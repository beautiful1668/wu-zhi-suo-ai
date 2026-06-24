#!/bin/bash
BASE_DIR="/Users/pugongying/family-conflict-journal"
URL_FILE="$BASE_DIR/current-url.txt"
PORT=3000

echo "🏠 启动吾之所爱..."

# 杀掉旧进程
pkill -f "node.*server.js" 2>/dev/null
pkill -f "pinggy.io" 2>/dev/null
sleep 2

# 启动服务器
cd "$BASE_DIR"
node server.js &
sleep 2

if ! curl -s -o /dev/null "http://localhost:$PORT"; then
  echo "❌ 服务器启动失败"
  exit 1
fi

echo "✅ 服务器已启动"
echo "🌐 创建公网隧道..."

# 启动 pinggy 隧道，捕获 URL
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
    -p 443 -R0:localhost:$PORT a.pinggy.io 2>&1 | while IFS= read -r line; do
  echo "$line"
  if echo "$line" | grep -qEo 'https://[^ ]+\.pinggy\.net'; then
    URL=$(echo "$line" | grep -Eo 'https://[^ ]+\.pinggy\.net')
    echo "$URL" > "$URL_FILE"
    echo ""
    echo "============================================"
    echo "  🔗 $URL"
    echo "  📱 手机/电脑均可打开"
    echo "============================================"
  fi
done
