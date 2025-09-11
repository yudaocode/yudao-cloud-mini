@echo off
echo 启动DDD元数据驱动开发平台...

echo.
echo ==============================================
echo 1. 启动后端服务 (apps/ddd-platform-server)
echo ==============================================
start "DDD Platform Server" cmd /c "cd /d apps\ddd-platform-server && npm run dev && pause"

echo 等待3秒让后端服务启动...
timeout /t 3 /nobreak >nul

echo.
echo ==============================================
echo 2. 启动前端服务 (apps/ddd-platform-web)
echo ==============================================
start "DDD Platform Web" cmd /c "cd /d apps\ddd-platform-web && npm run dev && pause"

echo.
echo ==============================================
echo 服务启动完成
echo ==============================================
echo.
echo 访问地址:
echo - 前端界面: http://localhost:5173
echo - 后端API: http://localhost:7001
echo - API文档: http://localhost:7001/swagger-ui/index.html
echo.
echo 开发提示:
echo - 修改后端代码会自动重启服务
echo - 修改前端代码会自动热更新
echo - 按 Ctrl+C 停止对应的服务
echo.

pause
