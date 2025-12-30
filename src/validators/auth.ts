import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
  name: z.string().min(2, '名称至少需要2个字符').optional()
})

export const loginSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(1, '请输入密码')
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, '请提供刷新令牌')
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(8, '新密码至少需要8个字符')
})
