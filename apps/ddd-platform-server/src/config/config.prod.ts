import { MidwayConfig } from '@midwayjs/core';

export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql', // 必须指定数据库类型
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        username: process.env.MYSQL_USERNAME || 'ddd_platform',
        password: process.env.MYSQL_PASSWORD || 'password123',
        database: process.env.MYSQL_DATABASE || 'ddd_platform_prod',
        logging: true,
        synchronize: false, // 生产环境不自动同步表结构
        entities: ['**/entity/*.entity{.ts,.js}'],
        charset: 'utf8mb4',
        timezone: '+08:00',
        // 生产环境连接池配置
        extra: {
          connectionLimit: 50,
          maxIdle: 20,
          idleTimeout: 300000,
          acquireTimeout: 60000,
          timeout: 60000,
        },
      },
    },
  },
  
  // Redis配置 - 生产环境
  redis: {
    client: {
      port: parseInt(process.env.REDIS_PORT || '6379'),
      host: process.env.REDIS_HOST || 'localhost',
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB || '0'),
    },
  },
  
  // 生产环境安全配置
  security: {
    prefix: '/api/security',
    csrf: {
      enable: true,
      useSession: true,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
    },
  },

  // 生产环境日志配置
  midwayLogger: {
    default: {
      level: 'info',
      consoleLevel: 'warn',
    },
  },
} as MidwayConfig;
