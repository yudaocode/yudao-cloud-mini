#!/bin/bash

echo "正在启动DDD平台AMIS编辑器..."
echo

cd "$(dirname "$0")"

echo "检查Node.js是否已安装..."
if ! command -v node &> /dev/null; then
    echo "错误: 请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "检查依赖是否已安装..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接"
        exit 1
    fi
fi

echo "正在启动开发服务器..."
echo "编辑器地址: http://localhost:3000"
echo "预览页面: http://localhost:3000/preview.html"
echo
echo "请确保后端服务已在端口8100启动"
echo

# 在后台打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &
fi

npm run dev
