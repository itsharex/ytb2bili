# API Client 统一使用指南

## 概述

为了避免在多个文件中重复定义 API BASE_URL 和创建 HTTP 客户端，我们统一使用 `@/lib/api.ts` 中导出的工具函数和客户端。

## 核心工具

### 1. `getApiBaseUrl()`

获取 API 基础路径（不含协议和域名）

```typescript
import { getApiBaseUrl } from '@/lib/api';

const baseUrl = getApiBaseUrl();
// 开发环境: '/api/v1'
// 生产环境: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1'
```

### 2. `getFullApiBaseUrl()`

获取完整的 API 基础 URL（包含协议和域名）

```typescript
import { getFullApiBaseUrl } from '@/lib/api';

const fullUrl = getFullApiBaseUrl();
// 浏览器环境: 'http://localhost:3000' 或当前域名
// 服务器环境: 'http://localhost:8096'
```

### 3. `apiFetch()`

统一的 fetch 封装，自动处理 BASE_URL 和默认配置

```typescript
import { apiFetch } from '@/lib/api';

// 使用示例
const response = await apiFetch('/auth/accounts', {
  method: 'GET',
});

const data = await response.json();
```

**特点：**
- 自动添加 BASE_URL
- 默认包含 `credentials: 'include'` (支持跨域Cookie)
- 默认设置 `Content-Type: application/json`

### 4. Axios 实例 (默认导出)

使用 axios 的场景

```typescript
import api from '@/lib/api';

// 使用示例
const response = await api.get('/videos');
const result = await api.post('/submit', data);
```

**特点：**
- 自动添加 Firebase UID 到请求头
- 自动处理响应，直接返回 response.data
- 设置了 30 秒超时
- 包含 credentials

## 使用场景

### ✅ 推荐做法

```typescript
// 1. 使用 apiFetch
import { apiFetch } from '@/lib/api';

const response = await apiFetch('/auth/accounts');
const data = await response.json();

// 2. 使用 axios 实例
import api from '@/lib/api';

const data = await api.get('/auth/accounts');

// 3. 需要完整URL的场景（如OAuth）
import { getApiBaseUrl } from '@/lib/api';

const authUrl = `${getApiBaseUrl()}/auth/${platform}/authorize`;
window.open(authUrl, '_blank');
```

### ❌ 避免的做法

```typescript
// ❌ 不要在组件中重复定义
const apiBaseUrl = process.env.NODE_ENV === 'development' 
  ? '/api/v1'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1';

// ❌ 不要硬编码 URL
const response = await fetch('http://localhost:8096/api/v1/auth/status');
```

## 已更新的文件

以下文件已更新为使用统一的 API 客户端：

1. ✅ `/lib/api.ts` - 核心工具函数和客户端
2. ✅ `/app/accounts/page.tsx` - 账号绑定页面
3. ✅ `/hooks/useAuth.ts` - 认证钩子
4. ✅ `/app/page.tsx` - 首页
5. ✅ `/app/diagnostic/page.tsx` - 诊断页面

## 配置说明

### 开发环境

- 前端运行在 `http://localhost:3000`
- API 请求通过 Next.js rewrites 代理到 `http://localhost:8096`
- 使用相对路径 `/api/v1/*`

### 生产环境

- 使用环境变量 `NEXT_PUBLIC_API_URL`
- 默认值：`http://localhost:8096/api/v1`

### Next.js 代理配置

在 `next.config.js` 中：

```javascript
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8096/api/v1/:path*',
    },
  ];
}
```

## 优势

1. **统一管理** - 所有 API 配置在一个地方
2. **避免重复** - 不需要在每个文件中重复获取 BASE_URL
3. **类型安全** - 使用 TypeScript 类型定义
4. **易于维护** - 只需修改一处即可影响全局
5. **开发友好** - 自动处理开发/生产环境差异
6. **错误处理** - 统一的拦截器处理错误

## 注意事项

1. 需要完整 URL 的场景（如 OAuth 回调、打开新窗口）使用 `getFullApiBaseUrl()`
2. 普通 API 调用优先使用 `apiFetch` 或 axios 实例
3. 确保后端服务运行在 8096 端口
4. 开发时确保 Next.js 代理配置正确
