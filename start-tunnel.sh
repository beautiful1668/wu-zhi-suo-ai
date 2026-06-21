#!/bin/bash
# 家庭冲突记录 - 启动脚本
# 启动 Node.js 服务器 + serveo 公网隧道

BASE_DIR="/Users/pugongying/family-conflict-journal"
LOG_FILE="$BASE_DIR/tunnel.log"
URL_FILE="$BASE_DIR/current-url.txt"
PORT=3000

echo "========================================" | tee "$LOG_FILE"
echo "  启动时间: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# 先杀掉旧进程
pkill -f "node.*server.js" 2>/dev/null
sleep 1

# 启动 Node.js 服务器
cd "$BASE_DIR"
node server.js >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
sleep 2

# 检查服务器是否启动成功
if curl -s -o /dev/null "http://localhost:$PORT"; then
  echo "✅ 服务器启动成功 (PID: $SERVER_PID)" | tee -a "$LOG_FILE"
else
  echo "❌ 服务器启动失败" | tee -a "$LOG_FILE"
  exit 1
fi

# 启动 serveo 隧道
echo "🌐 正在创建公网隧道..." | tee -a "$LOG_FILE"
ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -R 80:localhost:$PORT serveo.net 2>&1 | while read line; do
  echo "$line" | tee -a "$LOG_FILE"
  # 提取 URL
  if echo "$line" | grep -q "Forwarding HTTP traffic from"; then
    URL=$(echo "$line" | grep -o 'https://[^ ]*')
    echo "$URL" > "$URL_FILE"
    echo ""
    echo "========================================" | tee -a "$LOG_FILE"
    echo "  🔗 公网访问链接: $URL" | tee -a "$LOG_FILE"
    echo "  📋 链接已保存到: $URL_FILE" | tee -a "$LOG_FILE"
    echo "  📱 手机/电脑均可打开此链接" | tee -a "$LOG_FILE"
    echo "========================================" | tee -a "$LOG_FILE"
  fi
done
