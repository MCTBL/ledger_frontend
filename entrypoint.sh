#!/bin/sh
set -e  # 遇到错误立即退出

echo "Removing old config..."
rm -f /etc/nginx/conf.d/default.conf

echo "Substituting environment variables..."
envsubst '${BACKEND_HOST}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "Removing template..."
rm -f /etc/nginx/conf.d/nginx.conf.template

echo "Starting nginx..."
exec nginx -g 'daemon off;'