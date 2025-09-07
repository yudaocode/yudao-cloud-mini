# 数据传输对象 (DTO) 管理 API

## 📋 概述

DTO管理API基于企业级数据传输最佳实践，提供DTO定义、映射、验证、版本控制等全生命周期管理。参考Netflix、Spotify等大厂API设计模式和GraphQL、gRPC等现代数据传输标准。

## 🎯 分层Schema架构 v2.0

### Schema架构设计

本API遵循企业级分层Schema架构模式，提供完整的CRUD操作支持：

### Schema文件组织
```
object-jsonschemas/data-transfer-objects.schemas/
├── fields/                         # 字段级Schema定义
│   ├── common-fields.schema.json   # 通用字段定义
│   ├── dto-fields.schema.json      # DTO字段定义
│   └── mapping-fields.schema.json  # 映射字段定义
├── full/                          # 完整对象Schema
│   ├── data-transfer-objects.schema.json   # 完整DTO管理对象
│   ├── dto-definition.schema.json          # 完整DTO定义对象
│   └── dto-mapping.schema.json             # 完整DTO映射对象
└── operations/                    # 操作级Schema
    ├── patch/                     # 部分更新操作
    │   ├── dto-definition-patch.schema.json
    │   └── dto-mapping-patch.schema.json
    └── bulk/                      # 批量操作
        ├── dto-bulk.schema.json
        └── mapping-bulk.schema.json
```

### CRUD操作映射
- **CREATE/READ**: 使用 `full/*.schema.json` 完整对象Schema
- **UPDATE (PATCH)**: 使用 `operations/patch/*.schema.json` 部分更新Schema  
- **UPDATE (PUT)**: 使用 `full/*.schema.json` 完整替换Schema
- **BULK**: 使用 `operations/bulk/*.schema.json` 批量操作Schema

## 🏗️ API架构设计

### 1. 分层架构
```
/api/ddd/data-transfer-objects/
├── /domains/{domainId}/
│   ├── /dtos/                       # DTO定义管理
│   │   ├── /{dtoId}/attributes      # DTO属性
│   │   ├── /{dtoId}/validation      # 验证规则
│   │   ├── /{dtoId}/mappings        # 映射关系
│   │   ├── /{dtoId}/versions        # 版本历史
│   │   └── /{dtoId}/documentation   # 文档说明
│   ├── /mappings/                   # 映射规则管理
│   │   ├── /domain-to-dto          # 领域模型到DTO
│   │   ├── /dto-to-dto             # DTO间映射
│   │   ├── /dto-to-api             # DTO到API映射
│   │   └── /transformations        # 转换规则
│   ├── /validation/                 # 验证管理
│   │   ├── /rules                  # 验证规则
│   │   ├── /constraints            # 约束条件
│   │   └── /schemas                # 验证模式
│   └── /generation/                 # 代码生成
│       ├── /templates              # 生成模板
│       ├── /serializers            # 序列化器
│       └── /deserializers          # 反序列化器
├── /catalog/                        # DTO目录
│   ├── /search                     # 搜索发现
│   ├── /browse                     # 分类浏览
│   └── /recommendations            # 推荐DTO
├── /governance/                     # 治理管理
│   ├── /standards                  # 标准规范
│   ├── /compliance                 # 合规检查
│   └── /metrics                    # 质量指标
└── /integration/                    # 集成管理
    ├── /openapi                    # OpenAPI集成
    ├── /graphql                    # GraphQL集成
    ├── /grpc                       # gRPC集成
    └── /avro                       # Apache Avro集成
```

### 2. 核心概念

#### 2.1 DTO类型分类
- **Request DTO**: 请求数据传输对象
- **Response DTO**: 响应数据传输对象  
- **Command DTO**: 命令数据传输对象
- **Query DTO**: 查询数据传输对象
- **Event DTO**: 事件数据传输对象
- **Internal DTO**: 内部传输对象

#### 2.2 映射模式
- **Direct Mapping**: 直接映射
- **Transformation Mapping**: 转换映射
- **Aggregation Mapping**: 聚合映射
- **Projection Mapping**: 投影映射

#### 2.3 验证策略
- **Schema Validation**: 模式验证
- **Business Rule Validation**: 业务规则验证
- **Cross-Reference Validation**: 交叉引用验证

## 📚 API详情

### 1. DTO管理

#### 1.1 获取DTO列表
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/dtos
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- dtoType?: 'REQUEST' | 'RESPONSE' | 'COMMAND' | 'QUERY' | 'EVENT' | 'INTERNAL'
- isActive?: boolean
- sortBy?: 'name' | 'dtoType' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DTO>
```

#### 1.2 创建DTO
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/dtos
Body: {
  name: string;                    // DTO名称
  description: string;             // 描述
  dtoType: 'REQUEST' | 'RESPONSE' | 'COMMAND' | 'QUERY' | 'EVENT' | 'INTERNAL';
  packageName: string;             // 包名
  className: string;               // 类名
  attributes: DTOAttribute[];      // 属性列表
  validationRules: ValidationRule[]; // 验证规则
  documentation?: string;          // 文档说明
  tags?: string[];                 // 标签
  isActive: boolean;
}
Response: ApiResponse<DTO>
```

#### 1.3 获取单个DTO
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}
Response: ApiResponse<DTO>
```

#### 1.4 更新DTO
```typescript
PUT /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}
Body: {
  name?: string;
  description?: string;
  dtoType?: 'REQUEST' | 'RESPONSE' | 'COMMAND' | 'QUERY' | 'EVENT' | 'INTERNAL';
  packageName?: string;
  className?: string;
  attributes?: DTOAttribute[];
  validationRules?: ValidationRule[];
  documentation?: string;
  tags?: string[];
  isActive?: boolean;
}
Response: ApiResponse<DTO>
```

#### 1.5 删除DTO
```typescript
DELETE /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}
Response: ApiResponse<void>
```

### 2. DTO属性管理

#### 2.1 获取DTO属性列表
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}/attributes
Response: ApiResponse<DTOAttribute[]>
```

#### 2.2 添加DTO属性
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}/attributes
Body: {
  name: string;                    // 属性名称
  type: string;                    // 数据类型
  description: string;             // 描述
  isRequired: boolean;             // 是否必填
  isCollection: boolean;           // 是否集合类型
  defaultValue?: any;              // 默认值
  constraints?: AttributeConstraints; // 约束条件
  annotations?: string[];          // 注解列表
  order: number;                   // 排序
}
Response: ApiResponse<DTOAttribute>
```

#### 2.3 更新DTO属性
```typescript
PUT /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}/attributes/{attributeId}
Body: {
  name?: string;
  type?: string;
  description?: string;
  isRequired?: boolean;
  isCollection?: boolean;
  defaultValue?: any;
  constraints?: AttributeConstraints;
  annotations?: string[];
  order?: number;
}
Response: ApiResponse<DTOAttribute>
```

#### 2.4 删除DTO属性
```typescript
DELETE /api/ddd/data-transfer-objects/domains/{domainId}/dtos/{dtoId}/attributes/{attributeId}
Response: ApiResponse<void>
```

### 3. 映射管理

#### 3.1 获取映射规则列表
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/mappings
Query Parameters:
- mappingType?: 'DOMAIN_TO_DTO' | 'DTO_TO_DTO' | 'DTO_TO_API'
- sourceId?: string
- targetId?: string

Response: ApiResponse<DTOMapping[]>
```

#### 3.2 创建映射规则
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/mappings
Body: {
  name: string;                    // 映射名称
  description: string;             // 描述
  mappingType: 'DOMAIN_TO_DTO' | 'DTO_TO_DTO' | 'DTO_TO_API';
  sourceId: string;                // 源ID
  targetId: string;                // 目标ID
  fieldMappings: FieldMapping[];   // 字段映射
  transformationRules: TransformationRule[]; // 转换规则
  conditions?: MappingCondition[]; // 映射条件
  isActive: boolean;
}
Response: ApiResponse<DTOMapping>
```

#### 3.3 获取单个映射规则
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/mappings/{mappingId}
Response: ApiResponse<DTOMapping>
```

#### 3.4 更新映射规则
```typescript
PUT /api/ddd/data-transfer-objects/domains/{domainId}/mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  fieldMappings?: FieldMapping[];
  transformationRules?: TransformationRule[];
  conditions?: MappingCondition[];
  isActive?: boolean;
}
Response: ApiResponse<DTOMapping>
```

#### 3.5 删除映射规则
```typescript
DELETE /api/ddd/data-transfer-objects/domains/{domainId}/mappings/{mappingId}
Response: ApiResponse<void>
```

### 4. 验证规则管理

#### 4.1 获取验证规则列表
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/validation/rules
Query Parameters:
- dtoId?: string
- ruleType?: 'SCHEMA' | 'BUSINESS' | 'CROSS_REFERENCE'
- isActive?: boolean

Response: ApiResponse<ValidationRule[]>
```

#### 4.2 创建验证规则
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/validation/rules
Body: {
  name: string;                    // 规则名称
  description: string;             // 描述
  ruleType: 'SCHEMA' | 'BUSINESS' | 'CROSS_REFERENCE';
  targetDtoId: string;             // 目标DTO ID
  expression: string;              // 验证表达式
  errorMessage: string;            // 错误信息
  severity: 'ERROR' | 'WARNING' | 'INFO';
  order: number;                   // 执行顺序
  isActive: boolean;
}
Response: ApiResponse<ValidationRule>
```

#### 4.3 更新验证规则
```typescript
PUT /api/ddd/data-transfer-objects/domains/{domainId}/validation/rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  expression?: string;
  errorMessage?: string;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  order?: number;
  isActive?: boolean;
}
Response: ApiResponse<ValidationRule>
```

#### 4.4 删除验证规则
```typescript
DELETE /api/ddd/data-transfer-objects/domains/{domainId}/validation/rules/{ruleId}
Response: ApiResponse<void>
```

### 5. 代码生成管理

#### 5.1 获取生成模板列表
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/generation/templates
Query Parameters:
- language?: 'JAVA' | 'CSHARP' | 'TYPESCRIPT' | 'PYTHON' | 'GO'
- framework?: 'SPRING_BOOT' | 'ASP_NET_CORE' | 'EXPRESS' | 'DJANGO'

Response: ApiResponse<GenerationTemplate[]>
```

#### 5.2 创建生成模板
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/generation/templates
Body: {
  name: string;                    // 模板名称
  description: string;             // 描述
  language: 'JAVA' | 'CSHARP' | 'TYPESCRIPT' | 'PYTHON' | 'GO';
  framework: 'SPRING_BOOT' | 'ASP_NET_CORE' | 'EXPRESS' | 'DJANGO';
  templateContent: string;         // 模板内容
  variables: TemplateVariable[];   // 模板变量
  isActive: boolean;
}
Response: ApiResponse<GenerationTemplate>
```

#### 5.3 生成DTO代码
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/generation/generate
Body: {
  dtoId: string;                   // DTO ID
  templateId: string;              // 模板ID
  language: string;                // 目标语言
  outputPath?: string;             // 输出路径
  variables?: Record<string, any>; // 变量值
}
Response: ApiResponse<GenerationResult>
```

#### 5.4 获取生成历史
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/generation/history
Query Parameters:
- dtoId?: string
- templateId?: string
- startDate?: string
- endDate?: string

Response: PaginatedResponse<GenerationHistory>
```

### 6. DTO目录管理

#### 6.1 搜索DTO
```typescript
GET /api/ddd/data-transfer-objects/catalog/search
Query Parameters:
- query: string
- dtoType?: string
- domain?: string
- tags?: string[]
- page?: number
- size?: number

Response: PaginatedResponse<DTOSearchResult>
```

#### 6.2 浏览DTO分类
```typescript
GET /api/ddd/data-transfer-objects/catalog/browse
Query Parameters:
- category?: string
- domain?: string
- page?: number
- size?: number

Response: PaginatedResponse<DTO>
```

#### 6.3 获取DTO推荐
```typescript
GET /api/ddd/data-transfer-objects/catalog/recommendations
Query Parameters:
- basedOnDtoId?: string
- domain?: string
- limit?: number

Response: ApiResponse<DTORecommendation[]>
```

### 7. 治理管理

#### 7.1 检查合规性
```typescript
POST /api/ddd/data-transfer-objects/domains/{domainId}/governance/compliance/check
Body: {
  dtoIds: string[];                // 要检查的DTO ID列表
  rules: string[];                 // 要应用的规则
}
Response: ApiResponse<ComplianceReport>
```

#### 7.2 获取质量指标
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/governance/metrics
Query Parameters:
- timeRange?: string
- metricType?: 'COMPLEXITY' | 'REUSABILITY' | 'CONSISTENCY'

Response: ApiResponse<QualityMetrics>
```

#### 7.3 获取标准规范
```typescript
GET /api/ddd/data-transfer-objects/governance/standards
Response: ApiResponse<DTOStandard[]>
```

### 8. 集成管理

#### 8.1 导出OpenAPI规范
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/integration/openapi/export
Query Parameters:
- dtoIds?: string[]
- version?: string

Response: ApiResponse<OpenAPISpec>
```

#### 8.2 导出GraphQL Schema
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/integration/graphql/export
Query Parameters:
- dtoIds?: string[]

Response: ApiResponse<GraphQLSchema>
```

#### 8.3 导出gRPC Proto
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/integration/grpc/export
Query Parameters:
- dtoIds?: string[]
- packageName?: string

Response: ApiResponse<ProtoSpec>
```

#### 8.4 导出Avro Schema
```typescript
GET /api/ddd/data-transfer-objects/domains/{domainId}/integration/avro/export
Query Parameters:
- dtoIds?: string[]
- namespace?: string

Response: ApiResponse<AvroSchema>
```
  // 关联数据
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 4. 分析服务

#### 4.1 获取分析报告
```typescript
GET /api/ddd/data-transfer-objects/{domainId}/analysis/report
Response: ApiResponse<AnalysisReport>
```

#### 4.2 获取统计信息
```typescript
GET /api/ddd/data-transfer-objects/{domainId}/analysis/statistics
Response: ApiResponse<Statistics>
```

## 📊 数据模型

### DataTransferObjectsInfo
```typescript
interface DataTransferObjectsInfo {
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
| DATA-TRANSFER-OBJECTS.NOT_FOUND | 数据不存在 |
| DATA-TRANSFER-OBJECTS.INVALID_DATA | 数据无效 |
| DATA-TRANSFER-OBJECTS.DUPLICATE_NAME | 名称重复 |
| DATA-TRANSFER-OBJECTS.ACCESS_DENIED | 访问被拒绝 |
| DATA-TRANSFER-OBJECTS.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建项目
```typescript
const newItem = {
  name: "示例项目",
  description: "这是一个示例项目",
  isActive: true
};

const response = await fetch('/api/ddd/data-transfer-objects/domain_001/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newItem)
});
```

### 获取分析报告
```typescript
const response = await fetch('/api/ddd/data-transfer-objects/domain_001/analysis/report');
const report = await response.json();
console.log('分析报告:', report.data);
```
