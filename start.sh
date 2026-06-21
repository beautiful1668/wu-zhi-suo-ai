#!/bin/bash
cd /Users/pugongying/family-conflict-journal
echo "🏠 启动家庭冲突记录服务器..."
node server.js &
SERVER_PID=$!
sleep 2
echo ""
echo "=============================================="
echo "  本地访问: http://localhost:3000"
echo "  按 Ctrl+C 停止服务器"
echo "=============================================="
wait $SERVER_PID
