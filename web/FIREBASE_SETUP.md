# Firebase 登录配置指南

## 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称，按照提示完成创建

## 2. 启用身份验证

1. 在 Firebase 项目中，点击左侧菜单的"Authentication"（身份验证）
2. 点击"开始使用"
3. 在"登录方法"标签页中启用以下提供商：

### 启用 Google 登录
- 点击"Google"
- 切换开关启用
- 填写项目的公开名称和支持邮箱
- 点击"保存"

### 启用 GitHub 登录
- 点击"GitHub"
- 切换开关启用
- 需要先在 GitHub 创建 OAuth 应用：
  1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
  2. 点击"New OAuth App"
  3. 填写信息：
     - Application name: 你的应用名称
     - Homepage URL: `http://localhost:3000` (开发环境)
     - Authorization callback URL: 复制 Firebase 提供的回调 URL
  4. 创建后获得 Client ID 和 Client Secret
  5. 将这些信息填入 Firebase 的 GitHub 登录配置中
- 点击"保存"

## 3. 获取 Firebase 配置

1. 在 Firebase 项目中，点击项目设置（齿轮图标）
2. 在"常规"标签页，滚动到"您的应用"部分
3. 选择或创建一个 Web 应用
4. 复制配置对象中的值

## 4. 配置环境变量

将获得的配置值填入 `.env.local` 文件：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 5. 安全规则

### 5.1 Firebase 控制台设置

在 Firebase Authentication 设置中：
- 设置授权域名（开发环境添加 `localhost`）
- 生产环境添加你的域名

### 5.2 CORS 配置

确保后端 API 允许来自前端的请求。

## 6. 测试登录

1. 启动开发服务器：
```bash
cd web
npm run dev
```

2. 访问 `http://localhost:3000`
3. 点击 Google 或 GitHub 登录按钮
4. 完成授权流程

## 7. 生产部署

### 更新授权域名
1. 在 Firebase Console > Authentication > Settings > Authorized domains
2. 添加你的生产域名

### 更新 GitHub OAuth 应用
1. 在 GitHub OAuth 应用设置中
2. 添加生产环境的回调 URL

### 环境变量
确保生产环境的 `.env.production` 包含正确的 Firebase 配置

## 常见问题

### Q: 登录弹窗被阻止
A: 检查浏览器是否阻止了弹出窗口，需要允许来自你的域名的弹窗

### Q: GitHub 登录失败
A: 
- 检查 GitHub OAuth 应用的回调 URL 是否正确
- 确认 Client ID 和 Secret 是否正确填写

### Q: Google 登录失败
A: 
- 确认项目已启用 Google 登录
- 检查授权域名是否包含当前域名

### Q: 网络错误
A: 
- 检查网络连接
- 确认 Firebase 项目未被停用
- 检查 API 密钥是否正确

## 安全建议

1. **不要提交 .env.local 到 git**
   - 已在 .gitignore 中排除

2. **使用环境变量**
   - 生产环境使用安全的方式管理密钥
   - 考虑使用密钥管理服务

3. **定期轮换密钥**
   - 定期更新 API 密钥和 OAuth 密钥

4. **监控使用情况**
   - 在 Firebase Console 中监控认证使用情况
   - 设置预算警报

## 参考链接

- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [Google 登录设置](https://firebase.google.com/docs/auth/web/google-signin)
- [GitHub 登录设置](https://firebase.google.com/docs/auth/web/github-auth)
