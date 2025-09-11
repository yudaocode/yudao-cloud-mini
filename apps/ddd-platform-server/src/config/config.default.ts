import { MidwayConfig } from '@midwayjs/core';

export default {
  // 应用配置
  keys: '1641445112752_4297',
  koa: {
    port: 7001,
  },
  
  // TypeORM配置 - 使用MySQL 5.7
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST || '192.168.17.123',
        port: parseInt(process.env.MYSQL_PORT || '33306'),
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'ddd_platform',
        synchronize: true, // 开发环境自动同步表结构
        logging: false,
        entities: ['**/entity/*.entity{.ts,.js}'],
        charset: 'utf8mb4',
        timezone: '+08:00',
        acquireTimeout: 60000,
        timeout: 60000,
        reconnectLimit: 10,
        reconnectDelay: 600,
        // MySQL特定配置
        extra: {
          connectionLimit: 10,
          maxIdle: 10,
          idleTimeout: 60000,
          acquireTimeout: 60000,
          timeout: 60000,
        },
      },
    },
  },

  // Redis配置
  redis: {
    client: {
      port: parseInt(process.env.REDIS_PORT || '16379'),
      host: process.env.REDIS_HOST || '192.168.17.123',
      password: process.env.REDIS_PASSWORD || 'mfml.6603.9703',
      db: parseInt(process.env.REDIS_DB || '0'),
    },
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'ddd-platform-secret',
    expiresIn: '7d',
  },

  // 文件上传配置
  upload: {
    mode: 'file',
    fileSize: '50mb',
    whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.wbmp', '.webp', '.tif', '.psd', '.svg', '.js', '.jsx', '.json', '.css', '.less', '.html', '.htm', '.xml'],
  },

  // 跨域配置
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  },

  // 安全配置
  security: {
    prefix: '/api/security',
    csrf: {
      enable: false,
    },
  },

  // Swagger配置
  swagger: {
    title: 'DDD元数据驱动开发平台',
    description: '基于DDD元数据的可视化开发平台API文档',
    version: '1.0.0',
    termsOfService: '',
    contact: {
      name: 'API Support',
      email: '1366122949@qq.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  // RocketMQ配置
  rocketmq: {
    nameServer: process.env.ROCKETMQ_NAME_SERVER || '192.168.17.123:9876',
    producer: {
      groupId: 'ddd-platform-producer',
    },
    consumer: {
      groupId: 'ddd-platform-consumer',
    },
  },

  // 业务配置
  business: {
    // 代码生成配置
    codeGeneration: {
      outputPath: process.env.CODE_OUTPUT_PATH || './generated',
      templatePath: process.env.TEMPLATE_PATH || './templates',
    },
    // AMIS配置
    amis: {
      version: '2.8.0',
      theme: 'cxd',
    },
  },
} as MidwayConfig;
