import { Init, Inject, Provide, Singleton } from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';

export interface CodeGenerationMessage {
  taskId: string;
  projectId: string;
  entityIds: string[];
  templateType: string;
  outputPath: string;
  userId: string;
}

export interface ScreenGenerationMessage {
  taskId: string;
  projectId: string;
  entityId: string;
  screenType: 'list' | 'form' | 'detail' | 'dashboard';
  userId: string;
}

@Provide()
@Singleton()
export class RedisMessageQueueService {
  @Inject()
  redisService!: RedisService;

  private readonly QUEUE_PREFIX = 'ddd:queue:';
  private readonly CODE_GENERATION_QUEUE = 'code-generation';
  private readonly SCREEN_GENERATION_QUEUE = 'screen-generation';
  private readonly PROJECT_STATUS_QUEUE = 'project-status';

  @Init()
  async init() {
    console.log('Redis Message Queue Service initialized');
  }

  /**
   * 发送代码生成任务消息
   */
  async sendCodeGenerationTask(message: CodeGenerationMessage): Promise<void> {
    try {
      const queueKey = this.QUEUE_PREFIX + this.CODE_GENERATION_QUEUE;
      await this.redisService.lpush(queueKey, JSON.stringify(message));
      console.log('Code generation task sent to Redis queue:', message.taskId);
    } catch (error) {
      console.error('Failed to send code generation task to Redis:', error);
      throw error;
    }
  }

  /**
   * 发送界面生成任务消息
   */
  async sendScreenGenerationTask(message: ScreenGenerationMessage): Promise<void> {
    try {
      const queueKey = this.QUEUE_PREFIX + this.SCREEN_GENERATION_QUEUE;
      await this.redisService.lpush(queueKey, JSON.stringify(message));
      console.log('Screen generation task sent to Redis queue:', message.taskId);
    } catch (error) {
      console.error('Failed to send screen generation task to Redis:', error);
      throw error;
    }
  }

  /**
   * 发送项目状态更新消息
   */
  async sendProjectStatusUpdate(projectId: string, status: string, userId: string): Promise<void> {
    try {
      const message = {
        projectId,
        status,
        userId,
        timestamp: Date.now(),
      };

      const queueKey = this.QUEUE_PREFIX + this.PROJECT_STATUS_QUEUE;
      await this.redisService.lpush(queueKey, JSON.stringify(message));
      console.log('Project status update sent to Redis queue:', projectId);
    } catch (error) {
      console.error('Failed to send project status update to Redis:', error);
      throw error;
    }
  }

  /**
   * 从队列中获取代码生成任务
   */
  async getCodeGenerationTask(): Promise<CodeGenerationMessage | null> {
    try {
      const queueKey = this.QUEUE_PREFIX + this.CODE_GENERATION_QUEUE;
      const messageStr = await this.redisService.rpop(queueKey);
      return messageStr ? JSON.parse(messageStr) : null;
    } catch (error) {
      console.error('Failed to get code generation task from Redis:', error);
      throw error;
    }
  }

  /**
   * 从队列中获取界面生成任务
   */
  async getScreenGenerationTask(): Promise<ScreenGenerationMessage | null> {
    try {
      const queueKey = this.QUEUE_PREFIX + this.SCREEN_GENERATION_QUEUE;
      const messageStr = await this.redisService.rpop(queueKey);
      return messageStr ? JSON.parse(messageStr) : null;
    } catch (error) {
      console.error('Failed to get screen generation task from Redis:', error);
      throw error;
    }
  }

  /**
   * 获取队列长度
   */
  async getQueueLength(queueName: string): Promise<number> {
    try {
      const queueKey = this.QUEUE_PREFIX + queueName;
      return await this.redisService.llen(queueKey);
    } catch (error) {
      console.error('Failed to get queue length:', error);
      return 0;
    }
  }

  /**
   * 清空队列
   */
  async clearQueue(queueName: string): Promise<void> {
    try {
      const queueKey = this.QUEUE_PREFIX + queueName;
      await this.redisService.del(queueKey);
      console.log(`Queue ${queueName} cleared`);
    } catch (error) {
      console.error('Failed to clear queue:', error);
      throw error;
    }
  }

  /**
   * 获取所有队列状态
   */
  async getQueueStatus(): Promise<{ [key: string]: number }> {
    try {
      const status = {
        codeGeneration: await this.getQueueLength(this.CODE_GENERATION_QUEUE),
        screenGeneration: await this.getQueueLength(this.SCREEN_GENERATION_QUEUE),
        projectStatus: await this.getQueueLength(this.PROJECT_STATUS_QUEUE),
      };
      return status;
    } catch (error) {
      console.error('Failed to get queue status:', error);
      return {};
    }
  }
}
