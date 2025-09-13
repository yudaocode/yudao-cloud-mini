import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const start = Date.now();
      
      console.log('[REPORT] Request started:', {
        method: ctx.method,
        url: ctx.url,
        userAgent: ctx.get('user-agent'),
        ip: ctx.ip,
        timestamp: new Date().toISOString()
      });
      
      try {
        await next();
        
        const duration = Date.now() - start;
        console.log('[REPORT] Request completed:', {
          method: ctx.method,
          url: ctx.url,
          status: ctx.status,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        const duration = Date.now() - start;
        console.error('[REPORT] Request failed:', {
          method: ctx.method,
          url: ctx.url,
          error: error instanceof Error ? error.message : String(error),
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
  }
}
