# Performance Monitoring Schema 性能监控模式

## 概述 Overview

Performance Monitoring Schema 是 DDD 元数据驱动开发平台的性能监控和度量系统规范。它提供了企业级的性能监控、指标收集、告警管理、SLA 监控和负载测试的完整解决方案。

## 架构组成 Architecture Components

### 1. 核心模式 Core Schemas

- **performance-monitoring-core.schema.json**: 简化的核心性能监控模式
- **full/performance-monitoring-specification.schema.json**: 完整的企业级性能监控规范

### 2. 组件库 Component Library

- **fields/performance-monitoring-fields.schema.json**: 可重用的字段组件库
- **operations/performance-monitoring-operations.schema.json**: 监控操作定义

### 3. 示例和文档 Examples & Documentation

- **examples/user-service-monitoring-example.json**: 用户服务监控示例
- **README.md**: 完整文档

## 主要特性 Key Features

### 🎯 指标管理 Metrics Management
- **多种指标类型**: Counter、Gauge、Histogram、Summary
- **灵活聚合**: 时间窗口、分组聚合、多种函数
- **智能采样**: 固定比率、储存池、自适应采样
- **标签管理**: 多维度标签、动态标签、标签过滤

### 📊 告警系统 Alerting System
- **条件告警**: 阈值、表达式、多条件组合
- **多级通知**: 邮件、Slack、Webhook、短信
- **告警抑制**: 时间窗口、依赖关系、静默期
- **升级机制**: 多级升级、自动升级、团队通知

### 📈 仪表板管理 Dashboard Management
- **可视化面板**: 图表、仪表盘、统计面板、表格
- **实时监控**: 自动刷新、时间范围、变量支持
- **布局管理**: 网格布局、响应式设计、面板分组
- **交互功能**: 钻取、过滤、链接跳转

### 🎯 SLA 监控 SLA Monitoring
- **服务等级目标**: 可用性、响应时间、错误率
- **错误预算**: 预算跟踪、消耗率、预警
- **燃烧率告警**: 多时间窗口、阈值配置、自动告警
- **合规报告**: 周期报告、趋势分析、历史数据

### 🚀 负载测试 Load Testing
- **测试场景**: 渐增负载、突发流量、持续压力
- **端点配置**: 权重分配、预期响应、参数化
- **性能标准**: 响应时间、吞吐量、错误率、资源利用率
- **结果分析**: 详细报告、图表展示、趋势分析

### 🔄 DDD 集成 DDD Integration
- **领域事件**: 事件监听、指标映射、业务度量
- **聚合指标**: 聚合操作、业务规则、上下文映射
- **业务规则**: 规则执行、性能监控、结果追踪
- **上下文映射**: 限界上下文、服务映射、命名空间

### 📤 数据导出 Data Export
- **多种导出器**: Prometheus、Jaeger、InfluxDB、Elasticsearch
- **批处理**: 批量导出、超时控制、队列管理
- **数据处理**: 内存限制、批量处理、压缩传输
- **可靠性**: 重试机制、错误处理、状态监控

### 🔒 安全配置 Security Configuration
- **身份认证**: JWT、API Key、OAuth 2.0
- **授权控制**: RBAC、权限管理、角色分配
- **数据保护**: 加密存储、传输加密、敏感数据脱敏
- **审计日志**: 访问日志、操作记录、合规追踪

## 使用场景 Use Cases

### 1. 微服务监控 Microservices Monitoring
```json
{
  "performanceMonitoringSpecification": {
    "metrics": [
      {
        "metricId": "service_request_total",
        "name": "service.request.total",
        "type": "COUNTER",
        "tags": {
          "service": "service_name",
          "method": "http_method",
          "status": "http_status"
        }
      }
    ]
  }
}
```

### 2. 业务指标监控 Business Metrics Monitoring
```json
{
  "domainIntegration": {
    "domainEvents": {
      "enabled": true,
      "eventTypes": ["OrderCreatedEvent", "PaymentProcessedEvent"],
      "metricMapping": [
        {
          "eventType": "OrderCreatedEvent",
          "metricName": "business.orders.created",
          "aggregation": "COUNT"
        }
      ]
    }
  }
}
```

### 3. SLA 合规监控 SLA Compliance Monitoring
```json
{
  "slaDefinitions": [
    {
      "slaId": "api_availability",
      "name": "API 可用性 SLA",
      "objectives": [
        {
          "name": "服务可用性",
          "metricName": "service.request.total",
          "targetValue": 0.999,
          "operator": "GTE",
          "compliance": 0.999
        }
      ]
    }
  ]
}
```

## 配置示例 Configuration Examples

### 全局配置 Global Configuration
```json
{
  "globalConfiguration": {
    "collection": {
      "interval": "10s",
      "batchSize": 1000,
      "enableCompression": true
    },
    "storage": {
      "backend": "PROMETHEUS",
      "retention": {
        "shortTerm": {"duration": 7, "unit": "DAYS"},
        "longTerm": {"duration": 6, "unit": "MONTHS"}
      }
    },
    "alerting": {
      "evaluationInterval": "30s",
      "groupWait": "10s",
      "repeatInterval": "4h"
    }
  }
}
```

### 指标定义 Metric Definition
```json
{
  "metrics": [
    {
      "metricId": "request_duration",
      "name": "request.duration",
      "type": "HISTOGRAM",
      "unit": "MILLISECONDS",
      "description": "请求响应时间分布",
      "sampling": {
        "strategy": "RESERVOIR",
        "rate": 0.5
      },
      "aggregation": {
        "functions": ["AVG", "P95", "P99"],
        "timeWindow": {
          "duration": 1,
          "unit": "MINUTES"
        }
      }
    }
  ]
}
```

### 告警规则 Alert Rule
```json
{
  "alertRules": [
    {
      "ruleId": "high_error_rate",
      "name": "高错误率告警",
      "metricName": "request.total",
      "condition": {
        "aggregation": "RATE",
        "threshold": {"value": 0.05, "operator": "GT"},
        "expression": "rate(request_total{status=~\"5..\"}[5m]) > 0.05"
      },
      "severity": "CRITICAL",
      "notifications": [
        {
          "type": "EMAIL",
          "target": "ops-team@example.com"
        },
        {
          "type": "SLACK",
          "target": "#alerts-critical"
        }
      ]
    }
  ]
}
```

## 集成指南 Integration Guide

### 1. Spring Boot 集成 Spring Boot Integration

#### 依赖配置 Dependencies
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
</dependency>
```

#### 配置文件 Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: "prometheus,health,metrics"
  metrics:
    export:
      prometheus:
        enabled: true
        step: 10s
    tags:
      application: ${spring.application.name}
      environment: ${spring.profiles.active}
```

### 2. Prometheus 集成 Prometheus Integration

#### Prometheus 配置 prometheus.yml
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
    scrape_interval: 10s
```

#### 告警规则 Alerting Rules
```yaml
groups:
  - name: application.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} for {{ $labels.instance }}"
```

### 3. Grafana 仪表板 Grafana Dashboard

#### 仪表板配置 Dashboard Configuration
```json
{
  "dashboard": {
    "title": "Application Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{ method }} {{ status }}"
          }
        ]
      }
    ]
  }
}
```

## 最佳实践 Best Practices

### 1. 指标命名 Metric Naming
- 使用一致的命名约定：`{service}.{subsystem}.{measurement}`
- 包含必要的标签信息：service、environment、version
- 避免高基数标签：user_id、request_id 等

### 2. 告警设计 Alert Design
- 基于 SLI/SLO 设计告警
- 使用多时间窗口避免误报
- 设置合理的告警抑制和升级机制

### 3. 仪表板设计 Dashboard Design
- 遵循"金字塔"原则：从概览到详细
- 使用统一的视觉风格和颜色
- 提供必要的上下文和文档链接

### 4. 性能优化 Performance Optimization
- 合理设置采样率和聚合策略
- 使用批量处理减少网络开销
- 配置适当的数据保留策略

## 故障排除 Troubleshooting

### 常见问题 Common Issues

#### 1. 指标丢失 Missing Metrics
```bash
# 检查 Prometheus 目标状态
curl http://prometheus:9090/api/v1/targets

# 检查应用指标端点
curl http://app:8080/actuator/prometheus
```

#### 2. 告警不触发 Alerts Not Firing
```bash
# 检查告警规则语法
promtool check rules alert.rules.yml

# 查看告警评估状态
curl http://prometheus:9090/api/v1/alerts
```

#### 3. 仪表板无数据 Dashboard No Data
- 检查数据源配置
- 验证查询表达式
- 确认时间范围设置

### 调试工具 Debugging Tools

#### 1. Prometheus 查询 Prometheus Queries
```promql
# 检查指标可用性
up{job="my-service"}

# 查看指标元数据
prometheus_tsdb_symbol_table_size_bytes
```

#### 2. 日志分析 Log Analysis
```bash
# 查看应用日志
kubectl logs -f deployment/my-service

# 查看 Prometheus 日志
kubectl logs -f deployment/prometheus
```

## 扩展开发 Extension Development

### 自定义指标 Custom Metrics
```java
@Component
public class BusinessMetrics {
    private final Counter orderCounter;
    private final Timer paymentTimer;
    
    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.orderCounter = Counter.builder("business.orders.total")
            .description("Total number of orders")
            .tag("type", "order")
            .register(meterRegistry);
            
        this.paymentTimer = Timer.builder("business.payment.duration")
            .description("Payment processing time")
            .register(meterRegistry);
    }
}
```

### 自定义告警 Custom Alerts
```java
@Component
public class CustomAlertManager {
    
    @EventListener
    public void handleBusinessEvent(OrderCreatedEvent event) {
        // 自定义业务告警逻辑
        if (event.getAmount().compareTo(BigDecimal.valueOf(10000)) > 0) {
            alertService.sendAlert("Large order detected", event);
        }
    }
}
```

## 版本历史 Version History

- **v3.0**: 企业级监控系统，支持 DDD 集成、安全配置、负载测试
- **v2.0**: 增加 SLA 监控、仪表板管理、数据导出功能
- **v1.0**: 基础指标监控、告警管理功能

## 许可证 License

本项目采用 MIT 许可证，详情请参见 [LICENSE](../../../../LICENSE) 文件。

## 贡献指南 Contributing

欢迎提交问题和改进建议！请参考我们的 [贡献指南](../../../../docs/CONTRIBUTING.md) 了解更多信息。

---

*Performance Monitoring Schema - 让性能监控变得简单而强大*
