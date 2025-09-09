# API Definition Schemas v3.0

## 概述

API Definition Schemas v3.0 是DDD元数据驱动开发平台的API定义组件，提供了完整的OpenAPI 3.0集成、版本管理、契约测试和性能监控功能。

## 架构特性

### 🚀 核心功能
- **OpenAPI 3.0集成**: 完全兼容OpenAPI 3.0规范
- **DDD域模型映射**: 将API操作映射到域聚合、实体和业务规则
- **版本管理**: 语义化版本控制和向后兼容性管理
- **契约测试**: 消费者驱动的契约测试和提供者验证
- **性能监控**: SLA定义、负载测试和性能指标
- **自动文档生成**: 基于schema的API文档自动生成

### 📁 目录结构

```
api-definition.schemas/
├── full/
│   └── api-specification-v3.schema.json      # 完整功能的API规范schema
├── fields/
│   └── api-fields.schema.json                # 可复用的字段组件
├── operations/
│   └── api-operations.schema.json            # API操作定义schema
├── contract-testing/
│   └── api-contract-testing.schema.json      # 契约测试schema
├── examples/
│   └── user-management-api-v3-example.json   # 用户管理API示例
├── api-specification-core.schema.json        # 核心API规范schema
└── README.md                                 # 本文档
```

## Schema文件说明

### 1. api-specification-v3.schema.json (完整版)
- **用途**: 企业级API定义，包含所有高级功能
- **特性**: 
  - 完整的OpenAPI 3.0支持
  - 域模型集成
  - 版本管理和迁移
  - 契约测试配置
  - 性能监控和SLA定义
  - 安全配置和权限管理
  - 自动文档生成

### 2. api-specification-core.schema.json (核心版)
- **用途**: 基础API定义，适用于简单场景
- **特性**:
  - 基本OpenAPI 3.0支持
  - 简化的域映射
  - 基础版本信息
  - 核心安全配置

### 3. api-fields.schema.json (字段组件)
- **用途**: 可复用的字段定义和验证规则
- **包含**:
  - 标准数据类型 (ID、版本号、时间戳等)
  - 域模型类型 (聚合名、实体名、事件名等)
  - 验证模式 (邮箱、URL、正则表达式等)
  - 性能阈值和安全配置

### 4. api-operations.schema.json (操作定义)
- **用途**: 详细的API操作定义，包含域集成
- **特性**:
  - 操作级别的域映射
  - 业务逻辑和规则定义
  - 性能配置文件
  - 契约测试定义
  - 参数和响应的域验证

### 5. api-contract-testing.schema.json (契约测试)
- **用途**: 消费者驱动的契约测试配置
- **支持**:
  - Pact框架集成
  - 提供者状态管理
  - 模拟服务配置
  - 验证设置和CI/CD集成

## 使用指南

### 基础使用

```json
{
  "apiSpecification": {
    "metadata": {
      "id": "my_api",
      "name": "My API",
      "version": "3.0.0",
      "category": "domain_api",
      "boundedContext": "MyDomain"
    },
    "openApiDefinition": {
      "openapi": "3.0.3",
      "info": {
        "title": "My API",
        "version": "3.0.0"
      },
      "paths": {
        "/users": {
          "get": {
            "operationId": "listUsers",
            "responses": {
              "200": {
                "description": "Success"
              }
            }
          }
        }
      }
    },
    "domainMapping": {
      "boundedContext": "UserManagement"
    }
  }
}
```

### 域模型集成

```json
{
  "domainIntegration": {
    "aggregateMapping": {
      "User": {
        "operations": ["createUser", "updateUser"],
        "events": ["UserCreated", "UserUpdated"]
      }
    },
    "businessRuleIntegration": {
      "validationRules": [
        {
          "ruleId": "BR_UNIQUE_EMAIL",
          "operations": ["createUser"],
          "enforcement": "domain_layer"
        }
      ]
    }
  }
}
```

### 契约测试配置

```json
{
  "contractTesting": {
    "enabled": true,
    "testingFramework": {
      "name": "pact",
      "configuration": {
        "publishResults": true
      }
    },
    "consumerContracts": [
      {
        "consumer": "frontend-app",
        "contractId": "user-api-contract",
        "interactions": [
          {
            "description": "Get user by ID",
            "request": {
              "method": "GET",
              "path": "/users/123"
            },
            "response": {
              "status": 200
            }
          }
        ]
      }
    ]
  }
}
```

## 验证和集成

### Schema验证
使用JSON Schema验证器验证API定义：

```bash
# 安装ajv-cli
npm install -g ajv-cli

# 验证API定义
ajv validate -s api-specification-v3.schema.json -d my-api-definition.json
```

### 生成OpenAPI文档
从DDD API定义生成标准OpenAPI文档：

```javascript
// 提取OpenAPI定义
const apiSpec = require('./my-api-definition.json');
const openApiDoc = apiSpec.apiSpecification.openApiDefinition;

// 生成Swagger UI
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
```

### 契约测试集成
与Pact等契约测试框架集成：

```javascript
// 消费者测试
const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'frontend-app',
  provider: 'user-api',
  // 从API定义中提取契约配置
});
```

## 最佳实践

### 1. API设计原则
- 遵循RESTful设计原则
- 使用语义化版本控制
- 实现幂等性操作
- 提供清晰的错误处理

### 2. 域模型映射
- 每个API操作映射到明确的域概念
- 使用命令查询责任分离(CQRS)模式
- 定义清晰的聚合边界
- 实现域事件发布

### 3. 版本管理
- 使用URL路径进行主版本控制
- 实现向后兼容的API演进
- 提供清晰的弃用时间表
- 自动化迁移指南生成

### 4. 契约测试
- 实施消费者驱动的契约测试
- 在CI/CD流水线中集成契约验证
- 维护契约注册表
- 实现提供者状态管理

### 5. 性能监控
- 定义明确的SLA指标
- 实施性能测试自动化
- 监控API使用模式
- 实现主动告警机制

## 工具支持

### 开发工具
- **VS Code插件**: JSON Schema验证和自动完成
- **IDEA插件**: API定义语法高亮和验证
- **Postman集合**: 自动生成API测试集合

### CI/CD集成
- **GitHub Actions**: 自动化schema验证和契约测试
- **Jenkins Pipeline**: API文档生成和部署
- **Docker**: 容器化API文档服务

### 监控工具
- **Prometheus**: API性能指标收集
- **Grafana**: API性能仪表盘
- **ELK Stack**: API日志分析

## 扩展性

### 自定义字段
可以扩展现有schema以支持特定需求：

```json
{
  "customExtensions": {
    "x-rate-limiting": {
      "requests-per-minute": 100
    },
    "x-caching": {
      "ttl-seconds": 300
    }
  }
}
```

### 插件机制
支持通过插件扩展功能：

```json
{
  "plugins": [
    {
      "name": "api-security-analyzer",
      "version": "1.0.0",
      "configuration": {}
    }
  ]
}
```

## 相关资源

- [OpenAPI 3.0规范](https://swagger.io/specification/)
- [JSON Schema规范](https://json-schema.org/)
- [Pact契约测试](https://docs.pact.io/)
- [DDD参考架构](../../../docs/implementation-plan.md)

## 更新日志

### v3.0.0 (2024-01-15)
- ✨ 新增OpenAPI 3.0完整支持
- ✨ 增强域模型集成功能
- ✨ 添加契约测试框架
- ✨ 实现性能监控配置
- ✨ 支持自动文档生成
- 🔧 优化schema结构和验证规则
- 📚 完善文档和示例

### v2.1.0 (2023-12-01)
- ✨ 添加基础版本管理
- 🐛 修复schema验证问题
- 📚 更新文档

### v2.0.0 (2023-11-01)
- 🎉 初始版本发布
- ✨ 基础API定义功能
- ✨ 简单域模型映射
