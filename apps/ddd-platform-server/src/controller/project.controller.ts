import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { CreateProjectDTO, ProjectQueryDTO, ProjectService, UpdateProjectDTO } from '../service/project.service';

/**
 * 项目管理控制器
 */
@Controller('/api/v1/projects')
export class ProjectController {
  @Inject()
  projectService: ProjectService;

  /**
   * 创建项目
   */
  @Post('/')
  @Validate()
  async createProject(@Body() createProjectDTO: CreateProjectDTO) {
    try {
      const project = await this.projectService.createProject(createProjectDTO);
      return {
        success: true,
        code: 'SUCCESS',
        message: '项目创建成功',
        data: project
      };
    } catch (error) {
      return {
        success: false,
        code: 'CREATE_FAILED',
        message: '项目创建失败',
        error: error.message
      };
    }
  }

  /**
   * 获取项目列表
   */
  @Get('/')
  async getProjects(@Query() queryDTO: ProjectQueryDTO) {
    try {
      const result = await this.projectService.getProjects(queryDTO);
      return {
        success: true,
        code: 'SUCCESS',
        message: '获取项目列表成功',
        data: result.projects,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: Math.ceil(result.total / result.pageSize)
        }
      };
    } catch (error) {
      return {
        success: false,
        code: 'QUERY_FAILED',
        message: '获取项目列表失败',
        error: error.message
      };
    }
  }

  /**
   * 获取项目详情
   */
  @Get('/:projectId')
  async getProjectById(@Param('projectId') projectId: string) {
    try {
      const project = await this.projectService.getProjectById(projectId);
      
      if (!project) {
        return {
          success: false,
          code: 'NOT_FOUND',
          message: '项目不存在'
        };
      }

      return {
        success: true,
        code: 'SUCCESS',
        message: '获取项目详情成功',
        data: project
      };
    } catch (error) {
      return {
        success: false,
        code: 'QUERY_FAILED',
        message: '获取项目详情失败',
        error: error.message
      };
    }
  }

  /**
   * 更新项目
   */
  @Put('/:projectId')
  @Validate()
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateProjectDTO: UpdateProjectDTO
  ) {
    try {
      const project = await this.projectService.updateProject(projectId, updateProjectDTO);
      
      if (!project) {
        return {
          success: false,
          code: 'NOT_FOUND',
          message: '项目不存在'
        };
      }

      return {
        success: true,
        code: 'SUCCESS',
        message: '项目更新成功',
        data: project
      };
    } catch (error) {
      return {
        success: false,
        code: 'UPDATE_FAILED',
        message: '项目更新失败',
        error: error.message
      };
    }
  }

  /**
   * 删除项目
   */
  @Delete('/:projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    try {
      const success = await this.projectService.deleteProject(projectId);
      
      if (!success) {
        return {
          success: false,
          code: 'NOT_FOUND',
          message: '项目不存在'
        };
      }

      return {
        success: true,
        code: 'SUCCESS',
        message: '项目删除成功'
      };
    } catch (error) {
      return {
        success: false,
        code: 'DELETE_FAILED',
        message: '项目删除失败',
        error: error.message
      };
    }
  }

  /**
   * 获取项目成员
   */
  @Get('/:projectId/members')
  async getProjectMembers(@Param('projectId') projectId: string) {
    try {
      const members = await this.projectService.getProjectMembers(projectId);
      return {
        success: true,
        code: 'SUCCESS',
        message: '获取项目成员成功',
        data: members
      };
    } catch (error) {
      return {
        success: false,
        code: 'QUERY_FAILED',
        message: '获取项目成员失败',
        error: error.message
      };
    }
  }

  /**
   * 添加项目成员
   */
  @Post('/:projectId/members')
  @Validate()
  async addProjectMember(
    @Param('projectId') projectId: string,
    @Body() memberDTO: { userId: string; role: 'ADMIN' | 'DEVELOPER' | 'VIEWER' }
  ) {
    try {
      const member = await this.projectService.addProjectMember(
        projectId,
        memberDTO.userId,
        memberDTO.role
      );

      return {
        success: true,
        code: 'SUCCESS',
        message: '添加项目成员成功',
        data: member
      };
    } catch (error) {
      return {
        success: false,
        code: 'ADD_MEMBER_FAILED',
        message: '添加项目成员失败',
        error: error.message
      };
    }
  }
}
