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

disable_redundant_ubuntu_mirror_file() {
  local mirrors_file="/etc/apt/sources.list.d/ubuntu-mirrors.list"
  local disabled_file="${mirrors_file}.disabled-by-revendeo"

  if [[ ! -f "${mirrors_file}" ]]; then
    return
  fi

  if [[ -f /etc/apt/sources.list ]] && grep -Eq 'archive\.ubuntu\.com/ubuntu|security\.ubuntu\.com/ubuntu' /etc/apt/sources.list; then
    log "Desativando ${mirrors_file} porque /etc/apt/sources.list ja cobre os repositorios Ubuntu"
    mv "${mirrors_file}" "${disabled_file}"
  fi
}

repair_ubuntu_mirrors() {
  local file
  local tmp

  shopt -s nullglob

  for file in /etc/apt/sources.list /etc/apt/sources.list.d/*.list; do
    [[ -f "${file}" ]] || continue

    if ! grep -Eq 'mirror\.ufam\.edu\.br/ubuntu' "${file}"; then
      continue
    fi

    tmp="$(mktemp)"
    sed -E 's#https?://mirror\.ufam\.edu\.br/ubuntu#http://archive.ubuntu.com/ubuntu#g' "${file}" >"${tmp}"

    if ! cmp -s "${file}" "${tmp}"; then
      log "Substituindo mirror Ubuntu invalido em ${file}"
      mv "${tmp}" "${file}"
    else
      rm -f "${tmp}"
    fi
  done

  shopt -u nullglob
}

normalize_apt_sources() {
  local file
  local tmp
  local line
  local normalized
  declare -A seen_entries=()

  shopt -s nullglob

  for file in /etc/apt/sources.list /etc/apt/sources.list.d/*.list; do
    [[ -f "${file}" ]] || continue

    tmp="$(mktemp)"

    while IFS= read -r line || [[ -n "${line}" ]]; do
      if [[ "${line}" =~ ^[[:space:]]*$ ]] || [[ "${line}" =~ ^[[:space:]]*# ]]; then
        printf '%s\n' "${line}" >>"${tmp}"
        continue
      fi

      normalized="$(printf '%s' "${line}" | tr -s '[:space:]' ' ' | sed -E 's/^ //; s/ $//')"

      if [[ -z "${seen_entries[${normalized}]+x}" ]]; then
        seen_entries["${normalized}"]=1
        printf '%s\n' "${line}" >>"${tmp}"
      fi
    done <"${file}"

    if ! cmp -s "${file}" "${tmp}"; then
      log "Removendo entradas APT duplicadas em ${file}"
      mv "${tmp}" "${file}"
    else
      rm -f "${tmp}"
    fi
  done

  shopt -u nullglob
}

apt_update_with_recovery() {
  if apt-get update -y; then
    return
  fi

  log "apt-get update falhou; aplicando fallback para mirrors oficiais do Ubuntu"
  repair_ubuntu_mirrors
  normalize_apt_sources
  apt-get update -y
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Este script precisa ser executado como root."
    exit 1
  fi
}

ensure_base_packages() {
  log "Instalando dependencias de sistema"
  disable_redundant_ubuntu_mirror_file
  normalize_apt_sources
  apt_update_with_recovery
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

ensure_local_postgres() {
  local original_dir

  if [[ "${LOCAL_POSTGRES_ENABLED:-0}" != "1" ]]; then
    return
  fi

  log "Provisionando PostgreSQL local"
  apt-get install -y postgresql
  systemctl enable postgresql
  systemctl start postgresql

  original_dir="$(pwd)"
  cd /tmp

  if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${LOCAL_POSTGRES_USER}'" | grep -q 1; then
    runuser -u postgres -- psql -c "CREATE ROLE ${LOCAL_POSTGRES_USER} LOGIN PASSWORD '${LOCAL_POSTGRES_PASSWORD}'"
  else
    runuser -u postgres -- psql -c "ALTER ROLE ${LOCAL_POSTGRES_USER} WITH LOGIN PASSWORD '${LOCAL_POSTGRES_PASSWORD}'"
  fi

  if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='${LOCAL_POSTGRES_DB}'" | grep -q 1; then
    runuser -u postgres -- createdb -O "${LOCAL_POSTGRES_USER}" "${LOCAL_POSTGRES_DB}"
  fi

  cd "${original_dir}"
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

  if [[ -f "${APP_DIR}/pnpm-lock.yaml" ]]; then
    pnpm install --frozen-lockfile
  else
    log "pnpm-lock.yaml ausente; instalando sem frozen-lockfile"
    pnpm install --no-frozen-lockfile
  fi

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
  ensure_local_postgres
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
