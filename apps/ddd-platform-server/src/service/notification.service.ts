import { Provide, Singleton } from '@midwayjs/decorator';

export interface NotificationMessage {
  userId: string;
  type: string;
  content: any;
  timestamp: number;
}

@Provide()
@Singleton()
export class NotificationService {
  /**
   * 发送通知
   */
  async sendNotification(userId: string, type: string, content: any): Promise<void> {
    try {
      const notification: NotificationMessage = {
        userId,
        type,
        content,
        timestamp: Date.now(),
      };

      console.log('Sending notification:', notification);

      // 这里可以实现多种通知方式：
      // 1. WebSocket实时推送
      // 2. 邮件通知
      // 3. 短信通知
      // 4. 系统内消息
      
      // 目前暂时只是日志输出，后续可以扩展
      await this.logNotification(notification);
      
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * 记录通知日志
   */
  private async logNotification(notification: NotificationMessage): Promise<void> {
    // 这里可以将通知保存到数据库或日志文件
    console.log(`[NOTIFICATION] ${notification.type} for user ${notification.userId}:`, notification.content);
  }

  /**
   * 批量发送通知
   */
  async sendBatchNotifications(notifications: Array<{userId: string; type: string; content: any}>): Promise<void> {
    try {
      const promises = notifications.map(notif => 
        this.sendNotification(notif.userId, notif.type, notif.content)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to send batch notifications:', error);
      throw error;
    }
  }

  /**
   * 发送项目状态变更通知
   */
  async sendProjectStatusNotification(projectId: string, status: string, userIds: string[]): Promise<void> {
    const notifications = userIds.map(userId => ({
      userId,
      type: 'PROJECT_STATUS_CHANGED',
      content: {
        projectId,
        status,
        timestamp: Date.now(),
      }
    }));

    await this.sendBatchNotifications(notifications);
  }

  /**
   * 发送代码生成完成通知
   */
  async sendCodeGenerationCompleteNotification(userId: string, taskId: string, outputPath: string): Promise<void> {
    await this.sendNotification(userId, 'CODE_GENERATION_COMPLETED', {
      taskId,
      outputPath,
      message: '代码生成已完成',
      timestamp: Date.now(),
    });
  }

  /**
   * 发送界面生成完成通知
   */
  async sendScreenGenerationCompleteNotification(userId: string, taskId: string, screenId: string): Promise<void> {
    await this.sendNotification(userId, 'SCREEN_GENERATION_COMPLETED', {
      taskId,
      screenId,
      message: '界面生成已完成',
      timestamp: Date.now(),
    });
  }
}
