"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const decorator_1 = require("@midwayjs/decorator");
let AuthMiddleware = class AuthMiddleware {
    resolve() {
        return async (ctx, next) => {
            // 跳过认证的路径
            const skipPaths = [
                '/health',
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
};
AuthMiddleware = __decorate([
    (0, decorator_1.Middleware)()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
