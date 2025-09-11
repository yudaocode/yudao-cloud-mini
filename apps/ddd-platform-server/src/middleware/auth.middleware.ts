import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 跳过认证的路径
      const skipPaths = [
        '/api/health',
        '/api/swagger-ui',
        '/swagger-ui',
        '/api-docs',
        '/favicon.ico',
      ];

      // 检查是否需要跳过认证
      const shouldSkip = skipPaths.some(path => ctx.path.startsWith(path));
      
      if (shouldSkip) {
        await next();
        return;
      }

      // 暂时跳过JWT验证，后续可以添加
      // const token = ctx.headers.authorization;
      // if (!token) {
      //   ctx.status = 401;
      //   ctx.body = { success: false, message: 'Unauthorized' };
      //   return;
      // }

      await next();
    };
  }
}
