# 数据库迁移指南

## 已完成的工作

✅ **任务 1.1**: 设计 auth 数据库表
✅ **任务 1.4**: 设计 user 数据库表
✅ **数据库迁移文件已创建**

## 数据库模型

### 1. User (用户表)
- `id`: UUID 主键
- `email`: 唯一邮箱
- `password_hash`: 密码哈希
- `name`: 用户名称
- `avatar`: 头像 URL
- `status`: 用户状态 (ACTIVE/INACTIVE/SUSPENDED/DELETED)
- `email_verified`: 邮箱验证状态
- `last_login_at`: 最后登录时间

### 2. Session (会话表)
- 存储用户登录会话
- 支持 token 过期管理
- 记录 IP 和 User Agent

### 3. RefreshToken (刷新令牌表)
- 用于 JWT 刷新令牌管理
- 支持令牌撤销

### 4. LoginAttempt (登录尝试记录)
- 记录所有登录尝试(成功/失败)
- 用于安全审计和限流

## 应用迁移

### 选项 1: 使用 Docker Compose (推荐)

```bash
# 启动数据库
docker-compose up -d postgres redis

# 等待数据库启动完成后,应用迁移
npx prisma migrate dev
```

### 选项 2: 本地 PostgreSQL

如果你有本地 PostgreSQL 实例:

```bash
# 1. 创建数据库
createdb "用户认证系统"

# 2. 更新 .env 中的 DATABASE_URL

# 3. 应用迁移
npx prisma migrate dev
```

### 选项 3: 重置数据库 (开发环境)

```bash
# 这会删除所有数据并重新创建表
npx prisma migrate reset
```

## 验证迁移

```bash
# 打开 Prisma Studio 查看数据
npx prisma studio

# 或使用 psql
psql -U postgres -d "用户认证系统" -c "\dt"
```

## 下一步

数据库表已设计完成,现在可以实现:

1. **任务 1.2**: 实现 auth API
2. **任务 1.3**: 实现 auth 前端页面
3. **任务 1.5**: 实现 user API
4. **任务 1.6**: 实现 user 前端页面

需要我继续实现这些任务吗?
