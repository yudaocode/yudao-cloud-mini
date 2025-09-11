import { httpError, MidwayHttpError } from '@midwayjs/core';
import { Catch, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  @Inject()
  logger: any;

  async catch(err: MidwayHttpError, ctx: Context) {
    // 404错误处理
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: 'Not Found',
      statusCode: 404,
      path: ctx.url,
    };
  }
}
