# YTB2BILI - YouTube 到 Bilibili 自动化转载系统

一个功能完整的视频自动化处理系统，支持从 YouTube 等平台下载视频，自动生成字幕、翻译内容、生成元数据，并定时上传到 Bilibili。

## ✨ 核心功能

### 🎬 智能视频处理链

**4步准备流程（实时处理）**：
1. **🎬 字幕生成** - 使用 Whisper AI 自动生成高质量字幕
2. **📷 封面下载** - 自动下载并上传高清封面到云存储
3. **🌐 字幕翻译** - 支持百度翻译和 DeepSeek AI 多语言翻译
4. **🤖 元数据生成** - AI 分析视频内容，生成符合 B站规范的标题、描述、标签

**定时上传策略（智能调度）**：
- **🎥 视频上传** - 每小时上传一个处理完成的视频
- **📝 字幕上传** - 视频上传成功后1小时自动上传字幕

### 📊 可视化管理面板
- **📋 视频列表** - 实时查看所有视频的处理状态
- **🔍 详细信息** - 完整的视频信息和处理步骤追踪  
- **🎯 单步重试** - 支持重新执行失败的任务步骤
- **📈 进度监控** - 实时进度百分比和处理时长统计
- **📁 文件管理** - 查看和下载所有生成的文件（视频、字幕、封面等）

### 🔐 B站账户集成
- **📱 扫码登录** - 支持 Bilibili TV 扫码快速登录
- **🖼️ 二维码生成** - 后端自动生成 PNG 格式登录二维码
- **🔄 自动检测** - 前端实时轮询检测登录状态
- **👤 用户信息** - 获取并展示用户名、头像等信息
- **💾 状态持久化** - 自动保存登录 Token 和 Cookie
- **⚡ 状态检查** - 智能检测账户登录状态

---

## 🏗️ 技术架构

### 🖥️ 后端技术栈
- **语言**: Go 1.24+ (支持最新语言特性)
- **Web 框架**: Gin (高性能HTTP框架)
- **ORM**: GORM v2 (支持多数据库)
- **数据库**: MySQL 8.0+ / PostgreSQL 15+ / SQLite (开发环境)
- **文件存储**: 腾讯云 COS (支持大文件分片上传)
- **依赖注入**: Uber FX (声明式依赖管理)
- **定时任务**: Robfig Cron v3 (精确到秒级调度)
- **日志**: Zap + Lumberjack (结构化日志和日志轮转)

### 🌐 前端技术栈 
- **框架**: Next.js 15+ (支持 App Router)
- **语言**: TypeScript 5.x (完全类型安全)
- **UI 库**: React 18 + Tailwind CSS 3.x
- **图标**: Lucide React (现代化图标库)
- **HTTP 客户端**: Axios (支持请求拦截和重试)
- **构建**: 静态导出 + 嵌入式部署

### 🔗 外部服务集成
- **🎤 yt-dlp** - 多平台视频下载 (YouTube, TikTok, 等)
- **🧠 Whisper AI** - 高精度语音识别和字幕生成
- **🌐 百度翻译 API** - 专业机器翻译服务
- **🤖 DeepSeek AI** - 先进的AI翻译和内容生成
- **📺 Bilibili SDK** - 官方视频上传和用户认证API
- **☁️ 腾讯云 COS** - 企业级对象存储服务
- **📊 数据分析** - 可选的用户行为分析和统计

---

## 📁 项目结构

```
ytb2bili/
├── main.go                      # 🚀 应用程序入口和依赖注入配置
├── Makefile                     # 📦 自动化构建脚本 (前端+后端一键打包)
├── config.toml                  # ⚙️ 主配置文件
├── config.toml.example          # 📋 配置文件模板
├── go.mod                       # 📦 Go 模块依赖管理
└── README.md                    # 📖 项目文档

internal/                        # 🏠 内部业务逻辑
├── chain_task/                  # ⛓️ 任务链处理引擎
│   ├── chain_task_handler.go    # 任务链执行器 (准备阶段: 字幕生成→翻译→元数据)
│   ├── upload_scheduler.go      # 上传调度器 (定时上传: 视频→字幕)
│   ├── base/
│   │   └── base_task.go         # 任务基类
│   ├── handlers/                # 🔧 具体任务处理器
│   │   ├── generate_subtitles.go      # 字幕生成 (Whisper AI)
│   │   ├── translate_subtitle.go      # 字幕翻译 (百度/DeepSeek)
│   │   ├── generate_metadata.go       # 元数据生成 (AI标题描述)
│   │   ├── download_img_handler.go    # 封面下载处理
│   │   ├── upload_to_bilibili.go      # 视频上传到B站
│   │   ├── upload_subtitle_to_bilibili.go  # 字幕上传到B站
│   │   └── ...
│   └── manager/
│       ├── chain.go             # 任务链管理
│       └── state.go             # 状态管理
├── core/                        # 🎯 核心业务层
│   ├── app_server.go            # HTTP 服务器配置
│   ├── models/                  # 📊 数据模型
│   │   ├── tb_video.go          # 视频表模型
│   │   ├── tb_task_step.go      # 任务步骤模型
│   │   ├── tb_user.go           # 用户模型
│   │   └── ...
│   ├── services/                # 🔄 业务服务层
│   │   ├── tb_video_service.go  # 视频业务逻辑
│   │   ├── task_step_service.go # 任务步骤管理
│   │   └── saved_video_service.go
│   └── types/
│       ├── app_config.go        # 应用配置定义
│       └── task_interface.go    # 任务接口定义
├── handler/                     # 🌐 HTTP 请求处理器
│   ├── auth_handler.go          # 认证相关 API
│   ├── video_handler.go         # 视频管理 API
│   ├── upload_handler.go        # 上传相关 API
│   ├── subtitle_handler.go      # 字幕处理 API
│   └── ...
├── storage/                     # 💾 存储抽象层
│   ├── interfaces.go            # 存储接口定义
│   └── login_store.go           # 登录状态存储
└── web/                         # 🌟 内嵌前端资源
    ├── static.go                # 静态文件服务器
    └── bili-up-web/             # Next.js 编译后的静态文件
        ├── index.html           # 前端入口页面
        ├── _next/               # Next.js 静态资源
        └── ...

pkg/                             # 📚 可重用组件库
├── analytics/                   # 📊 数据分析客户端
│   ├── client.go
│   └── middleware.go
├── cos/                         # ☁️ 腾讯云COS存储客户端
│   ├── cos_client.go
│   ├── cos_handler.go
│   └── download_utils.go
├── logger/                      # 📝 日志组件
│   └── logger.go
├── services/                    # 🛠️ 通用服务
│   └── subtitle_service.go
├── store/                       # 🗃️ 数据库操作
│   ├── database.go              # 数据库连接
│   ├── migrate.go               # 数据库迁移
│   └── model/                   # 数据库模型
├── translator/                  # 🌐 翻译服务
│   ├── baidu_translator.go      # 百度翻译
│   ├── deepseek_translator.go   # DeepSeek翻译
│   ├── factory.go               # 翻译器工厂
│   └── manager.go               # 翻译管理器
└── utils/                       # 🧰 工具函数
    ├── crypto.go                # 加密工具
    ├── ffmpeg_utils.go          # 视频处理工具
    ├── youtube_utils.go         # YouTube工具
    ├── ytdlp_manager.go         # yt-dlp管理器
    └── ...
```

---

## 🚀 快速开始

> 📚 **完整构建指南**: 请查看 [BUILD_GUIDE.md](./BUILD_GUIDE.md) 了解详细的构建和部署说明。

### 快速构建（一键打包前端+后端）

```bash
cd bili-up-api
make build
./bili-up-api-server
```

这将自动：
1. 构建 Next.js 前端并导出静态文件
2. 将前端嵌入到 Go 二进制中
3. 编译生成单个可执行文件

访问 `http://localhost:8096` 即可使用完整的前后端功能。

### 1. 环境要求

- Go 1.19+
- MySQL 8.0+ / PostgreSQL / SQLite
- Node.js 18+ (用于构建前端)
- Rust 1.70+ (biliup-rs，可选)

### 2. 配置数据库

```sql
CREATE DATABASE bili_up CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置文件

复制并修改配置文件：

```bash
cp config.toml.example config.toml
```

编辑 `config.toml`：

```toml
listen = ":8096"
environment = "development"
debug = true
FileUpDir = "/path/to/media"

[database]
  type = "mysql"
  host = "localhost"
  port = 3306
  username = "root"
  password = "your_password"
  database = "bili_up"

# 腾讯云 COS 配置
[TenCosConfig]
  Enabled = true
  CosBucketURL = "https://your-bucket.cos.region.myqcloud.com"
  CosSecretId = "your_secret_id"
  CosSecretKey = "your_secret_key"
  CosRegion = "ap-guangzhou"
  CosBucket = "your-bucket"

# 百度翻译配置
[BaiduTransConfig]
  enabled = true
  app_id = "your_app_id"
  secret_key = "your_secret_key"

# DeepSeek 配置
[DeepSeekTransConfig]
  enabled = true
  api_key = "your_api_key"
  model = "deepseek-chat"
  endpoint = "https://api.deepseek.com"

```

### 4. 编译运行

```bash
# 安装依赖
go mod download

# 编译
go build -o bili_up_backend main.go

# 运行
./bili_up_backend
```

---

## 📖 API 文档

### 视频管理

#### 获取视频列表
```http
GET /api/v1/videos
```

#### 获取视频详情（含任务步骤）
```http
GET /api/v1/videos/:id
```

响应示例：
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "视频标题",
    "description": "视频描述",
    "cover_url": "封面URL",
    "status": "completed",
    "task_steps": [
      {
        "step_name": "download_video",
        "step_order": 1,
        "status": "completed",
        "duration": 120,
        "can_retry": false
      },
      // ... 其他步骤
    ]
  }
}
```

#### 重试任务步骤
```http
POST /api/v1/videos/:id/steps/:stepName/retry
```

#### 获取视频文件列表
```http
GET /api/v1/videos/:id/files
```

### 认证相关

#### 获取登录二维码
```http
GET /api/v1/auth/qrcode
```

#### 获取二维码图片
```http
GET /api/v1/auth/qrcode/image/:authCode
```

#### 轮询登录状态
```http
POST /api/v1/auth/poll
Body: {"auth_code": "xxx"}
```

#### 检查登录状态
```http
GET /api/v1/auth/status
```

#### 获取用户信息
```http
GET /api/v1/auth/userinfo
```

#### 登出
```http
POST /api/v1/auth/logout
```

---



## 🎯 任务处理流程

### 6步处理链

1. **download_video** - 下载视频
   - 支持多平台（B站、抖音、YouTube 等）
   - 自动选择最佳清晰度
   - 保存到本地或云存储

2. **generate_subtitles** - 生成字幕
   - 使用 Whisper AI 语音识别
   - 自动断句和时间轴
   - 支持多语言识别

3. **translate_subtitles** - 翻译字幕
   - 百度翻译或 DeepSeek AI
   - 保留字幕格式和时间轴
   - 支持多语言翻译

4. **generate_metadata** - 生成元数据
   - AI 分析视频内容
   - 生成标题、描述、标签
   - 符合 B站 SEO 规范

5. **upload_to_bilibili** - 上传视频
   - 分片上传支持大文件
   - 自动重试机制
   - 实时进度反馈

6. **upload_subtitles** - 上传字幕
   - 支持双语字幕
   - 自动关联视频
   - SRT/ASS 格式支持

### 任务状态

- `pending` - 等待执行
- `running` - 执行中
- `completed` - 已完成
- `failed` - 失败
- `skipped` - 跳过

---

## 🧪 测试

### 运行单元测试
```bash
go test ./...
```

### API 测试

使用提供的测试脚本：

```bash
# 测试应用认证
./test_app_auth.sh

# 测试视频上传（需要先登录）
curl http://localhost:8096/api/v1/videos

# 测试认证状态
curl http://localhost:8096/api/v1/auth/status
```

---

## 📊 数据库表结构

### videos 表
```sql
CREATE TABLE videos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  cover_url VARCHAR(512),
  file_path VARCHAR(512),
  status VARCHAR(50),
  bilibili_bvid VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### task_steps 表
```sql
CREATE TABLE task_steps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id BIGINT,
  step_name VARCHAR(100),
  step_order INT,
  status VARCHAR(50),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INT,
  error_msg TEXT,
  result_data JSON,
  can_retry BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);
```

---

## 🛠️ 故障排查

### 问题1: 数据库连接失败

**错误**: `Error 1045: Access denied`

**解决**:
1. 检查 `config.toml` 中的数据库配置
2. 确认 MySQL 服务正在运行
3. 验证用户名和密码

### 问题2: B站登录失败

**错误**: 二维码过期或无法扫描

**解决**:
1. 刷新页面重新获取二维码
2. 检查网络连接
3. 确认 B站账号状态正常

### 问题3: 视频上传失败

**错误**: 上传超时或中断

**解决**:
1. 检查网络速度
2. 尝试减小视频文件大小
3. 查看 B站账号是否有上传权限
4. 检查 Token 是否过期

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---
