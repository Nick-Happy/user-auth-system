import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '用户认证系统 API 运行中' })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '未找到请求的端点' })
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('未处理的错误:', err)
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📚 API 文档:`)
  console.log(`   - POST   /api/auth/register     - 用户注册`)
  console.log(`   - POST   /api/auth/login        - 用户登录`)
  console.log(`   - POST   /api/auth/refresh-token - 刷新令牌`)
  console.log(`   - POST   /api/auth/logout       - 用户登出`)
  console.log(`   - GET    /api/auth/profile      - 获取认证信息`)
  console.log(`   - PUT    /api/auth/password     - 修改密码`)
  console.log(`   - GET    /api/users/profile     - 获取用户资料`)
  console.log(`   - PUT    /api/users/profile     - 更新用户资料`)
  console.log(`   - GET    /api/users/sessions    - 获取会话列表`)
  console.log(`   - GET    /api/users/login-history - 获取登录历史`)
})
