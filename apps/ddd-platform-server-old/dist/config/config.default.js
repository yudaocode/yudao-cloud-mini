"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = {
    // 应用基础配置
    keys: 'ddd-platform-secret',
    koa: {
        port: 8100,
    },
    // 数据库配置 - MySQL (192.168.17.123:33306)
    typeorm: {
        dataSource: {
            default: {
                type: 'mysql',
                host: '192.168.17.123',
                port: 33306,
                username: 'root',
                password: 'root',
                database: 'ddd_platform',
                synchronize: false,
                logging: true,
                entities: [
                    'entity/*{.ts,.js}',
                ],
                timezone: '+08:00',
            }
        },
    },
    // Redis配置 (192.168.17.123:16379)
    redis: {
        client: {
            port: 16379,
            host: '192.168.17.123',
            password: 'mfml.6603.1400',
            db: 0,
            connectTimeout: 5000,
            lazyConnect: true,
            retryDelayOnFailover: 100,
            enableReadyCheck: false,
            maxRetriesPerRequest: 3
        },
    },
    // JWT配置
    jwt: {
        secret: 'ddd-platform-secret-key',
        expiresIn: '7d',
    },
    // 文件上传配置
    upload: {
        mode: 'file',
        fileSize: '10mb',
        whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    },
    // CORS配置
    cors: {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    // Security配置
    security: {
        csrf: {
            enable: false,
        },
    },
    // Swagger配置
    swagger: {
        title: 'DDD Platform API',
        description: 'DDD元数据驱动开发平台API文档',
        version: '1.0.0',
        termsOfService: '',
        contact: {
            name: 'API Support',
            email: 'support@dddplatform.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    // RocketMQ配置 (暂时禁用)
    rocketmq: {
        producer: {
            enabled: false,
        },
        consumer: {
            enabled: false,
        },
    },
    // 模板引擎配置
    view: {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.njk': 'nunjucks',
        },
        options: {
            templatePath: (0, path_1.join)(process.cwd(), 'src', 'view'),
        },
    },
    // 静态资源配置
    staticFile: {
        dirs: {
            default: {
                prefix: '/',
                dir: (0, path_1.join)(process.cwd(), 'src', 'public'),
            },
        },
    },
    // 开发环境配置
    midwayLogger: {
        default: {
            level: 'info',
            consoleLevel: 'info',
        },
    },
};
