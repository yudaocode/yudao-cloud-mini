# DDD元数据驱动开发平台 - 使用示例和最佳实践

## 📋 概述

本文档提供了DDD元数据驱动开发平台的使用示例和最佳实践，帮助开发者更好地理解和使用各个Schema文件。

## 🎯 使用场景

### 1. 电商领域示例

#### 1.1 统一语言定义

```json
{
  "version": "2.0.0",
  "domainId": "domain_ecommerce",
  "businessTerms": [
    {
      "id": "term_order",
      "name": "订单",
      "englishName": "Order",
      "description": "客户购买商品时创建的订单",
      "category": "DOMAIN_CONCEPT",
      "attributes": ["attr_order_id", "attr_order_amount", "attr_order_status"],
      "relatedTerms": ["term_customer", "term_product"],
      "examples": ["用户下单购买iPhone", "订单状态从待付款变为已付款"],
      "isCore": true,
      "priority": "HIGH"
    },
    {
      "id": "term_customer",
      "name": "客户",
      "englishName": "Customer",
      "description": "购买商品的用户",
      "category": "DOMAIN_CONCEPT",
      "attributes": ["attr_customer_id", "attr_customer_name", "attr_customer_email"],
      "relatedTerms": ["term_order"],
      "isCore": true,
      "priority": "HIGH"
    }
  ],
  "businessAttributes": [
    {
      "id": "attr_order_id",
      "name": "订单ID",
      "description": "订单的唯一标识符",
      "dataType": "String",
      "constraints": {
        "minLength": 1,
        "maxLength": 50,
        "pattern": "^ORD\\d{8}$"
      },
      "isRequired": true,
      "isUnique": true
    },
    {
      "id": "attr_order_amount",
      "name": "订单金额",
      "description": "订单的总金额",
      "dataType": "BigDecimal",
      "unit": "元",
      "constraints": {
        "minValue": 0.01,
        "maxValue": 999999.99
      },
      "isRequired": true
    },
    {
      "id": "attr_order_status",
      "name": "订单状态",
      "description": "订单的当前状态",
      "dataType": "Enum",
      "customType": "OrderStatus",
      "constraints": {
        "allowedValues": ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]
      },
      "isRequired": true
    }
  ]
}
```

#### 1.2 战略设计定义

```json
{
  "version": "2.0.0",
  "domainId": "domain_ecommerce",
  "boundedContexts": [
    {
      "id": "bc_order_management",
      "name": "订单管理",
      "description": "负责订单的创建、修改、查询和状态管理",
      "subdomainId": "subdomain_core",
      "type": "CORE",
      "ubiquitousLanguage": ["term_order", "term_customer"],
      "businessCapabilities": [
        {
          "id": "cap_order_creation",
          "name": "订单创建",
          "description": "创建新订单的能力"
        },
        {
          "id": "cap_order_status_management",
          "name": "订单状态管理",
          "description": "管理订单状态变更的能力"
        }
      ],
      "team": {
        "id": "team_order",
        "name": "订单团队",
        "size": 8,
        "roles": ["Product Owner", "Tech Lead", "Developer", "QA"]
      },
      "technologyStack": {
        "id": "tech_order",
        "languages": ["Java", "TypeScript"],
        "frameworks": ["Spring Boot", "React"],
        "databases": ["PostgreSQL", "Redis"]
      }
    }
  ],
  "contextMappings": [
    {
      "id": "mapping_order_customer",
      "sourceContextId": "bc_order_management",
      "targetContextId": "bc_customer_management",
      "pattern": "CUSTOMER_SUPPLIER",
      "contracts": [
        {
          "id": "contract_customer_info",
          "name": "客户信息契约",
          "description": "订单管理上下文获取客户信息的契约"
        }
      ]
    }
  ]
}
```

#### 1.3 战术设计定义

```json
{
  "version": "2.0.0",
  "domainId": "domain_ecommerce",
  "aggregates": [
    {
      "id": "agg_order",
      "name": "订单聚合",
      "description": "订单聚合根，管理订单及其相关实体",
      "termId": "term_order",
      "rootEntityId": "entity_order",
      "invariants": [
        {
          "id": "inv_order_amount_positive",
          "description": "订单金额必须大于0",
          "expression": "amount > 0"
        }
      ],
      "entityIds": ["entity_order", "entity_order_item"],
      "valueObjectIds": ["vo_money", "vo_order_status"]
    }
  ],
  "entities": [
    {
      "id": "entity_order",
      "name": "订单",
      "description": "订单实体，订单聚合的根实体",
      "termId": "term_order",
      "aggregateId": "agg_order",
      "isRoot": true,
      "identity": {
        "id": "identity_order_id",
        "type": "String",
        "pattern": "^ORD\\d{8}$"
      },
      "attributes": [
        {
          "id": "attr_order_id",
          "name": "订单ID",
          "businessAttributeId": "attr_order_id",
          "isIdentity": true,
          "isRequired": true
        },
        {
          "id": "attr_order_amount",
          "name": "订单金额",
          "businessAttributeId": "attr_order_amount",
          "isRequired": true
        }
      ],
      "methods": [
        {
          "id": "method_create_order",
          "name": "createOrder",
          "description": "创建新订单",
          "visibility": "PUBLIC",
          "parameters": [
            {
              "id": "param_customer_id",
              "name": "customerId",
              "type": "String",
              "isRequired": true
            }
          ],
          "returnType": "Order"
        }
      ]
    }
  ],
  "valueObjects": [
    {
      "id": "vo_money",
      "name": "金额",
      "description": "表示货币金额的值对象",
      "termId": "term_money",
      "isImmutable": true,
      "attributes": [
        {
          "id": "attr_amount",
          "name": "金额值",
          "businessAttributeId": "attr_order_amount",
          "isRequired": true
        },
        {
          "id": "attr_currency",
          "name": "货币类型",
          "businessAttributeId": "attr_currency",
          "isRequired": true
        }
      ]
    }
  ]
}
```

#### 1.4 DTO定义

```json
{
  "version": "2.0.0",
  "boundedContextId": "bc_order_management",
  "dataTransferObjects": [
    {
      "id": "dto_order_create_request",
      "name": "订单创建请求DTO",
      "description": "创建订单时的请求数据传输对象",
      "englishName": "OrderCreateRequestDTO",
      "type": "REQUEST",
      "layer": "APPLICATION",
      "purpose": "CREATE",
      "attributes": [
        {
          "id": "attr_customer_id",
          "name": "客户ID",
          "businessAttributeId": "attr_customer_id",
          "isRequired": true
        },
        {
          "id": "attr_items",
          "name": "商品列表",
          "businessAttributeId": "attr_order_items",
          "isCollection": true,
          "collectionType": "LIST"
        }
      ],
      "validationRules": ["rule_customer_exists", "rule_items_not_empty"],
      "serialization": {
        "id": "serialization_json",
        "format": "JSON",
        "library": "JACKSON"
      },
      "version": "1.0.0",
      "isActive": true
    },
    {
      "id": "dto_order_response",
      "name": "订单响应DTO",
      "description": "订单查询结果的响应数据传输对象",
      "englishName": "OrderResponseDTO",
      "type": "RESPONSE",
      "layer": "APPLICATION",
      "purpose": "QUERY",
      "attributes": [
        {
          "id": "attr_order_id",
          "name": "订单ID",
          "businessAttributeId": "attr_order_id",
          "isRequired": true
        },
        {
          "id": "attr_order_status",
          "name": "订单状态",
          "businessAttributeId": "attr_order_status",
          "isRequired": true
        }
      ],
      "serialization": {
        "id": "serialization_json",
        "format": "JSON",
        "library": "JACKSON"
      },
      "version": "1.0.0",
      "isActive": true
    }
  ]
}
```

#### 1.5 实现映射定义

```json
{
  "version": "2.0.0",
  "domainId": "domain_ecommerce",
  "boundedContextId": "bc_order_management",
  "architectureMapping": {
    "id": "arch_mapping_order",
    "name": "订单管理架构映射",
    "description": "订单管理限界上下文的架构映射",
    "architecturePattern": "COLA",
    "layers": {
      "presentationLayer": {
        "id": "layer_presentation",
        "name": "表现层",
        "description": "处理用户界面和API接口",
        "components": [
          {
            "id": "comp_order_controller",
            "name": "OrderController",
            "type": "CONTROLLER",
            "packageName": "com.ecommerce.order.presentation",
            "className": "OrderController"
          }
        ]
      },
      "applicationLayer": {
        "id": "layer_application",
        "name": "应用层",
        "description": "处理业务用例和协调",
        "components": [
          {
            "id": "comp_order_service",
            "name": "OrderService",
            "type": "SERVICE",
            "packageName": "com.ecommerce.order.application",
            "className": "OrderService"
          }
        ]
      },
      "domainLayer": {
        "id": "layer_domain",
        "name": "领域层",
        "description": "包含领域模型和业务逻辑",
        "components": [
          {
            "id": "comp_order_aggregate",
            "name": "Order",
            "type": "CLASS",
            "packageName": "com.ecommerce.order.domain",
            "className": "Order"
          }
        ]
      },
      "infrastructureLayer": {
        "id": "layer_infrastructure",
        "name": "基础设施层",
        "description": "处理数据持久化和外部服务",
        "components": [
          {
            "id": "comp_order_repository",
            "name": "OrderRepository",
            "type": "REPOSITORY",
            "packageName": "com.ecommerce.order.infrastructure",
            "className": "OrderRepositoryImpl"
          }
        ]
      }
    }
  },
  "persistenceMappings": [
    {
      "id": "persistence_mapping_order",
      "entityId": "entity_order",
      "tableName": "orders",
      "schema": "ecommerce",
      "columns": [
        {
          "id": "column_order_id",
          "attributeName": "orderId",
          "columnName": "order_id",
          "columnType": "VARCHAR(50)",
          "primaryKey": true,
          "nullable": false
        },
        {
          "id": "column_order_amount",
          "attributeName": "amount",
          "columnName": "amount",
          "columnType": "DECIMAL(10,2)",
          "nullable": false
        }
      ]
    }
  ]
}
```

#### 1.6 amis-screen定义

```json
{
  "version": "2.0.0",
  "domainId": "domain_ecommerce",
  "boundedContextId": "bc_order_management",
  "screens": [
    {
      "id": "screen_order_list",
      "name": "订单列表",
      "description": "显示所有订单的列表页面",
      "type": "LIST",
      "route": "/orders",
      "permissions": ["ORDER_READ"],
      "amisPage": {
        "type": "page",
        "title": "订单管理",
        "body": [
          {
            "type": "crud",
            "api": "/api/orders",
            "columns": [
              {
                "name": "orderId",
                "label": "订单ID",
                "type": "text"
              },
              {
                "name": "amount",
                "label": "订单金额",
                "type": "number"
              },
              {
                "name": "status",
                "label": "订单状态",
                "type": "mapping",
                "map": {
                  "PENDING": "待付款",
                  "PAID": "已付款",
                  "SHIPPED": "已发货",
                  "DELIVERED": "已送达",
                  "CANCELLED": "已取消"
                }
              }
            ]
          }
        ]
      },
      "modelBindings": [
        {
          "id": "binding_order_list",
          "modelType": "ENTITY",
          "modelId": "entity_order",
          "bindingType": "TABLE_COLUMNS",
          "componentPath": "body.0.columns",
          "mappingRules": [
            {
              "id": "mapping_order_id",
              "sourceField": "orderId",
              "targetField": "orderId",
              "transformation": "DIRECT"
            },
            {
              "id": "mapping_order_amount",
              "sourceField": "amount",
              "targetField": "amount",
              "transformation": "DIRECT"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🏆 最佳实践

### 1. 统一语言设计

#### 1.1 术语命名规范
- **使用业务术语**：避免技术术语，使用业务人员能理解的词汇
- **保持一致性**：在整个项目中保持术语使用的一致性
- **提供英文名称**：为国际化做准备
- **详细描述**：提供清晰的描述和示例

#### 1.2 业务属性设计
- **复用性**：设计可复用的业务属性
- **类型安全**：使用明确的数据类型
- **约束完整**：提供完整的验证约束
- **单位明确**：为数值类型指定单位

### 2. 战略设计

#### 2.1 限界上下文划分
- **业务导向**：根据业务能力划分上下文
- **团队边界**：考虑团队的组织结构
- **技术约束**：考虑技术栈和部署约束
- **演进考虑**：为未来的演进留出空间

#### 2.2 上下文映射
- **明确关系**：定义清晰的上下文间关系
- **契约设计**：设计明确的集成契约
- **数据流**：明确数据流向和转换规则

### 3. 战术设计

#### 3.1 聚合设计
- **聚合根**：每个聚合只有一个根实体
- **不变量**：定义聚合的不变量
- **边界清晰**：明确聚合的边界
- **生命周期**：管理聚合的生命周期

#### 3.2 实体设计
- **身份明确**：每个实体都有明确的身份
- **业务逻辑**：将业务逻辑放在实体中
- **状态管理**：管理实体的状态变化

#### 3.3 值对象设计
- **不可变**：值对象应该是不可变的
- **相等性**：基于值而不是身份判断相等
- **自包含**：包含验证逻辑

### 4. DTO设计

#### 4.1 分层设计
- **明确用途**：根据使用场景设计DTO
- **数据转换**：处理领域对象和DTO间的转换
- **版本管理**：管理DTO的版本演进

#### 4.2 验证设计
- **分层验证**：在不同层进行验证
- **业务规则**：包含业务规则验证
- **错误处理**：提供清晰的错误信息

### 5. 实现映射

#### 5.1 架构映射
- **架构模式**：选择合适的架构模式
- **层间依赖**：管理层间的依赖关系
- **组件设计**：设计清晰的组件接口

#### 5.2 持久化映射
- **表设计**：设计合理的数据库表结构
- **索引优化**：为查询性能设计索引
- **约束管理**：使用数据库约束保证数据完整性

### 6. 前端设计

#### 6.1 amis集成
- **组件复用**：充分利用amis组件库
- **模板设计**：设计可复用的屏幕模板
- **响应式设计**：支持多设备适配

#### 6.2 数据绑定
- **模型绑定**：建立DDD模型和UI组件的绑定
- **验证同步**：保持前后端验证的一致性
- **状态管理**：管理UI状态和数据状态

## 🔧 工具使用

### 1. Schema验证工具

```bash
# 安装依赖
npm install ajv ajv-formats

# 运行验证
node schema-validator.js
```

### 2. 代码生成

```bash
# 基于Schema生成代码
npm run generate:code

# 基于Schema生成文档
npm run generate:docs
```

### 3. 可视化工具

```bash
# 启动可视化工具
npm run start:visualizer

# 查看Schema关系图
open http://localhost:3000
```

## 📚 参考资料

- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [JSON Schema](https://json-schema.org/)
- [amis文档](https://aisuda.bce.baidu.com/amis/zh-CN/docs)
- [COLA架构](https://github.com/alibaba/COLA)

## 🤝 贡献指南

1. **遵循规范**：遵循本文档中的最佳实践
2. **示例完整**：提供完整的使用示例
3. **文档更新**：及时更新相关文档
4. **测试验证**：确保示例的正确性

---

*本文档将随着平台的发展持续更新*
