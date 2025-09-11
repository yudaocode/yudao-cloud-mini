import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectMember } from '../entity/project.entity';

export interface CreateProjectDTO {
  name: string;
  description?: string;
  ownerId: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface ProjectQueryDTO {
  ownerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

@Provide()
export class ProjectService {
  @InjectEntityModel(Project)
  projectRepository: Repository<Project>;

  @InjectEntityModel(ProjectMember)
  projectMemberRepository: Repository<ProjectMember>;

  /**
   * 创建项目
   */
  async createProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    const project = new Project();
    project.id = `project_${uuidv4().replace(/-/g, '')}`;
    project.name = createProjectDTO.name;
    project.description = createProjectDTO.description;
    project.ownerId = createProjectDTO.ownerId;
    project.status = 'ACTIVE';
    project.metadata = {
      version: '1.0.0',
      createdBy: createProjectDTO.ownerId,
      features: {
        dddModeling: true,
        screenGeneration: true,
        codeGeneration: true
      }
    };

    const savedProject = await this.projectRepository.save(project);

    // 添加项目创建者为管理员
    await this.addProjectMember(savedProject.id, createProjectDTO.ownerId, 'OWNER');

    return savedProject;
  }

  /**
   * 获取项目列表
   */
  async getProjects(queryDTO: ProjectQueryDTO): Promise<{
    projects: Project[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { ownerId, status, page = 1, pageSize = 20 } = queryDTO;
    
    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (ownerId) {
      queryBuilder.where('project.ownerId = :ownerId', { ownerId });
    }

    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    queryBuilder
      .orderBy('project.updatedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [projects, total] = await queryBuilder.getManyAndCount();

    return {
      projects,
      total,
      page,
      pageSize
    };
  }

  /**
   * 获取项目详情
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    return await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['boundedContexts', 'aggregates']
    });
  }

  /**
   * 更新项目
   */
  async updateProject(projectId: string, updateProjectDTO: UpdateProjectDTO): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId }
    });

    if (!project) {
      return null;
    }

    if (updateProjectDTO.name) {
      project.name = updateProjectDTO.name;
    }

    if (updateProjectDTO.description !== undefined) {
      project.description = updateProjectDTO.description;
    }

    if (updateProjectDTO.status) {
      project.status = updateProjectDTO.status;
    }

    return await this.projectRepository.save(project);
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const result = await this.projectRepository.delete(projectId);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * 添加项目成员
   */
  async addProjectMember(
    projectId: string, 
    userId: string, 
    role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER'
  ): Promise<ProjectMember> {
    const member = new ProjectMember();
    member.projectId = projectId;
    member.userId = userId;
    member.role = role;
    member.permissions = this.getDefaultPermissions(role);

    return await this.projectMemberRepository.save(member);
  }

  /**
   * 获取项目成员列表
   */
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return await this.projectMemberRepository.find({
      where: { projectId },
      relations: ['project']
    });
  }

  /**
   * 检查用户是否有项目访问权限
   */
  async checkProjectAccess(projectId: string, userId: string): Promise<boolean> {
    const member = await this.projectMemberRepository.findOne({
      where: { projectId, userId }
    });

    return !!member;
  }

  /**
   * 获取用户在项目中的角色
   */
  async getUserProjectRole(projectId: string, userId: string): Promise<string | null> {
    const member = await this.projectMemberRepository.findOne({
      where: { projectId, userId }
    });

    return member ? member.role : null;
  }

  /**
   * 根据角色获取默认权限
   */
  private getDefaultPermissions(role: string): Record<string, any> {
    const permissions = {
      OWNER: {
        project: ['read', 'write', 'delete', 'manage'],
        ddd: ['read', 'write', 'delete'],
        screen: ['read', 'write', 'delete'],
        generation: ['read', 'write', 'execute'],
        members: ['read', 'write', 'delete']
      },
      ADMIN: {
        project: ['read', 'write'],
        ddd: ['read', 'write', 'delete'],
        screen: ['read', 'write', 'delete'],
        generation: ['read', 'write', 'execute'],
        members: ['read', 'write']
      },
      DEVELOPER: {
        project: ['read'],
        ddd: ['read', 'write'],
        screen: ['read', 'write'],
        generation: ['read', 'execute'],
        members: ['read']
      },
      VIEWER: {
        project: ['read'],
        ddd: ['read'],
        screen: ['read'],
        generation: ['read'],
        members: ['read']
      }
    };

    return permissions[role] || permissions.VIEWER;
  }
}
