import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  getSessions,
  deleteSession,
  deleteAllSessions,
  getLoginHistory,
  getAllUsers,
  updateUserStatus
} from '../controllers/userController'
import { authenticate } from '../middleware/auth'

const router = Router()

// 当前用户相关路由
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

// 会话管理
router.get('/sessions', authenticate, getSessions)
router.delete('/sessions/:sessionId', authenticate, deleteSession)
router.delete('/sessions', authenticate, deleteAllSessions)

// 登录历史
router.get('/login-history', authenticate, getLoginHistory)

// 管理员路由 (需要管理员权限检查)
router.get('/all', authenticate, getAllUsers)
router.put('/:userId/status', authenticate, updateUserStatus)

export default router
