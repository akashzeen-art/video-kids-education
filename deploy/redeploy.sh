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
PORT=3001
PING_MESSAGE=ping pong
EOF
fi

echo "========== 3. Build =========="
pnpm install
pnpm build

echo "========== 4. Restart PM2 (videokidseducation only) =========="
pm2 startOrReload deploy/ecosystem.config.cjs
pm2 save

echo "========== 5. Verify app on port 3001 =========="
sleep 2
TITLE=$(curl -s http://127.0.0.1:3011/ | grep -o '<title>[^<]*</title>' || true)
echo "Page title on :3001 => $TITLE"
if echo "$TITLE" | grep -qi "selfistar"; then
  echo "ERROR: Port 3011 still serves SelfiStar! Check PM2 port conflicts."
  pm2 list
  exit 1
fi
if ! echo "$TITLE" | grep -qi "Univers des Enfants"; then
  echo "WARN: Expected 'Univers des Enfants' title. Got: $TITLE"
fi
curl -s http://127.0.0.1:3011/api/ping
echo ""

echo "========== 6. Nginx kidzzbuzz.com =========="
cp deploy/nginx-kidzzbuzz.conf /etc/nginx/sites-available/kidzzbuzz.com
ln -sf /etc/nginx/sites-available/kidzzbuzz.com /etc/nginx/sites-enabled/kidzzbuzz.com

# Remove kidzzbuzz from other site configs (selfistar etc.) — safe edit
for f in /etc/nginx/sites-enabled/*; do
  if [ "$(basename "$f")" != "kidzzbuzz.com" ] && grep -q "kidzzbuzz" "$f" 2>/dev/null; then
    echo "WARNING: $f also mentions kidzzbuzz — edit manually and remove kidzzbuzz from server_name"
    grep -n "kidzzbuzz" "$f" || true
  fi
done

nginx -t
systemctl reload nginx

echo "========== 7. Final check =========="
curl -s https://kidzzbuzz.com/ | grep -o '<title>[^<]*</title>' || true
curl -s https://kidzzbuzz.com/api/ping
echo ""
echo "DONE. Open https://kidzzbuzz.com in incognito browser."
