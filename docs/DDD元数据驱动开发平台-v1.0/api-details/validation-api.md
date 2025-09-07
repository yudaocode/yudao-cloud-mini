# 验证规则管理 API

## 📋 概述

验证规则管理API专注于DDD元数据的验证配置、规则定义和质量管理，基于`root.schema.json`中的validation定义，确保数据一致性和业务规则合规性。

## 🎯 Schema架构

本API遵循分层Schema架构模式，提供完整的CRUD操作支持：

### Schema文件组织
```
object-jsonschemas/validation.schemas/
├── fields/                         # 字段级Schema定义
│   ├── common-fields.schema.json   # 通用字段定义
│   ├── validation-configuration-fields.schema.json  # 配置字段
│   └── validation-rule-fields.schema.json          # 规则字段
├── full/                          # 完整对象Schema
│   ├── validation-configuration.schema.json        # 完整配置对象
│   └── validation-rule.schema.json                # 完整规则对象
└── operations/                    # 操作级Schema
    ├── patch/                     # 部分更新操作
    │   ├── validation-configuration-patch.schema.json
    │   └── validation-rule-patch.schema.json
    └── bulk/                      # 批量操作
        ├── validation-configuration-bulk.schema.json
        └── validation-rule-bulk.schema.json
```

### CRUD操作映射
- **CREATE/READ**: 使用 `full/*.schema.json` 完整对象Schema
- **UPDATE (PATCH)**: 使用 `operations/patch/*.schema.json` 部分更新Schema  
- **DELETE**: 基于ID操作，无需复杂Schema
- **BULK**: 使用 `operations/bulk/*.schema.json` 批量操作Schema

## 🏗️ API结构

```
/api/ddd/validation/
├── /configurations                 # 验证配置管理
│   ├── /global                    # 全局验证配置
│   ├── /domain-specific           # 领域特定配置
│   └── /schema-level              # Schema级别配置
├── /rules                         # 验证规则管理
│   ├── /business-rules            # 业务规则
│   ├── /cross-schema              # 跨Schema验证
│   ├── /consistency               # 一致性规则
│   └── /custom                    # 自定义规则
├── /execution                     # 验证执行
│   ├── /on-demand                 # 按需验证
│   ├── /scheduled                 # 定时验证
│   └── /real-time                 # 实时验证
├── /results                       # 验证结果
│   ├── /reports                   # 验证报告
│   ├── /issues                    # 问题列表
│   └── /metrics                   # 质量指标
└── /governance                    # 质量治理
    ├── /policies                  # 质量策略
    ├── /thresholds                # 阈值管理
    └── /alerts                    # 告警配置
```

## 📚 API详情

### 1. 验证配置管理

#### 1.1 获取验证配置
```typescript
GET /api/ddd/validation/configurations/{configId}
Response: ApiResponse<ValidationConfiguration>
Schema: object-jsonschemas/validation.schemas/full/validation-configuration.schema.json
```

#### 1.2 创建验证配置
```typescript
POST /api/ddd/validation/configurations
Body: ValidationConfiguration (遵循完整配置Schema)
Schema: object-jsonschemas/validation.schemas/full/validation-configuration.schema.json
Response: ApiResponse<ValidationConfiguration>
```

#### 1.3 更新验证配置
```typescript
PUT /api/ddd/validation/configurations/{configId}
Body: ValidationConfiguration (完整更新)
Schema: object-jsonschemas/validation.schemas/full/validation-configuration.schema.json
Response: ApiResponse<ValidationConfiguration>
```

#### 1.4 部分更新验证配置
```typescript
PATCH /api/ddd/validation/configurations/{configId}
Body: ValidationConfigurationPatch (部分更新)
Schema: object-jsonschemas/validation.schemas/operations/patch/validation-configuration-patch.schema.json
Response: ApiResponse<ValidationConfiguration>
```

#### 1.5 删除验证配置
```typescript
DELETE /api/ddd/validation/configurations/{configId}
Response: ApiResponse<void>
```

#### 1.6 批量操作验证配置
```typescript
POST /api/ddd/validation/configurations/bulk
Body: ValidationConfigurationBulkOperation
Schema: object-jsonschemas/validation.schemas/operations/bulk/validation-configuration-bulk.schema.json
Response: ApiResponse<BulkOperationResult>
```

### 2. 验证规则管理

#### 2.1 获取验证规则列表
```typescript
GET /api/ddd/validation/rules
Query Parameters:
- type?: 'CROSS_SCHEMA' | 'BUSINESS_RULE' | 'CONSISTENCY' | 'CUSTOM'
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- scope?: 'GLOBAL' | 'DOMAIN' | 'SCHEMA'
- isActive?: boolean
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<ValidationRule>
Schema: object-jsonschemas/validation.schemas/full/validation-rule.schema.json
```

#### 2.2 创建验证规则
```typescript
POST /api/ddd/validation/rules
Body: ValidationRule (遵循完整规则Schema)
Schema: object-jsonschemas/validation.schemas/full/validation-rule.schema.json
Response: ApiResponse<ValidationRule>
```

#### 2.3 获取单个验证规则
```typescript
GET /api/ddd/validation/rules/{ruleId}
Response: ApiResponse<ValidationRule>
Schema: object-jsonschemas/validation.schemas/full/validation-rule.schema.json
```

#### 2.4 更新验证规则
```typescript
PUT /api/ddd/validation/rules/{ruleId}
Body: ValidationRule (完整更新)
Schema: object-jsonschemas/validation.schemas/full/validation-rule.schema.json
Response: ApiResponse<ValidationRule>
```

#### 2.5 部分更新验证规则
```typescript
PATCH /api/ddd/validation/rules/{ruleId}
Body: ValidationRulePatch (部分更新)
Schema: object-jsonschemas/validation.schemas/operations/patch/validation-rule-patch.schema.json
Response: ApiResponse<ValidationRule>
```

#### 2.6 删除验证规则
```typescript
DELETE /api/ddd/validation/rules/{ruleId}
Response: ApiResponse<void>
```

#### 2.7 批量操作验证规则
```typescript
POST /api/ddd/validation/rules/bulk
Body: ValidationRuleBulkOperation
Schema: object-jsonschemas/validation.schemas/operations/bulk/validation-rule-bulk.schema.json
Response: ApiResponse<BulkOperationResult>
```

### 3. 验证执行管理

#### 3.1 触发按需验证
```typescript
POST /api/ddd/validation/execution/on-demand
Body: {
  scope: 'GLOBAL' | 'DOMAIN' | 'SCHEMA' | 'ENTITY';
  targetIds?: string[];             // 目标ID列表
  ruleIds?: string[];               // 要执行的规则ID
  async?: boolean;                  // 是否异步执行
}
Response: ApiResponse<ValidationExecution>
```

#### 3.2 获取验证执行状态
```typescript
GET /api/ddd/validation/execution/{executionId}
Response: ApiResponse<ValidationExecution>
```

#### 3.3 取消验证执行
```typescript
DELETE /api/ddd/validation/execution/{executionId}
Response: ApiResponse<void>
```

#### 3.4 获取定时验证任务列表
```typescript
GET /api/ddd/validation/execution/scheduled
Query Parameters:
- status?: 'ACTIVE' | 'INACTIVE' | 'PAUSED'
- nextRunTime?: string

Response: ApiResponse<ScheduledValidation[]>
```

#### 3.5 创建定时验证任务
```typescript
POST /api/ddd/validation/execution/scheduled
Body: {
  name: string;                     // 任务名称
  description?: string;             // 任务描述
  cronExpression: string;           // Cron表达式
  scope: 'GLOBAL' | 'DOMAIN' | 'SCHEMA';
  targetIds?: string[];
  ruleIds?: string[];
  isActive: boolean;
}
Response: ApiResponse<ScheduledValidation>
```

#### 3.6 更新定时验证任务
```typescript
PUT /api/ddd/validation/execution/scheduled/{taskId}
Body: {
  name?: string;
  description?: string;
  cronExpression?: string;
  targetIds?: string[];
  ruleIds?: string[];
  isActive?: boolean;
}
Response: ApiResponse<ScheduledValidation>
```

#### 3.7 删除定时验证任务
```typescript
DELETE /api/ddd/validation/execution/scheduled/{taskId}
Response: ApiResponse<void>
```

### 4. 验证结果管理

#### 4.1 获取验证报告列表
```typescript
GET /api/ddd/validation/results/reports
Query Parameters:
- executionId?: string
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- startDate?: string
- endDate?: string
- page?: number
- size?: number

Response: PaginatedResponse<ValidationReport>
```

#### 4.2 获取单个验证报告
```typescript
GET /api/ddd/validation/results/reports/{reportId}
Response: ApiResponse<ValidationReport>
```

#### 4.3 导出验证报告
```typescript
GET /api/ddd/validation/results/reports/{reportId}/export
Query Parameters:
- format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON'

Response: File Download
```

#### 4.4 获取验证问题列表
```typescript
GET /api/ddd/validation/results/issues
Query Parameters:
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- status?: 'OPEN' | 'RESOLVED' | 'IGNORED'
- assignee?: string
- ruleId?: string
- page?: number
- size?: number

Response: PaginatedResponse<ValidationIssue>
```

#### 4.5 更新验证问题状态
```typescript
PUT /api/ddd/validation/results/issues/{issueId}
Body: {
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
  assignee?: string;
  resolution?: string;
  comments?: string;
}
Response: ApiResponse<ValidationIssue>
```

#### 4.6 批量处理验证问题
```typescript
POST /api/ddd/validation/results/issues/batch
Body: {
  issueIds: string[];
  action: 'RESOLVE' | 'IGNORE' | 'ASSIGN' | 'ESCALATE';
  assignee?: string;
  comments?: string;
}
Response: ApiResponse<BatchUpdateResult>
```

#### 4.7 获取质量指标
```typescript
GET /api/ddd/validation/results/metrics
Query Parameters:
- timeRange?: string              // 时间范围，如 '7d', '30d'
- scope?: 'GLOBAL' | 'DOMAIN' | 'SCHEMA'
- targetId?: string

Response: ApiResponse<QualityMetrics>
```

### 5. 质量治理管理

#### 5.1 获取质量策略列表
```typescript
GET /api/ddd/validation/governance/policies
Query Parameters:
- scope?: 'GLOBAL' | 'DOMAIN' | 'SCHEMA'
- isActive?: boolean

Response: ApiResponse<QualityPolicy[]>
```

#### 5.2 创建质量策略
```typescript
POST /api/ddd/validation/governance/policies
Body: {
  name: string;                     // 策略名称
  description?: string;             // 策略描述
  scope: 'GLOBAL' | 'DOMAIN' | 'SCHEMA';
  rules: PolicyRule[];              // 策略规则
  enforcement: 'BLOCKING' | 'WARNING' | 'INFORMATIONAL';
  isActive: boolean;
}
Response: ApiResponse<QualityPolicy>
```

#### 5.3 更新质量策略
```typescript
PUT /api/ddd/validation/governance/policies/{policyId}
Body: {
  name?: string;
  description?: string;
  rules?: PolicyRule[];
  enforcement?: 'BLOCKING' | 'WARNING' | 'INFORMATIONAL';
  isActive?: boolean;
}
Response: ApiResponse<QualityPolicy>
```

#### 5.4 删除质量策略
```typescript
DELETE /api/ddd/validation/governance/policies/{policyId}
Response: ApiResponse<void>
```

#### 5.5 获取阈值配置列表
```typescript
GET /api/ddd/validation/governance/thresholds
Query Parameters:
- metricType?: string
- scope?: 'GLOBAL' | 'DOMAIN' | 'SCHEMA'

Response: ApiResponse<QualityThreshold[]>
```

#### 5.6 创建阈值配置
```typescript
POST /api/ddd/validation/governance/thresholds
Body: {
  name: string;                     // 阈值名称
  description?: string;             // 描述
  metricType: string;               // 指标类型
  scope: 'GLOBAL' | 'DOMAIN' | 'SCHEMA';
  thresholds: {
    critical: number;               // 严重阈值
    warning: number;                // 警告阈值
    good: number;                   // 良好阈值
  };
  actions: ThresholdAction[];       // 超阈值动作
  isActive: boolean;
}
Response: ApiResponse<QualityThreshold>
```

#### 5.7 更新阈值配置
```typescript
PUT /api/ddd/validation/governance/thresholds/{thresholdId}
Body: {
  name?: string;
  description?: string;
  thresholds?: {
    critical?: number;
    warning?: number;
    good?: number;
  };
  actions?: ThresholdAction[];
  isActive?: boolean;
}
Response: ApiResponse<QualityThreshold>
```

#### 5.8 删除阈值配置
```typescript
DELETE /api/ddd/validation/governance/thresholds/{thresholdId}
Response: ApiResponse<void>
```

#### 5.9 获取告警配置列表
```typescript
GET /api/ddd/validation/governance/alerts
Query Parameters:
- alertType?: 'EMAIL' | 'WEBHOOK' | 'SLACK' | 'SMS'
- isActive?: boolean

Response: ApiResponse<AlertConfiguration[]>
```

#### 5.10 创建告警配置
```typescript
POST /api/ddd/validation/governance/alerts
Body: {
  name: string;                     // 告警名称
  description?: string;             // 描述
  alertType: 'EMAIL' | 'WEBHOOK' | 'SLACK' | 'SMS';
  triggers: AlertTrigger[];         // 触发条件
  recipients: AlertRecipient[];     // 接收者
  template: string;                 // 告警模板
  isActive: boolean;
}
Response: ApiResponse<AlertConfiguration>
```

#### 5.11 更新告警配置
```typescript
PUT /api/ddd/validation/governance/alerts/{alertId}
Body: {
  name?: string;
  description?: string;
  triggers?: AlertTrigger[];
  recipients?: AlertRecipient[];
  template?: string;
  isActive?: boolean;
}
Response: ApiResponse<AlertConfiguration>
```

#### 5.12 删除告警配置
```typescript
DELETE /api/ddd/validation/governance/alerts/{alertId}
Response: ApiResponse<void>
```

### 6. 分析和报告

#### 6.1 获取验证趋势分析
```typescript
GET /api/ddd/validation/analysis/trends
Query Parameters:
- timeRange?: string              // 时间范围
- scope?: 'GLOBAL' | 'DOMAIN' | 'SCHEMA'
- metricType?: string             // 指标类型

Response: ApiResponse<TrendAnalysis>
```

#### 6.2 获取问题热点分析
```typescript
GET /api/ddd/validation/analysis/hotspots
Query Parameters:
- timeRange?: string
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- limit?: number

Response: ApiResponse<HotspotAnalysis>
```

#### 6.3 生成质量报告
```typescript
POST /api/ddd/validation/analysis/report
Body: {
  reportType: 'SUMMARY' | 'DETAILED' | 'TREND' | 'COMPLIANCE';
  scope: 'GLOBAL' | 'DOMAIN' | 'SCHEMA';
  timeRange?: string;
  includeCharts?: boolean;
  format: 'PDF' | 'HTML' | 'JSON';
}
Response: ApiResponse<ReportGeneration>
```
    schemas?: string[];             # 适用的Schema列表
    fields?: string[];              # 适用的字段列表
    events?: string[];              # 触发事件列表
  };
  parameters?: {                    # 规则参数
    [key: string]: any;
  };
  dependencies?: string[];          # 依赖的其他规则
  priority: number;                 # 执行优先级
}
Response: ApiResponse<ValidationRule>
```

#### 2.3 更新验证规则
```typescript
PUT /api/ddd/validation/rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  expression?: string;
  message?: string;
  conditions?: {
    schemas?: string[];
    fields?: string[];
    events?: string[];
  };
  parameters?: {
    [key: string]: any;
  };
  priority?: number;
  isActive?: boolean;
}
Response: ApiResponse<ValidationRule>
```

### 3. 验证执行管理

#### 3.1 获取关联信息
```typescript
GET /api/ddd/validation/{domainId}/associations
Response: ApiResponse<Association[]>
```

#### 3.2 更新关联信息
```typescript
PUT /api/ddd/validation/{domainId}/associations
Body: {
  // 关联数据
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 4. 分析服务

#### 4.1 获取分析报告
```typescript
GET /api/ddd/validation/{domainId}/analysis/report
Response: ApiResponse<AnalysisReport>
```

#### 4.2 获取统计信息
```typescript
GET /api/ddd/validation/{domainId}/analysis/statistics
Response: ApiResponse<Statistics>
```

## 📊 数据模型

### ValidationInfo
```typescript
interface ValidationInfo {
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
| VALIDATION.NOT_FOUND | 数据不存在 |
| VALIDATION.INVALID_DATA | 数据无效 |
| VALIDATION.DUPLICATE_NAME | 名称重复 |
| VALIDATION.ACCESS_DENIED | 访问被拒绝 |
| VALIDATION.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建验证配置
```typescript
const validationConfig = {
  id: "validation_config_domain_consistency",
  name: "领域一致性验证配置",
  description: "确保战略设计与战术设计的领域一致性",
  type: "CONSISTENCY",
  severity: "ERROR",
  scope: "DOMAIN",
  settings: {
    validateOnSave: true,
    validateOnImport: true,
    asyncValidation: false,
    batchSize: 100,
    timeout: 300
  },
  notifications: {
    onError: true,
    onWarning: false,
    recipients: ["architect@example.com"]
  },
  isActive: true
};

const response = await fetch('/api/ddd/validation/configurations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validationConfig)
});
```

### 创建验证规则
```typescript
const validationRule = {
  id: "validation_rule_domain_consistency_001",
  name: "领域定义一致性检查",
  description: "检查战略设计中的领域在战术设计中是否有对应定义",
  type: "CONSISTENCY",
  severity: "ERROR",
  scope: "DOMAIN",
  expression: "$.strategicDesign.domains[*].id in $.tacticalDesign.domains[*].id",
  message: "战术设计中缺少对应的领域定义：{missingDomains}",
  conditions: {
    triggers: ["ON_CREATE", "ON_UPDATE"]
  },
  parameters: {
    checkDepth: 2,
    ignoreInactive: true
  },
  priority: 1,
  order: 10,
  isActive: true
};

const response = await fetch('/api/ddd/validation/rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validationRule)
});
```

### 执行验证
```typescript
const validationExecution = {
  scope: "DOMAIN",
  targetIds: ["domain_001", "domain_002"],
  ruleIds: ["validation_rule_domain_consistency_001"],
  async: true
};

const response = await fetch('/api/ddd/validation/execution/on-demand', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validationExecution)
});

const execution = await response.json();
console.log('验证执行ID:', execution.data.id);
```

### 获取验证结果
```typescript
const response = await fetch(`/api/ddd/validation/results/${execution.data.id}`);
const result = await response.json();
console.log('验证结果:', result.data);
```
