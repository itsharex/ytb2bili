#!/bin/bash

# 切换到生产配置
echo "Switching to production configuration..."

# 备份当前配置
if [ -f "next.config.js" ]; then
    cp next.config.js next.config.js.bak
    echo "Backed up current config to next.config.js.bak"
fi

# 使用生产配置
cp next.config.prod.js next.config.js 2>/dev/null || echo "Using default next.config.js"
echo "✓ Using production config (static export with trailing slash)"

echo ""
echo "Production mode configured!"
echo "Run 'npm run build' to build for production"
