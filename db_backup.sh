#!/bin/bash

# Skriptin yerləşdiyi qovluğu tapırıq (fərqli yerlərdən çağırılsa belə .env faylını tapa bilsin)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# .env faylının olub-olmadığını yoxlayırıq
if [ -f "$SCRIPT_DIR/.env" ]; then
    # .env faylındakı dəyişənləri skriptə idxal edirik (export ilə)
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
else
    echo "XƏTA: .env faylı tapılmadı! Skript dayandırılır."
    exit 1
fi

# Cari zaman damğası
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Postgres-in şifrəni avtomatik oxuması üçün mühit dəyişəni təyin edirik
export PGPASSWORD=$DB_PASS

# Backup qovluğu yoxdursa yaradırıq
mkdir -p "$BACKUP_DIR"

echo "Backup prosesi başladıldı: $DATE"

# BACKUP PROSESİ (pg_dump)
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f "$BACKUP_DIR/$DB_NAME-$DATE.bak"

# Prosesin uğurlu olub-olmadığını yoxlayırıq
if [ $? -eq 0 ]; then
    echo "Backup uğurla tamamlandı: $BACKUP_DIR/$DB_NAME-$DATE.bak"
else
    echo "XƏTA: Backup icra oluna bilmədi!"
    unset PGPASSWORD
    exit 1
fi

# KÖHNƏ BACKUP-LARIN TEMİZLƏNMƏSİ (30 gündən köhnə .bak fayllarını silir)
echo "Köhnə backup-lar yoxlanılır..."
find "$BACKUP_DIR" -type f -mtime +30 -name "*.bak" -delete

# Təhlükəsizlik üçün şifrə dəyişənini təmizləyirik
unset PGPASSWORD
echo "Proses tamamlandı."