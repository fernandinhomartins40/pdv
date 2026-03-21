#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${APP_DIR}/.env.production"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-revendeo.com.br}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-www.revendeo.com.br}"
APP_PORT="${APP_PORT:-${WEB_PORT:-3040}}"
WEB_INTERNAL_PORT="${WEB_INTERNAL_PORT:-3000}"
API_INTERNAL_PORT="${API_INTERNAL_PORT:-3001}"
TLS_ENABLED="${TLS_ENABLED:-1}"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-/var/www/revendeo-downloads}"
INSTALLER_FILENAME="${INSTALLER_FILENAME:-revendeo-pdv-installer.exe}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-revendeo}"
DOCKER_COMPOSE_FILE="${APP_DIR}/docker-compose.vps.yml"
COMPOSE_PROFILE_ARGS=()
LEGACY_HOST_POSTGRES_PROXY_ENABLED="${LEGACY_HOST_POSTGRES_PROXY_ENABLED:-0}"
LEGACY_HOST_POSTGRES_PROXY_PORT="${LEGACY_HOST_POSTGRES_PROXY_PORT:-5432}"
LEGACY_HOST_POSTGRES_PROXY_SERVICE="revendeo-postgres-proxy.service"
LEGACY_HOST_POSTGRES_GATEWAY_IP=""
DOCKER_HOST_GATEWAY_IP="${DOCKER_HOST_GATEWAY_IP:-}"
SEED_TEST_USERS_ENABLED="${SEED_TEST_USERS_ENABLED:-0}"

log() {
  printf '\n==> %s\n' "$1"
}

compose() {
  docker compose \
    --project-name "${COMPOSE_PROJECT_NAME}" \
    --file "${DOCKER_COMPOSE_FILE}" \
    "${COMPOSE_PROFILE_ARGS[@]}" \
    "$@"
}

dump_service_diagnostics() {
  local service_name="$1"

  echo
  echo "---- docker compose ps ----"
  compose ps || true
  echo
  echo "---- docker compose logs: ${service_name} ----"
  compose logs --tail 120 "${service_name}" || true
  echo
}

wait_for_http() {
  local name="$1"
  local url="$2"
  local service_name="$3"
  local max_attempts="${4:-30}"
  local attempt

  for ((attempt = 1; attempt <= max_attempts; attempt++)); do
    if curl --fail --silent --show-error "${url}" >/dev/null; then
      return
    fi

    sleep 2
  done

  dump_service_diagnostics "${service_name}"
  echo "Timeout aguardando ${name} responder em ${url}."
  exit 1
}

wait_for_tcp() {
  local name="$1"
  local host="$2"
  local port="$3"
  local max_attempts="${4:-15}"
  local attempt

  for ((attempt = 1; attempt <= max_attempts; attempt++)); do
    if timeout 1 bash -lc "</dev/tcp/${host}/${port}" >/dev/null 2>&1; then
      return
    fi

    sleep 1
  done

  echo "Timeout aguardando ${name} responder em ${host}:${port}."
  exit 1
}

extract_database_port() {
  local database_url="${1:-${DATABASE_URL:-}}"

  if [[ "${database_url}" =~ @[^/?#]+:([0-9]+) ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return
  fi

  printf '%s\n' "5432"
}

normalize_legacy_host_postgres_env() {
  if [[ -z "${DATABASE_URL:-}" ]]; then
    return
  fi

  if [[ "${DATABASE_URL}" == *"@host.docker.internal"* ]]; then
    LEGACY_HOST_POSTGRES_PROXY_ENABLED=1
    LEGACY_HOST_POSTGRES_PROXY_PORT="$(extract_database_port "${DATABASE_URL}")"
    return
  fi

  LEGACY_HOST_POSTGRES_PROXY_ENABLED=0
  LEGACY_HOST_POSTGRES_PROXY_PORT=5432
}

get_compose_network_name() {
  docker network ls \
    --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" \
    --filter "label=com.docker.compose.network=revendeo" \
    --format '{{.Name}}' \
    | head -n 1
}

get_compose_network_gateway_ip() {
  local network_name=""

  network_name="$(get_compose_network_name || true)"
  if [[ -z "${network_name}" ]]; then
    return 1
  fi

  docker network inspect "${network_name}" --format '{{(index .IPAM.Config 0).Gateway}}' 2>/dev/null
}

get_compose_network_subnet() {
  local network_name=""

  network_name="$(get_compose_network_name || true)"
  if [[ -z "${network_name}" ]]; then
    return 1
  fi

  docker network inspect "${network_name}" --format '{{(index .IPAM.Config 0).Subnet}}' 2>/dev/null
}

get_compose_network_bridge_name() {
  local network_name=""
  local network_id=""

  network_name="$(get_compose_network_name || true)"
  if [[ -z "${network_name}" ]]; then
    return 1
  fi

  network_id="$(docker network inspect "${network_name}" --format '{{.Id}}' 2>/dev/null || true)"
  if [[ -z "${network_id}" ]]; then
    return 1
  fi

  printf 'br-%s\n' "${network_id:0:12}"
}

ensure_compose_network_gateway_ip() {
  local gateway_ip="${DOCKER_HOST_GATEWAY_IP:-}"

  if [[ -n "${gateway_ip}" ]]; then
    printf '%s\n' "${gateway_ip}"
    return 0
  fi

  gateway_ip="$(get_compose_network_gateway_ip || true)"
  if [[ -z "${gateway_ip}" ]]; then
    compose run --rm --no-deps api sh -lc 'exit 0' >/dev/null 2>&1 || true
    gateway_ip="$(get_compose_network_gateway_ip || true)"
  fi

  if [[ -z "${gateway_ip}" ]]; then
    return 1
  fi

  printf '%s\n' "${gateway_ip}"
}

set_compose_network_gateway_ip() {
  local gateway_ip="${1:-}"

  if [[ -z "${gateway_ip}" ]]; then
    echo "Gateway Docker vazio; nao foi possivel exportar DOCKER_HOST_GATEWAY_IP."
    exit 1
  fi

  DOCKER_HOST_GATEWAY_IP="${gateway_ip}"
  export DOCKER_HOST_GATEWAY_IP
}

ensure_legacy_host_postgres_ufw_rule() {
  local gateway_ip="${1:-${LEGACY_HOST_POSTGRES_GATEWAY_IP:-}}"
  local subnet=""
  local bridge_name=""

  if ! command -v ufw >/dev/null 2>&1; then
    return
  fi

  if ! ufw status 2>/dev/null | grep -q '^Status: active'; then
    return
  fi

  subnet="$(get_compose_network_subnet || true)"
  bridge_name="$(get_compose_network_bridge_name || true)"

  if [[ -z "${gateway_ip}" || -z "${subnet}" || -z "${bridge_name}" ]]; then
    echo "Nao foi possivel determinar a bridge Docker para liberar o proxy PostgreSQL no UFW."
    exit 1
  fi

  if ufw status numbered 2>/dev/null | grep -F "${gateway_ip} ${LEGACY_HOST_POSTGRES_PROXY_PORT}/tcp on ${bridge_name}" | grep -F "${subnet}" >/dev/null 2>&1; then
    return
  fi

  log "Liberando UFW para o proxy PostgreSQL na bridge ${bridge_name}"
  ufw allow in on "${bridge_name}" from "${subnet}" to "${gateway_ip}" port "${LEGACY_HOST_POSTGRES_PROXY_PORT}" proto tcp
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

package_installed() {
  dpkg-query -W -f='${Status}' "$1" 2>/dev/null | grep -q '^install ok installed$'
}

package_has_candidate() {
  local candidate

  candidate="$(apt-cache policy "$1" 2>/dev/null | awk '/Candidate:/ { print $2 }')"
  [[ -n "${candidate}" && "${candidate}" != "(none)" ]]
}

ensure_base_packages() {
  local -a packages=(curl ca-certificates git nginx)

  log "Instalando dependencias de sistema"
  disable_redundant_ubuntu_mirror_file
  normalize_apt_sources
  apt_update_with_recovery

  apt-get install -y "${packages[@]}"
}

ensure_docker_packages() {
  local docker_family=""
  local -a packages=()

  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "Docker e Docker Compose ja estao disponiveis"
    return
  fi

  if package_installed docker-ce || package_installed docker-ce-cli || package_installed containerd.io; then
    docker_family="official"
  elif package_installed docker.io || package_installed docker-compose-v2; then
    docker_family="ubuntu"
  elif package_has_candidate docker.io || package_has_candidate docker-compose-v2; then
    docker_family="ubuntu"
  elif package_has_candidate docker-ce; then
    docker_family="official"
  else
    echo "Nenhum pacote Docker suportado foi encontrado nos repositorios APT."
    exit 1
  fi

  case "${docker_family}" in
    ubuntu)
      log "Garantindo Docker via pacotes Ubuntu"

      if ! command -v docker >/dev/null 2>&1 && ! package_installed docker.io; then
        packages+=(docker.io)
      fi

      if ! docker compose version >/dev/null 2>&1; then
        if package_has_candidate docker-compose-v2; then
          packages+=(docker-compose-v2)
        elif package_has_candidate docker-compose-plugin && ! package_has_candidate docker-ce; then
          packages+=(docker-compose-plugin)
        fi
      fi
      ;;
    official)
      log "Garantindo Docker via repositorio oficial"

      if package_installed containerd && ! package_installed containerd.io; then
        log "Removendo pacote containerd do Ubuntu para evitar conflito com containerd.io"
        apt-get remove -y containerd
      fi

      if ! package_installed docker-ce; then
        packages+=(docker-ce)
      fi

      if ! package_installed docker-ce-cli; then
        packages+=(docker-ce-cli)
      fi

      if ! package_installed containerd.io; then
        packages+=(containerd.io)
      fi

      if package_has_candidate docker-buildx-plugin && ! package_installed docker-buildx-plugin; then
        packages+=(docker-buildx-plugin)
      fi

      if ! docker compose version >/dev/null 2>&1 && package_has_candidate docker-compose-plugin; then
        packages+=(docker-compose-plugin)
      fi
      ;;
  esac

  if ((${#packages[@]} > 0)); then
    apt-get install -y "${packages[@]}"
  fi

  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker nao esta disponivel apos a instalacao."
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "docker compose nao esta disponivel apos a instalacao."
    exit 1
  fi
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

  normalize_legacy_host_postgres_env

  COMPOSE_PROFILE_ARGS=()
  if [[ "${LOCAL_POSTGRES_ENABLED:-0}" == "1" ]]; then
    COMPOSE_PROFILE_ARGS+=(--profile local-db)
  fi
}

ensure_downloads_dir() {
  log "Preparando diretorio de downloads"
  install -d -m 755 "${DOWNLOADS_DIR}"
}

ensure_docker() {
  log "Garantindo daemon Docker ativo"
  systemctl enable docker
  systemctl start docker
}

disable_legacy_host_postgres_proxy() {
  local service_file="/etc/systemd/system/${LEGACY_HOST_POSTGRES_PROXY_SERVICE}"

  if [[ ! -f "${service_file}" ]]; then
    return
  fi

  log "Desativando proxy legado do PostgreSQL no host"
  systemctl disable --now "${LEGACY_HOST_POSTGRES_PROXY_SERVICE}" || true
  rm -f "${service_file}"
  systemctl daemon-reload
}

validate_container_tcp_access() {
  compose run --rm --no-deps api node -e "
    const net = require('node:net');
    const socket = net.createConnection({
      host: 'host.docker.internal',
      port: Number(process.env.LEGACY_HOST_POSTGRES_PROXY_PORT || '5432')
    });

    const timeout = setTimeout(() => {
      socket.destroy();
      process.exit(1);
    }, 3000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.end();
      process.exit(0);
    });

    socket.on('error', () => {
      clearTimeout(timeout);
      process.exit(1);
    });
  "
}

ensure_legacy_host_postgres_proxy() {
  local service_file="/etc/systemd/system/${LEGACY_HOST_POSTGRES_PROXY_SERVICE}"
  local gateway_ip=""

  if [[ "${LEGACY_HOST_POSTGRES_PROXY_ENABLED:-0}" != "1" ]]; then
    disable_legacy_host_postgres_proxy
    return
  fi

  if [[ "${DATABASE_URL:-}" != *"@host.docker.internal"* ]]; then
    echo "LEGACY_HOST_POSTGRES_PROXY_ENABLED=1 requer DATABASE_URL apontando para host.docker.internal."
    exit 1
  fi

  log "Configurando proxy do PostgreSQL legado do host para containers"
  apt-get install -y socat

  gateway_ip="$(ensure_compose_network_gateway_ip || true)"
  if [[ -z "${gateway_ip}" ]]; then
    echo "Nao foi possivel descobrir o gateway da rede Docker do compose."
    exit 1
  fi
  set_compose_network_gateway_ip "${gateway_ip}"
  LEGACY_HOST_POSTGRES_GATEWAY_IP="${gateway_ip}"

  wait_for_tcp "PostgreSQL legado do host" "127.0.0.1" "${LEGACY_HOST_POSTGRES_PROXY_PORT}" 15

  cat >"${service_file}" <<EOF
[Unit]
Description=Revendeo PostgreSQL proxy for Docker containers
After=docker.service network-online.target
Wants=network-online.target
Requires=docker.service

[Service]
Type=simple
Restart=always
RestartSec=2
ExecStart=/usr/bin/socat TCP-LISTEN:${LEGACY_HOST_POSTGRES_PROXY_PORT},bind=${gateway_ip},reuseaddr,fork TCP:127.0.0.1:${LEGACY_HOST_POSTGRES_PROXY_PORT}

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable "${LEGACY_HOST_POSTGRES_PROXY_SERVICE}"
  systemctl restart "${LEGACY_HOST_POSTGRES_PROXY_SERVICE}"

  wait_for_tcp "proxy do PostgreSQL legado" "${gateway_ip}" "${LEGACY_HOST_POSTGRES_PROXY_PORT}" 15
  ensure_legacy_host_postgres_ufw_rule "${gateway_ip}"

  if ! validate_container_tcp_access; then
    echo "O container da API nao conseguiu conectar em host.docker.internal:${LEGACY_HOST_POSTGRES_PROXY_PORT} mesmo com o proxy ativo."
    exit 1
  fi
}

resolve_compose_database_url() {
  local compose_database_url="${DATABASE_URL:-}"
  local gateway_ip=""

  if [[ -z "${compose_database_url}" ]]; then
    echo "DATABASE_URL nao definida para a execucao no Docker Compose."
    exit 1
  fi

  if [[ "${LEGACY_HOST_POSTGRES_PROXY_ENABLED:-0}" == "1" && "${compose_database_url}" == *"@host.docker.internal"* ]]; then
    gateway_ip="${LEGACY_HOST_POSTGRES_GATEWAY_IP:-}"

    if [[ -z "${gateway_ip}" ]]; then
      gateway_ip="$(ensure_compose_network_gateway_ip || true)"
    fi

    if [[ -z "${gateway_ip}" ]]; then
      echo "Nao foi possivel resolver o gateway Docker para acessar o banco no Docker Compose."
      exit 1
    fi

    set_compose_network_gateway_ip "${gateway_ip}"
    compose_database_url="${compose_database_url//@host.docker.internal/@${gateway_ip}}"
  fi

  printf '%s\n' "${compose_database_url}"
}

apply_database_schema() {
  local schema_database_url=""

  schema_database_url="$(resolve_compose_database_url)"

  log "Aplicando schema do banco"
  compose run --rm --no-deps -e "DATABASE_URL=${schema_database_url}" api sh -lc '
    set -eu
    pnpm db:generate

    if [ -d packages/database/prisma/migrations ] && find packages/database/prisma/migrations -mindepth 1 -maxdepth 1 | grep -q .; then
      pnpm db:deploy
    else
      pnpm --filter @pdv/database exec prisma db push --schema prisma/schema.prisma --accept-data-loss
    fi
  '
}

seed_test_users() {
  local seed_database_url=""

  if [[ "${SEED_TEST_USERS_ENABLED:-0}" != "1" ]]; then
    return
  fi

  seed_database_url="$(resolve_compose_database_url)"

  log "Aplicando seed dos usuarios de teste"
  compose run --rm --no-deps -e "DATABASE_URL=${seed_database_url}" api sh -lc '
    set -eu
    pnpm db:seed:test-users
  '
}

stop_legacy_services() {
  local service_name

  for service_name in revendeo-api.service revendeo-web.service; do
    if systemctl list-unit-files "${service_name}" >/dev/null 2>&1; then
      log "Desativando servico legado ${service_name}"
      systemctl disable --now "${service_name}" || true
    fi
  done
}

wait_for_container_health() {
  local service_name="$1"
  local max_attempts="${2:-30}"
  local attempt
  local container_id
  local status

  for ((attempt = 1; attempt <= max_attempts; attempt++)); do
    container_id="$(compose ps -q "${service_name}" 2>/dev/null || true)"

    if [[ -n "${container_id}" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
      if [[ "${status}" == "healthy" ]]; then
        return
      fi
    fi

    sleep 2
  done

  dump_service_diagnostics "${service_name}"
  echo "Timeout aguardando o container ${service_name} ficar saudavel."
  exit 1
}

start_local_postgres() {
  if [[ "${LOCAL_POSTGRES_ENABLED:-0}" != "1" ]]; then
    return
  fi

  log "Subindo PostgreSQL local no Docker"
  compose up -d postgres
  wait_for_container_health "postgres" 30
}

build_images() {
  log "Construindo imagens Docker da API e do painel"
  cd "${APP_DIR}"
  compose build --pull web api
}

start_stack() {
  log "Subindo stack Docker da aplicacao"
  cd "${APP_DIR}"
  compose up -d --remove-orphans
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

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
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
  local -a certbot_args

  if [[ "${TLS_ENABLED}" != "1" ]]; then
    log "TLS desativado por configuracao; mantendo aplicacao somente em HTTP"
    return
  fi

  log "Configurando TLS com Certbot"
  apt-get install -y certbot python3-certbot-nginx

  certbot_args=(
    --nginx
    --non-interactive
    --agree-tos
    --keep-until-expiring
    --redirect
    -d "${PRIMARY_DOMAIN}"
    -d "${SECONDARY_DOMAIN}"
  )

  if [[ -n "${LETSENCRYPT_EMAIL:-}" ]]; then
    certbot_args+=(-m "${LETSENCRYPT_EMAIL}")
  else
    log "LETSENCRYPT_EMAIL nao definido; registrando Certbot sem email de contato"
    certbot_args+=(--register-unsafely-without-email)
  fi

  certbot "${certbot_args[@]}"
}

run_healthchecks() {
  local attempt

  log "Validando proxy interno do stack"
  wait_for_http "proxy interno" "http://127.0.0.1:${APP_PORT}/health" "nginx" 30
  wait_for_http "painel web interno" "http://127.0.0.1:${APP_PORT}" "web" 30

  log "Validando roteamento publico do nginx da VPS"
  for ((attempt = 1; attempt <= 30; attempt++)); do
    if curl --fail --silent --show-error -H "Host: ${PRIMARY_DOMAIN}" http://127.0.0.1/health >/dev/null; then
      return
    fi

    sleep 2
  done

  systemctl --no-pager --full status nginx || true
  dump_service_diagnostics "nginx"
  echo "Timeout aguardando o nginx da VPS rotear a aplicacao."
  exit 1
}

main() {
  local public_scheme="http"

  require_root
  ensure_base_packages
  ensure_docker_packages
  ensure_docker
  ensure_env_file
  ensure_downloads_dir
  stop_legacy_services
  start_local_postgres
  build_images
  ensure_legacy_host_postgres_proxy
  apply_database_schema
  seed_test_users
  start_stack
  configure_nginx
  configure_tls
  run_healthchecks

  if [[ "${TLS_ENABLED}" == "1" ]]; then
    public_scheme="https"
  fi

  log "Deploy concluido"
  echo "Painel: ${public_scheme}://${PRIMARY_DOMAIN}"
  echo "API: ${public_scheme}://${PRIMARY_DOMAIN}/v1"
  echo "Health: ${public_scheme}://${PRIMARY_DOMAIN}/health"
  echo "Download: ${public_scheme}://${PRIMARY_DOMAIN}/download"
  echo "Instalador: ${public_scheme}://${PRIMARY_DOMAIN}/downloads/${INSTALLER_FILENAME}"
}

main "$@"
