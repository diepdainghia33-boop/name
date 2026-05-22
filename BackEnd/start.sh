#!/bin/bash

echo "=== Starting Laravel Application ==="

echo ">>> Running database migrations..."
php artisan migrate --force

echo ">>> Clearing config cache..."
php artisan config:clear
php artisan cache:clear

echo ">>> Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
