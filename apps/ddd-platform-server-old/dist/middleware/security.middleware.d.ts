import { IMiddleware } from '@midwayjs/core';
import { IMidwayKoaContext, NextFunction } from '@midwayjs/koa';
export declare class SecurityMiddleware implements IMiddleware<IMidwayKoaContext, NextFunction> {
    resolve(): (ctx: IMidwayKoaContext, next: NextFunction) => Promise<void>;
}
