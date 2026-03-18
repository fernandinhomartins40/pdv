#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${APP_DIR}/.env.production"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-revendeo.com.br}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-www.revendeo.com.br}"
WEB_PORT="${WEB_PORT:-3040}"
API_PORT="${API_PORT:-3041}"
REQUIRED_NODE_MAJOR="${REQUIRED_NODE_MAJOR:-20}"

log() {
  printf '\n==> %s\n' "$1"
}

normalize_apt_sources() {
  local file
  local tmp

  shopt -s nullglob

  for file in /etc/apt/sources.list /etc/apt/sources.list.d/*.list; do
    [[ -f "${file}" ]] || continue

    tmp="$(mktemp)"

    awk '
      /^[[:space:]]*#/ || /^[[:space:]]*$/ {
        print
        next
      }
      {
        key = $0
        gsub(/[[:space:]]+/, " ", key)
        sub(/^ /, "", key)
        sub(/ $/, "", key)
      }
      !seen[key]++ { print }
    ' "${file}" >"${tmp}"

    if ! cmp -s "${file}" "${tmp}"; then
      log "Removendo entradas APT duplicadas em ${file}"
      mv "${tmp}" "${file}"
    else
      rm -f "${tmp}"
    fi
  done

  shopt -u nullglob
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Este script precisa ser executado como root."
    exit 1
  fi
}

ensure_base_packages() {
  log "Instalando dependencias de sistema"
  normalize_apt_sources
  apt-get update -y
  apt-get install -y curl ca-certificates git nginx
}

ensure_node() {
  local node_major=""

  if command -v node >/dev/null 2>&1; then
    node_major="$(node -p "process.versions.node.split('.')[0]")"
  fi

  if [[ -z "${node_major}" || "${node_major}" -lt "${REQUIRED_NODE_MAJOR}" ]]; then
    log "Instalando Node.js ${REQUIRED_NODE_MAJOR}"
    curl -fsSL "https://deb.nodesource.com/setup_${REQUIRED_NODE_MAJOR}.x" | bash -
    apt-get install -y nodejs
  fi

  corepack enable
  corepack prepare pnpm@9.15.0 --activate
}

ensure_env_file() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "Arquivo ${ENV_FILE} nao encontrado."
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
}

apply_database_schema() {
  if [[ -d "${APP_DIR}/packages/database/prisma/migrations" ]] && find "${APP_DIR}/packages/database/prisma/migrations" -mindepth 1 -maxdepth 1 | read -r _; then
    log "Aplicando migrations versionadas do Prisma"
    pnpm db:deploy
  else
    log "Nenhuma migration versionada encontrada; aplicando schema atual com prisma db push"
    pnpm db:push
  fi
}

build_apps() {
  log "Instalando dependencias do monorepo"
  cd "${APP_DIR}"
  pnpm install --frozen-lockfile

  log "Gerando cliente Prisma"
  pnpm db:generate

  apply_database_schema

  log "Build da API"
  pnpm --filter @pdv/api build

  log "Build do painel web"
  pnpm --filter @pdv/web build
}

write_systemd_service() {
  local service_name="$1"
  local description="$2"
  local after="$3"
  local exec_start="$4"
  local extra_env="$5"

  cat >"/etc/systemd/system/${service_name}.service" <<EOF
[Unit]
Description=${description}
After=${after}

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
EnvironmentFile=${ENV_FILE}
${extra_env}
ExecStart=${exec_start}
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF
}

configure_services() {
  local node_bin
  local pnpm_bin

  node_bin="$(command -v node)"
  pnpm_bin="$(command -v pnpm)"

  log "Configurando servicos systemd"
  write_systemd_service \
    "revendeo-api" \
    "Revendeo API" \
    "network.target" \
    "${node_bin} ${APP_DIR}/apps/api/dist/server.js" \
    "Environment=PORT=${API_PORT}"

  write_systemd_service \
    "revendeo-web" \
    "Revendeo Web" \
    "network.target revendeo-api.service" \
    "${pnpm_bin} --filter @pdv/web start --hostname 127.0.0.1 --port ${WEB_PORT}" \
    "Environment=PORT=${WEB_PORT}"

  systemctl daemon-reload
  systemctl enable revendeo-api.service revendeo-web.service
  systemctl restart revendeo-api.service revendeo-web.service
}

configure_nginx() {
  local nginx_file="/etc/nginx/sites-available/${PRIMARY_DOMAIN}"

  log "Configurando nginx"
  cat >"${nginx_file}" <<EOF
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    server_name ${PRIMARY_DOMAIN} ${SECONDARY_DOMAIN};
    client_max_body_size 20m;

    location /v1/ {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location = /health {
        proxy_pass http://127.0.0.1:${API_PORT}/health;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:${WEB_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

  ln -sfn "${nginx_file}" "/etc/nginx/sites-enabled/${PRIMARY_DOMAIN}"
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl enable nginx
  systemctl reload nginx
}

configure_tls() {
  if [[ -z "${LETSENCRYPT_EMAIL:-}" ]]; then
    log "LETSENCRYPT_EMAIL nao definido; mantendo configuracao HTTP"
    return
  fi

  log "Configurando TLS com Certbot"
  apt-get install -y certbot python3-certbot-nginx

  certbot --nginx --non-interactive --agree-tos --keep-until-expiring --redirect \
    -m "${LETSENCRYPT_EMAIL}" \
    -d "${PRIMARY_DOMAIN}" \
    -d "${SECONDARY_DOMAIN}"
}

run_healthchecks() {
  log "Validando API"
  curl --fail --silent "http://127.0.0.1:${API_PORT}/health" >/dev/null

  log "Validando painel web"
  curl --fail --silent --head "http://127.0.0.1:${WEB_PORT}" >/dev/null
}

main() {
  require_root
  ensure_base_packages
  ensure_node
  ensure_env_file
  build_apps
  configure_services
  configure_nginx
  configure_tls
  run_healthchecks

  log "Deploy concluido"
  echo "Painel: http://${PRIMARY_DOMAIN}"
  echo "API: http://${PRIMARY_DOMAIN}/v1"
  echo "Health: http://${PRIMARY_DOMAIN}/health"
}

main "$@"
