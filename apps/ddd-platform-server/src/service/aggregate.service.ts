import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Aggregate } from '../entity/aggregate.entity';

@Provide()
export class AggregateService {
  @InjectEntityModel(Aggregate)
  aggregateRepository: Repository<Aggregate>;

  /**
   * 创建聚合根
   */
  async createAggregate(aggregateData: Partial<Aggregate>): Promise<Aggregate> {
    const aggregate = this.aggregateRepository.create(aggregateData);
    return await this.aggregateRepository.save(aggregate);
  }

  /**
   * 获取聚合根列表
   */
  async getAggregates(domainId?: number): Promise<Aggregate[]> {
    const whereCondition = domainId ? { domainId } : {};
    return await this.aggregateRepository.find({
      where: whereCondition,
      relations: ['domain', 'domain.project'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取聚合根
   */
  async getAggregateById(id: number): Promise<Aggregate> {
    return await this.aggregateRepository.findOne({
      where: { id },
      relations: ['domain', 'domain.project'],
    });
  }

  /**
   * 更新聚合根
   */
  async updateAggregate(
    id: number,
    updateData: Partial<Aggregate>
  ): Promise<Aggregate> {
    await this.aggregateRepository.update(id, updateData);
    return await this.getAggregateById(id);
  }

  /**
   * 删除聚合根
   */
  async deleteAggregate(id: number): Promise<boolean> {
    const result = await this.aggregateRepository.delete(id);
    return result.affected > 0;
  }
}
