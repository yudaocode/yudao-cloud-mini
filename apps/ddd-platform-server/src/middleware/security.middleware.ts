import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class SecurityMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 设置安全头
      ctx.set('X-Content-Type-Options', 'nosniff');
      ctx.set('X-Frame-Options', 'DENY');
      ctx.set('X-XSS-Protection', '1; mode=block');
      ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // CORS处理（如果需要）
      if (ctx.method === 'OPTIONS') {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        ctx.status = 204;
        return;
      }
      
      await next();
    };
  }
}
