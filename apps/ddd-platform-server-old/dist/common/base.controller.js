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
exports.BaseController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const response_1 = require("./response");
/**
 * 基础控制器
 * 提供统一的响应处理和错误捕获
 */
class BaseController {
    /**
     * 统一成功响应
     */
    success(data, message = '操作成功') {
        return (0, response_1.createSuccessResponse)(data, message, this.ctx.path);
    }
    /**
     * 统一错误响应
     */
    error(message = '操作失败', code = 500) {
        return (0, response_1.createErrorResponse)(message, code, this.ctx.path);
    }
    /**
     * 统一异常处理装饰器
     */
    async handleRequest(operation, successMessage, errorMessage) {
        try {
            const result = await operation();
            return this.success(result, successMessage);
        }
        catch (error) {
            console.error(`[${this.constructor.name}] Error:`, error);
            return this.error(errorMessage || error.message || '服务器内部错误', 500);
        }
    }
    /**
     * 获取分页参数
     */
    getPageParams() {
        const { pageNum = 1, pageSize = 10, keyword, orderBy, orderDir = 'ASC' } = this.ctx.query;
        return {
            pageNum: Math.max(1, parseInt(pageNum) || 1),
            pageSize: Math.min(100, Math.max(1, parseInt(pageSize) || 10)),
            keyword: keyword,
            orderBy: orderBy,
            orderDir: orderDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
        };
    }
    /**
     * 获取当前用户ID（从JWT token中获取）
     */
    getCurrentUserId() {
        // TODO: 实现JWT token解析
        return this.ctx.state?.user?.id || null;
    }
    /**
     * 验证必需参数
     */
    validateRequired(params, requiredFields) {
        const missingFields = requiredFields.filter(field => params[field] === undefined || params[field] === null || params[field] === '');
        if (missingFields.length > 0) {
            throw new Error(`缺少必需参数: ${missingFields.join(', ')}`);
        }
    }
}
__decorate([
    (0, decorator_1.Inject)(),
    __metadata("design:type", Object)
], BaseController.prototype, "ctx", void 0);
exports.BaseController = BaseController;
