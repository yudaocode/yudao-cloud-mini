import { MidwayHttpError } from '@midwayjs/core';
import { Catch, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  @Inject()
  logger: any;

  async catch(err: Error, ctx: Context) {
    // 记录错误日志
    this.logger.error('Unhandled error:', err);

    // 默认错误返回
    let status = 500;
    let message = 'Internal Server Error';

    // 处理HTTP错误
    if (err instanceof MidwayHttpError) {
      status = err.status;
      message = err.message;
    }

    // 开发环境返回详细错误信息
    if (ctx.app.getEnv() === 'local') {
      ctx.status = status;
      ctx.body = {
        success: false,
        message,
        error: err.message,
        stack: err.stack,
      };
    } else {
      // 生产环境返回简化错误信息
      ctx.status = status;
      ctx.body = {
        success: false,
        message: status >= 500 ? 'Internal Server Error' : message,
      };
    }
  }
}
