import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export interface AuthRequest extends Request {
  userId?: string
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证令牌' })
    }

    const token = authHeader.substring(7)

    // 验证 JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // 检查会话是否存在且未过期
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: '会话已过期,请重新登录' })
    }

    // 检查用户状态
    if (session.user.status !== 'ACTIVE') {
      return res.status(403).json({ error: '用户账号已被禁用' })
    }

    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' })
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const session = await prisma.session.findUnique({
      where: { token }
    })

    if (session && session.expiresAt >= new Date()) {
      req.userId = decoded.userId
    }

    next()
  } catch (error) {
    // 可选认证失败不影响请求
    next()
  }
}
