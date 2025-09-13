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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const base_controller_1 = require("../common/base.controller");
const test_service_1 = require("../service/test.service");
let TestController = class TestController extends base_controller_1.BaseController {
    async hello() {
        return this.handleRequest(() => this.testService.getHello(), '获取Hello信息成功');
    }
    async checkDatabase() {
        return this.handleRequest(() => this.testService.checkDatabaseConnection(), '数据库连接检查完成', '数据库连接检查失败');
    }
    async checkRedis() {
        return this.handleRequest(() => this.testService.checkRedisConnection(), 'Redis连接检查完成', 'Redis连接检查失败');
    }
    async health() {
        return this.handleRequest(async () => {
            const dbStatus = await this.testService.checkDatabaseConnection();
            const redisStatus = await this.testService.checkRedisConnection();
            return {
                server: 'DDD Platform Server',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                services: {
                    database: dbStatus,
                    redis: redisStatus
                }
            };
        }, '健康检查完成');
    }
    async create(body) {
        this.validateRequired(body, ['name']);
        return this.handleRequest(() => this.testService.create(body), '创建成功');
    }
    async list() {
        const pageParams = this.getPageParams();
        return this.handleRequest(() => this.testService.findAll(pageParams), '查询成功');
    }
};
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", test_service_1.TestService)
], TestController.prototype, "testService", void 0);
__decorate([
    (0, decorator_1.Get)('/hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "hello", null);
__decorate([
    (0, decorator_1.Get)('/db-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "checkDatabase", null);
__decorate([
    (0, decorator_1.Get)('/redis-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "checkRedis", null);
__decorate([
    (0, decorator_1.Get)('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "health", null);
__decorate([
    (0, decorator_1.Post)('/create'),
    __param(0, (0, decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "create", null);
__decorate([
    (0, decorator_1.Get)('/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "list", null);
TestController = __decorate([
    (0, decorator_1.Controller)('/api/test')
], TestController);
exports.TestController = TestController;
