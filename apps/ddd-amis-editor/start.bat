@echo off
echo 正在启动DDD平台AMIS编辑器...
echo.

cd /d "%~dp0"

echo 检查Node.js是否已安装...
node --version > nul 2>&1
if errorlevel 1 (
    echo 错误: 请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 检查依赖是否已安装...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

echo 正在启动开发服务器...
echo 编辑器地址: http://localhost:3000/simple-editor.html
echo 预览页面: http://localhost:3000/preview.html
echo.
echo 请确保后端服务已在端口7001启动
echo.

start http://localhost:3000/simple.html
call npm run dev

pause
