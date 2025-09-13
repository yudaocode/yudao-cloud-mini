import {
    Body,
    Controller,
    Del,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
} from '@midwayjs/core';
import { Aggregate } from '../entity/aggregate.entity';
import { AggregateService } from '../service/aggregate.service';

@Controller('/api/aggregates')
export class AggregateController {
  @Inject()
  aggregateService: AggregateService;

  @Post('/')
  async createAggregate(@Body() aggregateData: Partial<Aggregate>) {
    try {
      const aggregate = await this.aggregateService.createAggregate(aggregateData);
      return {
        success: true,
        code: 200,
        message: '聚合根创建成功',
        data: aggregate,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '聚合根创建失败',
        error: error.message,
      };
    }
  }

  @Get('/')
  async getAggregates(@Query('domainId') domainId: number) {
    try {
      const aggregates = await this.aggregateService.getAggregates(domainId);
      return {
        success: true,
        code: 200,
        message: '获取聚合根列表成功',
        data: aggregates,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取聚合根列表失败',
        error: error.message,
      };
    }
  }

  @Get('/:id')
  async getAggregate(@Param('id') id: number) {
    try {
      const aggregate = await this.aggregateService.getAggregateById(id);
      if (!aggregate) {
        return {
          success: false,
          code: 404,
          message: '聚合根不存在',
        };
      }
      return {
        success: true,
        code: 200,
        message: '获取聚合根详情成功',
        data: aggregate,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取聚合根详情失败',
        error: error.message,
      };
    }
  }

  @Put('/:id')
  async updateAggregate(
    @Param('id') id: number,
    @Body() updateData: Partial<Aggregate>
  ) {
    try {
      const aggregate = await this.aggregateService.updateAggregate(id, updateData);
      return {
        success: true,
        code: 200,
        message: '聚合根更新成功',
        data: aggregate,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '聚合根更新失败',
        error: error.message,
      };
    }
  }

  @Del('/:id')
  async deleteAggregate(@Param('id') id: number) {
    try {
      const result = await this.aggregateService.deleteAggregate(id);
      if (!result) {
        return {
          success: false,
          code: 404,
          message: '聚合根不存在或删除失败',
        };
      }
      return {
        success: true,
        code: 200,
        message: '聚合根删除成功',
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '聚合根删除失败',
        error: error.message,
      };
    }
  }
}
