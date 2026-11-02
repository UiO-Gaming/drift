#!/bin/bash
# Nightly dump of all Postgres databases + roles, compressed.
# Installed on the server as /srv/uiogaming/.backups/backup_db.sh, run by cron (see ../cron/uiogaming.crontab).
# The rsync user pulls the backup folder to off-site storage every night at 03:00.
#
# Restore: gunzip -c backup_YYYY-MM-DD.sql.gz | docker exec -i postgres psql -U postgres
set -euo pipefail

BACKUP_DIR=/srv/uiogaming/.backups/postgres
KEEP_DAYS=14

log()  { echo "$(date '+%Y-%m-%d %H:%M:%S') $*"; }
fail() { log "Backup FAILED: $*" >&2; rm -f "$BACKUP_FILE"; exit 1; }

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%F).sql.gz"
trap 'fail "error on line $LINENO"' ERR

log "Backing up all databases"
docker exec postgres pg_dumpall -U postgres | gzip > "$BACKUP_FILE"
[[ $(gunzip -c "$BACKUP_FILE" | tail -n 5) == *"cluster dump complete"* ]] || fail "dump incomplete"
log "Backup completed: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

find "$BACKUP_DIR" -name 'backup_*.sql*' -mtime +"$KEEP_DAYS" -delete
