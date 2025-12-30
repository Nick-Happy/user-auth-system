import api from './api'

export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  status: string
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  name?: string
}

export interface LoginData {
  email: string
  password: string
}

// 认证 API
export const authService = {
  // 用户注册
  register: async (data: RegisterData) => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  // 用户登录
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', {
      ...data,
      userAgent: navigator.userAgent,
      ipAddress: '', // 后端会自动获取
    })
    return response.data
  },

  // 用户登出
  logout: async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
  },

  // 获取当前用户信息
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/profile')
    return response.data
  },

  // 修改密码
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/api/auth/password', data)
    return response.data
  },
}

// 用户 API
export const userService = {
  // 获取用户资料
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/users/profile')
    return response.data
  },

  // 更新用户资料
  updateProfile: async (data: { name?: string; avatar?: string }) => {
    const response = await api.put('/api/users/profile', data)
    return response.data
  },

  // 获取会话列表
  getSessions: async () => {
    const response = await api.get('/api/users/sessions')
    return response.data
  },

  // 删除指定会话
  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/api/users/sessions/${sessionId}`)
    return response.data
  },

  // 删除所有会话
  deleteAllSessions: async () => {
    const response = await api.delete('/api/users/sessions')
    return response.data
  },

  // 获取登录历史
  getLoginHistory: async (limit = 20, offset = 0) => {
    const response = await api.get(`/api/users/login-history?limit=${limit}&offset=${offset}`)
    return response.data
  },
}
