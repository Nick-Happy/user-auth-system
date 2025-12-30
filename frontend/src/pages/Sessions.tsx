import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/authService'

interface Session {
  id: string
  token: string
  userAgent: string | null
  ipAddress: string | null
  expiresAt: string
  createdAt: string
}

const Sessions: React.FC = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const data = await userService.getSessions()
      setSessions(data.sessions || [])
    } catch (err: any) {
      setMessage(err.response?.data?.error || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await userService.deleteSession(sessionId)
      setMessage('会话删除成功')
      loadSessions()
    } catch (err: any) {
      setMessage(err.response?.data?.error || '删除失败')
    }
  }

  const handleDeleteAllSessions = async () => {
    if (!window.confirm('确定要删除所有会话吗? 这将强制您在所有设备上重新登录。')) {
      return
    }

    try {
      await userService.deleteAllSessions()
      setMessage('所有会话已删除')
      loadSessions()
    } catch (err: any) {
      setMessage(err.response?.data?.error || '删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getUserAgentIcon = (userAgent: string | null) => {
    if (!userAgent) return '💻'
    if (userAgent.includes('Mobile')) return '📱'
    if (userAgent.includes('Chrome')) return '🌐'
    if (userAgent.includes('Firefox')) return '🦊'
    if (userAgent.includes('Safari')) return '🧭'
    return '💻'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-gray-900"
              >
                ← 返回
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">会话管理</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">活动会话</h2>
              <button
                onClick={handleDeleteAllSessions}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                删除所有会话
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded ${
                message.includes('成功')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">加载中...</div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                暂无活动会话
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getUserAgentIcon(session.userAgent)}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {session.userAgent || '未知设备'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              IP: {session.ipAddress || '未知'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">创建时间:</span> {formatDate(session.createdAt)}
                          </p>
                          <p>
                            <span className="font-medium">过期时间:</span> {formatDate(session.expiresAt)}
                          </p>
                          <p>
                            <span className="font-medium">状态:</span>{' '}
                            {new Date(session.expiresAt) > new Date() ? (
                              <span className="text-green-600">活动</span>
                            ) : (
                              <span className="text-red-600">已过期</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="ml-4 px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>提示:</strong> 删除会话将使该设备上的用户登出。当前设备的会话也将被删除,您需要重新登录。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Sessions
