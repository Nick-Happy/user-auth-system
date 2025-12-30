# 用户认证系统 API 文档

## 概述

完整的用户认证系统 API,支持注册、登录、会话管理、JWT 令牌刷新等功能。

**基础 URL**: `http://localhost:8080`

---

## 认证 API (`/api/auth`)

### 1. 用户注册

```http
POST /api/auth/register
Content-Type: application/json
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三"
}
```

**响应 (201):**
```json
{
  "message": "注册成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "avatar": null,
    "status": "ACTIVE",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. 用户登录

```http
POST /api/auth/login
Content-Type: application/json
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

**响应 (200):**
```json
{
  "message": "登录成功",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "avatar": null,
    "status": "ACTIVE",
    "emailVerified": false
  }
}
```

---

### 3. 刷新令牌

```http
POST /api/auth/refresh-token
Content-Type: application/json
```

**请求体:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应 (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 4. 用户登出

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "message": "登出成功"
}
```

---

### 5. 获取认证信息

```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "avatar": null,
    "status": "ACTIVE",
    "emailVerified": false,
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. 修改密码

```http
PUT /api/auth/password
Authorization: Bearer <access_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**响应 (200):**
```json
{
  "message": "密码更新成功,请重新登录"
}
```

---

## 用户 API (`/api/users`)

### 1. 获取用户资料

```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "avatar": null,
    "status": "ACTIVE",
    "emailVerified": false,
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. 更新用户资料

```http
PUT /api/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "name": "李四",
  "avatar": "https://example.com/avatar.jpg"
}
```

**响应 (200):**
```json
{
  "message": "个人资料更新成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "李四",
    "avatar": "https://example.com/avatar.jpg",
    "status": "ACTIVE",
    "emailVerified": false,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. 获取会话列表

```http
GET /api/users/sessions
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "192.168.1.1",
      "expiresAt": "2024-01-01T00:15:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. 删除指定会话

```http
DELETE /api/users/sessions/:sessionId
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "message": "会话删除成功"
}
```

---

### 5. 删除所有会话

```http
DELETE /api/users/sessions
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "message": "所有会话已删除"
}
```

---

### 6. 获取登录历史

```http
GET /api/users/login-history?limit=20&offset=0
Authorization: Bearer <access_token>
```

**响应 (200):**
```json
{
  "attempts": [
    {
      "id": "uuid",
      "success": true,
      "failureReason": null,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

---

## 错误响应

所有错误响应遵循以下格式:

```json
{
  "error": "错误消息"
}
```

**常见 HTTP 状态码:**
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 安全特性

1. **密码加密**: 使用 bcryptjs 加密存储
2. **JWT 令牌**: Access Token (15分钟) + Refresh Token (7天)
3. **会话管理**: 支持多设备登录和会话撤销
4. **登录审计**: 记录所有登录尝试(成功/失败)
5. **账号状态**: 支持 ACTIVE/INACTIVE/SUSPENDED/DELETED 状态
6. **速率限制**: 建议在生产环境添加速率限制中间件

---

## 快速开始

### 1. 启动数据库

```bash
docker-compose up -d postgres redis
```

### 2. 应用数据库迁移

```bash
npx prisma migrate dev
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 测试 API

```bash
# 注册用户
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"测试用户"}'

# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 项目结构

```
src/
├── controllers/        # 控制器
│   ├── authController.ts
│   └── userController.ts
├── middleware/         # 中间件
│   └── auth.ts
├── routes/            # 路由
│   ├── auth.ts
│   └── user.ts
├── validators/        # 请求验证
│   ├── auth.ts
│   └── user.ts
├── utils/             # 工具函数
│   └── jwt.ts
├── lib/               # 库
│   └── prisma.ts
└── index.ts           # 入口文件
```

---

## 下一步

需要继续实现:
- **任务 1.3**: 实现 auth 前端页面
- **任务 1.6**: 实现 user 前端页面
- **任务 2.1 & 2.2**: 编写测试
