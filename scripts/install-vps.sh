#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${APP_DIR}/.env.production"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-revendeo.com.br}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-www.revendeo.com.br}"
WEB_PORT="${WEB_PORT:-3040}"
API_PORT="${API_PORT:-3041}"

log() {
  printf '\n==> %s\n' "$1"
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Este instalador precisa ser executado como root."
    exit 1
  fi
}

write_env_file() {
  log "Preparando .env.production"

  if [[ -f "${ENV_FILE}" ]]; then
    cp "${ENV_FILE}" "${ENV_FILE}.backup"
  fi

  if [[ -n "${DATABASE_URL:-}" ]]; then
    {
      printf '%s\n' "NODE_ENV=production"
      printf '%s\n' "NEXT_TELEMETRY_DISABLED=1"
      printf '%s\n' "DATABASE_URL=${DATABASE_URL}"
      printf '%s\n' "NEXT_PUBLIC_APP_URL=https://${PRIMARY_DOMAIN}"
      printf '%s\n' "NEXT_PUBLIC_API_URL=https://${PRIMARY_DOMAIN}/v1"
      printf '%s\n' "PRIMARY_DOMAIN=${PRIMARY_DOMAIN}"
      printf '%s\n' "SECONDARY_DOMAIN=${SECONDARY_DOMAIN}"
      printf '%s\n' "WEB_PORT=${WEB_PORT}"
      printf '%s\n' "API_PORT=${API_PORT}"
    } > "${ENV_FILE}"
    return
  fi

  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "DATABASE_URL nao foi informado e ${ENV_FILE} nao existe."
    exit 1
  fi
}

run_deploy() {
  log "Executando deploy da aplicacao"
  chmod +x "${APP_DIR}/scripts/deploy-vps.sh"

  PRIMARY_DOMAIN="${PRIMARY_DOMAIN}" \
  SECONDARY_DOMAIN="${SECONDARY_DOMAIN}" \
  WEB_PORT="${WEB_PORT}" \
  API_PORT="${API_PORT}" \
  LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-}" \
  bash "${APP_DIR}/scripts/deploy-vps.sh"
}

main() {
  require_root
  write_env_file
  run_deploy
}

main "$@"
