// 配置文件路径
export const CONFIG_PATHS = {
  // 屏幕定义文件路径
  SCREEN_DEFINITION: '/docs/DDD元数据驱动开发平台-v1.0/samples/order-inv-pay/amis-screen-definition.json',
  
  // 其他配置文件路径
  DDD_MODELS: '/docs/DDD元数据驱动开发平台-v1.0/',
  
  // API基础路径
  API_BASE: '/api',
  
  // Mock数据路径
  MOCK_BASE: '/mock'
};

// 开发环境配置
export const DEV_CONFIG = {
  // 是否启用Mock
  ENABLE_MOCK: true,
  
  // 是否启用调试日志
  ENABLE_DEBUG: true,
  
  // 开发服务器端口
  DEV_PORT: 5173
};

// 生产环境配置
export const PROD_CONFIG = {
  // 是否启用Mock
  ENABLE_MOCK: false,
  
  // 是否启用调试日志
  ENABLE_DEBUG: false,
  
  // 生产环境API地址
  API_BASE: process.env.REACT_APP_API_BASE || '/api'
};
