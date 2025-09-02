import axios, { AxiosResponse } from 'axios';

// 模拟数据定义
interface MockOrder {
  id: string;
  orderNo: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createTime: string;
}

interface MockInventory {
  id: string;
  productName: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdateTime: string;
}

interface MockPayment {
  id: string;
  paymentNo: string;
  orderNo: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentTime: string;
}

interface MockResponse<T> {
  status: number;
  msg: string;
  data: {
    items: T[];
    total: number;
  };
}

// 模拟数据
const mockOrders: MockOrder[] = [
  {
    id: '1',
    orderNo: 'ORD001',
    customerName: '张三',
    totalAmount: 299.99,
    status: '已确认',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    orderNo: 'ORD002',
    customerName: '李四',
    totalAmount: 599.99,
    status: '已发货',
    createTime: '2024-01-15 11:20:00'
  },
  {
    id: '3',
    orderNo: 'ORD003',
    customerName: '王五',
    totalAmount: 199.99,
    status: '待支付',
    createTime: '2024-01-15 12:10:00'
  }
];

const mockInventory: MockInventory[] = [
  {
    id: '1',
    productName: '商品A',
    stockQuantity: 100,
    reservedQuantity: 20,
    availableQuantity: 80,
    lastUpdateTime: '2024-01-15 12:00:00'
  },
  {
    id: '2',
    productName: '商品B',
    stockQuantity: 50,
    reservedQuantity: 10,
    availableQuantity: 40,
    lastUpdateTime: '2024-01-15 12:00:00'
  }
];

const mockPayments: MockPayment[] = [
  {
    id: '1',
    paymentNo: 'PAY001',
    orderNo: 'ORD001',
    amount: 299.99,
    paymentMethod: '微信支付',
    status: '已支付',
    paymentTime: '2024-01-15 10:35:00'
  },
  {
    id: '2',
    paymentNo: 'PAY002',
    orderNo: 'ORD002',
    amount: 599.99,
    paymentMethod: '支付宝',
    status: '已支付',
    paymentTime: '2024-01-15 11:25:00'
  }
];

// 创建amis兼容的fetcher函数
export const createAmisFetcher = () => {
  return async ({ url, method, data, config }: any): Promise<any> => {
    try {
      console.log('amis fetcher called:', { url, method, data });
      
      // 处理不同的API端点
      if (url.includes('/api/orders') || url.includes('/api/order')) {
        if (method?.toLowerCase() === 'get') {
          // amis期望的返回格式
          return {
            status: 0,
            msg: 'success',
            data: {
              items: mockOrders,
              total: mockOrders.length
            }
          };
        } else if (method?.toLowerCase() === 'post') {
          // 模拟创建订单
          const newOrder = {
            id: Date.now().toString(),
            orderNo: `ORD${Date.now()}`,
            customerName: data?.customerName || '新客户',
            totalAmount: data?.totalAmount || 0,
            status: '待确认',
            createTime: new Date().toLocaleString()
          };
          mockOrders.push(newOrder);
          return {
            status: 0,
            msg: 'success',
            data: newOrder
          };
        }
      }
      
      if (url.includes('/api/inventory') || url.includes('/api/inv')) {
        return {
          status: 0,
          msg: 'success',
          data: {
            items: mockInventory,
            total: mockInventory.length
          }
        };
      }
      
      if (url.includes('/api/payment') || url.includes('/api/pay')) {
        return {
          status: 0,
          msg: 'success',
          data: {
            items: mockPayments,
            total: mockPayments.length
          }
        };
      }
      
      // 默认返回空数据
      return {
        status: 0,
        msg: 'success',
        data: {
          items: [],
          total: 0
        }
      };
      
    } catch (error) {
      console.error('amis fetcher error:', error);
      return {
        status: 1,
        msg: 'error',
        data: null
      };
    }
  };
};

// 配置axios拦截器
export const setupMockInterceptors = () => {
  // 响应拦截器
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // 如果是网络错误或404，返回模拟数据
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.log('API调用失败，使用模拟数据:', error.config?.url);
        
        const url = error.config?.url || '';
        let mockData: any = {
          status: 0,
          msg: 'success',
          data: {
            items: [],
            total: 0
          }
        };

        // 根据URL返回相应的模拟数据
        if (url.includes('/api/orders') || url.includes('/api/order')) {
          mockData.data.items = mockOrders;
          mockData.data.total = mockOrders.length;
        } else if (url.includes('/api/inventory') || url.includes('/api/inv')) {
          mockData.data.items = mockInventory;
          mockData.data.total = mockInventory.length;
        } else if (url.includes('/api/payment') || url.includes('/api/pay')) {
          mockData.data.items = mockPayments;
          mockData.data.total = mockPayments.length;
        }

        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: 'OK'
        });
      }
      return Promise.reject(error);
    }
  );

  // 请求拦截器
  axios.interceptors.request.use(
    (config) => {
      // 确保API调用返回JSON格式
      if (config.url && config.url.includes('/api/')) {
        config.headers.set('Accept', 'application/json');
        config.headers.set('Content-Type', 'application/json');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
