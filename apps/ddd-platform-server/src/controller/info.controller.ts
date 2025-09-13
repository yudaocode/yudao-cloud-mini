import { Controller, Get } from '@midwayjs/core';

@Controller('/api')
export class ApiInfoController {
  @Get('/info')
  async getApiInfo() {
    return {
      success: true,
      code: 200,
      message: 'DDD元数据驱动开发平台API',
      data: {
        title: 'DDD Platform API',
        version: '1.0.0',
        description: 'DDD元数据驱动开发平台后端API服务',
        endpoints: {
          projects: {
            description: '项目管理',
            endpoints: [
              'GET /api/projects - 获取项目列表',
              'POST /api/projects - 创建项目',
              'GET /api/projects/:id - 获取项目详情',
              'PUT /api/projects/:id - 更新项目',
              'DELETE /api/projects/:id - 删除项目'
            ]
          },
          domains: {
            description: '域管理',
            endpoints: [
              'GET /api/domains - 获取域列表',
              'GET /api/domains?projectId=:id - 获取指定项目的域',
              'POST /api/domains - 创建域',
              'GET /api/domains/:id - 获取域详情',
              'PUT /api/domains/:id - 更新域',
              'DELETE /api/domains/:id - 删除域'
            ]
          },
          aggregates: {
            description: '聚合根管理',
            endpoints: [
              'GET /api/aggregates - 获取聚合根列表',
              'GET /api/aggregates?domainId=:id - 获取指定域的聚合根',
              'POST /api/aggregates - 创建聚合根',
              'GET /api/aggregates/:id - 获取聚合根详情',
              'PUT /api/aggregates/:id - 更新聚合根',
              'DELETE /api/aggregates/:id - 删除聚合根'
            ]
          },
          entities: {
            description: '实体/值对象管理',
            endpoints: [
              'GET /api/entities - 获取实体列表',
              'GET /api/entities?aggregateId=:id - 获取指定聚合根的实体',
              'GET /api/entities?type=entity|value_object - 按类型获取实体',
              'POST /api/entities - 创建实体/值对象',
              'GET /api/entities/:id - 获取实体详情',
              'PUT /api/entities/:id - 更新实体',
              'DELETE /api/entities/:id - 删除实体'
            ]
          }
        },
        database: {
          status: '已连接',
          host: '192.168.17.123:33306',
          database: 'ddd_platform'
        },
        redis: {
          status: '已连接',
          host: '192.168.17.123:16379'
        }
      }
    };
  }
}
