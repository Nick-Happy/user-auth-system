import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">用户认证系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">欢迎回来!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">用户信息</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">邮箱:</span> {user?.email}</p>
                  <p><span className="font-medium">姓名:</span> {user?.name || '未设置'}</p>
                  <p><span className="font-medium">状态:</span> {user?.status}</p>
                  <p><span className="font-medium">邮箱验证:</span> {user?.emailVerified ? '已验证' : '未验证'}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">账户信息</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">注册时间:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-CN') : '-'}</p>
                  <p><span className="font-medium">最后登录:</span> {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '-'}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">快速访问</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/profile"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">👤</div>
                  <h4 className="font-medium">个人资料</h4>
                  <p className="text-sm text-gray-600">管理您的个人信息</p>
                </a>

                <a
                  href="/sessions"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">💻</div>
                  <h4 className="font-medium">会话管理</h4>
                  <p className="text-sm text-gray-600">查看和管理活动会话</p>
                </a>

                <a
                  href="/change-password"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-medium">修改密码</h4>
                  <p className="text-sm text-gray-600">更新您的密码</p>
                </a>

                <a
                  href="/login-history"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-medium">登录历史</h4>
                  <p className="text-sm text-gray-600">查看登录记录</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
