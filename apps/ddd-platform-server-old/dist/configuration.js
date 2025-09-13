"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerLifeCycle = void 0;
const crossDomain = __importStar(require("@midwayjs/cross-domain"));
const decorator_1 = require("@midwayjs/decorator");
const info = __importStar(require("@midwayjs/info"));
const jwt = __importStar(require("@midwayjs/jwt"));
const koa = __importStar(require("@midwayjs/koa"));
const redis = __importStar(require("@midwayjs/redis"));
const security = __importStar(require("@midwayjs/security"));
const staticFile = __importStar(require("@midwayjs/static-file"));
const swagger = __importStar(require("@midwayjs/swagger"));
const typeorm = __importStar(require("@midwayjs/typeorm"));
const upload = __importStar(require("@midwayjs/upload"));
const validate = __importStar(require("@midwayjs/validate"));
const path_1 = require("path");
let ContainerLifeCycle = class ContainerLifeCycle {
    async onReady() {
        console.log('🚀 DDD Platform Server is starting...');
        // 全局错误处理中间件
        this.app.use(async (ctx, next) => {
            const start = Date.now();
            try {
                await next();
            }
            catch (err) {
                console.error(`[ERROR] ${ctx.method} ${ctx.url}:`, err);
                ctx.status = err.status || 500;
                ctx.body = {
                    success: false,
                    code: ctx.status,
                    message: err.message || 'Internal Server Error',
                    timestamp: new Date().toISOString(),
                    path: ctx.url,
                };
            }
            finally {
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
};
__decorate([
    (0, decorator_1.App)(),
    __metadata("design:type", Object)
], ContainerLifeCycle.prototype, "app", void 0);
ContainerLifeCycle = __decorate([
    (0, decorator_1.Configuration)({
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
        importConfigs: [(0, path_1.join)(__dirname, './config')],
    })
], ContainerLifeCycle);
exports.ContainerLifeCycle = ContainerLifeCycle;
