import React, { useMemo } from 'react';
import 'amis/sdk/sdk.css';
import 'amis/sdk/iconfont.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { render as amisRender } from 'amis';
import axios from 'axios';

// 基础示例：从本地mock加载一个CRUD
const schema = {
  type: 'page',
  title: '订单管理（演示）',
  body: [
    {
      type: 'crud',
      api: '/mock/orders',
      columns: [
        { name: 'id', label: 'ID' },
        { name: 'orderNumber', label: '订单编号' },
        { name: 'customerName', label: '客户' },
        { name: 'totalAmount', label: '金额' },
        { name: 'status', label: '状态' }
      ],
      headerToolbar: [
        {
          type: 'button',
          label: '新增订单',
          level: 'primary',
          actionType: 'dialog',
          dialog: {
            title: '新增订单',
            body: {
              type: 'form',
              api: 'post:/mock/orders',
              body: [
                { type: 'input-text', name: 'orderNumber', label: '订单编号', required: true },
                { type: 'input-text', name: 'customerName', label: '客户名称', required: true },
                { type: 'input-number', name: 'totalAmount', label: '金额', required: true, min: 0 },
                {
                  type: 'select',
                  name: 'status',
                  label: '状态',
                  value: 'PENDING',
                  options: [
                    { label: '待处理', value: 'PENDING' },
                    { label: '已确认', value: 'CONFIRMED' },
                    { label: '已发货', value: 'SHIPPED' },
                    { label: '已送达', value: 'DELIVERED' },
                    { label: '已取消', value: 'CANCELLED' }
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

// 简单的mock拦截
const mockData = {
  items: [
    { id: 1, orderNumber: 'ORD20241201001', customerName: '张三', totalAmount: 199.99, status: 'PENDING' },
    { id: 2, orderNumber: 'ORD20241201002', customerName: '李四', totalAmount: 299.5, status: 'CONFIRMED' }
  ],
  total: 2
};

axios.interceptors.request.use((config) => {
  if (config.url?.startsWith('/mock/orders')) {
    const method = (config.method || 'get').toLowerCase();
    if (method === 'get') {
      return Promise.resolve({
        ...config,
        adapter: async () => ({ data: mockData, status: 200, statusText: 'OK', headers: {}, config })
      });
    }

    if (method === 'post') {
      return Promise.resolve({
        ...config,
        adapter: async () => ({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config })
      });
    }
  }
  return config;
});

export const AmisRender: React.FC = () => {
  const env = useMemo(() => ({
    fetcher: ({ url, method, data, config: cfg }: any) => axios({ url, method, data, ...cfg }),
  }), []);

  return (
    <div style={{ padding: 16 }}>
      {amisRender(schema as any, {}, env)}
    </div>
  );
};
