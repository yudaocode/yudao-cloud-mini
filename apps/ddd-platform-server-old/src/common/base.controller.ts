import { Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiResponse, createErrorResponse, createSuccessResponse } from './response';

/**
 * 基础控制器
 * 提供统一的响应处理和错误捕获
 */
export abstract class BaseController {
  @Inject()
  ctx!: Context;

  /**
   * 统一成功响应
   */
  protected success<T = any>(data?: T, message: string = '操作成功'): ApiResponse<T> {
    return createSuccessResponse(data, message, this.ctx.path);
  }

  /**
   * 统一错误响应
   */
  protected error(message: string = '操作失败', code: number = 500): ApiResponse {
    return createErrorResponse(message, code, this.ctx.path);
  }

  /**
   * 统一异常处理装饰器
   */
  protected async handleRequest<T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation();
      return this.success(result, successMessage);
    } catch (error: any) {
      console.error(`[${this.constructor.name}] Error:`, error);
      return this.error(errorMessage || error.message || '服务器内部错误', 500);
    }
  }

  /**
   * 获取分页参数
   */
  protected getPageParams() {
    const { pageNum = 1, pageSize = 10, keyword, orderBy, orderDir = 'ASC' } = this.ctx.query;
    
    return {
      pageNum: Math.max(1, parseInt(pageNum as string) || 1),
      pageSize: Math.min(100, Math.max(1, parseInt(pageSize as string) || 10)),
      keyword: keyword as string,
      orderBy: orderBy as string,
      orderDir: (orderDir as string).toUpperCase() === 'DESC' ? 'DESC' as const : 'ASC' as const
    };
  }

  /**
   * 获取当前用户ID（从JWT token中获取）
   */
  protected getCurrentUserId(): string | null {
    // TODO: 实现JWT token解析
    return this.ctx.state?.user?.id || null;
  }

  /**
   * 验证必需参数
   */
  protected validateRequired(params: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => 
      params[field] === undefined || params[field] === null || params[field] === ''
    );
    
    if (missingFields.length > 0) {
      throw new Error(`缺少必需参数: ${missingFields.join(', ')}`);
    }
  }
}
