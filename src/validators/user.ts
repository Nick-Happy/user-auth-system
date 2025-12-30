import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2, '名称至少需要2个字符').optional(),
  avatar: z.string().url('无效的头像URL').optional()
})

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'])
})
