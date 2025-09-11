#!/bin/bash

echo "启动DDD元数据驱动开发平台..."

echo ""
echo "=============================================="
echo "1. 启动后端服务 (apps/ddd-platform-server)"
echo "=============================================="

# 在后台启动后端服务
cd apps/ddd-platform-server
npm run dev &
BACKEND_PID=$!
echo "后端服务已启动，PID: $BACKEND_PID"

echo "等待5秒让后端服务完全启动..."
sleep 5

echo ""
echo "=============================================="
echo "2. 启动前端服务 (apps/ddd-platform-web)"
echo "=============================================="

# 启动前端服务
cd ../ddd-platform-web
npm run dev &
FRONTEND_PID=$!
echo "前端服务已启动，PID: $FRONTEND_PID"

echo ""
echo "=============================================="
echo "服务启动完成"
echo "=============================================="
echo ""
echo "访问地址:"
echo "- 前端界面: http://localhost:5173"
echo "- 后端API: http://localhost:7001"
echo "- API文档: http://localhost:7001/swagger-ui/index.html"
echo ""
echo "开发提示:"
echo "- 修改后端代码会自动重启服务"
echo "- 修改前端代码会自动热更新"
echo "- 按 Ctrl+C 停止所有服务"
echo ""
echo "服务进程ID:"
echo "- 后端服务 PID: $BACKEND_PID"
echo "- 前端服务 PID: $FRONTEND_PID"
echo ""

# 等待用户按 Ctrl+C 停止服务
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
