#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${APP_DIR}/.env.production"
BACKUP_ENV_FILE="${ENV_FILE}.backup"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-revendeo.com.br}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-www.revendeo.com.br}"
WEB_PORT="${WEB_PORT:-3040}"
API_PORT="${API_PORT:-3041}"
TLS_ENABLED="${TLS_ENABLED:-1}"
APP_SCHEME="${APP_SCHEME:-}"
LOCAL_POSTGRES_ENABLED="${LOCAL_POSTGRES_ENABLED:-0}"
LOCAL_POSTGRES_DB="${LOCAL_POSTGRES_DB:-revendeo}"
LOCAL_POSTGRES_USER="${LOCAL_POSTGRES_USER:-revendeo_app}"
LOCAL_POSTGRES_PASSWORD_FILE="${LOCAL_POSTGRES_PASSWORD_FILE:-/root/.revendeo-postgres-password}"
LOCAL_POSTGRES_PASSWORD="${LOCAL_POSTGRES_PASSWORD:-}"

log() {
  printf '\n==> %s\n' "$1"
}

resolve_app_scheme() {
  if [[ -n "${APP_SCHEME}" ]]; then
    return
  fi

  if [[ "${TLS_ENABLED}" == "1" ]]; then
    APP_SCHEME="https"
  else
    APP_SCHEME="http"
  fi
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Este instalador precisa ser executado como root."
    exit 1
  fi
}

generate_local_postgres_password() {
  if [[ -n "${LOCAL_POSTGRES_PASSWORD}" ]]; then
    return
  fi

  if [[ -f "${LOCAL_POSTGRES_PASSWORD_FILE}" ]]; then
    LOCAL_POSTGRES_PASSWORD="$(tr -d '\r\n' < "${LOCAL_POSTGRES_PASSWORD_FILE}")"
    return
  fi

  set +o pipefail
  LOCAL_POSTGRES_PASSWORD="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32)"
  set -o pipefail
  printf '%s\n' "${LOCAL_POSTGRES_PASSWORD}" > "${LOCAL_POSTGRES_PASSWORD_FILE}"
  chmod 600 "${LOCAL_POSTGRES_PASSWORD_FILE}"
}

prepare_database_url() {
  if [[ -n "${DATABASE_URL:-}" ]]; then
    LOCAL_POSTGRES_ENABLED=0
    return
  fi

  if [[ -f "${ENV_FILE}" ]]; then
    log "DATABASE_URL nao informado; reutilizando ${ENV_FILE}"
    return
  fi

  if [[ -f "${BACKUP_ENV_FILE}" ]]; then
    log "DATABASE_URL nao informado; restaurando ${BACKUP_ENV_FILE}"
    cp "${BACKUP_ENV_FILE}" "${ENV_FILE}"
    return
  fi

  log "DATABASE_URL nao informado; gerando configuracao local de PostgreSQL na VPS"
  generate_local_postgres_password
  LOCAL_POSTGRES_ENABLED=1
  DATABASE_URL="postgresql://${LOCAL_POSTGRES_USER}:${LOCAL_POSTGRES_PASSWORD}@127.0.0.1:5432/${LOCAL_POSTGRES_DB}?schema=public"
}

write_env_file() {
  log "Preparando .env.production"

  if [[ -f "${ENV_FILE}" ]]; then
    cp "${ENV_FILE}" "${BACKUP_ENV_FILE}"
  fi

  prepare_database_url
  resolve_app_scheme

  if [[ -n "${DATABASE_URL:-}" ]]; then
    {
      printf '%s\n' "NODE_ENV=production"
      printf '%s\n' "NEXT_TELEMETRY_DISABLED=1"
      printf '%s\n' "DATABASE_URL=${DATABASE_URL}"
      printf '%s\n' "NEXT_PUBLIC_APP_URL=${APP_SCHEME}://${PRIMARY_DOMAIN}"
      printf '%s\n' "NEXT_PUBLIC_API_URL=${APP_SCHEME}://${PRIMARY_DOMAIN}/v1"
      printf '%s\n' "PRIMARY_DOMAIN=${PRIMARY_DOMAIN}"
      printf '%s\n' "SECONDARY_DOMAIN=${SECONDARY_DOMAIN}"
      printf '%s\n' "WEB_PORT=${WEB_PORT}"
      printf '%s\n' "API_PORT=${API_PORT}"
      printf '%s\n' "TLS_ENABLED=${TLS_ENABLED}"
      printf '%s\n' "LOCAL_POSTGRES_ENABLED=${LOCAL_POSTGRES_ENABLED}"
      if [[ "${LOCAL_POSTGRES_ENABLED}" == "1" ]]; then
        printf '%s\n' "LOCAL_POSTGRES_DB=${LOCAL_POSTGRES_DB}"
        printf '%s\n' "LOCAL_POSTGRES_USER=${LOCAL_POSTGRES_USER}"
        printf '%s\n' "LOCAL_POSTGRES_PASSWORD=${LOCAL_POSTGRES_PASSWORD}"
      fi
    } > "${ENV_FILE}"
    return
  fi
}

run_deploy() {
  log "Executando deploy da aplicacao"
  chmod +x "${APP_DIR}/scripts/deploy-vps.sh"

  PRIMARY_DOMAIN="${PRIMARY_DOMAIN}" \
  SECONDARY_DOMAIN="${SECONDARY_DOMAIN}" \
  WEB_PORT="${WEB_PORT}" \
  API_PORT="${API_PORT}" \
  TLS_ENABLED="${TLS_ENABLED}" \
  LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-}" \
  bash "${APP_DIR}/scripts/deploy-vps.sh"
}

main() {
  require_root
  write_env_file
  run_deploy
}

main "$@"
