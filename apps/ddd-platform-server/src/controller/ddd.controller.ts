import { Body, Controller, Del, Get, Inject, Param, Post, Put, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { CreateAggregateDTO, DDDService, UpdateAggregateDTO } from '../service/ddd.service';

/**
 * DDD模型管理控制器
 */
@Controller('/api/v1/projects/:projectId/aggregates')
export class DDDAggregateController {
  @Inject()
  dddService!: DDDService;

  /**
   * 创建聚合
   */
  @Post('/')
  @Validate()
  async createAggregate(
    @Param('projectId') projectId: string,
    @Body() createDto: CreateAggregateDTO
  ) {
    // 将 projectId 合并到 DTO 中
    const dto = { ...createDto, projectId };
    return await this.dddService.createAggregate(dto);
  }

  /**
   * 获取聚合列表
   */
  @Get('/')
  async getAggregates(
    @Param('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string
  ) {
    return await this.dddService.getAggregates(projectId);
  }

  /**
   * 获取聚合详情
   */
  @Get('/:aggregateId')
  async getAggregateById(
    @Param('projectId') projectId: string,
    @Param('aggregateId') aggregateId: string
  ) {
    return await this.dddService.getAggregateById(aggregateId);
  }

  /**
   * 更新聚合
   */
  @Put('/:aggregateId')
  @Validate()
  async updateAggregate(
    @Param('projectId') projectId: string,
    @Param('aggregateId') aggregateId: string,
    @Body() updateDto: UpdateAggregateDTO
  ) {
    return await this.dddService.updateAggregate(aggregateId, updateDto);
  }

  /**
   * 删除聚合
   */
  @Del('/:aggregateId')
  async deleteAggregate(
    @Param('projectId') projectId: string,
    @Param('aggregateId') aggregateId: string
  ) {
    return await this.dddService.deleteAggregate(aggregateId);
  }

}

/**
 * DDD实体管理控制器
 */
@Controller('/api/v1/projects/:projectId/entities')
export class DDDEntityController {
  @Inject()
  dddService!: DDDService;

  /**
   * 获取实体列表
   */
  @Get('/')
  async getEntities(
    @Param('projectId') projectId: string,
    @Query('aggregateId') aggregateId?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string
  ) {
    return await this.dddService.getEntities(projectId, aggregateId);
  }

  /**
   * 创建实体
   */
  @Post('/')
  @Validate()
  async createEntity(
    @Param('projectId') projectId: string,
    @Body() createDto: any
  ) {
    // 将 projectId 合并到 DTO 中
    const dto = { ...createDto, projectId };
    return await this.dddService.createEntity(dto);
  }

  /**
   * 获取实体详情
   */
  @Get('/:entityId')
  async getEntityById(
    @Param('projectId') projectId: string,
    @Param('entityId') entityId: string
  ) {
    return await this.dddService.getEntityById(entityId);
  }

}