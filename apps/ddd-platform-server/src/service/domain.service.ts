import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../entity/domain.entity';

@Provide()
export class DomainService {
  @InjectEntityModel(Domain)
  domainRepository: Repository<Domain>;

  /**
   * 创建域
   */
  async createDomain(domainData: Partial<Domain>): Promise<Domain> {
    const domain = this.domainRepository.create(domainData);
    return await this.domainRepository.save(domain);
  }

  /**
   * 获取域列表
   */
  async getDomains(projectId?: number): Promise<Domain[]> {
    const whereCondition = projectId ? { projectId } : {};
    return await this.domainRepository.find({
      where: whereCondition,
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取域
   */
  async getDomainById(id: number): Promise<Domain> {
    return await this.domainRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  /**
   * 更新域
   */
  async updateDomain(
    id: number,
    updateData: Partial<Domain>
  ): Promise<Domain> {
    await this.domainRepository.update(id, updateData);
    return await this.getDomainById(id);
  }

  /**
   * 删除域
   */
  async deleteDomain(id: number): Promise<boolean> {
    const result = await this.domainRepository.delete(id);
    return result.affected > 0;
  }
}
