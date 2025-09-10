# 🔄 DDD模型自动转换AMIS系统 - 避免重复定义的完整方案

## 🎯 核心目标

实现**DDD模型与AMIS界面的完全自动化转换**，确保：
- ✅ **单一数据源** - DDD模型为唯一真实来源
- ✅ **自动同步** - 模型变更自动反映到界面
- ✅ **零重复定义** - 避免在多处维护相同信息
- ✅ **类型安全** - 编译时检查一致性

## 🏗️ 整体架构设计

```
DDD元数据模型 (唯一数据源)
    ↓
模型转换引擎 (自动转换)
    ↓
AMIS增强配置 (最小化配置)
    ↓
AMIS界面渲染 (自动生成)
```

## 📊 模型映射策略

### 1. **实体 → AMIS表格列**

#### DDD实体定义
```json
{
  "entityId": "entity_customer",
  "name": "Customer",
  "attributes": [
    {
      "attributeId": "attr_customer_name",
      "name": "customerName",
      "type": {"baseType": "STRING", "maxLength": 100},
      "constraints": {
        "isRequired": true,
        "isUnique": false
      },
      "businessMeaning": "客户姓名",
      "ubiquitousLanguageTermId": "term_customer_name"
    },
    {
      "attributeId": "attr_customer_email", 
      "name": "email",
      "type": {"baseType": "STRING", "pattern": "email"},
      "constraints": {
        "isRequired": true,
        "isUnique": true
      },
      "businessMeaning": "客户邮箱"
    },
    {
      "attributeId": "attr_customer_status",
      "name": "status",
      "type": {
        "baseType": "ENUM",
        "allowedValues": ["ACTIVE", "INACTIVE", "SUSPENDED"]
      },
      "businessMeaning": "客户状态"
    }
  ]
}
```

#### 自动生成AMIS列配置
```typescript
class DDDToAmisConverter {
  
  entityToTableColumns(entity: DDDEntity): AmisColumn[] {
    return entity.attributes.map(attr => {
      const column: AmisColumn = {
        name: attr.name,
        label: this.getDisplayLabel(attr),
        type: this.mapDataTypeToAmisType(attr.type),
        sortable: this.isSortable(attr),
        searchable: this.isSearchable(attr)
      };
      
      // 基于业务含义的特殊处理
      if (attr.type.baseType === "ENUM") {
        column.type = "mapping";
        column.map = this.buildEnumMapping(attr.type.allowedValues);
      }
      
      if (attr.type.pattern === "email") {
        column.type = "link";
        column.href = "mailto:${email}";
      }
      
      return column;
    });
  }
  
  private getDisplayLabel(attr: DDDAttribute): string {
    // 优先使用统一语言术语的显示名
    if (attr.ubiquitousLanguageTermId) {
      return this.getTermDisplayName(attr.ubiquitousLanguageTermId);
    }
    // 其次使用业务含义
    if (attr.businessMeaning) {
      return attr.businessMeaning;
    }
    // 最后使用属性名的人性化版本
    return this.humanizeAttributeName(attr.name);
  }
  
  private mapDataTypeToAmisType(dataType: DDDDataType): string {
    const typeMapping = {
      "STRING": "text",
      "INTEGER": "number", 
      "DECIMAL": "number",
      "BOOLEAN": "switch",
      "DATE": "date",
      "DATETIME": "datetime",
      "ENUM": "mapping",
      "EMAIL": "link",
      "PHONE": "text",
      "URL": "link"
    };
    
    return typeMapping[dataType.baseType] || "text";
  }
}
```

### 2. **聚合 → AMIS表单Schema**

#### DDD聚合定义转表单
```typescript
class AggregateToFormConverter {
  
  aggregateToFormSchema(aggregate: DDDAggregate): AmisFormSchema {
    const rootEntity = aggregate.aggregateRoot;
    
    return {
      type: "form",
      title: `${aggregate.name}表单`,
      body: [
        // 聚合根字段
        ...this.entityToFormFields(rootEntity),
        
        // 值对象字段 (嵌套表单)
        ...aggregate.valueObjects.map(vo => 
          this.valueObjectToFormGroup(vo)
        ),
        
        // 子实体字段 (子表单)
        ...aggregate.entities.map(entity =>
          this.entityToSubForm(entity)
        )
      ],
      api: this.buildFormApi(aggregate)
    };
  }
  
  private entityToFormFields(entity: DDDEntity): AmisFormField[] {
    return entity.attributes.map(attr => {
      const field: AmisFormField = {
        name: attr.name,
        label: this.getDisplayLabel(attr),
        type: this.mapToFormFieldType(attr),
        required: attr.constraints.isRequired,
        placeholder: this.generatePlaceholder(attr)
      };
      
      // 基于验证规则生成validations
      if (attr.validationRules?.length > 0) {
        field.validations = this.buildValidationRules(attr.validationRules);
      }
      
      // 基于业务规则生成visibleOn/disabledOn
      if (attr.businessRules?.length > 0) {
        field.visibleOn = this.buildBusinessRuleExpression(attr.businessRules);
      }
      
      return field;
    });
  }
  
  private valueObjectToFormGroup(vo: DDDValueObject): AmisFormGroup {
    return {
      type: "group",
      title: vo.name,
      body: this.entityToFormFields(vo) // 值对象当作实体处理
    };
  }
}
```

### 3. **仓储 → AMIS API配置**

#### 自动生成API配置
```typescript
class RepositoryToApiConverter {
  
  repositoryToApiConfig(repository: DDDRepository): AmisApiConfig {
    const baseUrl = this.buildRepositoryBaseUrl(repository);
    
    return {
      // 基于仓储操作自动生成API端点
      endpoints: repository.operations.reduce((endpoints, op) => {
        endpoints[op.type.toLowerCase()] = this.buildEndpointUrl(baseUrl, op);
        return endpoints;
      }, {}),
      
      // 基于聚合类型生成请求/响应转换
      requestTransforms: this.buildRequestTransforms(repository),
      responseTransforms: this.buildResponseTransforms(repository)
    };
  }
  
  private buildEndpointUrl(baseUrl: string, operation: RepositoryOperation): string {
    const urlPatterns = {
      "FIND_BY_ID": `${baseUrl}/\${id}`,
      "FIND_BY_CRITERIA": `${baseUrl}/search`,
      "SAVE": `${baseUrl}`,
      "DELETE": `${baseUrl}/\${id}`,
      "COUNT": `${baseUrl}/count`,
      "EXISTS": `${baseUrl}/\${id}/exists`
    };
    
    return urlPatterns[operation.type] || baseUrl;
  }
}
```

## 🔧 实现核心组件

### 1. **模型元数据解析器**

```typescript
class DDDMetadataParser {
  
  async parseAggregateMetadata(aggregateId: string): Promise<DDDAggregateMetadata> {
    // 从Schema文件加载聚合定义
    const aggregateSchema = await this.loadSchema(`aggregate/${aggregateId}.json`);
    
    // 解析实体和值对象
    const entities = await Promise.all(
      aggregateSchema.entities.map(entityId => 
        this.loadSchema(`entity/${entityId}.json`)
      )
    );
    
    // 解析仓储定义
    const repositories = await Promise.all(
      aggregateSchema.repositories.map(repoId =>
        this.loadSchema(`repository/${repoId}.json`)
      )
    );
    
    return {
      aggregate: aggregateSchema,
      entities,
      valueObjects: aggregateSchema.valueObjects,
      repositories,
      // 解析业务规则和验证规则
      businessRules: await this.loadBusinessRules(aggregateSchema.businessRules),
      validationRules: await this.loadValidationRules(aggregateSchema)
    };
  }
  
  // 构建完整的类型映射
  buildTypeMapping(): DDDToAmisTypeMapping {
    return {
      dataTypes: new Map([
        ["STRING", { amisType: "input-text", defaultProps: {} }],
        ["INTEGER", { amisType: "input-number", defaultProps: { precision: 0 } }],
        ["DECIMAL", { amisType: "input-number", defaultProps: { precision: 2 } }],
        ["EMAIL", { amisType: "input-email", defaultProps: { validations: { isEmail: true } } }],
        ["PHONE", { amisType: "input-text", defaultProps: { validations: { isPhoneNumber: true } } }],
        ["DATE", { amisType: "input-date", defaultProps: { format: "YYYY-MM-DD" } }],
        ["DATETIME", { amisType: "input-datetime", defaultProps: { format: "YYYY-MM-DD HH:mm:ss" } }]
      ]),
      
      constraints: new Map([
        ["isRequired", (attr) => ({ required: true })],
        ["isUnique", (attr) => ({ validations: { remote: `/api/validation/unique/${attr.name}` } })],
        ["maxLength", (attr) => ({ maxLength: attr.constraints.maxValue })],
        ["minLength", (attr) => ({ minLength: attr.constraints.minValue })]
      ])
    };
  }
}
```

### 2. **智能转换引擎**

```typescript
class IntelligentDDDConverter {
  
  constructor(
    private metadataParser: DDDMetadataParser,
    private typeMapper: DDDToAmisTypeMapping,
    private templateEngine: AmisTemplateEngine
  ) {}
  
  async convertAggregateToScreens(aggregateId: string): Promise<AmisScreenConfig[]> {
    // 1. 解析DDD元数据
    const metadata = await this.metadataParser.parseAggregateMetadata(aggregateId);
    
    // 2. 生成标准CRUD屏幕
    const screens = [
      await this.generateListScreen(metadata),
      await this.generateCreateScreen(metadata), 
      await this.generateEditScreen(metadata),
      await this.generateDetailScreen(metadata)
    ];
    
    // 3. 基于业务规则生成特殊屏幕
    if (metadata.hasComplexWorkflow()) {
      screens.push(await this.generateWorkflowScreen(metadata));
    }
    
    if (metadata.hasReporting()) {
      screens.push(await this.generateReportScreen(metadata));
    }
    
    return screens;
  }
  
  private async generateListScreen(metadata: DDDAggregateMetadata): Promise<AmisScreenConfig> {
    const rootEntity = metadata.aggregate.aggregateRoot;
    
    return {
      screenId: `${metadata.aggregate.name.toLowerCase()}-list`,
      screenType: "CRUD_LIST",
      
      // 使用模板生成基础结构
      amisSchema: await this.templateEngine.renderTemplate("crud-list", {
        title: `${rootEntity.name}管理`,
        api: this.buildListApi(metadata),
        columns: this.entityToTableColumns(rootEntity),
        headerToolbar: this.generateHeaderToolbar(metadata),
        footerToolbar: this.generateFooterToolbar(metadata)
      }),
      
      // 最小化DDD增强配置
      dddEnhancements: {
        entityBindings: [{
          entityType: "AGGREGATE_ROOT",
          entityId: rootEntity.entityId,
          bindingType: "DATA_SOURCE",
          autoGeneration: { enabled: true }
        }],
        
        apiMappings: this.repositoryToApiConfig(metadata.repositories[0]),
        
        // 自动从实体约束生成权限
        permissionBindings: this.generatePermissions(metadata),
        
        // 自动从验证规则生成前端验证
        validationRules: this.convertValidationRules(metadata.validationRules)
      }
    };
  }
  
  // 智能生成表头工具栏
  private generateHeaderToolbar(metadata: DDDAggregateMetadata): AmisToolbarItem[] {
    const toolbar: AmisToolbarItem[] = [];
    
    // 基于聚合操作自动生成按钮
    if (metadata.hasCreateOperation()) {
      toolbar.push({
        type: "button",
        label: `新增${metadata.aggregate.name}`,
        level: "primary",
        actionType: "dialog",
        dialog: {
          title: `新增${metadata.aggregate.name}`,
          body: this.generateCreateForm(metadata)
        }
      });
    }
    
    if (metadata.hasBatchOperations()) {
      toolbar.push({
        type: "button", 
        label: "批量操作",
        level: "default"
      });
    }
    
    // 基于业务规则生成特殊操作按钮
    metadata.getCustomOperations().forEach(op => {
      toolbar.push({
        type: "button",
        label: op.displayName,
        actionType: "ajax",
        api: this.buildOperationApi(op)
      });
    });
    
    return toolbar;
  }
}
```

### 3. **模板引擎系统**

```typescript
class AmisTemplateEngine {
  
  private templates = new Map<string, AmisTemplate>();
  
  constructor() {
    this.loadBuiltinTemplates();
  }
  
  async renderTemplate(templateId: string, variables: any): Promise<any> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    return this.processTemplate(template.schema, variables);
  }
  
  private processTemplate(schema: any, variables: any): any {
    if (typeof schema === "string") {
      return this.interpolateString(schema, variables);
    }
    
    if (Array.isArray(schema)) {
      return schema.map(item => this.processTemplate(item, variables));
    }
    
    if (typeof schema === "object" && schema !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(schema)) {
        result[key] = this.processTemplate(value, variables);
      }
      return result;
    }
    
    return schema;
  }
  
  private interpolateString(template: string, variables: any): string {
    return template.replace(/\$\{([^}]+)\}/g, (match, varName) => {
      return this.resolveVariable(varName, variables);
    });
  }
  
  private loadBuiltinTemplates(): void {
    // CRUD列表模板
    this.templates.set("crud-list", {
      templateId: "crud-list",
      schema: {
        type: "page",
        title: "${title}",
        body: {
          type: "crud",
          api: "${api}",
          columns: "${columns}",
          headerToolbar: "${headerToolbar}",
          footerToolbar: "${footerToolbar}"
        }
      }
    });
    
    // 表单模板
    this.templates.set("form-create", {
      templateId: "form-create", 
      schema: {
        type: "form",
        title: "${title}",
        api: "${api}",
        body: "${fields}"
      }
    });
    
    // 详情页模板
    this.templates.set("detail-view", {
      templateId: "detail-view",
      schema: {
        type: "page",
        title: "${title}",
        body: {
          type: "service",
          api: "${api}",
          body: {
            type: "panel",
            title: "${entityName}详情",
            body: "${fields}"
          }
        }
      }
    });
  }
}
```

## 🔄 自动同步机制

### 1. **模型变更监听**

```typescript
class DDDModelWatcher {
  
  private watchers = new Map<string, FileWatcher>();
  private changeHandlers = new Set<ModelChangeHandler>();
  
  startWatching(schemaDirectory: string): void {
    // 监听聚合Schema文件变化
    this.watchSchemaFiles(`${schemaDirectory}/aggregate/*.json`, 
      (filePath, changeType) => this.handleAggregateChange(filePath, changeType));
    
    // 监听实体Schema文件变化  
    this.watchSchemaFiles(`${schemaDirectory}/entity/*.json`,
      (filePath, changeType) => this.handleEntityChange(filePath, changeType));
      
    // 监听DTO Schema文件变化
    this.watchSchemaFiles(`${schemaDirectory}/dto/*.json`,
      (filePath, changeType) => this.handleDtoChange(filePath, changeType));
  }
  
  private async handleAggregateChange(filePath: string, changeType: ChangeType): Promise<void> {
    const aggregateId = this.extractIdFromPath(filePath);
    
    try {
      // 重新解析聚合元数据
      const metadata = await this.metadataParser.parseAggregateMetadata(aggregateId);
      
      // 重新生成AMIS配置
      const screens = await this.converter.convertAggregateToScreens(aggregateId);
      
      // 通知所有变更处理器
      this.changeHandlers.forEach(handler => {
        handler.onAggregateChanged(aggregateId, metadata, screens);
      });
      
      // 自动更新生成的文件
      await this.updateGeneratedFiles(aggregateId, screens);
      
    } catch (error) {
      console.error(`Failed to handle aggregate change for ${aggregateId}:`, error);
      // 发送错误通知
      this.notifyError(aggregateId, error);
    }
  }
  
  private async updateGeneratedFiles(aggregateId: string, screens: AmisScreenConfig[]): Promise<void> {
    const outputDir = path.join(this.config.outputDirectory, aggregateId);
    
    for (const screen of screens) {
      const fileName = `${screen.screenId}.json`;
      const filePath = path.join(outputDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(screen, null, 2));
    }
    
    // 更新索引文件
    await this.updateScreenIndex(aggregateId, screens);
  }
}
```

### 2. **增量更新策略**

```typescript
class IncrementalUpdateManager {
  
  async updateScreenFromModelChange(
    aggregateId: string, 
    changedFields: string[], 
    changeType: 'ADD' | 'MODIFY' | 'DELETE'
  ): Promise<void> {
    
    const existingScreen = await this.loadExistingScreen(aggregateId);
    const modelMetadata = await this.getModelMetadata(aggregateId);
    
    switch (changeType) {
      case 'ADD':
        await this.addFieldsToScreen(existingScreen, changedFields, modelMetadata);
        break;
        
      case 'MODIFY': 
        await this.modifyFieldsInScreen(existingScreen, changedFields, modelMetadata);
        break;
        
      case 'DELETE':
        await this.removeFieldsFromScreen(existingScreen, changedFields);
        break;
    }
    
    // 保留用户自定义配置
    await this.preserveUserCustomizations(existingScreen);
    
    // 保存更新后的配置
    await this.saveUpdatedScreen(existingScreen);
  }
  
  private async addFieldsToScreen(
    screen: AmisScreenConfig, 
    newFields: string[], 
    metadata: DDDAggregateMetadata
  ): Promise<void> {
    
    for (const fieldName of newFields) {
      const attribute = metadata.findAttribute(fieldName);
      if (!attribute) continue;
      
      // 添加到表格列
      if (screen.amisSchema.body.type === 'crud') {
        const newColumn = this.attributeToColumn(attribute);
        screen.amisSchema.body.columns.push(newColumn);
      }
      
      // 添加到表单字段
      const createDialog = this.findCreateDialog(screen);
      if (createDialog) {
        const newField = this.attributeToFormField(attribute);
        createDialog.body.body.push(newField);
      }
    }
  }
  
  private async preserveUserCustomizations(screen: AmisScreenConfig): Promise<void> {
    // 保留用户在AMIS Editor中的自定义配置
    const userCustomizations = await this.loadUserCustomizations(screen.screenId);
    
    if (userCustomizations) {
      // 合并用户自定义的样式配置
      this.mergeCustomizations(screen.amisSchema, userCustomizations);
    }
  }
}
```

## 🎨 高级特性

### 1. **智能UI推断**

```typescript
class IntelligentUIInference {
  
  inferOptimalUIComponent(attribute: DDDAttribute): AmisComponent {
    // 基于属性特征推断最佳UI组件
    
    // 1. 基于数据类型
    if (attribute.type.baseType === "ENUM" && attribute.type.allowedValues.length <= 5) {
      return { type: "radios", options: this.buildOptions(attribute.type.allowedValues) };
    }
    
    if (attribute.type.baseType === "ENUM" && attribute.type.allowedValues.length > 5) {
      return { type: "select", options: this.buildOptions(attribute.type.allowedValues) };
    }
    
    // 2. 基于业务含义
    if (attribute.businessMeaning?.includes("密码")) {
      return { type: "input-password" };
    }
    
    if (attribute.businessMeaning?.includes("头像") || attribute.name.includes("avatar")) {
      return { type: "input-image" };
    }
    
    if (attribute.businessMeaning?.includes("附件") || attribute.name.includes("file")) {
      return { type: "input-file" };
    }
    
    // 3. 基于验证规则
    if (attribute.validationRules?.some(rule => rule.includes("email"))) {
      return { type: "input-email" };
    }
    
    if (attribute.validationRules?.some(rule => rule.includes("url"))) {
      return { type: "input-url" };
    }
    
    // 4. 基于约束条件
    if (attribute.constraints.maxLength && attribute.constraints.maxLength > 200) {
      return { type: "textarea" };
    }
    
    // 5. 基于统一语言术语
    if (attribute.ubiquitousLanguageTermId) {
      const term = this.getUbiquitousLanguageTerm(attribute.ubiquitousLanguageTermId);
      if (term.uiHints) {
        return this.parseUIHints(term.uiHints);
      }
    }
    
    // 默认回退
    return { type: "input-text" };
  }
  
  inferFormLayout(entity: DDDEntity): AmisFormLayout {
    const fieldCount = entity.attributes.length;
    
    // 基于字段数量推断布局
    if (fieldCount <= 5) {
      return { type: "normal", columns: 1 };
    } else if (fieldCount <= 15) {
      return { type: "horizontal", columns: 2 };
    } else {
      return { type: "tabs", groups: this.groupAttributesByCategory(entity.attributes) };
    }
  }
  
  private groupAttributesByCategory(attributes: DDDAttribute[]): FormGroup[] {
    const groups = new Map<string, DDDAttribute[]>();
    
    attributes.forEach(attr => {
      const category = this.inferAttributeCategory(attr);
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(attr);
    });
    
    return Array.from(groups.entries()).map(([category, attrs]) => ({
      title: category,
      body: attrs.map(attr => this.attributeToFormField(attr))
    }));
  }
}
```

### 2. **性能优化**

```typescript
class PerformanceOptimizer {
  
  optimizeForLargeDataset(screen: AmisScreenConfig, metadata: DDDAggregateMetadata): void {
    const estimatedRecordCount = metadata.getEstimatedRecordCount();
    
    if (estimatedRecordCount > 10000) {
      // 启用虚拟滚动
      screen.amisSchema.body.loadDataOnce = false;
      screen.amisSchema.body.pageSize = 50;
      
      // 优化查询字段
      screen.amisSchema.body.columns = this.selectOptimalColumns(
        screen.amisSchema.body.columns, 
        metadata
      );
      
      // 添加搜索优化
      screen.amisSchema.body.filter = this.buildOptimizedFilter(metadata);
    }
  }
  
  private selectOptimalColumns(columns: AmisColumn[], metadata: DDDAggregateMetadata): AmisColumn[] {
    // 基于属性的查询性能选择显示列
    return columns.filter(col => {
      const attribute = metadata.findAttribute(col.name);
      return attribute && (
        attribute.constraints.isIndexed ||
        attribute.constraints.isRequired ||
        attribute.isDisplayField
      );
    }).slice(0, 8); // 限制列数
  }
}
```

## 🚀 使用示例

### 完整的自动化流程

```typescript
// 1. 初始化转换系统
const converter = new DDDToAmisConverter({
  schemaPath: "./schemas",
  outputPath: "./generated-screens",
  templatePath: "./templates"
});

// 2. 监听模型变化并自动更新界面
converter.startAutoSync();

// 3. 手动转换特定聚合
const orderScreens = await converter.convertAggregate("agg_order");

// 4. 生成的配置示例
console.log(JSON.stringify(orderScreens[0], null, 2));
```

### 生成结果示例

```json
{
  "screenId": "order-list",
  "name": "订单管理",
  "amisSchema": {
    "type": "page",
    "title": "订单管理",
    "body": {
      "type": "crud",
      "api": "/api/orders",
      "columns": [
        {
          "name": "orderNumber",
          "label": "订单号", 
          "type": "text",
          "sortable": true
        },
        {
          "name": "customerName",
          "label": "客户名称",
          "type": "text"
        },
        {
          "name": "orderStatus",
          "label": "订单状态",
          "type": "mapping",
          "map": {
            "PENDING": "待支付",
            "PAID": "已支付", 
            "SHIPPED": "已发货"
          }
        },
        {
          "name": "totalAmount",
          "label": "订单金额",
          "type": "number",
          "prefix": "¥"
        }
      ]
    }
  },
  "dddEnhancements": {
    "entityBindings": [{
      "entityType": "AGGREGATE_ROOT",
      "entityId": "agg_order",
      "bindingType": "DATA_SOURCE"
    }]
  }
}
```

## 🎯 预期收益

### 开发效率提升
- ✅ **模型定义一次** - 在DDD Schema中定义，自动生成界面
- ✅ **自动保持同步** - 模型变更自动反映到界面，无需手动更新
- ✅ **零重复工作** - 完全消除重复定义和维护
- ✅ **类型安全保证** - 编译时检查模型与界面的一致性

### 质量保证
- 🔍 **一致性检查** - 自动验证模型与界面的一致性
- 🚀 **最佳实践** - 自动应用UI/UX最佳实践
- 📊 **性能优化** - 根据数据量自动优化界面性能
- 🔒 **安全保障** - 基于DDD权限模型自动生成权限控制

这个方案彻底解决了DDD模型与AMIS界面一致性的问题，实现了真正的单一数据源和自动化同步！
