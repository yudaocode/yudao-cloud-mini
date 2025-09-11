import { MidwayConfig } from '@midwayjs/core';

export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite', // 使用SQLite进行快速开发
        database: './data/ddd_platform_dev.db',
        logging: ['error', 'warn'],
        synchronize: true, // 开发环境自动同步表结构
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
  },
  
  // Redis配置 - 本地开发环境
  redis: {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 0,
    },
  },
  
  // 开发环境日志配置
  midwayLogger: {
    default: {
      level: 'debug',
      consoleLevel: 'debug',
    },
  },
} as MidwayConfig;
