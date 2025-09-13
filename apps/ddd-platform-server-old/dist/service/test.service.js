"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const redis_1 = require("@midwayjs/redis");
const typeorm_1 = require("@midwayjs/typeorm");
const typeorm_2 = require("typeorm");
const test_entity_1 = require("../entity/test.entity");
let TestService = class TestService {
    async getHello() {
        return {
            message: 'Hello from Midway.js!',
            timestamp: Date.now(),
            server: 'DDD Platform Server',
            version: '1.0.0'
        };
    }
    async checkDatabaseConnection() {
        try {
            // 测试数据库连接：192.168.17.123:33306 (user: root, pass: root)
            const result = await this.dataSource.query('SELECT 1 as test, NOW() as current_time');
            // 获取数据库信息
            const dbInfo = await this.dataSource.query('SELECT VERSION() as version');
            // 获取连接配置（使用类型断言）
            const options = this.dataSource.options;
            return {
                status: 'success',
                message: 'MySQL数据库连接正常',
                host: `${options.host || 'unknown'}:${options.port || 'unknown'}`,
                database: options.database || 'unknown',
                version: dbInfo[0]?.version || 'unknown',
                testQuery: result[0],
                connectionOptions: {
                    type: this.dataSource.options.type,
                    host: options.host,
                    port: options.port,
                    database: options.database
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'MySQL数据库连接失败',
                host: '192.168.17.123:33306',
                error: error.message,
                details: {
                    code: error.code,
                    errno: error.errno,
                    sqlState: error.sqlState
                }
            };
        }
    }
    async checkRedisConnection() {
        try {
            // 测试Redis连接：192.168.17.123:16379 (pass: mfml.6603.9703)
            const testKey = `test_key_${Date.now()}`;
            const testValue = `test_value_${Date.now()}`;
            // 执行Redis操作测试
            await this.redisService.set(testKey, testValue, 'EX', 60);
            const retrievedValue = await this.redisService.get(testKey);
            // 获取Redis服务器信息
            const info = await this.redisService.info('server');
            // 清理测试数据
            await this.redisService.del(testKey);
            return {
                status: 'success',
                message: 'Redis连接正常',
                host: '192.168.17.123:16379',
                testResult: retrievedValue === testValue ? '读写测试通过' : '读写测试失败',
                testData: {
                    key: testKey,
                    setValue: testValue,
                    getValue: retrievedValue
                },
                serverInfo: info.split('\r\n')[0] // Redis版本信息
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Redis连接失败',
                host: '192.168.17.123:16379',
                error: error.message,
                details: {
                    code: error.code,
                    name: error.name
                }
            };
        }
    }
    async create(data) {
        try {
            const entity = this.testModel.create({
                name: data.name || '测试项目',
                description: data.description || '这是一个测试项目',
                type: data.type || 'TEST',
                ...data
            });
            const savedResult = await this.testModel.save(entity);
            // 确保我们得到的是单个实体而不是数组
            const saved = Array.isArray(savedResult) ? savedResult[0] : savedResult;
            // 同时测试Redis缓存
            const cacheKey = `test_entity_${saved.id}`;
            await this.redisService.set(cacheKey, JSON.stringify(saved), 'EX', 300);
            return saved;
        }
        catch (error) {
            throw new Error(`创建测试实体失败: ${error.message}`);
        }
    }
    async findAll(pageParams) {
        try {
            const { pageNum = 1, pageSize = 10, keyword, orderBy = 'createdAt', orderDir = 'DESC' } = pageParams || {};
            const queryBuilder = this.testModel.createQueryBuilder('test');
            // 关键字搜索
            if (keyword) {
                queryBuilder.where('test.name LIKE :keyword OR test.description LIKE :keyword', {
                    keyword: `%${keyword}%`
                });
            }
            // 排序
            queryBuilder.orderBy(`test.${orderBy}`, orderDir);
            // 分页
            const offset = (pageNum - 1) * pageSize;
            queryBuilder.skip(offset).take(pageSize);
            const [entities, total] = await queryBuilder.getManyAndCount();
            return {
                list: entities,
                total,
                pageNum,
                pageSize,
                pages: Math.ceil(total / pageSize),
                timestamp: Date.now()
            };
        }
        catch (error) {
            throw new Error(`查询测试实体失败: ${error.message}`);
        }
    }
};
__decorate([
    (0, typeorm_1.InjectEntityModel)(test_entity_1.TestEntity),
    __metadata("design:type", typeorm_2.Repository)
], TestService.prototype, "testModel", void 0);
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", typeorm_2.DataSource)
], TestService.prototype, "dataSource", void 0);
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", redis_1.RedisService)
], TestService.prototype, "redisService", void 0);
TestService = __decorate([
    (0, decorator_1.Provide)()
], TestService);
exports.TestService = TestService;
