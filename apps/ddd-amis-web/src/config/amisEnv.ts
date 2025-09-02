// amis环境配置
export const amisEnv = {
  // 路由更新处理
  updateLocation: (location: string, replace?: boolean) => {
    // 静默处理路由更新，避免警告
    console.log('Location update:', location, replace);
  },
  
  // 取消操作检查
  isCancel: () => false,
  
  // 通知处理
  notify: (type: string, msg: string) => {
    console.log(`${type}: ${msg}`);
  },
  
  // 确认对话框
  confirm: (msg: string) => {
    return Promise.resolve(window.confirm(msg));
  },
  
  // 提示框
  alert: (msg: string) => {
    window.alert(msg);
  },
  
  // 获取当前路径
  getCurrentLocation: () => {
    return window.location.pathname;
  },
  
  // 获取查询参数
  getQueryParams: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  },
  
  // 设置查询参数
  setQueryParams: (params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  },
  
  // 跳转页面
  jumpTo: (to: string, action?: any) => {
    console.log('Jump to:', to, action);
    // 这里可以实现实际的页面跳转逻辑
  },
  
  // 返回上一页
  goBack: () => {
    window.history.back();
  },
  
  // 复制到剪贴板
  copy: (content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        console.log('Copied to clipboard:', content);
      });
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Copied to clipboard (fallback):', content);
    }
  },
  
  // 获取主题
  getTheme: () => 'antd',
  
  // 获取语言
  getLanguage: () => 'zh-CN',
  
  // 获取时区
  getTimezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  // 获取用户信息
  getUserInfo: () => ({
    id: 'demo-user',
    name: '演示用户',
    email: 'demo@example.com'
  }),
  
  // 获取权限
  hasPermission: (permission: string) => {
    // 演示环境默认返回true
    return true;
  }
};
