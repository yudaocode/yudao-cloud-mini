// 操作日志服务
export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'SUCCESS' | 'FAILURE';
  page?: number;
  pageSize?: number;
}

export class AuditLogService {
  private logs: AuditLog[] = [];

  // 记录操作日志
  async logAction(
    userId: string,
    username: string,
    action: string,
    resource: string,
    resourceId: string | undefined,
    details: any,
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'Unknown',
    status: 'SUCCESS' | 'FAILURE' = 'SUCCESS',
    errorMessage?: string
  ): Promise<void> {
    const log: AuditLog = {
      id: Date.now().toString(),
      userId,
      username,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      status,
      errorMessage
    };

    this.logs.push(log);
    
    // 模拟异步保存到数据库
    await this.saveToDatabase(log);
  }

  // 模拟保存到数据库
  private async saveToDatabase(log: AuditLog): Promise<void> {
    // 这里应该调用真实的数据库API
    console.log('保存审计日志到数据库:', log);
  }

  // 查询操作日志
  async queryLogs(filter: AuditLogFilter): Promise<{ logs: AuditLog[]; total: number }> {
    let filteredLogs = [...this.logs];

    // 应用过滤条件
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }

    if (filter.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action);
    }

    if (filter.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filter.resource);
    }

    if (filter.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!);
    }

    if (filter.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!);
    }

    if (filter.status) {
      filteredLogs = filteredLogs.filter(log => log.status === filter.status);
    }

    const total = filteredLogs.length;

    // 分页
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedLogs = filteredLogs.slice(start, end);

    return {
      logs: paginatedLogs,
      total
    };
  }

  // 获取日志统计信息
  async getLogStatistics(): Promise<{
    totalLogs: number;
    successCount: number;
    failureCount: number;
    actionStats: { [key: string]: number };
    resourceStats: { [key: string]: number };
    dailyStats: { [key: string]: number };
  }> {
    const totalLogs = this.logs.length;
    const successCount = this.logs.filter(log => log.status === 'SUCCESS').length;
    const failureCount = this.logs.filter(log => log.status === 'FAILURE').length;

    // 按操作类型统计
    const actionStats: { [key: string]: number } = {};
    this.logs.forEach(log => {
      actionStats[log.action] = (actionStats[log.action] || 0) + 1;
    });

    // 按资源类型统计
    const resourceStats: { [key: string]: number } = {};
    this.logs.forEach(log => {
      resourceStats[log.resource] = (resourceStats[log.resource] || 0) + 1;
    });

    // 按日期统计
    const dailyStats: { [key: string]: number } = {};
    this.logs.forEach(log => {
      const dateKey = log.timestamp.toISOString().split('T')[0];
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
    });

    return {
      totalLogs,
      successCount,
      failureCount,
      actionStats,
      resourceStats,
      dailyStats
    };
  }

  // 清理旧日志
  async cleanupOldLogs(daysToKeep: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialCount = this.logs.length;
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate);
    const removedCount = initialCount - this.logs.length;

    console.log(`清理了 ${removedCount} 条旧日志`);
    return removedCount;
  }

  // 导出日志
  async exportLogs(filter: AuditLogFilter, format: 'csv' | 'json' | 'excel'): Promise<string> {
    const { logs } = await this.queryLogs(filter);

    switch (format) {
      case 'csv':
        return this.exportToCSV(logs);
      case 'json':
        return this.exportToJSON(logs);
      case 'excel':
        return this.exportToExcel(logs);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  private exportToCSV(logs: AuditLog[]): string {
    const headers = ['ID', '用户ID', '用户名', '操作', '资源', '资源ID', '详情', 'IP地址', '用户代理', '时间', '状态', '错误信息'];
    const rows = logs.map(log => [
      log.id,
      log.userId,
      log.username,
      log.action,
      log.resource,
      log.resourceId || '',
      JSON.stringify(log.details),
      log.ipAddress,
      log.userAgent,
      log.timestamp.toISOString(),
      log.status,
      log.errorMessage || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  private exportToJSON(logs: AuditLog[]): string {
    return JSON.stringify(logs, null, 2);
  }

  private exportToExcel(logs: AuditLog[]): string {
    // 这里应该使用真实的Excel生成库
    return `Excel格式导出 ${logs.length} 条日志`;
  }

  // 获取预定义的操作类型
  getActionTypes(): string[] {
    return [
      'CREATE', 'READ', 'UPDATE', 'DELETE',
      'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT',
      'APPROVE', 'REJECT', 'ASSIGN', 'TRANSFER'
    ];
  }

  // 获取预定义的资源类型
  getResourceTypes(): string[] {
    return [
      'USER', 'ROLE', 'PERMISSION', 'ORDER',
      'PRODUCT', 'CUSTOMER', 'SYSTEM', 'CONFIG'
    ];
  }
}

export const auditLogService = new AuditLogService();
