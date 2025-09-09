# Domain Events Schemas

## 概述

领域事件(Domain Events)架构为DDD元数据平台提供完整的事件驱动架构支持，实现领域事件与业务规则的深度集成。

## 架构结构

```
domain-events.schemas/
├── domain-event.schema.json          # 主要领域事件Schema
├── full/
│   └── domain-event-rule.schema.json # 完整的事件-规则集成Schema
├── fields/
│   └── domain-event-fields.schema.json # 可复用字段组件
├── operations/
│   └── domain-event-operations.schema.json # 事件操作定义
├── examples/
│   └── order-created-event-example.json # 完整示例
└── README.md                         # 本文档
```

## 核心功能

### 1. 领域事件建模 (Domain Event Modeling)

- **事件元数据**: 标识、版本、分类、优先级管理
- **事件定义**: 事件类型、聚合根关联、因果关系追踪  
- **事件载荷**: Schema验证、数据类型映射、序列化配置
- **事件溯源**: 完整的事件存储和重放能力

### 2. 业务规则集成 (Business Rule Integration)

- **规则触发**: 事件驱动的业务规则自动执行
- **执行策略**: 同步/异步、并行/串行执行模式
- **上下文数据**: 事件数据、聚合状态、历史数据、外部数据集成
- **结果处理**: 规则执行结果聚合、发布、存储

### 3. 高级规则模式 (Advanced Rule Patterns)

- **前置规则**: 事件发布前的验证和预处理
- **后置规则**: 事件发布后的响应和级联操作
- **条件规则**: 复杂条件树和依赖关系处理
- **级联规则**: 规则链式触发和事件级联
- **Saga集成**: 长事务管理和补偿模式

### 4. 事件驱动验证 (Event-Driven Validation)

- **多层验证**: Schema验证、业务验证、自定义验证
- **验证时机**: 预事件、后事件、异步验证
- **错误处理**: 自动修复、建议、升级机制
- **批量验证**: 批处理和并行验证支持

### 5. 异步处理 (Async Processing)

- **处理策略**: 队列、流、Actor模式
- **分区支持**: 按键分区保证顺序性
- **背压处理**: 缓冲、回退、熔断策略
- **死信处理**: 失败重试和死信队列

### 6. 扩展事件溯源 (Extended Event Sourcing)

- **事件版本**: 版本迁移和兼容性管理
- **投影支持**: 读模型投影和重建策略
- **快照机制**: 聚合状态快照和压缩
- **重放能力**: 历史事件重放和时间点恢复

### 7. 监控和审计 (Monitoring & Audit)

- **指标收集**: 标准指标和自定义指标
- **链路追踪**: 分布式追踪和传播
- **日志记录**: 结构化日志和敏感数据脱敏
- **告警机制**: 规则配置和多渠道通知
- **审计跟踪**: 合规性审计和数据保留

## Schema文件说明

### domain-event.schema.json
基础领域事件Schema，定义核心事件结构和基本的业务规则集成能力。

**核心定义**:
- `DomainEvent`: 主事件结构
- `EventMetadata`: 事件元数据
- `EventDefinition`: 事件定义
- `EventPayload`: 事件载荷
- `BusinessRuleIntegration`: 业务规则集成
- `EventSourcing`: 事件溯源配置
- `EventProcessing`: 事件处理配置
- `EventMonitoring`: 监控配置

### domain-event-rule.schema.json
完整的事件规则集成Schema，扩展基础Schema提供高级规则模式支持。

**扩展定义**:
- `DomainEventWithRules`: 带规则集成的完整事件
- `AdvancedRuleIntegration`: 高级规则集成
- `EventDrivenValidation`: 事件驱动验证
- `AsyncEventProcessing`: 异步事件处理
- `ExtendedEventSourcing`: 扩展事件溯源
- `EventAuditTrail`: 事件审计跟踪

### domain-event-fields.schema.json
可复用的字段组件Schema，提供标准化的数据类型和验证规则。

**字段组件**:
- `EventIdentifier`: 标准事件标识符
- `EventMetrics`: 事件指标配置
- `EventSecurity`: 事件安全配置
- `EventRouting`: 事件路由配置
- `EventValidation`: 事件验证配置

### domain-event-operations.schema.json
事件操作Schema，定义各种事件操作的配置和实现。

**操作类型**:
- `EventPublishingOperation`: 事件发布操作
- `EventConsumptionOperation`: 事件消费操作
- `EventTransformationOperation`: 事件转换操作
- `RuleExecutionOperation`: 规则执行操作

## 使用示例

### 基础事件定义

```json
{
  "domainEvent": {
    "metadata": {
      "id": "user_registered",
      "name": "User Registration Event",
      "version": "1.0.0",
      "category": "domain"
    },
    "definition": {
      "eventType": "created",
      "aggregateRoot": {
        "type": "User",
        "id": "user-123"
      }
    },
    "payload": {
      "schema": {
        "type": "object",
        "properties": {
          "userId": {"type": "string"},
          "email": {"type": "string"},
          "registrationDate": {"type": "string", "format": "date-time"}
        }
      }
    }
  }
}
```

### 带业务规则的事件

```json
{
  "domainEventWithRules": {
    "metadata": {...},
    "definition": {...},
    "payload": {...},
    "businessRuleIntegration": {
      "triggeredRules": [
        {
          "ruleId": "BR_WELCOME_EMAIL",
          "condition": {
            "expression": "email != null",
            "language": "SPEL"
          },
          "priority": 1,
          "async": true
        }
      ]
    }
  }
}
```

## 集成指南

### 1. 与业务规则集成

领域事件可以触发以下类型的业务规则：
- **规格模式**: 复杂业务条件验证
- **策略模式**: 业务策略选择和执行  
- **不变量**: 业务不变量检查
- **验证规则**: 数据完整性验证
- **计算规则**: 业务计算和公式
- **工作流规则**: 业务流程控制

### 2. 与统一语言域集成

事件定义直接关联统一语言域中的术语：
- 事件名称映射业务术语
- 聚合根对应领域实体
- 事件载荷字段关联业务概念

### 3. 与战术设计集成

事件与DDD战术设计元素深度集成：
- **聚合**: 事件由聚合根产生
- **实体**: 实体状态变更触发事件
- **值对象**: 作为事件载荷数据
- **领域服务**: 处理跨聚合事件

## 最佳实践

### 1. 事件命名约定
- 使用过去时态: `OrderCreated`, `PaymentProcessed`
- 包含业务含义: `CustomerRegistered` 而不是 `DataInserted`
- 保持一致性: 统一的命名模式

### 2. 事件载荷设计
- 包含必要的业务数据
- 避免包含敏感信息
- 保持向后兼容性
- 使用值对象封装相关数据

### 3. 规则集成策略
- 明确同步vs异步执行
- 设计合理的补偿机制
- 避免循环依赖
- 保证幂等性

### 4. 性能优化
- 合理使用批处理
- 实施缓存策略
- 监控关键指标
- 优化序列化性能

### 5. 错误处理
- 设计重试策略
- 实施熔断机制
- 配置死信队列
- 建立告警机制

## 版本历史

- **v3.0.0** (2025-09-08): 完整的事件-规则集成架构
  - 新增高级规则模式支持
  - 实现事件驱动验证机制
  - 扩展异步处理能力
  - 增强监控和审计功能

- **v2.0.0**: 基础事件溯源支持
- **v1.0.0**: 初始版本，基础事件建模

## 相关文档

- [业务规则建模文档](../ubiquitous-language.schemas/README.md)
- [战术设计文档](../tactical-design.schemas/README.md)
- [验证规则文档](../validation.schemas/README.md)
- [API定义文档](../api-definition.schemas/README.md)

## 技术支持

如有问题或建议，请联系：
- 架构团队: architecture@company.com
- 开发团队: development@company.com
