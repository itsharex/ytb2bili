# 前后端分离开发指南

本项目采用前后端分离架构，前端使用 Next.js，后端使用 Go + Gin。

## 开发环境配置

### 1. 后端启动（Go）

```bash
# 在项目根目录
go run main.go
```

后端默认运行在 `http://localhost:8096`

### 2. 前端启动（Next.js）

```bash
# 进入前端目录
cd web

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

前端默认运行在 `http://localhost:3000`

### 3. 环境变量配置

前端通过环境变量配置后端API地址：

**开发环境** (`.env.development`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8096/api/v1
```

**生产环境** (`.env.production`):
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

**本地自定义** (`.env.local`，可选):
```env
NEXT_PUBLIC_API_URL=http://localhost:8096/api/v1
```

## API调用说明

前端直接调用后端API，无需代理：

```typescript
// web/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});
```

## CORS配置

后端已配置CORS支持，允许跨域请求：

- `Access-Control-Allow-Origin`: 动态设置为请求源
- `Access-Control-Allow-Methods`: POST, GET, OPTIONS, PUT, DELETE, UPDATE
- `Access-Control-Allow-Credentials`: true

## 开发模式特点

✅ **前后端独立运行**
- 前端: `localhost:3000`
- 后端: `localhost:8096`

✅ **实时热更新**
- 前端代码修改自动刷新
- 后端代码修改需重启服务

✅ **API直接调用**
- 不使用代理
- 通过CORS实现跨域

## 生产部署

### 静态部署（嵌入Go项目）

```bash
# 1. 构建前端
cd web
npm run build

# 2. 前端静态文件会输出到 web/output 目录
# 3. Go后端会自动serve这些静态文件

# 4. 启动Go服务器
cd ..
go run main.go
```

访问 `http://localhost:8096` 即可使用完整应用。

### 独立部署（前后端分离）

**前端部署**:
```bash
cd web
npm run build
# 将 output 目录部署到 CDN 或静态服务器
```

**后端部署**:
```bash
# 编译后端
go build -o app main.go
./app
```

修改前端的 `.env.production` 文件，指向实际的后端API地址。

## 配置文件说明

### Next.js 配置

- `next.config.dev.js`: 开发环境配置（前后端分离）
- `next.config.js`: 生产环境配置（静态导出）

当前使用的配置：前后端分离模式，两个配置文件都支持直接调用后端API。

### 环境变量

- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量
- `.env.local`: 本地覆盖配置（不提交到git）
- `.env.example`: 环境变量示例

## 常见问题

### Q: 前端访问API返回404？
A: 检查后端是否正常启动，确认运行在8096端口。

### Q: CORS错误？
A: 后端已配置CORS，如果仍有问题，检查浏览器控制台错误信息。

### Q: 如何修改后端端口？
A: 修改 `config.toml` 中的 `port` 配置，同时更新前端的 `NEXT_PUBLIC_API_URL`。

### Q: 开发时API调用很慢？
A: 检查网络连接，确认前后端都在本地运行。

## 技术栈

**前端**:
- Next.js 15.5.4
- React 18
- TypeScript
- Tailwind CSS
- Axios

**后端**:
- Go 1.21+
- Gin
- GORM
- PostgreSQL

## 开发建议

1. **使用两个终端**：一个运行后端，一个运行前端
2. **安装浏览器扩展**：React DevTools, Redux DevTools
3. **API测试工具**：使用 Postman 或 curl 测试后端API
4. **日志查看**：关注两个终端的输出日志
