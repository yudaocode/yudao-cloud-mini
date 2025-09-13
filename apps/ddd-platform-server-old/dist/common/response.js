"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPageResponse = exports.createErrorResponse = exports.createSuccessResponse = void 0;
/**
 * 创建成功响应
 */
function createSuccessResponse(data, message = '操作成功', path) {
    return {
        success: true,
        code: 200,
        message,
        data,
        timestamp: new Date().toISOString(),
        path
    };
}
exports.createSuccessResponse = createSuccessResponse;
/**
 * 创建错误响应
 */
function createErrorResponse(message = '操作失败', code = 500, path) {
    return {
        success: false,
        code,
        message,
        timestamp: new Date().toISOString(),
        path
    };
}
exports.createErrorResponse = createErrorResponse;
/**
 * 创建分页响应
 */
function createPageResponse(list, total, pageNum, pageSize, message = '查询成功') {
    const pages = Math.ceil(total / pageSize);
    return createSuccessResponse({
        list,
        total,
        pageNum,
        pageSize,
        pages
    }, message);
}
exports.createPageResponse = createPageResponse;
