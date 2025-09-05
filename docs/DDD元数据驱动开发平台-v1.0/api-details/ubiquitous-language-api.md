# 统一语言管理 API

## 📋 概述

统一语言管理API提供DDD统一语言的管理功能，采用扁平化、分表存储设计，支持MongoDB和MySQL数据库。

## 🏗️ API结构

```
/api/ddd/ubiquitous-language/
├── /domains/{domainId}              # 领域统一语言基本信息
├── /terms                           # 业务术语（独立表）
├── /attributes                      # 业务属性（独立表）
├── /rules                           # 业务规则（独立表）
├── /relationships                   # 术语关系（独立表）
└── /associations                    # 关联服务
```

## 📚 API详情

### 1. 领域统一语言管理

#### 1.1 获取领域统一语言信息
```typescript
GET /api/ddd/ubiquitous-language/domains/{domainId}
Response: ApiResponse<DomainUbiquitousLanguage>
```

#### 1.2 创建/更新领域统一语言
```typescript
PUT /api/ddd/ubiquitous-language/domains/{domainId}
Body: {
  domainId: string;                  // 必填，领域ID
  version: string;                   // 必填，版本号
  description: string;               // 描述
  isActive: boolean;                 // 是否激活
}
Response: ApiResponse<DomainUbiquitousLanguage>
```

#### 1.3 获取领域统计信息
```typescript
GET /api/ddd/ubiquitous-language/domains/{domainId}/statistics
Response: ApiResponse<DomainStatistics>
```

### 2. 业务术语管理（独立表）

#### 2.1 获取业务术语列表
```typescript
GET /api/ddd/ubiquitous-language/terms
Query Parameters:
- domainId: string                   // 必填，领域ID
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- category?: 'DOMAIN_ENTITY' | 'BUSINESS_CONCEPT' | 'VALUE_OBJECT' | 'SERVICE'
- isActive?: boolean
- sortBy?: 'name' | 'category' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BusinessTerm>
```

#### 2.2 获取单个业务术语
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}
Response: ApiResponse<BusinessTerm>
```

#### 2.3 创建业务术语
```typescript
POST /api/ddd/ubiquitous-language/terms
Body: {
  domainId: string;                  // 必填，领域ID
  name: string;                      // 必填，术语名称
  programmingName: string;           // 必填，编程名称
  description: string;               // 必填，描述
  category: 'DOMAIN_ENTITY' | 'BUSINESS_CONCEPT' | 'VALUE_OBJECT' | 'SERVICE';  // 必填，分类
  synonyms?: string[];               // 同义词列表
  examples?: string[];               // 示例列表
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<BusinessTerm>
```

#### 2.4 更新业务术语
```typescript
PUT /api/ddd/ubiquitous-language/terms/{termId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  category?: 'DOMAIN_ENTITY' | 'BUSINESS_CONCEPT' | 'VALUE_OBJECT' | 'SERVICE';
  synonyms?: string[];
  examples?: string[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessTerm>
```

#### 2.5 删除业务术语
```typescript
DELETE /api/ddd/ubiquitous-language/terms/{termId}
Response: ApiResponse<void>
```

#### 2.6 批量操作业务术语
```typescript
POST /api/ddd/ubiquitous-language/terms/batch
Body: {
  operations: Array<{
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    data?: BusinessTerm;
    termId?: string;
  }>;
}
Response: ApiResponse<BatchOperationResult>
```

### 3. 业务属性管理（独立表）

#### 3.1 获取业务属性列表
```typescript
GET /api/ddd/ubiquitous-language/attributes
Query Parameters:
- domainId: string                   // 必填，领域ID
- termId?: string                     // 可选，按术语筛选
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- dataType?: string
- isActive?: boolean
- sortBy?: 'name' | 'dataType' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BusinessAttribute>
```

#### 3.2 获取单个业务属性
```typescript
GET /api/ddd/ubiquitous-language/attributes/{attributeId}
Response: ApiResponse<BusinessAttribute>
```

#### 3.3 创建业务属性
```typescript
POST /api/ddd/ubiquitous-language/attributes
Body: {
  domainId: string;                  // 必填，领域ID
  termId: string;                    // 必填，所属术语ID
  name: string;                      // 必填，属性名称
  programmingName: string;           // 必填，编程名称
  description: string;               // 必填，描述
  dataType: string;                  // 必填，数据类型
  unit?: string;                     // 单位
  format?: string;                   // 格式
  constraints?: Constraints;          // 约束条件
  isUnique?: boolean;                // 是否唯一
  isReadOnly?: boolean;              // 是否只读
  businessLogic?: string;            // 业务逻辑
  examples?: string[];               // 示例列表
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<BusinessAttribute>
```

#### 3.4 更新业务属性
```typescript
PUT /api/ddd/ubiquitous-language/attributes/{attributeId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  termId?: string;
  dataType?: string;
  unit?: string;
  format?: string;
  constraints?: Constraints;
  isUnique?: boolean;
  isReadOnly?: boolean;
  businessLogic?: string;
  examples?: string[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessAttribute>
```

#### 3.5 删除业务属性
```typescript
DELETE /api/ddd/ubiquitous-language/attributes/{attributeId}
Response: ApiResponse<void>
```

#### 3.6 获取术语的所有属性
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/attributes
Response: ApiResponse<BusinessAttribute[]>
```

### 4. 业务规则管理（独立表）

#### 4.1 获取业务规则列表
```typescript
GET /api/ddd/ubiquitous-language/rules
Query Parameters:
- domainId: string                   // 必填，领域ID
- termId?: string                     // 可选，按术语筛选
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'VALIDATION' | 'BUSINESS_LOGIC' | 'CONSTRAINT'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BusinessRule>
```

#### 4.2 获取单个业务规则
```typescript
GET /api/ddd/ubiquitous-language/rules/{ruleId}
Response: ApiResponse<BusinessRule>
```

#### 4.3 创建业务规则
```typescript
POST /api/ddd/ubiquitous-language/rules
Body: {
  domainId: string;                  // 必填，领域ID
  termId: string;                    // 必填，所属术语ID
  name: string;                      // 必填，规则名称
  description: string;               // 必填，描述
  type: 'VALIDATION' | 'BUSINESS_LOGIC' | 'CONSTRAINT';  // 必填，规则类型
  expression: string;                // 必填，规则表达式
  severity: 'ERROR' | 'WARNING' | 'INFO';  // 严重程度
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<BusinessRule>
```

#### 4.4 更新业务规则
```typescript
PUT /api/ddd/ubiquitous-language/rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  termId?: string;
  type?: 'VALIDATION' | 'BUSINESS_LOGIC' | 'CONSTRAINT';
  expression?: string;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  isActive?: boolean;
}
Response: ApiResponse<BusinessRule>
```

#### 4.5 删除业务规则
```typescript
DELETE /api/ddd/ubiquitous-language/rules/{ruleId}
Response: ApiResponse<void>
```

#### 4.6 获取术语的所有规则
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/rules
Response: ApiResponse<BusinessRule[]>
```

### 5. 术语关系管理（独立表）

#### 5.1 获取术语关系列表
```typescript
GET /api/ddd/ubiquitous-language/relationships
Query Parameters:
- domainId: string                   // 必填，领域ID
- sourceTermId?: string              // 可选，源术语ID
- targetTermId?: string              // 可选，目标术语ID
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- relationshipType?: string
- isActive?: boolean
- sortBy?: 'sourceTermId' | 'targetTermId' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<TermRelationship>
```

#### 5.2 获取单个术语关系
```typescript
GET /api/ddd/ubiquitous-language/relationships/{relationshipId}
Response: ApiResponse<TermRelationship>
```

#### 5.3 创建术语关系
```typescript
POST /api/ddd/ubiquitous-language/relationships
Body: {
  domainId: string;                  // 必填，领域ID
  sourceTermId: string;              // 必填，源术语ID
  targetTermId: string;               // 必填，目标术语ID
  relationshipType: string;          // 必填，关系类型
  description: string;               // 必填，描述
  cardinality?: string;               // 基数
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<TermRelationship>
```

#### 5.4 更新术语关系
```typescript
PUT /api/ddd/ubiquitous-language/relationships/{relationshipId}
Body: {
  sourceTermId?: string;
  targetTermId?: string;
  relationshipType?: string;
  description?: string;
  cardinality?: string;
  isActive?: boolean;
}
Response: ApiResponse<TermRelationship>
```

#### 5.5 删除术语关系
```typescript
DELETE /api/ddd/ubiquitous-language/relationships/{relationshipId}
Response: ApiResponse<void>
```

#### 5.6 获取术语的所有关系
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/relationships
Query Parameters:
- direction?: 'INCOMING' | 'OUTGOING' | 'BOTH'  // 关系方向
Response: ApiResponse<TermRelationship[]>
```

### 6. 关联服务

#### 6.1 获取术语的领域关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/domains
Response: ApiResponse<DomainAssociation[]>
```

#### 6.2 获取术语的限界上下文关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/bounded-contexts
Response: ApiResponse<BoundedContextAssociation[]>
```

#### 6.3 获取术语的聚合关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/aggregates
Response: ApiResponse<AggregateAssociation[]>
```

#### 6.4 获取术语的实体关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/entities
Response: ApiResponse<EntityAssociation[]>
```

#### 6.5 获取术语的DTO关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/dtos
Response: ApiResponse<DtoAssociation[]>
```

#### 6.6 获取术语的屏幕关联
```typescript
GET /api/ddd/ubiquitous-language/terms/{termId}/associations/screens
Response: ApiResponse<ScreenAssociation[]>
```

#### 6.7 批量更新术语关联
```typescript
PUT /api/ddd/ubiquitous-language/terms/{termId}/associations
Body: {
  domainIds?: string[];
  boundedContextIds?: string[];
  aggregateIds?: string[];
  entityIds?: string[];
  dtoIds?: string[];
  screenIds?: string[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 7. 导出导入服务

#### 7.1 导出领域统一语言
```typescript
GET /api/ddd/ubiquitous-language/domains/{domainId}/export
Query Parameters:
- format?: 'JSON' | 'XML' | 'CSV'
- includeInactive?: boolean
Response: ApiResponse<ExportData>
```

#### 7.2 导入领域统一语言
```typescript
POST /api/ddd/ubiquitous-language/domains/{domainId}/import
Body: {
  data: any;                         // 导入数据
  options: {
    overwrite?: boolean;              // 是否覆盖现有数据
    validateOnly?: boolean;            // 仅验证不导入
  };
}
Response: ApiResponse<ImportResult>
```

## 📊 数据模型

### DomainUbiquitousLanguage（领域统一语言基本信息）
```typescript
interface DomainUbiquitousLanguage {
  domainId: string;                   // 领域ID
  version: string;                    // 版本号
  description: string;               // 描述
  isActive: boolean;                 // 是否激活
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
}
```

### BusinessTerm（业务术语）
```typescript
interface BusinessTerm {
  termId: string;                     // 术语ID
  domainId: string;                   // 领域ID
  name: string;                       // 术语名称
  programmingName: string;           // 编程名称
  description: string;               // 描述
  category: 'DOMAIN_ENTITY' | 'BUSINESS_CONCEPT' | 'VALUE_OBJECT' | 'SERVICE';
  synonyms?: string[];               // 同义词列表
  examples?: string[];               // 示例列表
  isActive: boolean;                 // 是否激活
  usageStatus: UsageStatus;          // 使用状态
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
}
```

### BusinessAttribute（业务属性）
```typescript
interface BusinessAttribute {
  attributeId: string;                // 属性ID
  domainId: string;                   // 领域ID
  termId: string;                     // 所属术语ID
  name: string;                       // 属性名称
  programmingName: string;           // 编程名称
  description: string;               // 描述
  dataType: string;                   // 数据类型
  unit?: string;                     // 单位
  format?: string;                   // 格式
  constraints?: Constraints;          // 约束条件
  isUnique?: boolean;                // 是否唯一
  isReadOnly?: boolean;              // 是否只读
  businessLogic?: string;            // 业务逻辑
  examples?: string[];               // 示例列表
  isActive: boolean;                 // 是否激活
  createdAt: string;                // 创建时间
  updatedAt: string;                // 更新时间
}
```

### BusinessRule（业务规则）
```typescript
interface BusinessRule {
  ruleId: string;                     // 规则ID
  domainId: string;                   // 领域ID
  termId: string;                     // 所属术语ID
  name: string;                       // 规则名称
  description: string;               // 描述
  type: 'VALIDATION' | 'BUSINESS_LOGIC' | 'CONSTRAINT';
  expression: string;                // 规则表达式
  severity: 'ERROR' | 'WARNING' | 'INFO';
  isActive: boolean;                 // 是否激活
  createdAt: string;                // 创建时间
  updatedAt: string;                // 更新时间
}
```

### TermRelationship（术语关系）
```typescript
interface TermRelationship {
  relationshipId: string;             // 关系ID
  domainId: string;                   // 领域ID
  sourceTermId: string;              // 源术语ID
  targetTermId: string;               // 目标术语ID
  relationshipType: string;          // 关系类型
  description: string;               // 描述
  cardinality?: string;               // 基数
  isActive: boolean;                 // 是否激活
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
}
```

### DomainStatistics（领域统计信息）
```typescript
interface DomainStatistics {
  domainId: string;                   // 领域ID
  totalTerms: number;                 // 总术语数
  activeTerms: number;                // 激活术语数
  totalAttributes: number;            // 总属性数
  activeAttributes: number;           // 激活属性数
  totalRules: number;                 // 总规则数
  activeRules: number;                // 激活规则数
  totalRelationships: number;         // 总关系数
  activeRelationships: number;        // 激活关系数
  lastUpdated: string;               // 最后更新时间
}
```

### Constraints（约束条件）
```typescript
interface Constraints {
  minLength?: number;                  // 最小长度
  maxLength?: number;                 // 最大长度
  minValue?: number;                  // 最小值
  maxValue?: number;                  // 最大值
  pattern?: string;                   // 正则表达式
  required?: boolean;                 // 是否必填
  enum?: string[];                    // 枚举值
  customRules?: string[];             // 自定义规则
}
```

### UsageStatus（使用状态）
```typescript
interface UsageStatus {
  isReferencedByStrategic: boolean;    // 是否被战略设计引用
  isReferencedByTactical: boolean;    // 是否被战术设计引用
  isReferencedByImplementation: boolean; // 是否被实现映射引用
  isReferencedByScreen: boolean;      // 是否被屏幕定义引用
  referencedBy: ReferenceInfo[];      // 引用详情
}

interface ReferenceInfo {
  schemaType: string;                 // 引用类型
  elementId: string;                  // 引用元素ID
  elementName: string;                // 引用元素名称
}
```

### BatchOperationResult（批量操作结果）
```typescript
interface BatchOperationResult {
  total: number;                       // 总操作数
  success: number;                     // 成功数
  failed: number;                      // 失败数
  errors: Array<{
    index: number;                     // 操作索引
    error: string;                     // 错误信息
  }>;
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| UBIQUITOUS_LANGUAGE.DOMAIN_NOT_FOUND | 领域不存在 |
| UBIQUITOUS_LANGUAGE.TERM_NOT_FOUND | 业务术语不存在 |
| UBIQUITOUS_LANGUAGE.TERM_DUPLICATE_NAME | 业务术语名称重复 |
| UBIQUITOUS_LANGUAGE.ATTRIBUTE_NOT_FOUND | 业务属性不存在 |
| UBIQUITOUS_LANGUAGE.RULE_NOT_FOUND | 业务规则不存在 |
| UBIQUITOUS_LANGUAGE.RELATIONSHIP_NOT_FOUND | 术语关系不存在 |
| UBIQUITOUS_LANGUAGE.RELATIONSHIP_CIRCULAR_REFERENCE | 循环引用错误 |
| UBIQUITOUS_LANGUAGE.INVALID_DATA | 数据无效 |
| UBIQUITOUS_LANGUAGE.ACCESS_DENIED | 访问被拒绝 |
| UBIQUITOUS_LANGUAGE.BATCH_OPERATION_FAILED | 批量操作失败 |

## 📖 使用示例

### 创建业务术语
```typescript
const newTerm = {
  domainId: "domain_001",
  name: "订单",
  programmingName: "Order",
  description: "客户购买商品时创建的订单",
  category: "DOMAIN_ENTITY",
  synonyms: ["订单", "购买单"],
  examples: ["用户下单购买iPhone", "订单包含商品列表"],
  isActive: true
};

const response = await fetch('/api/ddd/ubiquitous-language/terms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newTerm)
});
```

### 创建业务属性
```typescript
const newAttribute = {
  domainId: "domain_001",
  termId: "term_order",
  name: "订单号",
  programmingName: "orderNumber",
  description: "订单的唯一标识号",
  dataType: "string",
  format: "ORD-{YYYYMMDD}-{SEQ}",
  constraints: {
    required: true,
    minLength: 10,
    maxLength: 20,
    pattern: "^ORD-\\d{8}-\\d{6}$"
  },
  isUnique: true,
  isActive: true
};

const response = await fetch('/api/ddd/ubiquitous-language/attributes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newAttribute)
});
```

### 获取术语的所有属性
```typescript
const response = await fetch('/api/ddd/ubiquitous-language/terms/term_order/attributes');
const attributes = await response.json();
console.log(`订单术语包含 ${attributes.data.length} 个属性`);
```

### 批量创建术语
```typescript
const batchOperations = {
  operations: [
    {
      type: 'CREATE',
      data: {
        domainId: "domain_001",
        name: "用户",
        programmingName: "User",
        description: "系统用户",
        category: "DOMAIN_ENTITY",
        isActive: true
      }
    },
    {
      type: 'CREATE',
      data: {
        domainId: "domain_001",
        name: "商品",
        programmingName: "Product",
        description: "销售的商品",
        category: "DOMAIN_ENTITY",
        isActive: true
      }
    }
  ]
};

const response = await fetch('/api/ddd/ubiquitous-language/terms/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(batchOperations)
});
```

### 获取领域统计信息
```typescript
const response = await fetch('/api/ddd/ubiquitous-language/domains/domain_001/statistics');
const stats = await response.json();
console.log(`领域包含 ${stats.data.totalTerms} 个术语，${stats.data.totalAttributes} 个属性`);
```
