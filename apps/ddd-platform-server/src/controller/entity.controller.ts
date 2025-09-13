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
import { DddEntity } from '../entity/ddd-entity.entity';
import { EntityService } from '../service/entity.service';

@Controller('/api/entities')
export class EntityController {
  @Inject()
  entityService: EntityService;

  @Post('/')
  async createEntity(@Body() entityData: Partial<DddEntity>) {
    try {
      const entity = await this.entityService.createEntity(entityData);
      return {
        success: true,
        code: 200,
        message: '实体创建成功',
        data: entity,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '实体创建失败',
        error: error.message,
      };
    }
  }

  @Get('/')
  async getEntities(
    @Query('aggregateId') aggregateId: number,
    @Query('type') type: string
  ) {
    try {
      const entities = await this.entityService.getEntities(aggregateId, type);
      return {
        success: true,
        code: 200,
        message: '获取实体列表成功',
        data: entities,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取实体列表失败',
        error: error.message,
      };
    }
  }

  @Get('/:id')
  async getEntity(@Param('id') id: number) {
    try {
      const entity = await this.entityService.getEntityById(id);
      if (!entity) {
        return {
          success: false,
          code: 404,
          message: '实体不存在',
        };
      }
      return {
        success: true,
        code: 200,
        message: '获取实体详情成功',
        data: entity,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取实体详情失败',
        error: error.message,
      };
    }
  }

  @Put('/:id')
  async updateEntity(
    @Param('id') id: number,
    @Body() updateData: Partial<DddEntity>
  ) {
    try {
      const entity = await this.entityService.updateEntity(id, updateData);
      return {
        success: true,
        code: 200,
        message: '实体更新成功',
        data: entity,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '实体更新失败',
        error: error.message,
      };
    }
  }

  @Del('/:id')
  async deleteEntity(@Param('id') id: number) {
    try {
      const result = await this.entityService.deleteEntity(id);
      if (!result) {
        return {
          success: false,
          code: 404,
          message: '实体不存在或删除失败',
        };
      }
      return {
        success: true,
        code: 200,
        message: '实体删除成功',
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '实体删除失败',
        error: error.message,
      };
    }
  }
}
