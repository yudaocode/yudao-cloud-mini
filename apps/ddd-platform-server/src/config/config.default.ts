import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1757644496533_1511',
  koa: {
    port: 8100,
  },
  // TypeORM数据库配置
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '192.168.17.123',
        port: 33306,
        username: 'root',
        password: 'root',
        database: 'ddd_platform',
        synchronize: true,
        logging: true,
        entities: ['**/entity/*.entity{.ts,.js}'],
        timezone: '+08:00',
      },
    },
  },
  // Redis配置
  redis: {
    client: {
      port: 16379,
      host: '192.168.17.123',
      password: 'mfml.6603.1400',
      db: 0,
    },
  },
} as MidwayConfig;
