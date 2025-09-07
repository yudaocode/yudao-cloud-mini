# Schema关系管理 API

## 📋 概述

Schema关系管理API专注于DDD元数据Schema间的关系定义、验证和可视化管理，基于`root.schema.json`中的relationships定义。

## 🏗️ API结构

```
/api/ddd/relationships/
├── /schemas                         # Schema关系管理
│   ├── /definitions                # 关系定义
│   ├── /validation                 # 关系验证
│   ├── /visualization              # 关系可视化
│   └── /analysis                   # 关系分析
├── /types                          # 关系类型管理
│   ├── /reference                  # 引用关系
│   ├── /inheritance                # 继承关系
│   ├── /composition                # 组合关系
│   ├── /aggregation                # 聚合关系
│   └── /association                # 关联关系
└── /governance                     # 关系治理
    ├── /consistency                # 一致性检查
    ├── /dependencies               # 依赖分析
    └── /impact                     # 影响分析
```

## 📚 API详情

### 1. Schema关系定义管理

#### 1.1 获取Schema关系列表
```typescript
GET /api/ddd/relationships/schemas/definitions
Query Parameters:
- sourceSchema?: string             # 源Schema过滤
- targetSchema?: string             # 目标Schema过滤
- relationshipType?: 'REFERENCE' | 'INHERITANCE' | 'COMPOSITION' | 'AGGREGATION' | 'ASSOCIATION'
- cardinality?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY'
- isActive?: boolean
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<SchemaRelationship>
```

#### 1.2 创建Schema关系
```typescript
POST /api/ddd/relationships/schemas/definitions
Body: {
  id: string;                       # 关系ID，格式：relationship_[a-zA-Z0-9_]+
  name: string;                     # 关系名称
  description?: string;             # 关系描述
  sourceSchema: string;             # 源Schema标识
  targetSchema: string;             # 目标Schema标识
  sourceElement?: string;           # 源元素标识
  targetElement?: string;           # 目标元素标识
  type: 'REFERENCE' | 'INHERITANCE' | 'COMPOSITION' | 'AGGREGATION' | 'ASSOCIATION';
  cardinality: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  constraints?: {                   # 关系约束
    cascade?: boolean;              # 级联操作
    nullable?: boolean;             # 可为空
    bidirectional?: boolean;        # 双向关系
  };
  metadata?: {                      # 元数据信息
    createdBy: string;
    createdAt: string;
    tags?: string[];
  };
}
Response: ApiResponse<SchemaRelationship>
```

#### 1.3 更新Schema关系
```typescript
PUT /api/ddd/relationships/schemas/definitions/{relationshipId}
Body: {
  name?: string;
  description?: string;
  type?: 'REFERENCE' | 'INHERITANCE' | 'COMPOSITION' | 'AGGREGATION' | 'ASSOCIATION';
  cardinality?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  constraints?: {
    cascade?: boolean;
    nullable?: boolean;
    bidirectional?: boolean;
  };
  isActive?: boolean;
}
Response: ApiResponse<SchemaRelationship>
```

### 2. 关系验证管理

#### 2.1 验证Schema关系一致性
```typescript
POST /api/ddd/relationships/schemas/validation/consistency
Body: {
  relationshipIds?: string[];       # 指定关系ID列表，为空则验证所有
  validationRules?: {
    checkCycles?: boolean;          # 检查循环依赖
    checkOrphans?: boolean;         # 检查孤立关系
    checkConstraints?: boolean;     # 检查约束一致性
  };
}
Response: ApiResponse<ValidationResult>
```

#### 2.2 获取关系验证结果
```typescript
GET /api/ddd/relationships/schemas/validation/results
Query Parameters:
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- relationshipId?: string
- validationType?: 'CONSISTENCY' | 'CONSTRAINT' | 'DEPENDENCY'
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<ValidationIssue>
```

### 3. 关系可视化管理

#### 3.1 生成关系图
```typescript
POST /api/ddd/relationships/schemas/visualization
Body: {
  schemaIds?: string[];              # 指定Schema列表，为空则包含所有
  visualizationType: 'DEPENDENCY_GRAPH' | 'RELATIONSHIP_MATRIX' | 'HIERARCHY_TREE';
  options: {
    includeInactive?: boolean;       # 包含非活跃关系
    showLabels?: boolean;            # 显示标签
    groupByType?: boolean;           # 按类型分组
    layout?: 'FORCE' | 'HIERARCHICAL' | 'CIRCULAR';
  };
}
Response: ApiResponse<VisualizationData>
```

#### 3.2 获取可视化配置
```typescript
GET /api/ddd/relationships/schemas/visualization/configs
Response: PaginatedResponse<VisualizationConfig>
```

### 4. 关系分析管理

#### 4.1 执行关系分析
```typescript
POST /api/ddd/relationships/schemas/analysis
Body: {
  analysisType: 'DEPENDENCY_ANALYSIS' | 'COUPLING_ANALYSIS' | 'IMPACT_ANALYSIS';
  scope: {
    schemaIds?: string[];
    relationshipTypes?: string[];
  };
  parameters: {
    maxDepth?: number;               # 最大分析深度
    includeTransitive?: boolean;     # 包含传递关系
  };
}
Response: ApiResponse<AnalysisResult>
```

#### 4.2 获取分析历史
```typescript
GET /api/ddd/relationships/schemas/analysis/history
Query Parameters:
- analysisType?: string
- dateRange?: string
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<AnalysisHistory>
```

### 5. 关系类型管理 API

#### 5.1 获取引用关系
```typescript
GET /api/ddd/relationships/types/reference
Query Parameters:
- sourceSchema?: string
- targetSchema?: string

Response: PaginatedResponse<ReferenceRelationship>
```

#### 5.2 获取继承关系
```typescript
GET /api/ddd/relationships/types/inheritance
Response: PaginatedResponse<InheritanceRelationship>
```

#### 5.3 获取组合关系
```typescript
GET /api/ddd/relationships/types/composition
Response: PaginatedResponse<CompositionRelationship>
```

#### 5.4 获取聚合关系
```typescript
GET /api/ddd/relationships/types/aggregation
Response: PaginatedResponse<AggregationRelationship>
```

#### 5.5 获取关联关系
```typescript
GET /api/ddd/relationships/types/association
Response: PaginatedResponse<AssociationRelationship>
```

### 6. 关系治理管理 API

#### 6.1 一致性检查
```typescript
POST /api/ddd/relationships/governance/consistency
Body: {
  scope: {
    schemaIds?: string[];
    relationshipIds?: string[];
  };
  checkRules: {
    cyclicDependency: boolean;
    orphanedRelationships: boolean;
    constraintViolations: boolean;
    namingConventions: boolean;
  };
}
Response: ApiResponse<ConsistencyReport>
```

#### 6.2 依赖分析
```typescript
POST /api/ddd/relationships/governance/dependencies
Body: {
  targetSchema: string;              # 目标Schema
  analysisDepth: number;             # 分析深度
  includeIndirect: boolean;          # 包含间接依赖
}
Response: ApiResponse<DependencyGraph>
```

#### 6.3 影响分析
```typescript
POST /api/ddd/relationships/governance/impact
Body: {
  changeType: 'SCHEMA_CHANGE' | 'RELATIONSHIP_CHANGE' | 'FIELD_CHANGE';
  targetElements: string[];          # 变更目标元素
  impactScope: 'IMMEDIATE' | 'TRANSITIVE' | 'FULL';
}
Response: ApiResponse<ImpactAnalysis>
```

## 📊 数据模型

### RelationshipsInfo
```typescript
interface RelationshipsInfo {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Item
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Association
```typescript
interface Association {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### AnalysisReport
```typescript
interface AnalysisReport {
  id: string;
  type: string;
  data: any;
  generatedAt: string;
}
```

### Statistics
```typescript
interface Statistics {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  lastUpdated: string;
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| RELATIONSHIPS.NOT_FOUND | 数据不存在 |
| RELATIONSHIPS.INVALID_DATA | 数据无效 |
| RELATIONSHIPS.DUPLICATE_NAME | 名称重复 |
| RELATIONSHIPS.ACCESS_DENIED | 访问被拒绝 |
| RELATIONSHIPS.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建项目
```typescript
const newItem = {
  name: "示例项目",
  description: "这是一个示例项目",
  isActive: true
};

const response = await fetch('/api/ddd/relationships/domain_001/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newItem)
});
```

### 获取分析报告
```typescript
const response = await fetch('/api/ddd/relationships/domain_001/analysis/report');
const report = await response.json();
console.log('分析报告:', report.data);
```
