#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${APP_DIR}/.env.production"
BACKUP_ENV_FILE="${ENV_FILE}.backup"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-revendeo.com.br}"
SECONDARY_DOMAIN="${SECONDARY_DOMAIN:-www.revendeo.com.br}"
APP_PORT="${APP_PORT:-${WEB_PORT:-3040}}"
WEB_INTERNAL_PORT="${WEB_INTERNAL_PORT:-3000}"
API_INTERNAL_PORT="${API_INTERNAL_PORT:-3001}"
TLS_ENABLED="${TLS_ENABLED:-1}"
APP_SCHEME="${APP_SCHEME:-}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-revendeo}"
DOWNLOADS_DIR="${DOWNLOADS_DIR:-/var/www/revendeo-downloads}"
LOCAL_POSTGRES_ENABLED="${LOCAL_POSTGRES_ENABLED:-0}"
LOCAL_POSTGRES_DB="${LOCAL_POSTGRES_DB:-revendeo}"
LOCAL_POSTGRES_USER="${LOCAL_POSTGRES_USER:-revendeo_app}"
LOCAL_POSTGRES_PASSWORD_FILE="${LOCAL_POSTGRES_PASSWORD_FILE:-/root/.revendeo-postgres-password}"
LOCAL_POSTGRES_PASSWORD="${LOCAL_POSTGRES_PASSWORD:-}"
LEGACY_HOST_POSTGRES_PROXY_ENABLED="${LEGACY_HOST_POSTGRES_PROXY_ENABLED:-0}"
LEGACY_HOST_POSTGRES_PROXY_PORT="${LEGACY_HOST_POSTGRES_PROXY_PORT:-5432}"
SEED_TEST_USERS_ENABLED="${SEED_TEST_USERS_ENABLED:-}"

log() {
  printf '\n==> %s\n' "$1"
}

extract_database_port() {
  local database_url="${1:-${DATABASE_URL:-}}"

  if [[ "${database_url}" =~ @[^/?#]+:([0-9]+) ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return
  fi

  printf '%s\n' "5432"
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

load_existing_database_env() {
  local source_file=""
  local current_primary_domain="${PRIMARY_DOMAIN}"
  local current_secondary_domain="${SECONDARY_DOMAIN}"
  local current_app_port="${APP_PORT}"
  local current_web_internal_port="${WEB_INTERNAL_PORT}"
  local current_api_internal_port="${API_INTERNAL_PORT}"
  local current_tls_enabled="${TLS_ENABLED}"
  local current_compose_project_name="${COMPOSE_PROJECT_NAME}"
  local current_downloads_dir="${DOWNLOADS_DIR}"

  if [[ -f "${ENV_FILE}" ]]; then
    source_file="${ENV_FILE}"
  elif [[ -f "${BACKUP_ENV_FILE}" ]]; then
    source_file="${BACKUP_ENV_FILE}"
  else
    return 1
  fi

  log "DATABASE_URL nao informado; reutilizando configuracao existente de ${source_file}"

  set -a
  # shellcheck disable=SC1090
  . "${source_file}"
  set +a

  PRIMARY_DOMAIN="${current_primary_domain}"
  SECONDARY_DOMAIN="${current_secondary_domain}"
  APP_PORT="${current_app_port}"
  WEB_INTERNAL_PORT="${current_web_internal_port}"
  API_INTERNAL_PORT="${current_api_internal_port}"
  TLS_ENABLED="${current_tls_enabled}"
  COMPOSE_PROJECT_NAME="${current_compose_project_name}"
  DOWNLOADS_DIR="${current_downloads_dir}"

  return 0
}

normalize_database_url_for_containers() {
  if [[ -z "${DATABASE_URL:-}" ]]; then
    return
  fi

  if [[ "${DATABASE_URL}" == *"@127.0.0.1:"* || "${DATABASE_URL}" == *"@localhost:"* ]]; then
    log "DATABASE_URL local legado detectado; ajustando acesso para containers via host.docker.internal"
    LEGACY_HOST_POSTGRES_PROXY_ENABLED=1
    LEGACY_HOST_POSTGRES_PROXY_PORT="$(extract_database_port "${DATABASE_URL}")"
    DATABASE_URL="${DATABASE_URL//@127.0.0.1:/@host.docker.internal:}"
    DATABASE_URL="${DATABASE_URL//@localhost:/@host.docker.internal:}"
    LOCAL_POSTGRES_ENABLED=0
    return
  fi

  if [[ "${DATABASE_URL}" == *"@host.docker.internal"* ]]; then
    LEGACY_HOST_POSTGRES_PROXY_ENABLED=1
    LEGACY_HOST_POSTGRES_PROXY_PORT="$(extract_database_port "${DATABASE_URL}")"
    LOCAL_POSTGRES_ENABLED=0
    return
  fi

  LEGACY_HOST_POSTGRES_PROXY_ENABLED=0
  LEGACY_HOST_POSTGRES_PROXY_PORT=5432
}

prepare_database_url() {
  if [[ -n "${DATABASE_URL:-}" ]]; then
    LOCAL_POSTGRES_ENABLED=0
    normalize_database_url_for_containers
    return
  fi

  if load_existing_database_env; then
    normalize_database_url_for_containers
    return
  fi

  log "DATABASE_URL nao informado; gerando configuracao local de PostgreSQL no Docker"
  generate_local_postgres_password
  LOCAL_POSTGRES_ENABLED=1
  LEGACY_HOST_POSTGRES_PROXY_ENABLED=0
  LEGACY_HOST_POSTGRES_PROXY_PORT=5432
  DATABASE_URL="postgresql://${LOCAL_POSTGRES_USER}:${LOCAL_POSTGRES_PASSWORD}@postgres:5432/${LOCAL_POSTGRES_DB}?schema=public"
}

load_existing_seed_test_users_setting() {
  local source_file=""
  local existing_value=""

  if [[ -n "${SEED_TEST_USERS_ENABLED}" ]]; then
    return
  fi

  if [[ -f "${ENV_FILE}" ]]; then
    source_file="${ENV_FILE}"
  elif [[ -f "${BACKUP_ENV_FILE}" ]]; then
    source_file="${BACKUP_ENV_FILE}"
  else
    return
  fi

  existing_value="$(awk -F= '$1 == "SEED_TEST_USERS_ENABLED" { value = substr($0, index($0, "=") + 1) } END { print value }' "${source_file}")"

  if [[ -n "${existing_value}" ]]; then
    SEED_TEST_USERS_ENABLED="${existing_value}"
  fi
}

write_env_file() {
  log "Preparando .env.production"

  if [[ -f "${ENV_FILE}" ]]; then
    cp "${ENV_FILE}" "${BACKUP_ENV_FILE}"
  fi

  load_existing_seed_test_users_setting
  prepare_database_url
  resolve_app_scheme

  if [[ -n "${DATABASE_URL:-}" ]]; then
    {
      printf '%s\n' "NODE_ENV=production"
      printf '%s\n' "NEXT_TELEMETRY_DISABLED=1"
      printf '%s\n' "DATABASE_URL=${DATABASE_URL}"
      printf '%s\n' "NEXT_PUBLIC_API_URL=/v1"
      printf '%s\n' "APP_BASE_URL=${APP_SCHEME}://${PRIMARY_DOMAIN}"
      printf '%s\n' "CORS_ORIGIN=${APP_SCHEME}://${PRIMARY_DOMAIN},${APP_SCHEME}://${SECONDARY_DOMAIN}"
      printf '%s\n' "PRIMARY_DOMAIN=${PRIMARY_DOMAIN}"
      printf '%s\n' "SECONDARY_DOMAIN=${SECONDARY_DOMAIN}"
      printf '%s\n' "APP_PORT=${APP_PORT}"
      printf '%s\n' "WEB_INTERNAL_PORT=${WEB_INTERNAL_PORT}"
      printf '%s\n' "API_INTERNAL_PORT=${API_INTERNAL_PORT}"
      printf '%s\n' "TLS_ENABLED=${TLS_ENABLED}"
      printf '%s\n' "COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}"
      printf '%s\n' "DOWNLOADS_DIR=${DOWNLOADS_DIR}"
      printf '%s\n' "LOCAL_POSTGRES_ENABLED=${LOCAL_POSTGRES_ENABLED}"
      printf '%s\n' "LEGACY_HOST_POSTGRES_PROXY_ENABLED=${LEGACY_HOST_POSTGRES_PROXY_ENABLED}"
      if [[ -n "${SEED_TEST_USERS_ENABLED}" ]]; then
        printf '%s\n' "SEED_TEST_USERS_ENABLED=${SEED_TEST_USERS_ENABLED}"
      fi
      if [[ "${LEGACY_HOST_POSTGRES_PROXY_ENABLED}" == "1" ]]; then
        printf '%s\n' "LEGACY_HOST_POSTGRES_PROXY_PORT=${LEGACY_HOST_POSTGRES_PROXY_PORT}"
      fi
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
  APP_PORT="${APP_PORT}" \
  WEB_INTERNAL_PORT="${WEB_INTERNAL_PORT}" \
  API_INTERNAL_PORT="${API_INTERNAL_PORT}" \
  COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME}" \
  DOWNLOADS_DIR="${DOWNLOADS_DIR}" \
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
