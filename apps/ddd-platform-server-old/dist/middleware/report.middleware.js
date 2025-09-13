"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMiddleware = void 0;
const decorator_1 = require("@midwayjs/decorator");
let ReportMiddleware = class ReportMiddleware {
    resolve() {
        return async (ctx, next) => {
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
            }
            catch (error) {
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
};
ReportMiddleware = __decorate([
    (0, decorator_1.Middleware)()
], ReportMiddleware);
exports.ReportMiddleware = ReportMiddleware;
