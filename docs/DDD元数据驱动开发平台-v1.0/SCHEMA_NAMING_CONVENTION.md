# JSON Schema 命名规范和组织架构

## 📋 概述

为了解决多个业务领域的Schema管理问题，建立统一的命名规范和目录组织架构。

## 🏗️ 总体架构

### 根目录结构
```
object-jsonschemas/
├── {domain-name}.schemas/           # 领域级Schema目录
│   ├── fields/                      # 字段级定义
│   ├── full/                        # 完整对象Schema
│   └── operations/                  # 操作级Schema
├── shared.schemas/                  # 跨领域共享Schema
│   ├── common/                      # 通用定义
│   ├── types/                       # 基础类型
│   └── patterns/                    # 通用模式
└── {business-module}.schemas/       # 业务模块级Schema
```

## 🎯 命名规范

### 1. 领域级Schema目录命名

| 领域类型 | 目录命名规范 | 示例 |
|---------|-------------|------|
| **DDD核心领域** | `{domain-name}.schemas` | `ubiquitous-language.schemas` |
| **战略设计** | `strategic-design.schemas` | `strategic-design.schemas` |
| **战术设计** | `tactical-design.schemas` | `tactical-design.schemas` |
| **实现映射** | `implementation-mapping.schemas` | `implementation-mapping.schemas` |
| **数据传输** | `data-transfer-objects.schemas` | `data-transfer-objects.schemas` |
| **界面设计** | `ui-screen-definition.schemas` | `ui-screen-definition.schemas` |
| **项目元数据** | `project-metadata.schemas` | `project-metadata.schemas` |

### 2. 业务模块级Schema目录命名

| 业务模块 | 目录命名规范 | 示例 |
|---------|-------------|------|
| **用户管理** | `user-management.schemas` | `user-management.schemas` |
| **订单管理** | `order-management.schemas` | `order-management.schemas` |
| **商品管理** | `product-management.schemas` | `product-management.schemas` |
| **支付管理** | `payment-management.schemas` | `payment-management.schemas` |
| **库存管理** | `inventory-management.schemas` | `inventory-management.schemas` |

### 3. Schema文件命名规范

#### 字段级Schema (fields/)
- **格式**: `{entity-type}-fields.schema.json`
- **示例**: 
  - `common-fields.schema.json` (通用字段)
  - `business-term-fields.schema.json` (业务术语字段)
  - `business-attribute-fields.schema.json` (业务属性字段)
  - `user-fields.schema.json` (用户字段)
  - `order-fields.schema.json` (订单字段)

#### 完整对象Schema (full/)
- **格式**: `{entity-name}.schema.json`
- **示例**: 
  - `ubiquitous-language.schema.json`
  - `business-term.schema.json`
  - `business-attribute.schema.json`
  - `user.schema.json`
  - `order.schema.json`

#### 操作级Schema (operations/)
- **PATCH操作**: `operations/patch/{entity-name}-patch.schema.json`
- **批量操作**: `operations/bulk/{entity-name}-bulk.schema.json`
- **搜索操作**: `operations/search/{entity-name}-search.schema.json`
- **示例**:
  - `operations/patch/business-term-patch.schema.json`
  - `operations/bulk/business-term-bulk.schema.json`
  - `operations/search/business-term-search.schema.json`

## 📁 具体实施案例

### 当前已实施
```
object-jsonschemas/
└── ubiquitous-language.schemas/
    ├── fields/
    │   ├── common-fields.schema.json
    │   ├── business-term-fields.schema.json
    │   └── business-attribute-fields.schema.json
    ├── full/
    │   ├── ubiquitous-language.schema.json
    │   ├── business-term.schema.json
    │   ├── business-attribute.schema.json
    │   └── constraints.schema.json
    └── operations/
        ├── patch/
        │   ├── business-term-patch.schema.json
        │   └── ubiquitous-language-patch.schema.json
        └── bulk/
            └── business-term-bulk.schema.json
```

### 推荐扩展结构
```
object-jsonschemas/
├── strategic-design.schemas/
│   ├── fields/
│   │   ├── common-fields.schema.json
│   │   ├── domain-fields.schema.json
│   │   ├── bounded-context-fields.schema.json
│   │   └── subdomain-fields.schema.json
│   ├── full/
│   │   ├── strategic-design.schema.json
│   │   ├── domain.schema.json
│   │   ├── bounded-context.schema.json
│   │   └── subdomain.schema.json
│   └── operations/
│       ├── patch/
│       └── bulk/
├── tactical-design.schemas/
│   ├── fields/
│   │   ├── aggregate-fields.schema.json
│   │   ├── entity-fields.schema.json
│   │   ├── value-object-fields.schema.json
│   │   └── domain-service-fields.schema.json
│   ├── full/
│   │   ├── tactical-design.schema.json
│   │   ├── aggregate.schema.json
│   │   ├── entity.schema.json
│   │   └── value-object.schema.json
│   └── operations/
│       ├── patch/
│       └── bulk/
├── data-transfer-objects.schemas/
│   ├── fields/
│   │   ├── dto-fields.schema.json
│   │   ├── request-fields.schema.json
│   │   └── response-fields.schema.json
│   ├── full/
│   │   ├── dto.schema.json
│   │   ├── api-request.schema.json
│   │   └── api-response.schema.json
│   └── operations/
│       ├── patch/
│       └── bulk/
├── ui-screen-definition.schemas/
│   ├── fields/
│   │   ├── component-fields.schema.json
│   │   ├── layout-fields.schema.json
│   │   └── interaction-fields.schema.json
│   ├── full/
│   │   ├── screen-definition.schema.json
│   │   ├── component.schema.json
│   │   └── layout.schema.json
│   └── operations/
│       ├── patch/
│       └── bulk/
└── shared.schemas/
    ├── common/
    │   ├── base-entity.schema.json
    │   ├── audit-fields.schema.json
    │   └── pagination.schema.json
    ├── types/
    │   ├── primitive-types.schema.json
    │   ├── date-time-types.schema.json
    │   └── identifier-types.schema.json
    └── patterns/
        ├── naming-patterns.schema.json
        ├── validation-patterns.schema.json
        └── business-patterns.schema.json
```

## 🔧 $id 引用规范

### URL模式
```
https://example.com/ddd-metamodel/1.0/object-jsonschemas/{domain-name}.schemas/{category}/{file-name}
```

### 示例
```json
{
  "$id": "https://example.com/ddd-metamodel/1.0/object-jsonschemas/ubiquitous-language.schemas/full/business-term.schema.json"
}
```

## 📖 使用指南

### 1. 创建新领域Schema

```bash
# 1. 创建领域目录
mkdir object-jsonschemas/{domain-name}.schemas
mkdir object-jsonschemas/{domain-name}.schemas/fields
mkdir object-jsonschemas/{domain-name}.schemas/full  
mkdir object-jsonschemas/{domain-name}.schemas/operations
mkdir object-jsonschemas/{domain-name}.schemas/operations/patch
mkdir object-jsonschemas/{domain-name}.schemas/operations/bulk

# 2. 创建基础Schema文件
touch object-jsonschemas/{domain-name}.schemas/fields/common-fields.schema.json
touch object-jsonschemas/{domain-name}.schemas/full/{main-entity}.schema.json
touch object-jsonschemas/{domain-name}.schemas/operations/patch/{main-entity}-patch.schema.json
```

### 2. $ref 引用规范

#### 同域内引用
```json
{
  "name": {
    "$ref": "../fields/common-fields.schema.json#/$defs/name"
  }
}
```

#### 跨域引用
```json
{
  "baseEntity": {
    "$ref": "../../shared.schemas/common/base-entity.schema.json"
  }
}
```

### 3. API文档引用

```typescript
// 根据领域和操作类型选择Schema
const schemaPath = `object-jsonschemas/${domainName}.schemas/${operation}/${entityName}.schema.json`;

// 示例
Schema: object-jsonschemas/ubiquitous-language.schemas/operations/patch/business-term-patch.schema.json
```

## 🎯 迁移策略

### 现有文件迁移
1. **保持向后兼容**: 原有Schema文件标记为废弃但暂时保留
2. **分批迁移**: 按领域逐步迁移到新的命名规范
3. **文档同步**: 确保API文档与Schema路径保持一致

### 新项目规范
1. **严格遵循**: 所有新的Schema必须按照此规范创建
2. **代码审查**: 在代码审查中检查Schema命名规范
3. **自动化检查**: 考虑添加自动化工具检查命名规范

## 📊 效益分析

### 组织效益
- ✅ **清晰分类**: 每个领域有独立的Schema目录
- ✅ **易于维护**: 结构化组织便于维护和查找
- ✅ **团队协作**: 统一规范提升团队协作效率
- ✅ **扩展性强**: 支持任意数量的业务领域

### 技术效益  
- ✅ **引用明确**: $ref路径清晰可预测
- ✅ **避免冲突**: 命名空间分离避免文件名冲突
- ✅ **工具友好**: 规范化路径便于工具集成
- ✅ **版本管理**: 便于Schema版本化管理

---

## 📝 总结

通过建立统一的Schema命名规范和组织架构，我们解决了多领域Schema管理的复杂性问题，为项目的规模化发展奠定了坚实基础。这个规范不仅解决了当前的问题，更为未来的扩展预留了充分的空间。
