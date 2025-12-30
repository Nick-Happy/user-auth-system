import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { updateProfileSchema } from '../validators/user'
import { AuthRequest } from '../middleware/auth'

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

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        status: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    res.json({
      message: '个人资料更新成功',
      user
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('更新个人资料错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        token: true,
        userAgent: true,
        ipAddress: true,
        expiresAt: true,
        createdAt: true
      }
    })

    res.json({ sessions })
  } catch (error) {
    console.error('获取会话列表错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return res.status(404).json({ error: '会话不存在' })
    }

    if (session.userId !== req.userId) {
      return res.status(403).json({ error: '无权删除此会话' })
    }

    await prisma.session.delete({
      where: { id: sessionId }
    })

    res.json({ message: '会话删除成功' })
  } catch (error) {
    console.error('删除会话错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const deleteAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.session.deleteMany({
      where: { userId: req.userId }
    })

    res.json({ message: '所有会话已删除' })
  } catch (error) {
    console.error('删除所有会话错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const getLoginHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query

    const attempts = await prisma.loginAttempt.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      select: {
        id: true,
        success: true,
        failureReason: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true
      }
    })

    const total = await prisma.loginAttempt.count({
      where: { userId: req.userId }
    })

    res.json({
      attempts,
      total,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('获取登录历史错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

// 管理员功能
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0, status } = req.query

    const where: any = {}
    if (status) {
      where.status = status
    }

    const users = await prisma.user.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true
      }
    })

    const total = await prisma.user.count({ where })

    res.json({
      users,
      total,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    console.error('获取用户列表错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        updatedAt: true
      }
    })

    res.json({
      message: '用户状态更新成功',
      user
    })
  } catch (error) {
    console.error('更新用户状态错误:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
