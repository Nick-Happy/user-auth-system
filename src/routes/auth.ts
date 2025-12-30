import { Router } from 'express'
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updatePassword
} from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

// 公开路由
router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)

// 需要认证的路由
router.post('/logout', authenticate, logout)
router.get('/profile', authenticate, getProfile)
router.put('/password', authenticate, updatePassword)

export default router
