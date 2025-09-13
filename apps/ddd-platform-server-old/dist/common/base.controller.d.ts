import { Context } from '@midwayjs/koa';
import { ApiResponse } from './response';
/**
 * 基础控制器
 * 提供统一的响应处理和错误捕获
 */
export declare abstract class BaseController {
    ctx: Context;
    /**
     * 统一成功响应
     */
    protected success<T = any>(data?: T, message?: string): ApiResponse<T>;
    /**
     * 统一错误响应
     */
    protected error(message?: string, code?: number): ApiResponse;
    /**
     * 统一异常处理装饰器
     */
    protected handleRequest<T>(operation: () => Promise<T>, successMessage?: string, errorMessage?: string): Promise<ApiResponse<T>>;
    /**
     * 获取分页参数
     */
    protected getPageParams(): {
        pageNum: number;
        pageSize: number;
        keyword: string;
        orderBy: string;
        orderDir: "ASC" | "DESC";
    };
    /**
     * 获取当前用户ID（从JWT token中获取）
     */
    protected getCurrentUserId(): string | null;
    /**
     * 验证必需参数
     */
    protected validateRequired(params: Record<string, any>, requiredFields: string[]): void;
}
