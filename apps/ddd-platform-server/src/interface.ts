/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

/**
 * @description 通用API响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

/**
 * @description 项目创建DTO
 */
export interface CreateProjectDto {
  name: string;
  description?: string;
  creator: string;
}

/**
 * @description 项目更新DTO
 */
export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
}
