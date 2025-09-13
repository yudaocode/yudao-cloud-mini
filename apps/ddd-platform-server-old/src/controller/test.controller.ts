import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { BaseController } from '../common/base.controller';
import { ApiResponse } from '../common/response';
import { TestService } from '../service/test.service';

@Controller('/api/test')
export class TestController extends BaseController {
  @Inject()
  testService!: TestService;

  @Get('/hello')
  async hello(): Promise<ApiResponse> {
    return this.handleRequest(
      () => this.testService.getHello(),
      '获取Hello信息成功'
    );
  }

  @Get('/db-check')
  async checkDatabase(): Promise<ApiResponse> {
    return this.handleRequest(
      () => this.testService.checkDatabaseConnection(),
      '数据库连接检查完成',
      '数据库连接检查失败'
    );
  }

  @Get('/redis-check')
  async checkRedis(): Promise<ApiResponse> {
    return this.handleRequest(
      () => this.testService.checkRedisConnection(),
      'Redis连接检查完成',
      'Redis连接检查失败'
    );
  }

  @Get('/health')
  async health(): Promise<ApiResponse> {
    return this.handleRequest(
      async () => {
        const dbStatus = await this.testService.checkDatabaseConnection();
        const redisStatus = await this.testService.checkRedisConnection();
        return {
          server: 'DDD Platform Server',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          services: {
            database: dbStatus,
            redis: redisStatus
          }
        };
      },
      '健康检查完成'
    );
  }

  @Post('/create')
  async create(@Body() body: any): Promise<ApiResponse> {
    this.validateRequired(body, ['name']);
    return this.handleRequest(
      () => this.testService.create(body),
      '创建成功'
    );
  }

  @Get('/list')
  async list(): Promise<ApiResponse> {
    const pageParams = this.getPageParams();
    return this.handleRequest(
      () => this.testService.findAll(pageParams),
      '查询成功'
    );
  }
}
