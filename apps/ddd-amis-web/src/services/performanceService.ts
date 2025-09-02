// 性能服务
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'navigation' | 'resource' | 'paint' | 'layout' | 'custom';
}

export interface PerformanceThreshold {
  name: string;
  warning: number;
  critical: number;
  unit: string;
}

export interface PerformanceReport {
  timestamp: number;
  metrics: PerformanceMetric[];
  score: number;
  recommendations: string[];
}

export class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private thresholds: PerformanceThreshold[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeThresholds();
    this.startMonitoring();
  }

  // 初始化性能阈值
  private initializeThresholds(): void {
    this.thresholds = [
      // 导航性能
      { name: 'DOMContentLoaded', warning: 1000, critical: 3000, unit: 'ms' },
      { name: 'load', warning: 2000, critical: 5000, unit: 'ms' },
      { name: 'firstContentfulPaint', warning: 1500, critical: 3000, unit: 'ms' },
      { name: 'largestContentfulPaint', warning: 2500, critical: 4000, unit: 'ms' },
      { name: 'firstInputDelay', warning: 100, critical: 300, unit: 'ms' },
      { name: 'cumulativeLayoutShift', warning: 0.1, critical: 0.25, unit: '' },
      
      // 资源性能
      { name: 'resourceLoadTime', warning: 1000, critical: 3000, unit: 'ms' },
      { name: 'resourceSize', warning: 500000, critical: 2000000, unit: 'bytes' },
      
      // 自定义指标
      { name: 'apiResponseTime', warning: 500, critical: 2000, unit: 'ms' },
      { name: 'renderTime', warning: 100, critical: 500, unit: 'ms' }
    ];
  }

  // 开始性能监控
  private startMonitoring(): void {
    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observePaintTiming();
    this.observeLayoutShift();
    this.observeFirstInput();
    this.observeLargestContentfulPaint();
  }

  // 监控导航性能
  private observeNavigationTiming(): void {
    if ('PerformanceNavigationTiming' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms', 'navigation');
        this.recordMetric('load', navigation.loadEventEnd - navigation.loadEventStart, 'ms', 'navigation');
      }
    }
  }

  // 监控资源性能
  private observeResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.recordMetric('resourceLoadTime', resourceEntry.duration, 'ms', 'resource');
              this.recordMetric('resourceSize', resourceEntry.transferSize, 'bytes', 'resource');
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', observer);
      } catch (error) {
        console.warn('资源性能监控启动失败:', error);
      }
    }
  }

  // 监控绘制性能
  private observePaintTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              const paintEntry = entry as PerformancePaintTiming;
              if (paintEntry.name === 'first-paint') {
                this.recordMetric('firstPaint', paintEntry.startTime, 'ms', 'paint');
              } else if (paintEntry.name === 'first-contentful-paint') {
                this.recordMetric('firstContentfulPaint', paintEntry.startTime, 'ms', 'paint');
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', observer);
      } catch (error) {
        console.warn('绘制性能监控启动失败:', error);
      }
    }
  }

  // 监控布局偏移
  private observeLayoutShift(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          let cumulativeLayoutShift = 0;
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              cumulativeLayoutShift += (entry as any).value;
            }
          });
          
          if (cumulativeLayoutShift > 0) {
            this.recordMetric('cumulativeLayoutShift', cumulativeLayoutShift, '', 'layout');
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', observer);
      } catch (error) {
        console.warn('布局偏移监控启动失败:', error);
      }
    }
  }

  // 监控首次输入延迟
  private observeFirstInput(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as PerformanceEventTiming;
              this.recordMetric('firstInputDelay', firstInputEntry.processingStart - firstInputEntry.startTime, 'ms', 'navigation');
            }
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.set('first-input', observer);
      } catch (error) {
        console.warn('首次输入延迟监控启动失败:', error);
      }
    }
  }

  // 监控最大内容绘制
  private observeLargestContentfulPaint(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.recordMetric('largestContentfulPaint', lastEntry.startTime, 'ms', 'paint');
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('largest-contentful-paint', observer);
      } catch (error) {
        console.warn('最大内容绘制监控启动失败:', error);
      }
    }
  }

  // 记录性能指标
  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric['category']): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      category
    };

    this.metrics.push(metric);
    
    // 检查阈值并触发警告
    this.checkThreshold(metric);
    
    // 触发指标记录事件
    this.notifyMetricRecorded(metric);
  }

  // 检查性能阈值
  private checkThreshold(metric: PerformanceMetric): void {
    const threshold = this.thresholds.find(t => t.name === metric.name);
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      this.notifyPerformanceAlert(metric, 'critical', threshold);
    } else if (metric.value >= threshold.warning) {
      this.notifyPerformanceAlert(metric, 'warning', threshold);
    }
  }

  // 通知性能警告
  private notifyPerformanceAlert(metric: PerformanceMetric, level: 'warning' | 'critical', threshold: PerformanceThreshold): void {
    const message = `性能警告 [${level.toUpperCase()}]: ${metric.name} = ${metric.value}${metric.unit}, 阈值: ${threshold[level]}${threshold.unit}`;
    
    if (level === 'critical') {
      console.error(message);
    } else {
      console.warn(message);
    }

    // 触发性能警告事件
    this.notifyPerformanceWarning(metric, level, threshold);
  }

  // 获取性能指标
  getMetrics(filter?: { category?: string; name?: string; timeRange?: { start: number; end: number } }): PerformanceMetric[] {
    let filteredMetrics = [...this.metrics];

    if (filter?.category) {
      filteredMetrics = filteredMetrics.filter(m => m.category === filter.category);
    }

    if (filter?.name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === filter.name);
    }

    if (filter?.timeRange) {
      filteredMetrics = filteredMetrics.filter(m => 
        m.timestamp >= filter.timeRange!.start && m.timestamp <= filter.timeRange!.end
      );
    }

    return filteredMetrics;
  }

  // 获取性能报告
  generatePerformanceReport(): PerformanceReport {
    const recentMetrics = this.getMetrics({
      timeRange: {
        start: Date.now() - 24 * 60 * 60 * 1000, // 最近24小时
        end: Date.now()
      }
    });

    const score = this.calculatePerformanceScore(recentMetrics);
    const recommendations = this.generateRecommendations(recentMetrics);

    return {
      timestamp: Date.now(),
      metrics: recentMetrics,
      score,
      recommendations
    };
  }

  // 计算性能分数
  private calculatePerformanceScore(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 100;

    let totalScore = 0;
    let metricCount = 0;

    metrics.forEach(metric => {
      const threshold = this.thresholds.find(t => t.name === metric.name);
      if (threshold) {
        const normalizedValue = metric.value / threshold.warning;
        const score = Math.max(0, 100 - (normalizedValue * 50));
        totalScore += score;
        metricCount++;
      }
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 100;
  }

  // 生成性能建议
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    const issues = new Map<string, number>();

    // 统计问题
    metrics.forEach(metric => {
      const threshold = this.thresholds.find(t => t.name === metric.name);
      if (threshold && metric.value > threshold.warning) {
        const count = issues.get(metric.name) || 0;
        issues.set(metric.name, count + 1);
      }
    });

    // 生成建议
    if (issues.has('firstContentfulPaint')) {
      recommendations.push('优化首屏渲染时间，减少关键资源加载');
    }

    if (issues.has('largestContentfulPaint')) {
      recommendations.push('优化最大内容绘制，优化图片和字体加载');
    }

    if (issues.has('firstInputDelay')) {
      recommendations.push('优化交互响应时间，减少主线程阻塞');
    }

    if (issues.has('cumulativeLayoutShift')) {
      recommendations.push('减少布局偏移，为图片和广告预留空间');
    }

    if (issues.has('resourceLoadTime')) {
      recommendations.push('优化资源加载，使用CDN和压缩');
    }

    if (recommendations.length === 0) {
      recommendations.push('性能表现良好，继续保持！');
    }

    return recommendations;
  }

  // 添加性能指标监听器
  onMetricRecorded(callback: (metric: PerformanceMetric) => void): () => void {
    if (!this.eventListeners.has('metricRecorded')) {
      this.eventListeners.set('metricRecorded', []);
    }

    const listeners = this.eventListeners.get('metricRecorded')!;
    listeners.push(callback);

    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // 添加性能警告监听器
  onPerformanceWarning(callback: (metric: PerformanceMetric, level: 'warning' | 'critical', threshold: PerformanceThreshold) => void): () => void {
    if (!this.eventListeners.has('performanceWarning')) {
      this.eventListeners.set('performanceWarning', []);
    }

    const listeners = this.eventListeners.get('performanceWarning')!;
    listeners.push(callback);

    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // 通知指标记录
  private notifyMetricRecorded(metric: PerformanceMetric): void {
    const listeners = this.eventListeners.get('metricRecorded') || [];
    listeners.forEach(callback => {
      try {
        callback(metric);
      } catch (error) {
        console.error('性能指标监听器执行错误:', error);
      }
    });
  }

  // 通知性能警告
  private notifyPerformanceWarning(metric: PerformanceMetric, level: 'warning' | 'critical', threshold: PerformanceThreshold): void {
    const listeners = this.eventListeners.get('performanceWarning') || [];
    listeners.forEach(callback => {
      try {
        callback(metric, level, threshold);
      } catch (error) {
        console.error('性能警告监听器执行错误:', error);
      }
    });
  }

  // 手动测量性能
  async measurePerformance(name: string, fn: () => void | Promise<void>): Promise<number> {
    const startTime = performance.now();
    
    try {
      await Promise.resolve(fn());
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(name, duration, 'ms', 'custom');
    }
    
    return performance.now() - startTime;
  }

  // 测量异步操作性能
  async measureAsyncPerformance<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(name, duration, 'ms', 'custom');
    }
  }

  // 清理旧指标
  cleanupOldMetrics(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    const cutoffTime = Date.now() - maxAge;
    const initialCount = this.metrics.length;
    
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoffTime);
    
    const removedCount = initialCount - this.metrics.length;
    console.log(`清理了 ${removedCount} 条旧性能指标`);
    
    return removedCount;
  }

  // 导出性能数据
  exportPerformanceData(format: 'json' | 'csv'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.metrics, null, 2);
      case 'csv':
        return this.convertToCSV(this.metrics);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 转换为CSV格式
  private convertToCSV(metrics: PerformanceMetric[]): string {
    const headers = ['Name', 'Value', 'Unit', 'Category', 'Timestamp'];
    const rows = metrics.map(metric => [
      metric.name,
      metric.value,
      metric.unit,
      metric.category,
      new Date(metric.timestamp).toISOString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // 停止监控
  stopMonitoring(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }

  // 重新启动监控
  restartMonitoring(): void {
    this.stopMonitoring();
    this.startMonitoring();
  }
}

export const performanceService = new PerformanceService();
