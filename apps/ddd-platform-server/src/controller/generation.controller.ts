import { Body, Controller, Get, Inject, Param, Post } from '@midwayjs/decorator';
import { CodeGenerationService } from '../service/code-generation.service';
import { RedisMessageQueueService } from '../service/mq/redis-queue.service';
import { NotificationService } from '../service/notification.service';
import { ScreenGenerationService } from '../service/screen-generation.service';

export interface GenerateCodeRequest {
  projectId: string;
  entityIds: string[];
  templateType: 'spring-boot' | 'node-express' | 'react-crud' | 'vue-admin';
  outputPath: string;
  async?: boolean;
}

export interface GenerateScreenRequest {
  projectId: string;
  entityIds: string[];
  config: {
    type: 'list' | 'form' | 'detail' | 'dashboard';
    theme: 'antd' | 'element' | 'material' | 'custom';
    layout: 'grid' | 'form' | 'card' | 'table';
    components: string[];
    customStyles?: any;
  };
  outputPath: string;
  async?: boolean;
}

@Controller('/api/generation')
export class GenerationController {
  @Inject()
  codeGenerationService!: CodeGenerationService;

  @Inject()
  screenGenerationService!: ScreenGenerationService;

  @Inject()
  notificationService!: NotificationService;

  @Inject()
  mqProducerService!: RedisMessageQueueService;

  /**
   * 生成代码
   */
  @Post('/code')
  async generateCode(@Body() request: GenerateCodeRequest) {
    try {
      const { projectId, entityIds, templateType, outputPath, async = false } = request;

      if (async) {
        // 异步生成
        await this.mqProducerService.sendCodeGenerationTask({
          taskId: `code_gen_${projectId}_${Date.now()}`,
          projectId,
          entityIds,
          templateType,
          outputPath,
          userId: 'current_user', // 实际应用中从请求上下文获取
        });

        return {
          success: true,
          message: '代码生成任务已提交，请稍后查看结果',
          taskId: `code_gen_${projectId}_${Date.now()}`,
        };
      } else {
        // 同步生成
        const result = await this.codeGenerationService.generateCode(
          projectId,
          entityIds,
          templateType,
          outputPath
        );

        // 发送完成通知
        await this.notificationService.sendNotification(
          'current_user', // userId
          'success', // type
          {
            title: '代码生成完成',
            message: `项目 ${projectId} 的代码生成已完成`,
            data: {
              projectId,
              templateType,
              outputPath,
            },
          }
        );

        return {
          success: true,
          message: '代码生成完成',
          data: {
            code: result,
            outputPath,
          },
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      // 发送错误通知
      await this.notificationService.sendNotification(
        'current_user',
        'error',
        {
          title: '代码生成失败',
          message: `代码生成过程中发生错误: ${errorMessage}`,
          data: {
            projectId: request.projectId,
            error: errorMessage,
          },
        }
      );

      return {
        success: false,
        message: `代码生成失败: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }

  /**
   * 生成界面
   */
  @Post('/screen')
  async generateScreen(@Body() request: GenerateScreenRequest) {
    try {
      const { projectId, entityIds, config, outputPath, async = false } = request;

      if (async) {
        // 异步生成 - 只取第一个实体ID
        await this.mqProducerService.sendScreenGenerationTask({
          taskId: `screen_gen_${projectId}_${Date.now()}`,
          projectId,
          entityId: entityIds[0], // ScreenGenerationMessage只支持单个entityId
          screenType: config.type,
          userId: 'current_user',
        });

        return {
          success: true,
          message: '界面生成任务已提交，请稍后查看结果',
          taskId: `screen_gen_${projectId}_${Date.now()}`,
        };
      } else {
        // 同步生成
        const result = await this.screenGenerationService.generateScreen(
          projectId,
          {
            aggregateId: entityIds[0], // 假设第一个实体ID作为聚合ID
            screenType: config.type.toUpperCase() as 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD',
            templateId: config.theme, // 使用theme作为templateId
            customization: config
          }
        );

        // 发送完成通知
        await this.notificationService.sendNotification(
          'current_user',
          'SCREEN_GENERATION_COMPLETED',
          {
            title: '界面生成完成',
            message: `项目 ${projectId} 的界面生成已完成`,
            data: {
              projectId,
              screenType: config.type,
              outputPath,
            },
          }
        );

        return {
          success: true,
          message: '界面生成完成',
          data: {
            schema: result,
            outputPath,
          },
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      // 发送错误通知
      await this.notificationService.sendNotification(
        'current_user',
        'error',
        {
          title: '界面生成失败',
          message: `界面生成过程中发生错误: ${errorMessage}`,
          data: {
            projectId: request.projectId,
            error: errorMessage,
          },
        }
      );

      return {
        success: false,
        message: `界面生成失败: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }

  /**
   * 获取代码模板列表
   */
  @Get('/templates/code')
  async getCodeTemplates() {
    return {
      success: true,
      data: [
        {
          id: 'spring-boot',
          name: 'Spring Boot',
          type: 'backend',
          language: 'java',
          framework: 'Spring Boot',
          description: 'Spring Boot RESTful API with JPA',
        },
        {
          id: 'node-express',
          name: 'Node.js Express',
          type: 'backend',
          language: 'javascript',
          framework: 'Express.js',
          description: 'Node.js REST API with Express and Sequelize',
        },
        {
          id: 'react-crud',
          name: 'React CRUD',
          type: 'frontend',
          language: 'typescript',
          framework: 'React',
          description: 'React CRUD components with Ant Design',
        },
        {
          id: 'vue-admin',
          name: 'Vue Admin',
          type: 'frontend',
          language: 'typescript',
          framework: 'Vue.js',
          description: 'Vue.js admin interface with Element UI',
        },
      ],
    };
  }

  /**
   * 获取界面模板列表
   */
  @Get('/templates/screen')
  async getScreenTemplates() {
    return {
      success: true,
      data: [
        {
          id: 'list',
          name: '列表页面',
          type: 'list',
          description: '数据列表页面，支持搜索、排序、分页',
        },
        {
          id: 'form',
          name: '表单页面',
          type: 'form',
          description: '数据表单页面，支持新增、编辑',
        },
        {
          id: 'detail',
          name: '详情页面',
          type: 'detail',
          description: '数据详情展示页面',
        },
        {
          id: 'dashboard',
          name: '仪表盘',
          type: 'dashboard',
          description: '数据统计仪表盘',
        },
      ],
    };
  }

  /**
   * 获取生成任务状态
   */
  @Get('/task/:taskId/status')
  async getTaskStatus(@Param('taskId') taskId: string) {
    // 这里应该从Redis或数据库获取任务状态
    // 简化实现，返回模拟状态
    return {
      success: true,
      data: {
        taskId,
        status: 'completed', // pending, running, completed, failed
        progress: 100,
        result: {
          outputPath: '/path/to/generated/files',
          message: '生成完成',
        },
      },
    };
  }

  /**
   * 批量生成
   */
  @Post('/batch')
  async batchGenerate(@Body() request: {
    projectId: string;
    entityIds: string[];
    tasks: Array<{
      type: 'code' | 'screen';
      templateType?: string;
      config?: any;
      outputPath: string;
    }>;
  }) {
    try {
      const { projectId, entityIds, tasks } = request;
      const results = [];

      for (const task of tasks) {
        if (task.type === 'code' && task.templateType) {
          await this.mqProducerService.sendCodeGenerationTask({
            taskId: `code_gen_${projectId}_${Date.now()}`,
            projectId,
            entityIds,
            templateType: task.templateType,
            outputPath: task.outputPath,
            userId: 'current_user',
          });
        } else if (task.type === 'screen' && task.config) {
          await this.mqProducerService.sendScreenGenerationTask({
            taskId: `screen_gen_${projectId}_${Date.now()}`,
            projectId,
            entityId: entityIds[0], // 取第一个实体ID
            screenType: task.config.type,
            userId: 'current_user',
          });
        }

        results.push({
          type: task.type,
          status: 'submitted',
          taskId: `${task.type}_gen_${projectId}_${Date.now()}`,
        });
      }

      return {
        success: true,
        message: '批量生成任务已提交',
        data: results,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      return {
        success: false,
        message: `批量生成失败: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }

  /**
   * 预览生成结果
   */
  @Post('/preview')
  async previewGeneration(@Body() request: {
    projectId: string;
    entityIds: string[];
    type: 'code' | 'screen';
    templateType?: string;
    config?: any;
  }) {
    try {
      const { projectId, entityIds, type, templateType, config } = request;

      if (type === 'code' && templateType) {
        // 生成代码预览（不保存文件）
        const result = await this.codeGenerationService.generateCode(
          projectId,
          entityIds,
          templateType,
          '/tmp/preview' // 临时路径
        );

        return {
          success: true,
          data: {
            type: 'code',
            preview: result.substring(0, 2000), // 限制预览长度
            fullLength: result.length,
          },
        };
      } else if (type === 'screen' && config) {
        // 生成界面预览
        const result = await this.screenGenerationService.generateScreen(
          projectId,
          {
            aggregateId: entityIds[0], // 假设第一个实体ID作为聚合ID
            screenType: config.type.toUpperCase() as 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD',
            templateId: config.theme,
            customization: config
          }
        );

        return {
          success: true,
          data: {
            type: 'screen',
            preview: result,
          },
        };
      }

      return {
        success: false,
        message: '缺少必要参数或不支持的预览类型',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      return {
        success: false,
        message: `预览生成失败: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }
}
