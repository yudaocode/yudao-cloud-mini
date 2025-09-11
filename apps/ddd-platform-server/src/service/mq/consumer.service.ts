import { Config, Destroy, Init, Provide, Singleton } from '@midwayjs/decorator';
import { MQConsumer } from 'rocketmq-client-nodejs';
import { CodeGenerationService } from '../code-generation.service';
import { NotificationService } from '../notification.service';
import { ScreenGenerationService } from '../screen-generation.service';

@Provide()
@Singleton()
export class RocketMQConsumerService {
  @Config('rocketmq')
  rocketmqConfig: any;

  private consumer: MQConsumer;

  constructor(
    private codeGenerationService: CodeGenerationService,
    private screenGenerationService: ScreenGenerationService,
    private notificationService: NotificationService
  ) {}

  @Init()
  async init() {
    this.consumer = new MQConsumer({
      nameServer: this.rocketmqConfig.nameServer,
      groupId: this.rocketmqConfig.consumer.groupId,
    });

    // 订阅代码生成主题
    this.consumer.subscribe('CODE_GENERATION', 'GENERATE', async (message) => {
      await this.handleCodeGenerationMessage(message);
    });

    // 订阅界面生成主题
    this.consumer.subscribe('SCREEN_GENERATION', 'GENERATE', async (message) => {
      await this.handleScreenGenerationMessage(message);
    });

    // 订阅项目状态更新主题
    this.consumer.subscribe('PROJECT_STATUS', 'UPDATE', async (message) => {
      await this.handleProjectStatusMessage(message);
    });

    await this.consumer.start();
    console.log('RocketMQ Consumer started successfully');
  }

  @Destroy()
  async destroy() {
    if (this.consumer) {
      await this.consumer.shutdown();
      console.log('RocketMQ Consumer shutdown successfully');
    }
  }

  /**
   * 处理代码生成消息
   */
  private async handleCodeGenerationMessage(message: any): Promise<void> {
    try {
      const data = JSON.parse(message.body);
      console.log('Processing code generation task:', data);

      // 调用代码生成服务
      await this.codeGenerationService.generateCode(
        data.projectId,
        data.entityIds,
        data.templateType,
        data.outputPath
      );

      // 发送完成通知
      await this.notificationService.sendNotification(data.userId, 'CODE_GENERATION_COMPLETED', {
        taskId: data.taskId,
        projectId: data.projectId,
        status: 'completed',
      });

      console.log('Code generation task completed:', data.taskId);
    } catch (error) {
      console.error('Error processing code generation message:', error);
      
      // 发送失败通知
      const data = JSON.parse(message.body);
      await this.notificationService.sendNotification(data.userId, 'CODE_GENERATION_FAILED', {
        taskId: data.taskId,
        error: error.message,
      });
    }
  }

  /**
   * 处理界面生成消息
   */
  private async handleScreenGenerationMessage(message: any): Promise<void> {
    try {
      const data = JSON.parse(message.body);
      console.log('Processing screen generation task:', data);

      // 调用界面生成服务
      const screen = await this.screenGenerationService.generateScreenByEntityId(
        data.entityId,
        data.screenType
      );

      // 发送完成通知
      await this.notificationService.sendNotification(data.userId, 'SCREEN_GENERATION_COMPLETED', {
        taskId: data.taskId,
        screenId: screen.id,
        status: 'completed',
      });

      console.log('Screen generation task completed:', data.taskId);
    } catch (error) {
      console.error('Error processing screen generation message:', error);
      
      // 发送失败通知
      const data = JSON.parse(message.body);
      await this.notificationService.sendNotification(data.userId, 'SCREEN_GENERATION_FAILED', {
        taskId: data.taskId,
        error: error.message,
      });
    }
  }

  /**
   * 处理项目状态更新消息
   */
  private async handleProjectStatusMessage(message: any): Promise<void> {
    try {
      const data = JSON.parse(message.body);
      console.log('Processing project status update:', data);

      // 这里可以添加项目状态更新的业务逻辑
      // 比如更新数据库、发送WebSocket通知等

      console.log('Project status update processed:', data.projectId);
    } catch (error) {
      console.error('Error processing project status message:', error);
    }
  }
}
