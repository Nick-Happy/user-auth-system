import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { registerSchema, loginSchema, refreshTokenSchema, updatePasswordSchema } from '../validators/auth'
import { AuthRequest } from '../middleware/auth'

export const register = async (req: Request, res: Response) => {
  try {
    // 验证请求数据
    const validatedData = registerSchema.parse(req.body)

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已被注册' })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name || validatedData.email.split('@')[0]
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        status: true,
        emailVerified: true,
        createdAt: true
      }
    })

    res.status(201).json({
      message: '注册成功',
      user
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('注册错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, userAgent, ipAddress } = loginSchema.parse(req.body)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // 记录失败尝试
      await prisma.loginAttempt.create({
        data: {
          email,
          success: false,
          failureReason: '用户不存在',
          userAgent,
          ipAddress
        }
      })
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 验证密码
    const validPassword = await bcrypt.compare(password, user.passwordHash)

    if (!validPassword) {
      // 记录失败尝试
      await prisma.loginAttempt.create({
        data: {
          userId: user.id,
          email,
          success: false,
          failureReason: '密码错误',
          userAgent,
          ipAddress
        }
      })
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: '账号已被禁用,请联系管理员' })
    }

    // 生成令牌
    const accessToken = generateAccessToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    // 创建会话
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15分钟
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        userAgent,
        ipAddress,
        expiresAt
      }
    })

    // 创建刷新令牌记录
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt
      }
    })

    // 记录成功登录
    await prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email,
        success: true,
        userAgent,
        ipAddress
      }
    })

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    res.json({
      message: '登录成功',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        emailVerified: user.emailVerified
      }
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('登录错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body)

    // 验证刷新令牌
    const payload = verifyRefreshToken(refreshToken)

    // 查找刷新令牌记录
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: '刷新令牌无效或已过期' })
    }

    // 检查用户状态
    if (tokenRecord.user.status !== 'ACTIVE') {
      return res.status(403).json({ error: '账号已被禁用' })
    }

    // 生成新的访问令牌
    const accessToken = generateAccessToken({
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email
    })

    // 创建新会话
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await prisma.session.create({
      data: {
        userId: tokenRecord.user.id,
        token: accessToken,
        expiresAt
      }
    })

    res.json({
      accessToken,
      refreshToken: refreshToken // 刷新令牌可以重复使用直到过期
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('刷新令牌错误:', error)
    res.status(401).json({ error: '无效的刷新令牌' })
  }
}

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.substring(7)

    if (token) {
      // 删除会话
      await prisma.session.deleteMany({
        where: { token }
      })
    }

    res.json({ message: '登出成功' })
  } catch (error) {
    console.error('登出错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    res.json({ user })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updatePasswordSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    })

    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    // 验证当前密码
    const validPassword = await bcrypt.compare(validatedData.currentPassword, user.passwordHash)

    if (!validPassword) {
      return res.status(401).json({ error: '当前密码错误' })
    }

    // 更新密码
    const passwordHash = await bcrypt.hash(validatedData.newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    })

    // 撤销所有刷新令牌,强制重新登录
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() }
    })

    res.json({ message: '密码更新成功,请重新登录' })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('更新密码错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
