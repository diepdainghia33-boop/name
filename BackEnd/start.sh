#!/bin/bash

echo "=== Starting Laravel Application ==="

# Production defaults for Render (Firebase + TiDB)
if [ "${APP_ENV}" = "production" ]; then
    export CORS_ALLOW_ALL="${CORS_ALLOW_ALL:-true}"
    export CACHE_STORE="${CACHE_STORE:-file}"
    export SESSION_DRIVER="${SESSION_DRIVER:-file}"
    export QUEUE_CONNECTION="${QUEUE_CONNECTION:-sync}"
fi

DB_NAME="${DB_DATABASE:-}"
FORBIDDEN_DBS="mysql information_schema performance_schema"

if [ "$DB_NAME" = "sys" ]; then
    echo ">>> WARNING: DB_DATABASE=sys is invalid for Laravel. Using test instead."
    export DB_DATABASE=test
    DB_NAME=test
fi

for forbidden in $FORBIDDEN_DBS; do
    if [ "$DB_NAME" = "$forbidden" ]; then
        echo "ERROR: DB_DATABASE must be your TiDB app database (e.g. test), not '$DB_NAME'."
        echo "       Set DB_DATABASE=test in Render Environment (TiDB Console -> Connect)."
        exit 1
    fi
done

if [ -z "$DB_NAME" ]; then
    echo "ERROR: DB_DATABASE is not set. Use your TiDB database name (usually test)."
    exit 1
fi

echo ">>> Using database: ${DB_NAME}"

echo ">>> Running database migrations..."
if php artisan migrate --force; then
    echo ">>> Migrations complete."
else
    echo ">>> WARNING: migrations failed. Check DB_DATABASE, user permissions, and TiDB connection."
fi

echo ">>> Ensuring storage is writable and linked..."
mkdir -p storage/app/public/chat_images storage/app/public/chat_files
php artisan storage:link 2>/dev/null || true

echo ">>> Clearing config cache..."
php artisan config:clear

echo ">>> Clearing application cache..."
if php artisan cache:clear 2>/dev/null; then
    echo ">>> Cache cleared."
else
    echo ">>> Skipped cache:clear (use CACHE_STORE=file or run migrations first)."
fi

PORT="${PORT:-8000}"
echo ">>> Starting Laravel server on port ${PORT}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
