import React, { useState, useEffect } from 'react';
import { render as amisRender } from 'amis';
import { DDDParser } from '../services/dddParser';
import { AmisScreenDefinition } from '../types/ddd';

interface DynamicCRUDProps {
  screenId: string;
  screenDefinitionPath?: string;
}

export const DynamicCRUD: React.FC<DynamicCRUDProps> = ({
  screenId,
  screenDefinitionPath = '/docs/DDD元数据驱动开发平台-v1.0/samples/order-inv-pay/amis-screen-definition.json'
}) => {
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parser] = useState(() => new DDDParser());

  useEffect(() => {
    loadScreenDefinition();
  }, [screenId, screenDefinitionPath]);

  const loadScreenDefinition = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 加载屏幕定义
      await parser.loadScreenDefinition(screenDefinitionPath);
      
      // 获取amis配置
      const amisConfig = parser.getAmisConfig(screenId);
      setSchema(amisConfig);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      console.error('加载屏幕定义失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: any, data: any) => {
    console.log('Action triggered:', action, data);
    
    // 这里可以根据action类型处理不同的业务逻辑
    switch (action.actionType) {
      case 'ajax':
        // 处理AJAX请求
        break;
      case 'dialog':
        // 处理对话框
        break;
      case 'link':
        // 处理链接跳转
        break;
      default:
        console.log('未处理的action类型:', action.actionType);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <div>加载失败: {error}</div>
        <button onClick={loadScreenDefinition} style={{ marginTop: 10 }}>
          重试
        </button>
      </div>
    );
  }

  if (!schema) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div>未找到屏幕配置</div>
      </div>
    );
  }

  // 创建amis环境配置
  const env: any = {
    fetcher: ({ url, method, data, config }: any) => {
      // 这里可以集成真实的API调用
      console.log('API调用:', { url, method, data, config });
      
      // 模拟API响应
      if (url === '/api/orders' && method === 'GET') {
        return Promise.resolve({
          status: 0,
          msg: 'success',
          data: {
            items: [
              { id: 1, orderNumber: 'ORD20241201001', customerName: '张三', totalAmount: 199.99, status: 'PENDING' },
              { id: 2, orderNumber: 'ORD20241201002', customerName: '李四', totalAmount: 299.5, status: 'CONFIRMED' }
            ],
            total: 2
          }
        });
      }
      
      return Promise.resolve({ 
        status: 0, 
        msg: 'success',
        data: { success: true } 
      });
    },
    notify: (type: string, msg: string) => {
      console.log('通知:', type, msg);
    },
    alert: (msg: string) => {
      alert(msg);
    },
    confirm: (msg: string) => {
      return confirm(msg);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {amisRender(schema, {}, env)}
    </div>
  );
};
