'use client';

import { useState } from 'react';
import { Github, Mail, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  UserCredential 
} from 'firebase/auth';

interface FirebaseLoginProps {
  onLoginSuccess?: (user: any) => void;
  onRefreshStatus?: () => void;
}

export default function FirebaseLogin({ onLoginSuccess, onRefreshStatus }: FirebaseLoginProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Google 登录
  const handleGoogleLogin = async () => {
    setStatus('loading');
    setError('');
    setMessage('正在使用 Google 登录...');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result: UserCredential = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setStatus('success');
      setMessage('登录成功！');
      
      // 延迟一下让用户看到成功消息
      setTimeout(() => {
        if (onRefreshStatus) {
          onRefreshStatus();
        }
        
        if (onLoginSuccess) {
          onLoginSuccess({
            id: user.uid,
            name: user.displayName || 'Google User',
            email: user.email || '',
            avatar: user.photoURL || '',
            provider: 'google'
          });
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Google 登录失败:', error);
      setStatus('error');
      setError(getErrorMessage(error));
    }
  };

  // GitHub 登录
  const handleGithubLogin = async () => {
    setStatus('loading');
    setError('');
    setMessage('正在使用 GitHub 登录...');
    
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      provider.addScope('user:email');
      
      const result: UserCredential = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setStatus('success');
      setMessage('登录成功！');
      
      setTimeout(() => {
        if (onRefreshStatus) {
          onRefreshStatus();
        }
        
        if (onLoginSuccess) {
          onLoginSuccess({
            id: user.uid,
            name: user.displayName || 'GitHub User',
            email: user.email || '',
            avatar: user.photoURL || '',
            provider: 'github'
          });
        }
      }, 500);
      
    } catch (error: any) {
      console.error('GitHub 登录失败:', error);
      setStatus('error');
      setError(getErrorMessage(error));
    }
  };

  // 错误消息处理
  const getErrorMessage = (error: any): string => {
    const code = error.code;
    
    switch (code) {
      case 'auth/popup-closed-by-user':
        return '登录已取消';
      case 'auth/popup-blocked':
        return '弹窗被浏览器阻止，请允许弹窗后重试';
      case 'auth/cancelled-popup-request':
        return '登录请求已取消';
      case 'auth/account-exists-with-different-credential':
        return '该邮箱已使用其他登录方式注册';
      case 'auth/network-request-failed':
        return '网络错误，请检查网络连接';
      default:
        return error.message || '登录失败，请重试';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          欢迎登录
        </h2>
        <p className="text-gray-600">
          选择您喜欢的方式登录
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* 状态消息 */}
      {message && !error && (
        <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className={`text-sm text-center ${
            status === 'success' ? 'text-green-700' : 'text-blue-700'
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* 登录按钮 */}
      <div className="w-full space-y-3">
        {/* Google 登录 */}
        <button
          onClick={handleGoogleLogin}
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Mail className="w-5 h-5 text-red-500" />
          <span className="font-medium text-gray-700">使用 Google 登录</span>
        </button>

        {/* GitHub 登录 */}
        <button
          onClick={handleGithubLogin}
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Github className="w-5 h-5 text-white" />
          <span className="font-medium text-white">使用 GitHub 登录</span>
        </button>
      </div>

      {/* 分隔线 */}
      <div className="w-full flex items-center space-x-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">或</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* 其他登录选项说明 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>

      {/* 提示信息 */}
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 首次登录将自动创建账号
        </p>
      </div>
    </div>
  );
}
