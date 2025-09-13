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
export function createSuccessResponse<T = any>(
  data?: T, 
  message: string = '操作成功',
  path?: string
): ApiResponse<T> {
  return {
    success: true,
    code: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
    path
  };
}

/**
 * 创建错误响应
 */
export function createErrorResponse(
  message: string = '操作失败',
  code: number = 500,
  path?: string
): ApiResponse {
  return {
    success: false,
    code,
    message,
    timestamp: new Date().toISOString(),
    path
  };
}

/**
 * 创建分页响应
 */
export function createPageResponse<T = any>(
  list: T[],
  total: number,
  pageNum: number,
  pageSize: number,
  message: string = '查询成功'
): ApiResponse<PageResponse<T>> {
  const pages = Math.ceil(total / pageSize);
  
  return createSuccessResponse({
    list,
    total,
    pageNum,
    pageSize,
    pages
  }, message);
}
