#!/bin/bash
# Full redeploy Video Kids on kidzzbuzz.com — does NOT touch other PM2 apps
set -euo pipefail

APP_DIR="/var/www/vasnumero/videokidseducation"
REPO_URL="https://github.com/akashzeen-art/video-kids-education.git"

echo "========== 1. Pull latest code =========="
cd "$APP_DIR"
git fetch origin
git reset --hard origin/main
git pull origin main

echo "========== 2. Environment =========="
if [ ! -f .env ]; then
  cat > .env <<'EOF'
VITE_VAS_PRODUCT_CODE=AMVKE
VAS_API_BASE_URL=http://68.183.88.91/adpoke/cnt
VAS_PRODUCT_CODE=AMVKE
VITE_VAS_CAMPAIGN_URL=http://68.183.88.91/adpoke/cnt/act
PORT=3021
PING_MESSAGE=ping pong
EOF
fi

echo "========== 3. Build =========="
pnpm install
pnpm build

echo "========== 4. Restart PM2 (videokidseducation only) =========="
pm2 startOrReload deploy/ecosystem.config.cjs
pm2 save

echo "========== 5. Verify app on port 3021 =========="
sleep 2
TITLE=$(curl -s http://127.0.0.1:3021/ | grep -o '<title>[^<]*</title>' || true)
echo "Page title on :3021 => $TITLE"
if echo "$TITLE" | grep -qi "selfistar"; then
  echo "ERROR: Port 3021 still serves SelfiStar! Check PM2 port conflicts."
  pm2 list
  exit 1
fi
if ! echo "$TITLE" | grep -qi "Kids Education"; then
  echo "WARN: Expected 'Kids Education' title. Got: $TITLE"
fi
curl -s http://127.0.0.1:3021/api/ping
echo ""

echo "========== 6. Nginx kidzzbuzz.com =========="
cp deploy/nginx-kidzzbuzz.conf /etc/nginx/sites-available/kidzzbuzz.com
ln -sf /etc/nginx/sites-available/kidzzbuzz.com /etc/nginx/sites-enabled/kidzzbuzz.com

echo "========== 7. Nginx mkidseducation.com =========="
# mkidseducation.com must NOT appear in any other site's server_name on :443
for f in /etc/nginx/sites-enabled/*; do
  base=$(basename "$f")
  if [ "$base" != "kidzzbuzz.com" ] && [ "$base" != "mkidseducation.com" ] && grep -q "mkidseducation" "$f" 2>/dev/null; then
    echo "ERROR: $f also mentions mkidseducation — remove mkidseducation.com from its server_name first"
    grep -n "mkidseducation" "$f" || true
    exit 1
  fi
done

ln -sf /etc/nginx/sites-available/mkidseducation.com /etc/nginx/sites-enabled/mkidseducation.com

if [ ! -f /etc/letsencrypt/live/mkidseducation.com/fullchain.pem ]; then
  echo "No SSL cert yet — bootstrap HTTP-only for certbot..."
  cat > /etc/nginx/sites-available/mkidseducation.com <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name mkidseducation.com www.mkidseducation.com;
    location / {
        proxy_pass http://127.0.0.1:3021;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
  nginx -t && systemctl reload nginx
  certbot certonly --nginx -d mkidseducation.com -d www.mkidseducation.com --non-interactive --agree-tos --register-unsafely-without-email
fi

cp deploy/nginx-mkidseducation.conf /etc/nginx/sites-available/mkidseducation.com

# Remove kidzzbuzz from other site configs (selfistar etc.) — safe edit
for f in /etc/nginx/sites-enabled/*; do
  if [ "$(basename "$f")" != "kidzzbuzz.com" ] && grep -q "kidzzbuzz" "$f" 2>/dev/null; then
    echo "WARNING: $f also mentions kidzzbuzz — edit manually and remove kidzzbuzz from server_name"
    grep -n "kidzzbuzz" "$f" || true
  fi
done

nginx -t
systemctl reload nginx

echo "========== 8. Final check =========="
curl -s https://kidzzbuzz.com/ | grep -o '<title>[^<]*</title>' || true
curl -s https://kidzzbuzz.com/api/ping
curl -s https://mkidseducation.com/ | grep -o '<title>[^<]*</title>' || true
curl -s https://mkidseducation.com/api/ping
echo ""
echo "DONE. Open https://kidzzbuzz.com in incognito browser."
