import * as crossDomain from '@midwayjs/cross-domain';
import { App, Configuration } from '@midwayjs/decorator';
import * as info from '@midwayjs/info';
import * as jwt from '@midwayjs/jwt';
import * as koa from '@midwayjs/koa';
import * as redis from '@midwayjs/redis';
import * as security from '@midwayjs/security';
import * as staticFile from '@midwayjs/static-file';
import * as swagger from '@midwayjs/swagger';
import * as typeorm from '@midwayjs/typeorm';
import * as upload from '@midwayjs/upload';
import * as validate from '@midwayjs/validate';
import { join } from 'path';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local', 'development'],
    },
    crossDomain,
    staticFile,
    upload,
    typeorm,
    redis,
    jwt,
    swagger,
    security,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app!: koa.Application;

  async onReady() {
    console.log('🚀 DDD Platform Server is starting...');
    
    // 全局错误处理中间件
    this.app.use(async (ctx, next) => {
      const start = Date.now();
      try {
        await next();
      } catch (err: any) {
        console.error(`[ERROR] ${ctx.method} ${ctx.url}:`, err);
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          code: ctx.status,
          message: err.message || 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: ctx.url,
        };
      } finally {
        const duration = Date.now() - start;
        console.log(`[${ctx.status}] ${ctx.method} ${ctx.url} - ${duration}ms`);
      }
    });

    // 健康检查路由
    this.app.use(async (ctx, next) => {
      if (ctx.path === '/health' || ctx.path === '/ping') {
        ctx.body = {
          success: true,
          code: 200,
          message: 'DDD Platform Server is healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        };
        return;
      }
      await next();
    });

    console.log('✅ DDD Platform Server is ready!');
  }

  async onServerReady() {
    console.log('🌐 Server listening on http://localhost:8100');
  }
}
