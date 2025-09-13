import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';

@Provide()
export class ProjectService {
  @InjectEntityModel(Project)
  projectRepository: Repository<Project>;

  /**
   * 创建项目
   */
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectRepository.create(projectData);
    return await this.projectRepository.save(project);
  }

  /**
   * 获取项目列表
   */
  async getProjects(): Promise<Project[]> {
    return await this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取项目
   */
  async getProjectById(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id },
    });
  }

  /**
   * 更新项目
   */
  async updateProject(id: number, updateData: Partial<Project>): Promise<Project> {
    await this.projectRepository.update(id, updateData);
    return await this.getProjectById(id);
  }

  /**
   * 删除项目
   */
  async deleteProject(id: number): Promise<boolean> {
    const result = await this.projectRepository.delete(id);
    return result.affected > 0;
  }
}
