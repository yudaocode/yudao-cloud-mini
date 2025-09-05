# DDD元数据驱动开发平台 - 引用关系分析指南

## 📋 概述

本文档描述了DDD元数据驱动开发平台中的引用关系分析机制，采用后向引用自动发现的方式，避免了复杂的验证阶段，提供简洁优雅的解决方案。

## 🎯 问题背景

### 原始问题
1. **时序依赖**：`ubiquitous-language.schema.json` 需要 `domainId`，但领域定义在 `strategic-design.schema.json` 中
2. **保存失败**：在战略设计阶段未完成时，无法保存术语
3. **循环依赖风险**：领域定义可能也需要引用术语ID

### 解决方案
采用**后向引用自动发现**机制，允许自由创建，系统自动发现引用关系，通过界面提醒辅助发现问题。

## 🔄 引用关系分析

### 核心思想
**前向引用**：主动引用（如战术设计引用术语）
**后向引用**：被动形成（如术语被战略设计引用）

### 自动发现机制

#### 1. 引用关系自动发现
系统自动分析所有Schema，发现：
- 哪些元素被其他Schema引用
- 哪些元素未被引用
- 引用关系是否有效

#### 2. 使用状态自动维护
每个Schema元素自动维护使用状态：
```json
{
  "usageStatus": {
    "isReferencedByStrategic": true,
    "isReferencedByTactical": false,
    "isReferencedByDto": true,
    "isReferencedByImplementation": false,
    "lastReferencedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3. 问题自动发现
系统自动发现：
- **未使用的元素**：未被任何设计阶段引用的元素
- **孤立的引用**：引用不存在的元素
- **遗漏的设计**：应该被引用但未被引用的元素

### 界面提醒机制

#### 1. 使用状态指示器
- 🟢 已使用：被其他Schema引用
- 🟡 部分使用：被部分Schema引用
- 🔴 未使用：未被任何Schema引用

#### 2. 问题提醒
- ⚠️ 未使用提醒：显示未被引用的元素
- ❌ 孤立引用提醒：显示引用不存在的元素
- 💡 建议提醒：提供设计建议

#### 3. 设计辅助
- 📊 使用统计：显示各阶段的使用情况
- 🔗 引用关系图：可视化引用关系
- 📋 待办清单：列出需要处理的问题

## 🛠️ 验证规则配置

### validationRules 配置项

```json
{
  "validationRules": {
    "requireDomainId": true,           // 是否要求domainId
    "requireBoundedContextId": true,    // 是否要求boundedContextId
    "crossReferenceValidation": true   // 是否启用跨Schema引用验证
  }
}
```

### 配置说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `requireDomainId` | boolean | false | 是否要求domainId（在STRATEGIC_COMPLETE阶段后为true） |
| `requireBoundedContextId` | boolean | false | 是否要求boundedContextId（在STRATEGIC_COMPLETE阶段后为true） |
| `crossReferenceValidation` | boolean | false | 是否启用跨Schema引用验证 |

## 📝 使用示例

### 示例1：草稿阶段创建术语

```javascript
const validator = new DDDSchemaValidator();
await validator.loadSchemas();

const draftData = {
  version: "2.0.0",
  businessTerms: [
    {
      id: "term_order",
      name: "订单",
      programmingName: "Order",
      description: "客户购买商品或服务的记录",
      category: "DOMAIN_ENTITY"
    }
  ],
  validationStage: "DRAFT"
};

const result = await validator.validateData(draftData, 'ubiquitous-language.schema.json', {
  stage: 'DRAFT'
});

console.log('验证结果:', result.valid); // true
```

### 示例2：战略设计完成后验证

```javascript
const strategicData = {
  version: "2.0.0",
  domainId: "domain_ecommerce",
  businessTerms: [
    {
      id: "term_order",
      name: "订单",
      programmingName: "Order",
      description: "客户购买商品或服务的记录",
      category: "DOMAIN_ENTITY",
      boundedContextId: "bc_order_management"
    }
  ],
  validationStage: "STRATEGIC_COMPLETE",
  validationRules: {
    requireDomainId: true,
    requireBoundedContextId: true,
    crossReferenceValidation: true
  }
};

const result = await validator.validateData(strategicData, 'ubiquitous-language.schema.json', {
  stage: 'STRATEGIC_COMPLETE'
});

console.log('验证结果:', result.valid); // true
```

### 示例3：战术设计阶段验证

```javascript
const tacticalData = {
  version: "2.0.0",
  boundedContextId: "bc_order_management",
  aggregates: [
    {
      id: "agg_order",
      name: "订单聚合",
      description: "订单相关的聚合根",
      termId: "term_order",
      rootEntityId: "entity_order"
    }
  ],
  entities: [
    {
      id: "entity_order",
      name: "订单实体",
      description: "订单实体",
      termId: "term_order",
      aggregateId: "agg_order",
      attributes: [
        {
          id: "attr_order_id",
          name: "订单ID",
          businessAttributeId: "attr_order_id"
        }
      ]
    }
  ],
  validationStage: "TACTICAL_COMPLETE",
  validationRules: {
    requireBoundedContextId: true,
    requireTermReferences: true,
    requireAttributeReferences: true
  }
};

const result = await validator.validateData(tacticalData, 'tactical-design.schema.json', {
  stage: 'TACTICAL_COMPLETE'
});

console.log('验证结果:', result.valid); // true
```

### 示例4：DTO设计阶段验证

```javascript
const dtoData = {
  version: "2.0.0",
  boundedContextId: "bc_order_management",
  dataTransferObjects: [
    {
      id: "dto_order_request",
      name: "订单请求DTO",
      description: "创建订单的请求DTO",
      type: "REQUEST",
      layer: "APPLICATION",
      termReferences: ["term_order"],
      attributes: [
        {
          id: "attr_order_amount",
          name: "订单金额",
          businessAttributeId: "attr_order_amount"
        }
      ]
    }
  ],
  validationStage: "DTO_COMPLETE",
  validationRules: {
    requireBoundedContextId: true,
    requireTermReferences: true,
    requireAttributeReferences: true
  }
};

const result = await validator.validateData(dtoData, 'data-transfer-objects.schema.json', {
  stage: 'DTO_COMPLETE'
});

console.log('验证结果:', result.valid); // true
```

### 示例5：跨Schema引用验证

```javascript
const result = await validator.validateData(data, 'ubiquitous-language.schema.json', {
  stage: 'STRATEGIC_COMPLETE',
  enableCrossReference: true
});

// 这将检查：
// 1. domainId 是否在 strategic-design.schema.json 中存在
// 2. boundedContextId 是否在 strategic-design.schema.json 中存在
// 3. termId 是否在 ubiquitous-language.schema.json 中存在
// 4. businessAttributeId 是否在 ubiquitous-language.schema.json 中存在
```

## 🔧 最佳实践

### 1. 渐进式开发
```javascript
// 阶段1：创建基础术语
const draftTerms = createDraftTerms();
await validator.validateData(draftTerms, 'ubiquitous-language.schema.json', {
  stage: 'DRAFT'
});

// 阶段2：添加战略设计关联
const strategicTerms = addStrategicContext(draftTerms);
await validator.validateData(strategicTerms, 'ubiquitous-language.schema.json', {
  stage: 'STRATEGIC_COMPLETE'
});

// 阶段3：添加战术设计关联
const tacticalTerms = addTacticalContext(strategicTerms);
await validator.validateData(tacticalTerms, 'ubiquitous-language.schema.json', {
  stage: 'TACTICAL_COMPLETE'
});
```

### 2. 错误处理
```javascript
const result = await validator.validateData(data, 'ubiquitous-language.schema.json', {
  stage: 'STRATEGIC_COMPLETE'
});

if (!result.valid) {
  console.log('验证错误:');
  result.errors.forEach(error => {
    console.log(`- ${error.message}`);
  });
}
```

### 3. 阶段转换
```javascript
// 从草稿阶段转换到战略完成阶段
function upgradeToStrategic(draftData, domainId, boundedContextId) {
  return {
    ...draftData,
    domainId,
    businessTerms: draftData.businessTerms.map(term => ({
      ...term,
      boundedContextId
    })),
    validationStage: "STRATEGIC_COMPLETE",
    validationRules: {
      requireDomainId: true,
      requireBoundedContextId: true,
      crossReferenceValidation: true
    }
  };
}
```

## 📊 验证报告

### 验证结果结构
```javascript
{
  basicValidation: {
    valid: boolean,
    errors: Array
  },
  stageValidation: {
    valid: boolean,
    errors: Array
  },
  crossReferenceValidation: {
    valid: boolean,
    errors: Array
  },
  errors: Array  // 合并后的所有错误
}
```

### 错误类型
1. **基础验证错误**：Schema语法错误、必填字段缺失等
2. **阶段验证错误**：当前阶段要求但未满足的字段
3. **跨引用验证错误**：引用不存在或无效

## 🚀 工具集成

### 前端集成
```javascript
// React组件中的使用
const [validationStage, setValidationStage] = useState('DRAFT');
const [validationRules, setValidationRules] = useState({
  requireDomainId: false,
  requireBoundedContextId: false,
  crossReferenceValidation: false
});

const handleSave = async (data) => {
  const result = await validator.validateData({
    ...data,
    validationStage,
    validationRules
  }, 'ubiquitous-language.schema.json', {
    stage: validationStage
  });

  if (result.valid) {
    // 保存数据
    await saveData(data);
  } else {
    // 显示错误
    setErrors(result.errors);
  }
};
```

### 后端集成
```javascript
// Node.js API中的使用
app.post('/api/ubiquitous-language', async (req, res) => {
  const validator = new DDDSchemaValidator();
  await validator.loadSchemas();

  const result = await validator.validateData(req.body, 'ubiquitous-language.schema.json', {
    stage: req.body.validationStage || 'DRAFT'
  });

  if (result.valid) {
    // 保存到数据库
    const saved = await saveToDatabase(req.body);
    res.json({ success: true, data: saved });
  } else {
    res.status(400).json({ 
      success: false, 
      errors: result.errors 
    });
  }
});
```

## 📚 相关文档

- [统一语言Schema](./ubiquitous-language.schema.json)
- [战略设计Schema](./strategic-design.schema.json)
- [Schema验证工具](./schema-validator.js)
- [使用示例](./USAGE_EXAMPLES.md)

---

*本文档将随着平台发展持续更新*
