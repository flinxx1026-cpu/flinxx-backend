#!/bin/bash
echo "=== PM2 STATUS ==="
pm2 status
echo "=== FINDING ENV FILES ==="
find ~/flinxx-backend -maxdepth 2 -name ".env"
echo "=== SHOWING DB URLS ==="
for file in $(find ~/flinxx-backend -maxdepth 2 -name ".env"); do
  echo "File: $file"
  grep DATABASE_URL "$file"
done
echo "=== PM2 LOGS ==="
pm2 logs --nostream --lines 15
