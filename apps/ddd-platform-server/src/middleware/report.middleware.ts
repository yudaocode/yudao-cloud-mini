import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class ReportMiddleware {
  @Inject()
  logger: any;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      
      // 记录请求开始
      this.logger?.info(`Request started: ${ctx.method} ${ctx.url}`);
      
      await next();
      
      // 记录请求结束
      const duration = Date.now() - startTime;
      this.logger?.info(
        `Request completed: ${ctx.method} ${ctx.url} - ${ctx.status} - ${duration}ms`
      );
    };
  }
}
