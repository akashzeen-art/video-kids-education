#!/bin/bash
set -euo pipefail

APP_DIR="/var/www/vasnumero/videokidseducation"
REPO_URL="${REPO_URL:-https://github.com/akashzeen-art/video-kids-education.git}"

echo "==> Installing Video Kids Education to ${APP_DIR}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node 20+ first."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm
fi

mkdir -p "$(dirname "${APP_DIR}")"

if [ ! -d "${APP_DIR}/.git" ]; then
  git clone "${REPO_URL}" "${APP_DIR}"
else
  cd "${APP_DIR}"
  git pull origin main
fi

cd "${APP_DIR}"

if [ ! -f .env ]; then
  cat > .env <<'EOF'
VITE_VAS_PRODUCT_CODE=AMVKE
VAS_API_BASE_URL=http://68.183.88.91/adpoke/cnt
VAS_PRODUCT_CODE=AMVKE
VITE_VAS_CAMPAIGN_URL=http://68.183.88.91/adpoke/cnt/act
PORT=3001
PING_MESSAGE=ping pong
EOF
  echo "Created .env — review before going live."
fi

pnpm install
pnpm build

if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrReload deploy/ecosystem.config.cjs
  pm2 save
else
  npm install -g pm2
  pm2 startOrReload deploy/ecosystem.config.cjs
  pm2 save
fi

echo "==> App running on port 3001"
echo "==> Next: configure nginx with deploy/nginx-kidzzbuzz.conf"
echo "    sudo cp deploy/nginx-kidzzbuzz.conf /etc/nginx/sites-available/kidzzbuzz.com"
echo "    sudo ln -sf /etc/nginx/sites-available/kidzzbuzz.com /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"
echo "    sudo certbot --nginx -d kidzzbuzz.com -d www.kidzzbuzz.com"
