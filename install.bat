@echo off
echo 开始安装DDD元数据驱动开发平台...

echo.
echo ==============================================
echo 1. 安装后端依赖 (apps/ddd-platform-server)
echo ==============================================
cd apps\ddd-platform-server
if exist package.json (
    echo 正在安装后端Node.js依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 后端依赖安装失败，请检查网络连接或Node.js环境
        pause
        exit /b 1
    )
    echo 后端依赖安装完成
) else (
    echo 警告: 未找到后端package.json文件
)

echo.
echo ==============================================
echo 2. 安装前端依赖 (apps/ddd-platform-web)
echo ==============================================
cd ..\ddd-platform-web
if exist package.json (
    echo 正在安装前端Node.js依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 前端依赖安装失败，请检查网络连接或Node.js环境
        pause
        exit /b 1
    )
    echo 前端依赖安装完成
) else (
    echo 警告: 未找到前端package.json文件
)

echo.
echo ==============================================
echo 3. 初始化数据库 (可选)
echo ==============================================
echo 请确保PostgreSQL数据库已安装并运行
echo 数据库连接配置位于: apps/ddd-platform-server/src/config/config.default.ts
echo 您可以手动运行SQL脚本创建数据库表结构

echo.
echo ==============================================
echo 4. 启动开发服务器
echo ==============================================
echo 后端服务启动命令: cd apps/ddd-platform-server && npm run dev
echo 前端服务启动命令: cd apps/ddd-platform-web && npm run dev
echo.
echo 访问地址:
echo - 前端界面: http://localhost:5173
echo - 后端API: http://localhost:7001
echo.

echo ==============================================
echo 安装完成!
echo ==============================================
echo.
echo 下一步操作:
echo 1. 配置数据库连接 (apps/ddd-platform-server/src/config/)
echo 2. 启动后端服务: cd apps/ddd-platform-server && npm run dev
echo 3. 启动前端服务: cd apps/ddd-platform-web && npm run dev
echo.

pause
