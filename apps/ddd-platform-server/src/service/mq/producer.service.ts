import { Config, Destroy, Init, Provide, Singleton } from '@midwayjs/decorator';
// 暂时使用模拟的RocketMQ接口，等待正确的包安装
interface MQProducer {
  send(message: { topic: string; tag: string; body: string; keys: string }): Promise<any>;
  shutdown(): Promise<void>;
}

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
export class RocketMQProducerService {
  @Config('rocketmq')
  rocketmqConfig: any;

  private producer: MQProducer;

  @Init()
  async init() {
    this.producer = new MQProducer({
      nameServer: this.rocketmqConfig.nameServer,
      groupId: this.rocketmqConfig.producer.groupId,
    });

    await this.producer.start();
    console.log('RocketMQ Producer started successfully');
  }

  @Destroy()
  async destroy() {
    if (this.producer) {
      await this.producer.shutdown();
      console.log('RocketMQ Producer shutdown successfully');
    }
  }

  /**
   * 发送代码生成任务消息
   */
  async sendCodeGenerationTask(message: CodeGenerationMessage): Promise<void> {
    try {
      const result = await this.producer.send({
        topic: 'CODE_GENERATION',
        tag: 'GENERATE',
        body: JSON.stringify(message),
        keys: message.taskId,
      });
      console.log('Code generation task sent:', result);
    } catch (error) {
      console.error('Failed to send code generation task:', error);
      throw error;
    }
  }

  /**
   * 发送界面生成任务消息
   */
  async sendScreenGenerationTask(message: ScreenGenerationMessage): Promise<void> {
    try {
      const result = await this.producer.send({
        topic: 'SCREEN_GENERATION',
        tag: 'GENERATE',
        body: JSON.stringify(message),
        keys: message.taskId,
      });
      console.log('Screen generation task sent:', result);
    } catch (error) {
      console.error('Failed to send screen generation task:', error);
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

      const result = await this.producer.send({
        topic: 'PROJECT_STATUS',
        tag: 'UPDATE',
        body: JSON.stringify(message),
        keys: projectId,
      });
      console.log('Project status update sent:', result);
    } catch (error) {
      console.error('Failed to send project status update:', error);
      throw error;
    }
  }

  /**
   * 发送通用通知消息
   */
  async sendNotification(userId: string, type: string, content: any): Promise<void> {
    try {
      const message = {
        userId,
        type,
        content,
        timestamp: Date.now(),
      };

      const result = await this.producer.send({
        topic: 'NOTIFICATION',
        tag: type.toUpperCase(),
        body: JSON.stringify(message),
        keys: userId,
      });
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}
