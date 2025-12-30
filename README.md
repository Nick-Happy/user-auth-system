# 用户认证系统 (User Authentication System)

一个完整的全栈用户认证系统,包含后端 API 和 React 前端界面。

## ✨ 特性

- 🔐 **JWT 双令牌认证** - Access Token + Refresh Token
- 👥 **完整的用户管理** - 注册、登录、个人资料
- 💻 **会话管理** - 多设备登录、会话撤销
- 📊 **登录审计** - 完整的登录历史记录
- 🔒 **安全特性** - 密码加密、令牌自动刷新
- 📱 **响应式设计** - 支持移动端和桌面端

## 🚀 快速开始

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 配置环境变量

创建 `.env` 文件:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=8080
```

### 初始化数据库

```bash
npx prisma db push
npx prisma generate
```

### 启动应用

```bash
# 启动后端 API (终端 1)
npm run dev

# 启动前端应用 (终端 2)
cd frontend
npm start
```

访问:
- **前端**: http://localhost:3000
- **API**: http://localhost:8080

## 📁 项目结构

```
├── src/                    # 后端源码
│   ├── controllers/        # 控制器 (auth, user)
│   ├── middleware/         # 认证中间件
│   ├── routes/             # API 路由
│   ├── validators/         # 请求验证 (Zod)
│   ├── utils/              # 工具函数 (JWT)
│   └── index.ts            # 应用入口
│
├── frontend/               # 前端应用 (React)
│   └── src/
│       ├── components/     # 受保护路由组件
│       ├── contexts/       # 认证上下文
│       ├── pages/          # 页面组件 (登录、注册等)
│       └── services/       # API 服务
│
├── prisma/                 # 数据库
│   ├── schema.prisma       # 数据模型定义
│   └── migrations/         # 数据库迁移文件
│
└── docs/                   # 文档
    ├── API_DOCUMENTATION.md       # API 端点文档
    ├── FRONTEND_GUIDE.md          # 前端开发指南
    ├── DATABASE_SETUP.md          # 数据库配置
    └── PROJECT_COMPLETION.md      # 完整功能介绍
```

## 🔌 API 端点

### 认证 API

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/refresh-token` | 刷新令牌 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/profile` | 获取认证信息 |
| PUT | `/api/auth/password` | 修改密码 |

### 用户 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/users/profile` | 获取用户资料 |
| PUT | `/api/users/profile` | 更新用户资料 |
| GET | `/api/users/sessions` | 获取会话列表 |
| DELETE | `/api/users/sessions/:id` | 删除指定会话 |
| DELETE | `/api/users/sessions` | 删除所有会话 |
| GET | `/api/users/login-history` | 获取登录历史 |

## 📱 前端页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 登录 | `/login` | 用户登录 |
| 注册 | `/register` | 用户注册 |
| 仪表板 | `/dashboard` | 主页面 |
| 个人资料 | `/profile` | 编辑个人信息 |
| 会话管理 | `/sessions` | 管理活动设备 |
| 登录历史 | `/login-history` | 查看登录记录 |
| 修改密码 | `/change-password` | 更新密码 |

## 🛠️ 技术栈

### 后端
- **框架**: Express.js
- **语言**: TypeScript 5.0
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma 5.0
- **认证**: JWT (jsonwebtoken)
- **验证**: Zod

### 前端
- **框架**: React 18
- **语言**: TypeScript
- **路由**: React Router v6
- **HTTP**: Axios
- **状态**: React Context

## 🔐 安全特性

- ✅ 密码使用 bcryptjs 加密存储
- ✅ JWT 双令牌机制 (Access + Refresh)
- ✅ 令牌自动刷新
- ✅ 会话过期控制
- ✅ 登录审计日志
- ✅ 请求参数验证

## 📚 文档

- [API 文档](API_DOCUMENTATION.md) - 完整的 API 端点说明
- [前端指南](FRONTEND_GUIDE.md) - 前端页面和组件说明
- [数据库设置](DATABASE_SETUP.md) - 数据库配置指南
- [项目总结](PROJECT_COMPLETION.md) - 完整功能介绍和实现细节

## 🧪 测试

```bash
# 使用测试脚本
bash test-api.sh

# 或手动测试
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","name":"测试用户"}'
```

## 📝 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request!

---

**使用 AI 助手开发** 🤖✨
