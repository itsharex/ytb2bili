"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Link2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface AccountStatus {
  platform: string;
  name: string;
  connected: boolean;
  username?: string;
  avatar?: string;
  connectedAt?: string;
  icon: string;
  color: string;
  description: string;
}

export default function AccountsPage() {
  const { user, loading, handleLoginSuccess, handleRefreshStatus, handleLogout } = useAuth();
  const [accounts, setAccounts] = useState<AccountStatus[]>([
    {
      platform: 'bilibili',
      name: 'Bilibili（B站）',
      connected: false,
      icon: '📺',
      color: 'from-pink-500 to-pink-600',
      description: '绑定B站账号后，可直接将视频上传到您的B站账号'
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      connected: false,
      icon: '▶️',
      color: 'from-red-500 to-red-600',
      description: '绑定YouTube账号，下载和管理您的YouTube视频'
    },
    {
      platform: 'douyin',
      name: '抖音',
      connected: false,
      icon: '🎵',
      color: 'from-black to-gray-800',
      description: '绑定抖音账号，同步和管理您的抖音内容'
    },
    {
      platform: 'kuaishou',
      name: '快手',
      connected: false,
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      description: '绑定快手账号，管理您的快手视频内容'
    },
    {
      platform: 'wechat_channels',
      name: '微信视频号',
      connected: false,
      icon: '💬',
      color: 'from-green-500 to-green-600',
      description: '绑定微信视频号，同步视频到视频号平台'
    }
  ]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user) {
      checkAccountStatus();
    }
  }, [user]);

  const checkAccountStatus = async () => {
    setIsChecking(true);
    try {
      // 这里调用后端API检查各平台账号绑定状态
      const apiBaseUrl = process.env.NODE_ENV === 'development' 
        ? '/api/v1'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1';
      
      const response = await fetch(`${apiBaseUrl}/auth/accounts`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && data.data) {
          // 更新账号状态
          setAccounts(prev => prev.map(account => {
            const status = data.data[account.platform];
            if (status) {
              return {
                ...account,
                connected: status.connected,
                username: status.username,
                avatar: status.avatar,
                connectedAt: status.connected_at
              };
            }
            return account;
          }));
        }
      }
    } catch (error) {
      console.error('检查账号状态失败:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      const apiBaseUrl = process.env.NODE_ENV === 'development' 
        ? '/api/v1'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1';
      
      // 打开OAuth授权窗口
      const authUrl = `${apiBaseUrl}/auth/${platform}/authorize`;
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        authUrl,
        `${platform}_auth`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // 监听授权成功消息
      window.addEventListener('message', (event) => {
        if (event.data.type === 'auth_success' && event.data.platform === platform) {
          checkAccountStatus();
        }
      });
    } catch (error) {
      console.error('连接账号失败:', error);
      alert('连接失败，请重试');
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`确定要解绑${accounts.find(a => a.platform === platform)?.name}账号吗？`)) {
      return;
    }

    try {
      const apiBaseUrl = process.env.NODE_ENV === 'development' 
        ? '/api/v1'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1';
      
      const response = await fetch(`${apiBaseUrl}/auth/${platform}/disconnect`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.code === 200) {
        checkAccountStatus();
      } else {
        alert(data.message || '解绑失败');
      }
    } catch (error) {
      console.error('解绑账号失败:', error);
      alert('解绑失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">账号绑定</h1>
          <p className="text-gray-600">
            绑定各平台账号，实现跨平台视频管理和同步
          </p>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">安全提示</p>
            <p>绑定账号后，我们将使用您的账号信息进行视频上传和管理操作。我们承诺不会泄露您的账号信息，也不会进行任何未经授权的操作。</p>
          </div>
        </div>

        {/* 账号列表 */}
        <div className="min-h-[600px]">
          {isChecking ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.platform}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${account.color} rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                          {account.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {account.name}
                          </h3>
                          {account.connected ? (
                            <div className="flex items-center space-x-1 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>已绑定</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <XCircle className="w-4 h-4" />
                              <span>未绑定</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                      {account.description}
                    </p>

                    <div className="min-h-[76px] mb-4">
                      {account.connected && account.username && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            {account.avatar && (
                              <img
                                src={account.avatar}
                                alt={account.username}
                                className="w-8 h-8 rounded-full flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {account.username}
                              </p>
                              {account.connectedAt && (
                                <p className="text-xs text-gray-500">
                                  绑定时间：{new Date(account.connectedAt).toLocaleDateString('zh-CN')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {account.connected ? (
                        <>
                          <button
                            onClick={() => handleDisconnect(account.platform)}
                            className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                          >
                            解绑账号
                          </button>
                          <button
                            onClick={() => handleConnect(account.platform)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>重新授权</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(account.platform)}
                          className={`flex-1 px-4 py-2 bg-gradient-to-r ${account.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm flex items-center justify-center space-x-2`}
                        >
                          <Link2 className="w-4 h-4" />
                          <span>绑定账号</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">使用说明</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-900 w-6">1.</span>
              <p>点击"绑定账号"按钮，将跳转到对应平台的授权页面</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-900 w-6">2.</span>
              <p>在授权页面登录并同意授权后，即可完成账号绑定</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-900 w-6">3.</span>
              <p>绑定成功后，您可以在视频上传时选择对应的平台账号</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-gray-900 w-6">4.</span>
              <p>如需更换账号，可先解绑当前账号，再重新绑定新账号</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
