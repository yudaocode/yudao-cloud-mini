"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const decorator_1 = require("@midwayjs/decorator");
let SecurityMiddleware = class SecurityMiddleware {
    resolve() {
        return async (ctx, next) => {
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
};
SecurityMiddleware = __decorate([
    (0, decorator_1.Middleware)()
], SecurityMiddleware);
exports.SecurityMiddleware = SecurityMiddleware;
