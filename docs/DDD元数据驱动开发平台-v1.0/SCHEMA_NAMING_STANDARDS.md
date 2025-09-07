# Schema架构命名规范与统一标准 v2.0

## 📋 概述

本文档定义了DDD元数据驱动开发平台的Schema架构统一命名规范，确保所有API模块遵循一致的分层架构设计。

## 🎯 全局命名规范

### 1. 目录结构标准

```
object-jsonschemas/
├── {module-name}.schemas/           # 模块Schema根目录
│   ├── fields/                     # 字段级Schema定义（最细粒度）
│   │   ├── common-fields.schema.json      # 通用字段定义
│   │   └── {entity}-fields.schema.json    # 实体特定字段定义
│   ├── full/                       # 完整对象Schema（用于CREATE和READ）
│   │   ├── {main-entity}.schema.json      # 主实体完整Schema
│   │   └── {sub-entity}.schema.json       # 子实体完整Schema
│   └── operations/                 # 操作级Schema
│       ├── patch/                  # 部分更新Schema（用于PATCH）
│       │   └── {entity}-patch.schema.json
│       ├── bulk/                   # 批量操作Schema
│       │   └── {entity}-bulk.schema.json
│       ├── update/                 # 完整更新Schema（特殊情况）
│       │   └── {entity}-update.schema.json
│       └── delete/                 # 删除操作Schema（特殊情况）
│           └── {entity}-delete.schema.json
```

### 2. 模块命名映射

| API模块 | Schema目录名 | 主实体Schema | 状态 |
|---------|-------------|-------------|------|
| strategic-design-api.md | `strategic-design.schemas/` | `strategic-design.schema.json` | ✅ 已实现 |
| tactical-design-api.md | `tactical-design.schemas/` | `tactical-design.schema.json` | ✅ 已实现 |
| ubiquitous-language-api.md | `ubiquitous-language.schemas/` | `ubiquitous-language.schema.json` | ✅ 已实现 |
| project-metadata-api.md | `project-metadata.schemas/` | `project-metadata.schema.json` | ✅ 已实现 |
| data-transfer-objects-api.md | `data-transfer-objects.schemas/` | `data-transfer-objects.schema.json` | ✅ 已实现 |
| validation-api.md | `validation.schemas/` | `validation-configuration.schema.json` | ✅ 已实现 |

### 3. 文件命名规范

#### 3.1 字段级Schema (fields/)
- **格式**: `{entity-name}-fields.schema.json`
- **示例**: 
  - `common-fields.schema.json` - 通用字段
  - `business-term-fields.schema.json` - 业务术语字段
  - `aggregate-fields.schema.json` - 聚合字段

#### 3.2 完整对象Schema (full/)
- **格式**: `{entity-name}.schema.json`
- **示例**:
  - `strategic-design.schema.json` - 战略设计主实体
  - `bounded-context.schema.json` - 限界上下文子实体
  - `aggregate.schema.json` - 聚合子实体

#### 3.3 操作Schema (operations/)
- **PATCH格式**: `{entity-name}-patch.schema.json`
- **BULK格式**: `{entity-name}-bulk.schema.json`
- **UPDATE格式**: `{entity-name}-update.schema.json`
- **DELETE格式**: `{entity-name}-delete.schema.json`

## 🔧 Schema内容规范

### 1. JSON Schema标准
```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$id": "object-jsonschemas/{module}.schemas/{type}/{filename}",
  "title": "{中文标题}",
  "description": "{详细描述}",
  "type": "object",
  // ... 具体定义
}
```

### 2. 字段引用规范
```json
{
  "commonField": {
    "$ref": "../fields/common-fields.schema.json#/$defs/fieldName"
  },
  "specificField": {
    "$ref": "../fields/{entity}-fields.schema.json#/$defs/fieldName"
  }
}
```

### 3. 跨模块引用规范
```json
{
  "externalRef": {
    "$ref": "../../{other-module}.schemas/full/{entity}.schema.json"
  }
}
```

## 📊 实现状态检查表

### ✅ 已完成模块

#### 1. validation.schemas/
- ✅ `fields/common-fields.schema.json`
- ✅ `fields/validation-configuration-fields.schema.json`
- ✅ `fields/validation-rule-fields.schema.json`
- ✅ `full/validation-configuration.schema.json`
- ✅ `full/validation-rule.schema.json`
- ✅ `operations/patch/validation-configuration-patch.schema.json`
- ✅ `operations/patch/validation-rule-patch.schema.json`
- ✅ `operations/bulk/validation-configuration-bulk.schema.json`
- ✅ `operations/bulk/validation-rule-bulk.schema.json`

#### 2. strategic-design.schemas/
- ✅ `fields/common-fields.schema.json`
- ✅ `fields/bounded-context-fields.schema.json`
- ✅ `fields/subdomain-fields.schema.json`
- ✅ `full/strategic-design.schema.json`
- ✅ `full/bounded-context.schema.json`
- ✅ `full/subdomain.schema.json`
- ✅ `operations/update/strategic-design-update.schema.json`
- ✅ `operations/delete/strategic-design-delete.schema.json`

#### 3. tactical-design.schemas/
- ✅ `fields/aggregate-fields.schema.json`
- ✅ `fields/entity-fields.schema.json`
- ✅ `fields/value-object-fields.schema.json`
- ✅ `full/aggregate.schema.json`
- ✅ `full/tactical-design.schema.json` ⭐ 新增
- ✅ `full/entity.schema.json` ⭐ 新增
- ✅ `full/value-object.schema.json` ⭐ 新增

#### 4. ubiquitous-language.schemas/
- ✅ `fields/common-fields.schema.json`
- ✅ `fields/business-term-fields.schema.json`
- ✅ `fields/business-attribute-fields.schema.json`
- ✅ `full/ubiquitous-language.schema.json`
- ✅ `full/business-term.schema.json`
- ✅ `full/business-attribute.schema.json`
- ✅ `full/constraints.schema.json`
- ✅ `operations/patch/business-term-patch.schema.json`
- ✅ `operations/patch/ubiquitous-language-patch.schema.json`
- ✅ `operations/bulk/business-term-bulk.schema.json`

### 🔄 需要完善的模块

#### 1. project-metadata.schemas/
- ❌ 缺少完整的分层架构实现

#### 2. data-transfer-objects.schemas/
- ❌ 缺少完整的分层架构实现

#### 3. tactical-design.schemas/
- ❌ 缺少 `operations/patch/` 目录
- ❌ 缺少 `operations/bulk/` 目录

## 🚀 迁移计划

### Phase 1: 命名规范统一 ✅ 已完成
- [x] 统一所有API文档的Schema架构描述
- [x] 修复tactical-design.schemas缺失的Schema文件
- [x] 确保所有模块遵循命名规范

### Phase 2: 缺失Schema补全 🔄 进行中
- [ ] 补全 project-metadata.schemas 分层架构
- [ ] 补全 data-transfer-objects.schemas 分层架构
- [ ] 补全 tactical-design.schemas 操作Schema

### Phase 3: 质量验证 ⏳ 待执行
- [ ] 验证所有Schema文件的JSON语法
- [ ] 验证Schema引用关系的完整性
- [ ] 性能测试Schema验证效率

## 📝 使用指南

### 1. API开发者
在API文档中引用Schema时，请使用以下格式：
```markdown
Schema: object-jsonschemas/{module}.schemas/{type}/{filename}
```

### 2. 前端开发者
在客户端验证时，请根据操作类型选择合适的Schema：
- **CREATE**: 使用 `full/*.schema.json`
- **PATCH**: 使用 `operations/patch/*.schema.json`
- **BULK**: 使用 `operations/bulk/*.schema.json`

### 3. 后端开发者
在API实现中，请根据HTTP方法自动选择Schema：
```javascript
const schemaPath = {
  'POST': 'full/',
  'PUT': 'full/',
  'PATCH': 'operations/patch/',
  'DELETE': 'operations/delete/'
}[method] + entityType + '.schema.json';
```

## 🎉 总结

通过实施统一的Schema架构命名规范，我们实现了：

1. **✅ 命名一致性**: 所有模块遵循相同的目录结构和文件命名
2. **✅ 架构统一性**: 所有API文档都包含分层Schema架构说明
3. **✅ 可维护性**: 清晰的命名规范便于团队协作和维护
4. **✅ 可扩展性**: 标准化的架构便于未来新模块的添加

这个统一的Schema架构为DDD元数据驱动开发平台提供了坚实的基础，确保了企业级的数据验证和API一致性。
