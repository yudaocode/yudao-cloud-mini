# DTO映射Schema v3.0

## 概述

DTO映射Schema v3.0提供了完整的数据传输对象映射和转换规则定义系统，支持企业级的自动映射、复杂数据转换、映射验证和性能优化。

## 目录结构

```
dto-mapping.schemas/
├── dto-mapping-core.schema.json          # 简化核心映射Schema
├── full/
│   └── dto-mapping-specification.schema.json  # 完整企业级映射规范
├── fields/
│   └── dto-mapping-fields.schema.json    # 可复用字段组件
├── operations/
│   └── dto-mapping-operations.schema.json # 映射操作定义
├── examples/
│   └── user-entity-dto-mapping-example.json # 完整示例
└── README.md                             # 本文档
```

## 核心特性

### 1. 自动映射规则
- **直接映射**: 字段名相同的自动映射
- **路径映射**: 支持嵌套对象和数组索引的复杂路径映射
- **类型转换**: 自动类型转换和格式化
- **默认值**: 空值处理和默认值设置

### 2. 复杂数据转换
- **聚合转换**: 多个源字段合并为单个目标字段
- **拆分转换**: 单个源字段拆分为多个目标字段
- **条件转换**: 基于条件的动态映射
- **自定义转换**: JavaScript/Java/Groovy脚本支持

### 3. 映射验证和测试
- **字段验证**: 格式、范围、必填等验证规则
- **映射验证**: 映射完整性和一致性检查
- **单元测试**: 内置测试框架支持
- **性能测试**: 批量数据映射性能测试

### 4. 性能优化策略
- **缓存机制**: 多级缓存和智能缓存策略
- **批处理**: 批量映射和并行处理
- **异步映射**: 非阻塞异步映射支持
- **内存优化**: 流式处理和内存池管理

### 5. 多格式序列化
- **JSON**: 标准JSON序列化/反序列化
- **XML**: XML格式支持
- **Protocol Buffers**: 高性能二进制格式
- **Avro**: 模式演进支持的序列化

## 映射类型

### 1. 实体类型映射
- **ENTITY_TO_DTO**: 领域实体到数据传输对象
- **DTO_TO_ENTITY**: 数据传输对象到领域实体
- **AGGREGATE_TO_DTO**: 聚合根到DTO映射
- **DTO_TO_COMMAND**: DTO到命令对象映射

### 2. 转换策略
- **STRICT**: 严格模式，所有字段必须映射
- **LENIENT**: 宽松模式，允许部分字段缺失
- **IGNORE_UNKNOWN**: 忽略未知字段
- **FAIL_ON_NULL**: 空值时抛出异常

## 使用示例

### 基本映射定义

```json
{
  "mappingDefinition": {
    "metadata": {
      "id": "user-basic-mapping",
      "name": "用户基本映射",
      "version": "1.0.0"
    },
    "sourceType": "com.example.domain.User",
    "targetType": "com.example.dto.UserDTO",
    "fieldMappings": [
      {
        "sourceField": "id",
        "targetField": "userId",
        "mappingType": "DIRECT"
      },
      {
        "sourceField": "profile.email",
        "targetField": "email",
        "mappingType": "TRANSFORM",
        "transform": {
          "function": "maskEmail",
          "parameters": {"visibleChars": 3}
        }
      }
    ]
  }
}
```

### 复杂转换映射

```json
{
  "fieldMappings": [
    {
      "sourceField": "personalInfo",
      "targetField": "fullName",
      "mappingType": "AGGREGATE",
      "transform": {
        "expression": "personalInfo.firstName + ' ' + personalInfo.lastName"
      }
    },
    {
      "sourceField": "roles",
      "targetField": "roleNames",
      "mappingType": "TRANSFORM",
      "transform": {
        "function": "extractNames",
        "language": "JAVASCRIPT",
        "script": "function extractNames(roles) { return roles.map(r => r.name); }"
      }
    }
  ]
}
```

### 条件映射

```json
{
  "fieldMappings": [
    {
      "sourceField": "sensitive.data",
      "targetField": "maskedData",
      "mappingType": "CONDITIONAL",
      "condition": "hasPermission('VIEW_SENSITIVE')",
      "transform": {
        "function": "maskSensitiveData"
      },
      "defaultValue": "***"
    }
  ]
}
```

## DDD集成

### 领域事件集成
```json
{
  "domainIntegration": {
    "domainEvents": [
      {
        "eventType": "UserMappedEvent",
        "trigger": "AFTER_MAPPING",
        "condition": "mappingResult.isSuccess()"
      }
    ]
  }
}
```

### 业务规则集成
```json
{
  "businessRules": [
    {
      "ruleId": "email-privacy-rule",
      "ruleType": "TRANSFORMATION",
      "expression": "if (!hasPermission('VIEW_EMAIL')) { return maskEmail(email); }",
      "priority": 1
    }
  ]
}
```

### 上下文映射
```json
{
  "contextMapping": {
    "boundedContext": "UserManagement",
    "relationships": [
      {
        "contextName": "Authentication",
        "relationship": "CUSTOMER_SUPPLIER"
      }
    ]
  }
}
```

## 性能配置

### 缓存配置
```json
{
  "performanceSettings": {
    "enableCaching": true,
    "cacheProvider": "REDIS",
    "defaultCacheTtl": 300,
    "cacheKey": "user-dto:#{sourceObject.id}:#{currentUser.roles}"
  }
}
```

### 批处理配置
```json
{
  "batchOperations": [
    {
      "batchId": "bulk-user-mapping",
      "batchStrategy": "PARALLEL",
      "performanceConfig": {
        "batchSize": 100,
        "maxConcurrency": 5,
        "timeout": 30000
      }
    }
  ]
}
```

## 安全配置

### 数据分类和访问控制
```json
{
  "securityConfig": {
    "dataClassification": "INTERNAL",
    "accessControl": {
      "requiredRoles": ["USER_VIEWER"],
      "requiredPermissions": ["READ_USER_PROFILE"]
    },
    "encryption": {
      "enabled": true,
      "algorithm": "AES-256"
    }
  }
}
```

### 审计日志
```json
{
  "securitySettings": {
    "enableAuditLogging": true,
    "auditProvider": "DATABASE",
    "auditLevel": "DETAILED"
  }
}
```

## 测试支持

### 单元测试
```json
{
  "testCases": [
    {
      "name": "正常用户映射测试",
      "input": {
        "id": 123,
        "username": "testuser"
      },
      "expectedOutput": {
        "userId": 123,
        "username": "testuser"
      },
      "assertions": [
        {
          "field": "userId",
          "operator": "EQUALS",
          "expectedValue": 123
        }
      ]
    }
  ]
}
```

### 性能测试
```json
{
  "performanceTests": [
    {
      "name": "批量映射性能测试",
      "dataSize": 1000,
      "maxLatency": 5000,
      "minThroughput": 200
    }
  ]
}
```

## 监控和告警

### 度量指标
```json
{
  "monitoring": {
    "metrics": {
      "enabled": true,
      "provider": "MICROMETER",
      "customMetrics": [
        {
          "name": "dto_mapping_duration",
          "type": "TIMER",
          "description": "DTO映射执行时间"
        }
      ]
    }
  }
}
```

### 告警规则
```json
{
  "alerting": {
    "rules": [
      {
        "name": "高错误率告警",
        "condition": "dto_mapping_errors_rate > 0.05",
        "severity": "WARNING",
        "actions": [
          {
            "type": "EMAIL",
            "target": "admin@example.com"
          }
        ]
      }
    ]
  }
}
```

## 最佳实践

### 1. 映射设计原则
- **单一职责**: 每个映射操作只负责一种转换
- **幂等性**: 多次执行映射应产生相同结果
- **可测试性**: 提供充分的测试用例
- **性能优先**: 考虑缓存和批处理策略

### 2. 安全考虑
- **数据脱敏**: 敏感数据必须脱敏处理
- **权限控制**: 基于角色的字段访问控制
- **审计跟踪**: 记录映射操作的审计日志
- **加密存储**: 敏感字段的加密存储

### 3. 性能优化
- **缓存策略**: 合理使用缓存减少重复计算
- **批处理**: 大量数据使用批处理模式
- **异步处理**: 非关键路径使用异步映射
- **内存管理**: 避免内存泄露和大对象

### 4. 错误处理
- **优雅降级**: 映射失败时的备用策略
- **错误恢复**: 自动重试和错误恢复机制
- **日志记录**: 详细的错误日志和调试信息
- **监控告警**: 及时发现和处理异常

## 扩展和集成

### 框架集成
- **Spring Boot**: 自动配置和依赖注入
- **MapStruct**: 编译时代码生成
- **Jackson**: JSON序列化定制
- **Hibernate**: ORM实体映射

### 工具支持
- **IDE插件**: VS Code/IntelliJ插件支持
- **代码生成**: 自动生成映射代码
- **文档生成**: 自动生成映射文档
- **测试工具**: 映射测试工具集

## 版本历史

- **v3.0.0**: 企业级功能完整版本
  - 新增批处理和异步映射支持
  - 增强安全和监控功能
  - 完善DDD集成和业务规则支持
  - 优化性能和缓存机制

- **v2.0.0**: 功能增强版本
  - 添加复杂转换和条件映射
  - 增加验证和测试框架
  - 支持多种序列化格式

- **v1.0.0**: 基础版本
  - 基本映射功能
  - 简单类型转换
  - 基础验证支持

## 许可证

本Schema遵循MIT许可证，可自由使用和修改。

## 贡献指南

欢迎提交Issues和Pull Requests来改进这个Schema定义。请确保：

1. 遵循JSON Schema draft-07规范
2. 提供充分的示例和文档
3. 包含适当的测试用例
4. 保持向后兼容性

## 技术支持

- 文档站点: https://docs.ddd-platform.com/dto-mapping
- 社区论坛: https://community.ddd-platform.com
- GitHub Issues: https://github.com/ddd-platform/schemas/issues
- 邮件支持: support@ddd-platform.com
