import { Body, Controller, Del, Get, Inject, Param, Post, Put } from '@midwayjs/core';
import { Project } from '../entity/project.entity';
import { ProjectService } from '../service/project.service';

@Controller('/api/projects')
export class ProjectController {
  
  @Inject()
  projectService: ProjectService;

  @Post('/')
  async createProject(@Body() projectData: Partial<Project>) {
    try {
      const project = await this.projectService.createProject(projectData);
      return {
        success: true,
        code: 200,
        message: '项目创建成功',
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '项目创建失败',
        error: error.message,
      };
    }
  }

  @Get('/')
  async getProjects() {
    try {
      const projects = await this.projectService.getProjects();
      return {
        success: true,
        code: 200,
        message: '获取项目列表成功',
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取项目列表失败',
        error: error.message,
      };
    }
  }

  @Get('/:id')
  async getProject(@Param('id') id: number) {
    try {
      const project = await this.projectService.getProjectById(id);
      if (!project) {
        return {
          success: false,
          code: 404,
          message: '项目不存在',
        };
      }
      return {
        success: true,
        code: 200,
        message: '获取项目详情成功',
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '获取项目详情失败',
        error: error.message,
      };
    }
  }

  @Put('/:id')
  async updateProject(@Param('id') id: number, @Body() updateData: Partial<Project>) {
    try {
      const project = await this.projectService.updateProject(id, updateData);
      return {
        success: true,
        code: 200,
        message: '项目更新成功',
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '项目更新失败',
        error: error.message,
      };
    }
  }

  @Del('/:id')
  async deleteProject(@Param('id') id: number) {
    try {
      const result = await this.projectService.deleteProject(id);
      if (!result) {
        return {
          success: false,
          code: 404,
          message: '项目不存在或删除失败',
        };
      }
      return {
        success: true,
        code: 200,
        message: '项目删除成功',
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: '项目删除失败',
        error: error.message,
      };
    }
  }
}
