#!/bin/bash

# 切换到开发配置
echo "Switching to development configuration..."

# 备份当前配置
if [ -f "next.config.js" ]; then
    cp next.config.js next.config.js.bak
    echo "Backed up current config to next.config.js.bak"
fi

# 使用开发配置
cp next.config.dev.js next.config.js
echo "✓ Using next.config.dev.js (no trailing slash, direct API calls)"

echo ""
echo "Development mode configured!"
echo "Frontend will run on: http://localhost:3000"
echo "Backend should run on: http://localhost:8096"
echo ""
echo "Run 'npm run dev' to start the development server"
