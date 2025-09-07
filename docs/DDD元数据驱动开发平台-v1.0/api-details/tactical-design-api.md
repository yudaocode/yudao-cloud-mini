# 战术设计管理 API

## 📋 概述

战术设计管理API基于DDD战术设计模式，提供聚合、实体、值对象、领域服务、仓储等战术元素的全生命周期管理。参考Spring Data、Axon Framework等大厂DDD框架实践。

## 🎯 分层Schema架构 v2.0

### Schema架构设计

本API遵循企业级分层Schema架构模式，提供完整的CRUD操作支持：

### Schema文件组织
```
object-jsonschemas/tactical-design.schemas/
├── fields/                         # 字段级Schema定义
│   ├── aggregate-fields.schema.json        # 聚合字段定义
│   ├── entity-fields.schema.json           # 实体字段定义
│   └── value-object-fields.schema.json     # 值对象字段定义
├── full/                          # 完整对象Schema
│   ├── tactical-design.schema.json         # 完整战术设计对象
│   ├── aggregate.schema.json               # 完整聚合对象
│   ├── entity.schema.json                  # 完整实体对象
│   └── value-object.schema.json            # 完整值对象
└── operations/                    # 操作级Schema
    ├── patch/                     # 部分更新操作
    │   ├── tactical-design-patch.schema.json
    │   ├── aggregate-patch.schema.json
    │   └── entity-patch.schema.json
    └── bulk/                      # 批量操作
        ├── aggregate-bulk.schema.json
        └── entity-bulk.schema.json
```

### CRUD操作映射
- **CREATE/READ**: 使用 `full/*.schema.json` 完整对象Schema
- **UPDATE (PATCH)**: 使用 `operations/patch/*.schema.json` 部分更新Schema  
- **UPDATE (PUT)**: 使用 `full/*.schema.json` 完整替换Schema
- **BULK**: 使用 `operations/bulk/*.schema.json` 批量操作Schema

## 🏗️ API架构设计

### 1. 分层架构
```
/api/ddd/tactical-design/
├── /domains/{domainId}/
│   ├── /aggregates/                 # 聚合管理
│   │   ├── /{aggregateId}/entities  # 聚合内实体
│   │   ├── /{aggregateId}/commands  # 聚合命令
│   │   ├── /{aggregateId}/events    # 聚合事件
│   │   └── /{aggregateId}/rules     # 业务规则
│   ├── /entities/                   # 实体管理
│   │   ├── /{entityId}/attributes   # 实体属性
│   │   ├── /{entityId}/methods      # 实体方法
│   │   ├── /{entityId}/relationships # 实体关系
│   │   └── /{entityId}/lifecycle    # 生命周期
│   ├── /value-objects/              # 值对象管理
│   │   ├── /{valueObjectId}/properties # 值对象属性
│   │   └── /{valueObjectId}/validation # 验证规则
│   ├── /domain-services/            # 领域服务管理
│   │   ├── /{serviceId}/operations  # 服务操作
│   │   └── /{serviceId}/dependencies # 服务依赖
│   ├── /repositories/               # 仓储管理
│   │   ├── /{repositoryId}/operations # 仓储操作
│   │   └── /{repositoryId}/queries    # 查询定义
│   ├── /factories/                  # 工厂管理
│   │   └── /{factoryId}/strategies    # 创建策略
│   └── /enums/                      # 枚举管理
├── /validation/                     # 验证服务
│   ├── /business-rules             # 业务规则验证
│   ├── /invariants                 # 不变量检查
│   └── /constraints                # 约束验证
├── /patterns/                       # 设计模式
│   ├── /aggregate-patterns         # 聚合模式
│   ├── /entity-patterns            # 实体模式
│   └── /service-patterns           # 服务模式
└── /generation/                     # 代码生成
    ├── /templates                  # 代码模板
    ├── /transformations            # 转换规则
    └── /artifacts                  # 生成产物
```

### 2. 核心战术概念

#### 2.1 Aggregate（聚合）
- **Aggregate Root**: 聚合根
- **Entity**: 聚合内实体
- **Value Object**: 值对象
- **Business Rules**: 业务规则

#### 2.2 Domain Services（领域服务）
- **Stateless Operations**: 无状态操作
- **Cross-Aggregate Logic**: 跨聚合逻辑
- **External Integrations**: 外部集成

#### 2.3 Repository（仓储）
- **Aggregate Persistence**: 聚合持久化
- **Query Patterns**: 查询模式
- **Caching Strategy**: 缓存策略

## 📚 API详情

### 1. 聚合管理（Aggregates）

#### 1.1 获取聚合列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/aggregates
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- aggregateType?: 'CRUD' | 'PROCESSING' | 'DOCUMENT'

Response: PaginatedResponse<Aggregate>
```

#### 1.2 创建聚合
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/aggregates
Body: {
  name: string;                    // 聚合名称
  description: string;             // 描述
  aggregateType: 'CRUD' | 'PROCESSING' | 'DOCUMENT';
  rootEntityName: string;          // 聚合根名称
  businessRules: string[];         // 业务规则
  invariants: string[];            // 不变量
  isActive: boolean;
}
Response: ApiResponse<Aggregate>
```

#### 1.3 获取单个聚合
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/aggregates/{aggregateId}
Response: ApiResponse<Aggregate>
```

#### 1.4 更新聚合
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/aggregates/{aggregateId}
Body: {
  name?: string;
  description?: string;
  aggregateType?: 'CRUD' | 'PROCESSING' | 'DOCUMENT';
  businessRules?: string[];
  invariants?: string[];
  isActive?: boolean;
}
Response: ApiResponse<Aggregate>
```

#### 1.5 删除聚合
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/aggregates/{aggregateId}
Response: ApiResponse<void>
```

### 2. 实体管理（Entities）

#### 2.1 获取实体列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/entities
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- aggregateId?: string
- isRoot?: boolean
- entityType?: 'ROOT' | 'CHILD'

Response: PaginatedResponse<Entity>
```

#### 2.2 创建实体
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/entities
Body: {
  name: string;                    // 实体名称
  description: string;             // 描述
  aggregateId: string;             // 所属聚合
  isRoot: boolean;                 // 是否聚合根
  attributes: EntityAttribute[];   // 属性列表
  methods: EntityMethod[];         // 方法列表
  lifecycle: EntityLifecycle;      // 生命周期
  isActive: boolean;
}
Response: ApiResponse<Entity>
```

#### 2.3 获取单个实体
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/entities/{entityId}
Response: ApiResponse<Entity>
```

#### 2.4 更新实体
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/entities/{entityId}
Body: {
  name?: string;
  description?: string;
  attributes?: EntityAttribute[];
  methods?: EntityMethod[];
  lifecycle?: EntityLifecycle;
  isActive?: boolean;
}
Response: ApiResponse<Entity>
```

#### 2.5 删除实体
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/entities/{entityId}
Response: ApiResponse<void>
```

### 3. 值对象管理（Value Objects）

#### 3.1 获取值对象列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/value-objects
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- valueType?: 'SIMPLE' | 'COMPLEX' | 'COLLECTION'
- isActive?: boolean

Response: PaginatedResponse<ValueObject>
```

#### 3.2 创建值对象
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/value-objects
Body: {
  name: string;                    // 值对象名称
  description: string;             // 描述
  valueType: 'SIMPLE' | 'COMPLEX' | 'COLLECTION';
  properties: ValueObjectProperty[]; // 属性列表
  validationRules: ValidationRule[];  // 验证规则
  isImmutable: boolean;            // 是否不可变
  isActive: boolean;
}
Response: ApiResponse<ValueObject>
```

#### 3.3 获取单个值对象
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/value-objects/{valueObjectId}
Response: ApiResponse<ValueObject>
```

#### 3.4 更新值对象
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/value-objects/{valueObjectId}
Body: {
  name?: string;
  description?: string;
  properties?: ValueObjectProperty[];
  validationRules?: ValidationRule[];
  isImmutable?: boolean;
  isActive?: boolean;
}
Response: ApiResponse<ValueObject>
```

#### 3.5 删除值对象
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/value-objects/{valueObjectId}
Response: ApiResponse<void>
```

### 4. 领域服务管理（Domain Services）

#### 4.1 获取领域服务列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/domain-services
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- serviceType?: 'CALCULATION' | 'INTEGRATION' | 'COORDINATION'
- isActive?: boolean

Response: PaginatedResponse<DomainService>
```

#### 4.2 创建领域服务
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/domain-services
Body: {
  name: string;                    // 服务名称
  description: string;             // 描述
  serviceType: 'CALCULATION' | 'INTEGRATION' | 'COORDINATION';
  operations: ServiceOperation[];  // 操作列表
  dependencies: ServiceDependency[]; // 依赖关系
  isStateless: boolean;            // 是否无状态
  isActive: boolean;
}
Response: ApiResponse<DomainService>
```

#### 4.3 获取单个领域服务
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/domain-services/{serviceId}
Response: ApiResponse<DomainService>
```

#### 4.4 更新领域服务
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/domain-services/{serviceId}
Body: {
  name?: string;
  description?: string;
  operations?: ServiceOperation[];
  dependencies?: ServiceDependency[];
  isStateless?: boolean;
  isActive?: boolean;
}
Response: ApiResponse<DomainService>
```

#### 4.5 删除领域服务
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/domain-services/{serviceId}
Response: ApiResponse<void>
```

### 5. 仓储管理（Repositories）

#### 5.1 获取仓储列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/repositories
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- aggregateId?: string
- repositoryType?: 'MEMORY' | 'DATABASE' | 'FILE' | 'EXTERNAL'

Response: PaginatedResponse<Repository>
```

#### 5.2 创建仓储
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/repositories
Body: {
  name: string;                    // 仓储名称
  description: string;             // 描述
  aggregateId: string;             // 对应聚合
  repositoryType: 'MEMORY' | 'DATABASE' | 'FILE' | 'EXTERNAL';
  operations: RepositoryOperation[]; // 操作列表
  queries: RepositoryQuery[];      // 查询定义
  cachingStrategy?: CachingStrategy; // 缓存策略
  isActive: boolean;
}
Response: ApiResponse<Repository>
```

#### 5.3 获取单个仓储
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/repositories/{repositoryId}
Response: ApiResponse<Repository>
```

#### 5.4 更新仓储
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/repositories/{repositoryId}
Body: {
  name?: string;
  description?: string;
  operations?: RepositoryOperation[];
  queries?: RepositoryQuery[];
  cachingStrategy?: CachingStrategy;
  isActive?: boolean;
}
Response: ApiResponse<Repository>
```

#### 5.5 删除仓储
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/repositories/{repositoryId}
Response: ApiResponse<void>
```

### 6. 工厂管理（Factories）

#### 6.1 获取工厂列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/factories
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- factoryType?: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT'
- isActive?: boolean

Response: PaginatedResponse<Factory>
```

#### 6.2 创建工厂
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/factories
Body: {
  name: string;                    // 工厂名称
  description: string;             // 描述
  factoryType: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT';
  targetType: string;              // 目标类型
  creationStrategies: CreationStrategy[]; // 创建策略
  validationRules: ValidationRule[]; // 验证规则
  isActive: boolean;
}
Response: ApiResponse<Factory>
```

#### 6.3 获取单个工厂
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/factories/{factoryId}
Response: ApiResponse<Factory>
```

#### 6.4 更新工厂
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/factories/{factoryId}
Body: {
  name?: string;
  description?: string;
  creationStrategies?: CreationStrategy[];
  validationRules?: ValidationRule[];
  isActive?: boolean;
}
Response: ApiResponse<Factory>
```

#### 6.5 删除工厂
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/factories/{factoryId}
Response: ApiResponse<void>
```

### 7. 枚举管理（Enums）

#### 7.1 获取枚举列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/enums
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- category?: string
- isActive?: boolean

Response: PaginatedResponse<DomainEnum>
```

#### 7.2 创建枚举
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/enums
Body: {
  name: string;                    // 枚举名称
  description: string;             // 描述
  category: string;                // 分类
  values: EnumValue[];             // 枚举值
  defaultValue?: string;           // 默认值
  isActive: boolean;
}
Response: ApiResponse<DomainEnum>
```

#### 7.3 获取单个枚举
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/enums/{enumId}
Response: ApiResponse<DomainEnum>
```

#### 7.4 更新枚举
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/enums/{enumId}
Body: {
  name?: string;
  description?: string;
  values?: EnumValue[];
  defaultValue?: string;
  isActive?: boolean;
}
Response: ApiResponse<DomainEnum>
```

#### 7.5 删除枚举
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/enums/{enumId}
Response: ApiResponse<void>
```

### 8. 验证服务管理

#### 8.1 获取业务规则列表
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/validation/business-rules
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- ruleType?: 'INVARIANT' | 'PRECONDITION' | 'POSTCONDITION'
- scope?: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT'

Response: PaginatedResponse<BusinessRule>
```

#### 8.2 创建业务规则
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/validation/business-rules
Body: {
  name: string;
  description: string;
  ruleType: 'INVARIANT' | 'PRECONDITION' | 'POSTCONDITION';
  scope: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT';
  targetId: string;
  expression: string;
  errorMessage: string;
  isActive: boolean;
}
Response: ApiResponse<BusinessRule>
```

#### 8.3 获取单个业务规则
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/validation/business-rules/{ruleId}
Response: ApiResponse<BusinessRule>
```

#### 8.4 更新业务规则
```typescript
PUT /api/ddd/tactical-design/domains/{domainId}/validation/business-rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  expression?: string;
  errorMessage?: string;
  isActive?: boolean;
}
Response: ApiResponse<BusinessRule>
```

#### 8.5 删除业务规则
```typescript
DELETE /api/ddd/tactical-design/domains/{domainId}/validation/business-rules/{ruleId}
Response: ApiResponse<void>
```

### 9. 设计模式管理

#### 9.1 获取聚合模式列表
```typescript
GET /api/ddd/tactical-design/patterns/aggregate-patterns
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- patternType?: 'CRUD' | 'DOCUMENT' | 'PROCESSING'

Response: PaginatedResponse<AggregatePattern>
```

#### 9.2 创建聚合模式
```typescript
POST /api/ddd/tactical-design/patterns/aggregate-patterns
Body: {
  name: string;
  description: string;
  patternType: 'CRUD' | 'DOCUMENT' | 'PROCESSING';
  structure: PatternStructure;
  guidelines: string[];
  examples: PatternExample[];
  isActive: boolean;
}
Response: ApiResponse<AggregatePattern>
```

#### 9.3 获取实体模式列表
```typescript
GET /api/ddd/tactical-design/patterns/entity-patterns
Response: PaginatedResponse<EntityPattern>
```

#### 9.4 获取服务模式列表
```typescript
GET /api/ddd/tactical-design/patterns/service-patterns
Response: PaginatedResponse<ServicePattern>
```

### 10. 代码生成管理

#### 10.1 获取代码模板列表
```typescript
GET /api/ddd/tactical-design/generation/templates
Query Parameters:
- templateType?: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT' | 'SERVICE' | 'REPOSITORY'
- language?: 'JAVA' | 'CSHARP' | 'TYPESCRIPT' | 'PYTHON'

Response: PaginatedResponse<CodeTemplate>
```

#### 10.2 创建代码模板
```typescript
POST /api/ddd/tactical-design/generation/templates
Body: {
  name: string;
  description: string;
  templateType: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT' | 'SERVICE' | 'REPOSITORY';
  language: 'JAVA' | 'CSHARP' | 'TYPESCRIPT' | 'PYTHON';
  templateContent: string;
  variables: TemplateVariable[];
  isActive: boolean;
}
Response: ApiResponse<CodeTemplate>
```

#### 10.3 生成代码
```typescript
POST /api/ddd/tactical-design/generation/generate
Body: {
  templateId: string;
  targetId: string;
  variables: Record<string, any>;
  outputPath?: string;
}
Response: ApiResponse<GenerationResult>
```

#### 10.4 获取生成历史
```typescript
GET /api/ddd/tactical-design/generation/artifacts
Query Parameters:
- domainId?: string
- templateId?: string
- startDate?: string
- endDate?: string

Response: PaginatedResponse<GenerationArtifact>
```

### 11. 分析服务

#### 11.1 执行战术设计分析
```typescript
POST /api/ddd/tactical-design/domains/{domainId}/analysis
Body: {
  analysisType: 'COMPLEXITY' | 'COUPLING' | 'COHESION' | 'COMPLETENESS';
  scope: string[];
  parameters?: Record<string, any>;
}
Response: ApiResponse<TacticalAnalysisResult>
```

#### 11.2 获取分析结果
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/analysis/{analysisId}
Response: ApiResponse<TacticalAnalysisResult>
```

#### 11.3 获取统计信息
```typescript
GET /api/ddd/tactical-design/domains/{domainId}/statistics
Response: ApiResponse<TacticalStatistics>
```

## 📊 数据模型

### Aggregate
```typescript
interface Aggregate {
  id: string;
  name: string;
  description: string;
  domainId: string;
  aggregateType: 'CRUD' | 'PROCESSING' | 'DOCUMENT';
  rootEntityName: string;
  businessRules: string[];
  invariants: string[];
  entities: string[];               // 聚合内实体ID列表
  valueObjects: string[];           // 值对象ID列表
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Entity
```typescript
interface Entity {
  id: string;
  name: string;
  description: string;
  aggregateId: string;
  isRoot: boolean;
  attributes: EntityAttribute[];
  methods: EntityMethod[];
  relationships: EntityRelationship[];
  lifecycle: EntityLifecycle;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EntityAttribute {
  name: string;
  type: string;
  isRequired: boolean;
  isIdentifier: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
}

interface EntityMethod {
  name: string;
  description: string;
  parameters: MethodParameter[];
  returnType: string;
  isPublic: boolean;
  businessLogic: string;
}

interface EntityRelationship {
  targetEntityId: string;
  relationshipType: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  isNavigable: boolean;
  cascadeType: 'NONE' | 'PERSIST' | 'MERGE' | 'REMOVE' | 'ALL';
}

interface EntityLifecycle {
  creationRules: string[];
  updateRules: string[];
  deletionRules: string[];
  stateTransitions: StateTransition[];
}
```

### ValueObject
```typescript
interface ValueObject {
  id: string;
  name: string;
  description: string;
  domainId: string;
  valueType: 'SIMPLE' | 'COMPLEX' | 'COLLECTION';
  properties: ValueObjectProperty[];
  validationRules: ValidationRule[];
  isImmutable: boolean;
  equalityRules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ValueObjectProperty {
  name: string;
  type: string;
  isRequired: boolean;
  constraints: PropertyConstraint[];
  description: string;
}
```

### DomainService
```typescript
interface DomainService {
  id: string;
  name: string;
  description: string;
  domainId: string;
  serviceType: 'CALCULATION' | 'INTEGRATION' | 'COORDINATION';
  operations: ServiceOperation[];
  dependencies: ServiceDependency[];
  isStateless: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceOperation {
  name: string;
  description: string;
  parameters: MethodParameter[];
  returnType: string;
  businessLogic: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface ServiceDependency {
  dependencyType: 'REPOSITORY' | 'EXTERNAL_SERVICE' | 'DOMAIN_SERVICE';
  targetId: string;
  isRequired: boolean;
  description: string;
}
```

### Repository
```typescript
interface Repository {
  id: string;
  name: string;
  description: string;
  domainId: string;
  aggregateId: string;
  repositoryType: 'MEMORY' | 'DATABASE' | 'FILE' | 'EXTERNAL';
  operations: RepositoryOperation[];
  queries: RepositoryQuery[];
  cachingStrategy?: CachingStrategy;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RepositoryOperation {
  operationType: 'SAVE' | 'FIND_BY_ID' | 'FIND_BY' | 'DELETE' | 'UPDATE';
  methodName: string;
  parameters: MethodParameter[];
  returnType: string;
  implementation: string;
}

interface RepositoryQuery {
  name: string;
  description: string;
  queryType: 'SIMPLE' | 'COMPLEX' | 'NATIVE';
  query: string;
  parameters: QueryParameter[];
  returnType: string;
}
```

### Factory
```typescript
interface Factory {
  id: string;
  name: string;
  description: string;
  domainId: string;
  factoryType: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT';
  targetType: string;
  creationStrategies: CreationStrategy[];
  validationRules: ValidationRule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreationStrategy {
  name: string;
  description: string;
  parameters: MethodParameter[];
  creationLogic: string;
  validationSteps: string[];
}
```

### DomainEnum
```typescript
interface DomainEnum {
  id: string;
  name: string;
  description: string;
  domainId: string;
  category: string;
  values: EnumValue[];
  defaultValue?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnumValue {
  name: string;
  value: any;
  description: string;
  isDeprecated: boolean;
  order: number;
}
```

### BusinessRule
```typescript
interface BusinessRule {
  id: string;
  name: string;
  description: string;
  domainId: string;
  ruleType: 'INVARIANT' | 'PRECONDITION' | 'POSTCONDITION';
  scope: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT';
  targetId: string;
  expression: string;
  errorMessage: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### ValidationRule
```typescript
interface ValidationRule {
  ruleType: 'REQUIRED' | 'RANGE' | 'PATTERN' | 'CUSTOM';
  expression: string;
  errorMessage: string;
  parameters?: Record<string, any>;
}
```

### AggregatePattern
```typescript
interface AggregatePattern {
  id: string;
  name: string;
  description: string;
  patternType: 'CRUD' | 'DOCUMENT' | 'PROCESSING';
  structure: PatternStructure;
  guidelines: string[];
  examples: PatternExample[];
  usageFrequency: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PatternStructure {
  components: PatternComponent[];
  relationships: PatternRelationship[];
  constraints: string[];
}
```

### CodeTemplate
```typescript
interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  templateType: 'AGGREGATE' | 'ENTITY' | 'VALUE_OBJECT' | 'SERVICE' | 'REPOSITORY';
  language: 'JAVA' | 'CSHARP' | 'TYPESCRIPT' | 'PYTHON';
  templateContent: string;
  variables: TemplateVariable[];
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateVariable {
  name: string;
  type: string;
  description: string;
  defaultValue?: any;
  isRequired: boolean;
}
```

### TacticalAnalysisResult
```typescript
interface TacticalAnalysisResult {
  id: string;
  domainId: string;
  analysisType: 'COMPLEXITY' | 'COUPLING' | 'COHESION' | 'COMPLETENESS';
  scope: string[];
  results: {
    metrics: Record<string, number>;
    insights: string[];
    recommendations: string[];
    issues: AnalysisIssue[];
  };
  executedAt: string;
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
}

interface AnalysisIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  category: string;
  description: string;
  affectedElements: string[];
  suggestedFix?: string;
}
```

### TacticalStatistics
```typescript
interface TacticalStatistics {
  domainId: string;
  aggregates: {
    total: number;
    byType: Record<string, number>;
    averageComplexity: number;
  };
  entities: {
    total: number;
    roots: number;
    children: number;
    averageAttributeCount: number;
  };
  valueObjects: {
    total: number;
    byType: Record<string, number>;
  };
  services: {
    total: number;
    byType: Record<string, number>;
  };
  repositories: {
    total: number;
    byType: Record<string, number>;
  };
  lastUpdated: string;
}
```

### Common Types
```typescript
interface MethodParameter {
  name: string;
  type: string;
  isRequired: boolean;
  defaultValue?: any;
  description: string;
}

interface QueryParameter {
  name: string;
  type: string;
  isRequired: boolean;
  description: string;
}

interface PropertyConstraint {
  type: 'MIN_LENGTH' | 'MAX_LENGTH' | 'PATTERN' | 'RANGE' | 'CUSTOM';
  value: any;
  errorMessage: string;
}

interface StateTransition {
  fromState: string;
  toState: string;
  trigger: string;
  conditions: string[];
  actions: string[];
}

interface CachingStrategy {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  evictionPolicy: 'LRU' | 'LFU' | 'FIFO';
}

interface GenerationResult {
  success: boolean;
  generatedFiles: GeneratedFile[];
  errors: string[];
  warnings: string[];
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

interface GenerationArtifact {
  id: string;
  templateId: string;
  targetId: string;
  generatedAt: string;
  files: GeneratedFile[];
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| TACTICAL-DESIGN.NOT_FOUND | 数据不存在 |
| TACTICAL-DESIGN.INVALID_DATA | 数据无效 |
| TACTICAL-DESIGN.DUPLICATE_NAME | 名称重复 |
| TACTICAL-DESIGN.ACCESS_DENIED | 访问被拒绝 |
| TACTICAL-DESIGN.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建项目
```typescript
const newItem = {
  name: "示例项目",
  description: "这是一个示例项目",
  isActive: true
};

const response = await fetch('/api/ddd/tactical-design/domain_001/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newItem)
});
```

### 获取分析报告
```typescript
const response = await fetch('/api/ddd/tactical-design/domain_001/analysis/report');
const report = await response.json();
console.log('分析报告:', report.data);
```
