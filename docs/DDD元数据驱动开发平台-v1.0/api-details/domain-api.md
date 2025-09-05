# 领域管理 API

## 📋 概述

领域管理API提供领域级别的信息管理功能，包括领域信息、利益相关者、业务目标、度量指标等。

## 🏗️ API结构

```
/api/ddd/domain/
├── /{domainId}                    # 领域基本信息
├── /{domainId}/stakeholders       # 利益相关者
├── /{domainId}/business-goals     # 业务目标
├── /{domainId}/metrics            # 度量指标
├── /{domainId}/associations       # 关联服务
└── /{domainId}/analysis           # 分析服务
```

## 📚 API详情

### 1. 领域基本信息管理

#### 1.1 获取领域信息
```typescript
GET /api/ddd/domain/{domainId}
Response: ApiResponse<DomainInfo>
```

#### 1.2 创建/更新领域信息
```typescript
PUT /api/ddd/domain/{domainId}
Body: {
  name: string;                     // 必填，领域名称
  description: string;              // 必填，领域描述
  businessDomain: string;          // 必填，业务领域
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';  // 必填，复杂度
  priority: number;                 // 必填，优先级
  isActive?: boolean;               // 是否激活
}
Response: ApiResponse<DomainInfo>
```

### 2. 利益相关者管理

#### 2.1 获取利益相关者列表
```typescript
GET /api/ddd/domain/{domainId}/stakeholders
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- role?: string
- isActive?: boolean
- sortBy?: 'name' | 'role' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Stakeholder>
```

#### 2.2 获取单个利益相关者
```typescript
GET /api/ddd/domain/{domainId}/stakeholders/{stakeholderId}
Response: ApiResponse<Stakeholder>
```

#### 2.3 创建利益相关者
```typescript
POST /api/ddd/domain/{domainId}/stakeholders
Body: {
  name: string;                     // 必填，利益相关者名称
  role: string;                     // 必填，角色
  description: string;              // 必填，描述
  contactInfo?: string;             // 联系信息
  influence: 'LOW' | 'MEDIUM' | 'HIGH';  // 影响力
  isActive?: boolean;               // 是否激活
}
Response: ApiResponse<Stakeholder>
```

#### 2.4 更新利益相关者
```typescript
PUT /api/ddd/domain/{domainId}/stakeholders/{stakeholderId}
Body: {
  name?: string;
  role?: string;
  description?: string;
  contactInfo?: string;
  influence?: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive?: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 2.5 删除利益相关者
```typescript
DELETE /api/ddd/domain/{domainId}/stakeholders/{stakeholderId}
Response: ApiResponse<void>
```

### 3. 业务目标管理

#### 3.1 获取业务目标列表
```typescript
GET /api/ddd/domain/{domainId}/business-goals
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- priority?: 'LOW' | 'MEDIUM' | 'HIGH'
- isActive?: boolean
- sortBy?: 'name' | 'priority' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BusinessGoal>
```

#### 3.2 获取单个业务目标
```typescript
GET /api/ddd/domain/{domainId}/business-goals/{goalId}
Response: ApiResponse<BusinessGoal>
```

#### 3.3 创建业务目标
```typescript
POST /api/ddd/domain/{domainId}/business-goals
Body: {
  name: string;                     // 必填，业务目标名称
  description: string;              // 必填，描述
  priority: 'LOW' | 'MEDIUM' | 'HIGH';  // 必填，优先级
  targetDate?: string;              // 目标日期
  successCriteria?: string[];       // 成功标准
  isActive?: boolean;               // 是否激活
}
Response: ApiResponse<BusinessGoal>
```

#### 3.4 更新业务目标
```typescript
PUT /api/ddd/domain/{domainId}/business-goals/{goalId}
Body: {
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  targetDate?: string;
  successCriteria?: string[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessGoal>
```

#### 3.5 删除业务目标
```typescript
DELETE /api/ddd/domain/{domainId}/business-goals/{goalId}
Response: ApiResponse<void>
```

### 4. 度量指标管理

#### 4.1 获取度量指标列表
```typescript
GET /api/ddd/domain/{domainId}/metrics
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'PERFORMANCE' | 'QUALITY' | 'BUSINESS'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Metric>
```

#### 4.2 创建度量指标
```typescript
POST /api/ddd/domain/{domainId}/metrics
Body: {
  name: string;                     // 必填，指标名称
  description: string;              // 必填，描述
  type: 'PERFORMANCE' | 'QUALITY' | 'BUSINESS';  // 必填，类型
  unit: string;                     // 必填，单位
  targetValue?: number;             // 目标值
  currentValue?: number;            // 当前值
  formula?: string;                 // 计算公式
  isActive?: boolean;               // 是否激活
}
Response: ApiResponse<Metric>
```

#### 4.3 更新度量指标
```typescript
PUT /api/ddd/domain/{domainId}/metrics/{metricId}
Body: {
  name?: string;
  description?: string;
  type?: 'PERFORMANCE' | 'QUALITY' | 'BUSINESS';
  unit?: string;
  targetValue?: number;
  currentValue?: number;
  formula?: string;
  isActive?: boolean;
}
Response: ApiResponse<Metric>
```

#### 4.4 删除度量指标
```typescript
DELETE /api/ddd/domain/{domainId}/metrics/{metricId}
Response: ApiResponse<void>
```

### 5. 关联服务

#### 5.1 获取领域的限界上下文关联
```typescript
GET /api/ddd/domain/{domainId}/associations/bounded-contexts
Response: ApiResponse<BoundedContextAssociation[]>
```

#### 5.2 获取领域的术语关联
```typescript
GET /api/ddd/domain/{domainId}/associations/terms
Response: ApiResponse<TermAssociation[]>
```

#### 5.3 获取领域的聚合关联
```typescript
GET /api/ddd/domain/{domainId}/associations/aggregates
Response: ApiResponse<AggregateAssociation[]>
```

#### 5.4 批量更新领域关联
```typescript
PUT /api/ddd/domain/{domainId}/associations
Body: {
  boundedContextIds?: string[];
  termIds?: string[];
  aggregateIds?: string[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 6. 分析服务

#### 6.1 获取领域健康度报告
```typescript
GET /api/ddd/domain/{domainId}/analysis/health-report
Response: ApiResponse<DomainHealthReport>
```

#### 6.2 获取领域完成度分析
```typescript
GET /api/ddd/domain/{domainId}/analysis/completion
Response: ApiResponse<DomainCompletionAnalysis>
```

#### 6.3 获取领域依赖关系图
```typescript
GET /api/ddd/domain/{domainId}/analysis/dependency-graph
Response: ApiResponse<DependencyGraph>
```

## 📊 数据模型

### DomainInfo
```typescript
interface DomainInfo {
  domainId: string;
  name: string;
  description: string;
  businessDomain: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Stakeholder
```typescript
interface Stakeholder {
  stakeholderId: string;
  name: string;
  role: string;
  description: string;
  contactInfo?: string;
  influence: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### BusinessGoal
```typescript
interface BusinessGoal {
  goalId: string;
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  targetDate?: string;
  successCriteria?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Metric
```typescript
interface Metric {
  metricId: string;
  name: string;
  description: string;
  type: 'PERFORMANCE' | 'QUALITY' | 'BUSINESS';
  unit: string;
  targetValue?: number;
  currentValue?: number;
  formula?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### DomainHealthReport
```typescript
interface DomainHealthReport {
  domainId: string;
  overallScore: number;
  completenessScore: number;
  consistencyScore: number;
  qualityScore: number;
  recommendations: string[];
  lastUpdated: string;
}
```

### DomainCompletionAnalysis
```typescript
interface DomainCompletionAnalysis {
  domainId: string;
  totalElements: number;
  completedElements: number;
  completionRate: number;
  missingElements: string[];
  lastUpdated: string;
}
```

### DependencyGraph
```typescript
interface DependencyGraph {
  domainId: string;
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  lastUpdated: string;
}

interface DependencyNode {
  id: string;
  type: 'DOMAIN' | 'BOUNDED_CONTEXT' | 'AGGREGATE';
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface DependencyEdge {
  source: string;
  target: string;
  type: 'DEPENDS_ON' | 'COLLABORATES_WITH';
  strength: 'WEAK' | 'MEDIUM' | 'STRONG';
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| DOMAIN.NOT_FOUND | 领域不存在 |
| DOMAIN.INVALID_DATA | 领域数据无效 |
| DOMAIN.DUPLICATE_NAME | 领域名称重复 |
| DOMAIN.ACCESS_DENIED | 访问被拒绝 |
| DOMAIN.DELETE_FAILED | 删除失败 |
| STAKEHOLDER.NOT_FOUND | 利益相关者不存在 |
| BUSINESS_GOAL.NOT_FOUND | 业务目标不存在 |
| METRIC.NOT_FOUND | 度量指标不存在 |

## 📖 使用示例

### 创建领域
```typescript
const newDomain = {
  name: "订单管理领域",
  description: "负责订单的创建、处理和跟踪",
  businessDomain: "电商",
  complexity: "MEDIUM",
  priority: 1,
  isActive: true
};

const response = await fetch('/api/ddd/domain/domain_001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newDomain)
});
```

### 添加利益相关者
```typescript
const stakeholder = {
  name: "产品经理",
  role: "产品负责人",
  description: "负责产品规划和需求管理",
  contactInfo: "pm@example.com",
  influence: "HIGH",
  isActive: true
};

const response = await fetch('/api/ddd/domain/domain_001/stakeholders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(stakeholder)
});
```

### 获取领域健康度报告
```typescript
const response = await fetch('/api/ddd/domain/domain_001/analysis/health-report');
const healthReport = await response.json();
console.log(`领域健康度评分: ${healthReport.data.overallScore}`);
```
