/**
 * 统一API响应结构
 */
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    timestamp: string;
    path?: string;
}
/**
 * 分页响应结构
 */
export interface PageResponse<T = any> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
    pages: number;
}
/**
 * 分页查询参数
 */
export interface PageQuery {
    pageNum?: number;
    pageSize?: number;
    keyword?: string;
    orderBy?: string;
    orderDir?: 'ASC' | 'DESC';
}
/**
 * 创建成功响应
 */
export declare function createSuccessResponse<T = any>(data?: T, message?: string, path?: string): ApiResponse<T>;
/**
 * 创建错误响应
 */
export declare function createErrorResponse(message?: string, code?: number, path?: string): ApiResponse;
/**
 * 创建分页响应
 */
export declare function createPageResponse<T = any>(list: T[], total: number, pageNum: number, pageSize: number, message?: string): ApiResponse<PageResponse<T>>;
