#### 5.4 获取单个DTO
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}
Response: ApiResponse<DataTransferObject>
```

#### 5.5 创建DTO
```typescript
POST /api/ddd/data-transfer-objects/{boundedContextId}/dtos
Body: {
  name: string;  // 必填，DTO名称
  description: string;  // 必填，DTO描述
  englishName?: string;  // 英文名称
  type: 'COMMAND' | 'QUERY' | 'REQUEST' | 'RESPONSE' | 'EVENT' | 'VIEW' | 'PROJECTION' | 'VALUE_OBJECT';  // 必填，DTO类型
  layer: 'CLIENT' | 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE';  // 必填，所属层
  purpose?: string;  // 用途说明
  attributes: DtoAttribute[];  // 必填，DTO属性列表
  termReferences?: string[];  // 术语引用ID列表
  validationRules?: ValidationRule[];  // 验证规则列表
  serialization?: Serialization;  // 序列化配置
  example?: Record<string, any>;  // 示例数据
  isImmutable?: boolean;  // 是否不可变
  generateBuilder?: boolean;  // 是否生成Builder模式
  isActive?: boolean;  // 是否激活
  version?: string;  // 版本号
  deprecated?: boolean;  // 是否已废弃
  replacementDtoId?: string;  // 替代DTO ID
}
Response: ApiResponse<DataTransferObject>
```

#### 5.6 更新DTO
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}
Body: {
  name?: string;
  description?: string;
  englishName?: string;
  type?: 'COMMAND' | 'QUERY' | 'REQUEST' | 'RESPONSE' | 'EVENT' | 'VIEW' | 'PROJECTION' | 'VALUE_OBJECT';
  layer?: 'CLIENT' | 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE';
  purpose?: string;
  attributes?: DtoAttribute[];
  termReferences?: string[];
  validationRules?: ValidationRule[];
  serialization?: Serialization;
  example?: Record<string, any>;
  isImmutable?: boolean;
  generateBuilder?: boolean;
  isActive?: boolean;
  version?: string;
  deprecated?: boolean;
  replacementDtoId?: string;
}
Response: ApiResponse<DataTransferObject>
```

#### 5.7 删除DTO
```typescript
DELETE /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}
Response: ApiResponse<void>
```

#### 5.8 获取DTO属性列表
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/attributes
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- dataType?: string
- isRequired?: boolean
- businessAttributeId?: string
- dtoAttributeId?: string
- sortBy?: 'name' | 'dataType' | 'isRequired' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DtoAttribute>
```

#### 5.9 获取单个DTO属性
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/attributes/{attributeId}
Response: ApiResponse<DtoAttribute>
```

#### 5.10 创建DTO属性
```typescript
POST /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/attributes
Body: {
  name: string;  // 必填，属性名称
  programmingName: string;  // 必填，编程名称
  description: string;  // 必填，属性描述
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;       // 引用其他DTO属性（次优先级）
  dataType?: string;             // 直接数据类型定义（最低优先级）
  isRequired?: boolean;          // 是否必填
  defaultValue?: any;            // 默认值
  validationRules?: string[];    // 验证规则列表
  // 以下字段从业务属性或DTO属性继承
  unit?: string;                 // 单位
  format?: string;               // 格式
  constraints?: Constraints;      // 约束条件
  isUnique?: boolean;           // 是否唯一
  isReadOnly?: boolean;         // 是否只读
  businessLogic?: string;        // 业务逻辑描述
  examples?: string[];           // 示例值列表
  // 支持集合类型和嵌套类型
  isCollection?: boolean;        // 是否为集合类型
  collectionType?: 'LIST' | 'SET' | 'MAP' | 'ARRAY';  // 集合类型
  nestedType?: string;           // 嵌套类型名称
  nestedDtoId?: string;          // 嵌套DTO ID
  nestedEntityId?: string;       // 嵌套实体ID
  nestedValueObjectId?: string;  // 嵌套值对象ID
}
Response: ApiResponse<DtoAttribute>
```

#### 5.11 更新DTO属性
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/attributes/{attributeId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  businessAttributeId?: string;
  dtoAttributeId?: string;
  dataType?: string;
  isRequired?: boolean;
  defaultValue?: any;
  validationRules?: string[];
  unit?: string;
  format?: string;
  constraints?: Constraints;
  isUnique?: boolean;
  isReadOnly?: boolean;
  businessLogic?: string;
  examples?: string[];
  isCollection?: boolean;
  collectionType?: 'LIST' | 'SET' | 'MAP' | 'ARRAY';
  nestedType?: string;
  nestedDtoId?: string;
  nestedEntityId?: string;
  nestedValueObjectId?: string;
}
Response: ApiResponse<DtoAttribute>
```

#### 5.12 删除DTO属性
```typescript
DELETE /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/attributes/{attributeId}
Response: ApiResponse<void>
```

#### 5.13 获取DTO映射列表
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dto-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- sourceType?: 'ENTITY' | 'DTO' | 'VALUE_OBJECT'
- targetType?: 'DTO' | 'ENTITY' | 'VALUE_OBJECT'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DtoMapping>
```

#### 5.14 获取单个DTO映射
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dto-mappings/{mappingId}
Response: ApiResponse<DtoMapping>
```

#### 5.15 创建DTO映射
```typescript
POST /api/ddd/data-transfer-objects/{boundedContextId}/dto-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  sourceType: 'ENTITY' | 'DTO' | 'VALUE_OBJECT';  // 必填，源类型
  sourceId: string;  // 必填，源ID
  targetType: 'DTO' | 'ENTITY' | 'VALUE_OBJECT';  // 必填，目标类型
  targetId: string;  // 必填，目标ID
  mappingType: 'ENTITY_TO_DTO' | 'DTO_TO_ENTITY' | 'DTO_TO_DTO' | 'VALUE_OBJECT_TO_DTO';  // 必填，映射类型
  fieldMappings: FieldMapping[];  // 必填，字段映射列表
  transformationRules?: TransformationRule[];  // 转换规则列表
  validationRules?: ValidationRule[];  // 验证规则列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<DtoMapping>
```

#### 5.16 更新DTO映射
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/dto-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  sourceType?: 'ENTITY' | 'DTO' | 'VALUE_OBJECT';
  sourceId?: string;
  targetType?: 'DTO' | 'ENTITY' | 'VALUE_OBJECT';
  targetId?: string;
  mappingType?: 'ENTITY_TO_DTO' | 'DTO_TO_ENTITY' | 'DTO_TO_DTO' | 'VALUE_OBJECT_TO_DTO';
  fieldMappings?: FieldMapping[];
  transformationRules?: TransformationRule[];
  validationRules?: ValidationRule[];
  isActive?: boolean;
}
Response: ApiResponse<DtoMapping>
```

#### 5.17 删除DTO映射
```typescript
DELETE /api/ddd/data-transfer-objects/{boundedContextId}/dto-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 5.18 DTO关联服务 - 获取DTO的术语关联
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 5.19 DTO关联服务 - 获取DTO的实体关联
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/entity-associations
Response: ApiResponse<EntityAssociation[]>
```

#### 5.20 DTO关联服务 - 获取DTO的聚合关联
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/aggregate-associations
Response: ApiResponse<AggregateAssociation[]>
```

#### 5.21 DTO关联服务 - 获取DTO的屏幕关联
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 5.22 DTO关联服务 - 批量更新DTO关联
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/dtos/{dtoId}/associations
Body: {
  termAssociations?: TermAssociation[];
  entityAssociations?: EntityAssociation[];
  aggregateAssociations?: AggregateAssociation[];
  screenAssociations?: ScreenAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 5.23 DTO分析服务 - 获取依赖关系图
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dependency-graph
Query Parameters:
- dtoId?: string;  // 指定DTO ID，为空则显示所有
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- depth?: number (default: 2)

Response: ApiResponse<DtoDependencyGraph>
```

#### 5.24 DTO分析服务 - 获取使用情况分析
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/usage-analysis
Query Parameters:
- dtoId?: string;  // 指定DTO ID，为空则分析所有
- timeRange?: string;  // 时间范围
- includeInactive?: boolean;  // 是否包含非激活使用

Response: ApiResponse<DtoUsageAnalysis>
```

#### 5.25 DTO分析服务 - 获取一致性检查
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/consistency-check
Query Parameters:
- dtoId?: string;  // 指定DTO ID，为空则检查所有
- checkType?: 'ATTRIBUTE' | 'MAPPING' | 'REFERENCE' | 'ALL';  // 检查类型

Response: ApiResponse<DtoConsistencyCheck>
```

#### 5.26 DTO代码生成服务 - 生成DTO代码
```typescript
POST /api/ddd/data-transfer-objects/{boundedContextId}/code-generation
Body: {
  dtoIds?: string[];  // DTO ID列表，为空则生成所有
  targetLanguage?: 'JAVA' | 'C_SHARP' | 'PYTHON' | 'TYPESCRIPT' | 'JAVASCRIPT'
  includeDocumentation?: boolean;  // 是否包含文档
  includeValidation?: boolean;  // 是否包含验证
  includeSerialization?: boolean;  // 是否包含序列化
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<DtoCodeGenerationResult>
```

#### 5.27 DTO代码生成服务 - 获取代码生成模板
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/code-templates
Query Parameters:
- targetLanguage?: 'JAVA' | 'C_SHARP' | 'PYTHON' | 'TYPESCRIPT' | 'JAVASCRIPT'
- templateType?: 'DTO' | 'MAPPER' | 'VALIDATOR' | 'SERIALIZER'

Response: ApiResponse<CodeTemplate[]>
```

#### 5.28 DTO代码生成服务 - 更新代码生成模板
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/code-templates/{templateId}
Body: {
  name?: string;  // 模板名称
  description?: string;  // 模板描述
  content?: string;  // 模板内容
  variables?: TemplateVariable[];  // 模板变量
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<CodeTemplate>
```
