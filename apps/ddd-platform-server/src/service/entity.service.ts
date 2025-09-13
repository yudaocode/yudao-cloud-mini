import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { DddEntity } from '../entity/ddd-entity.entity';

@Provide()
export class EntityService {
  @InjectEntityModel(DddEntity)
  entityRepository: Repository<DddEntity>;

  /**
   * 创建实体/值对象
   */
  async createEntity(entityData: Partial<DddEntity>): Promise<DddEntity> {
    const entity = this.entityRepository.create(entityData);
    return await this.entityRepository.save(entity);
  }

  /**
   * 获取实体/值对象列表
   */
  async getEntities(aggregateId?: number, type?: string): Promise<DddEntity[]> {
    const whereCondition: any = {};
    if (aggregateId) whereCondition.aggregateId = aggregateId;
    if (type) whereCondition.type = type;

    return await this.entityRepository.find({
      where: whereCondition,
      relations: ['aggregate', 'aggregate.domain', 'aggregate.domain.project'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取实体/值对象
   */
  async getEntityById(id: number): Promise<DddEntity> {
    return await this.entityRepository.findOne({
      where: { id },
      relations: ['aggregate', 'aggregate.domain', 'aggregate.domain.project'],
    });
  }

  /**
   * 更新实体/值对象
   */
  async updateEntity(
    id: number,
    updateData: Partial<DddEntity>
  ): Promise<DddEntity> {
    await this.entityRepository.update(id, updateData);
    return await this.getEntityById(id);
  }

  /**
   * 删除实体/值对象
   */
  async deleteEntity(id: number): Promise<boolean> {
    const result = await this.entityRepository.delete(id);
    return result.affected > 0;
  }
}
