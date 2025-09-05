# 分析服务 API

## 📋 概述

分析服务API提供引用分析、使用摘要、未使用元素、孤立引用、设计建议、依赖图、一致性分析、完整性分析、质量评估、影响分析、趋势分析、性能分析等功能。

## 🏗️ API结构

```

/api/ddd/analysis/
├── /{domainId}                      # 分析服务基本信息
├── /{domainId}/reference-analysis   # 引用分析
├── /{domainId}/usage-summary        # 使用摘要
├── /{domainId}/unused-elements      # 未使用元素
├── /{domainId}/orphaned-references  # 孤立引用
├── /{domainId}/design-recommendations # 设计建议
├── /{domainId}/dependency-graphs    # 依赖图
├── /{domainId}/consistency-analysis # 一致性分析
├── /{domainId}/completeness-analysis # 完整性分析
├── /{domainId}/quality-assessment   # 质量评估
├── /{domainId}/impact-analysis      # 影响分析
├── /{domainId}/trend-analysis        # 趋势分析
└── /{domainId}/performance-analysis # 性能分析
```

## 📚 API详情

### 1. 基本信息管理

#### 1.1 获取基本信息
```typescript
GET /api/ddd/analysis/{domainId}
Response: ApiResponse<AnalysisInfo>
```

#### 1.2 创建/更新基本信息
```typescript
PUT /api/ddd/analysis/{domainId}
Body: {
  // 根据具体模块定义
}
Response: ApiResponse<AnalysisInfo>
```

### 2. 核心功能管理

#### 2.1 获取列表
```typescript
GET /api/ddd/analysis/{domainId}/items
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'updatedAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Item>
```

#### 2.2 获取单个项目
```typescript
GET /api/ddd/analysis/{domainId}/items/{itemId}
Response: ApiResponse<Item>
```

#### 2.3 创建项目
```typescript
POST /api/ddd/analysis/{domainId}/items
Body: {
  name: string;                      // 必填，名称
  description: string;               // 必填，描述
  // 其他字段根据具体模块定义
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<Item>
```

#### 2.4 更新项目
```typescript
PUT /api/ddd/analysis/{domainId}/items/{itemId}
Body: {
  name?: string;
  description?: string;
  // 其他字段根据具体模块定义
  isActive?: boolean;
}
Response: ApiResponse<Item>
```

#### 2.5 删除项目
```typescript
DELETE /api/ddd/analysis/{domainId}/items/{itemId}
Response: ApiResponse<void>
```

### 3. 关联服务

#### 3.1 获取关联信息
```typescript
GET /api/ddd/analysis/{domainId}/associations
Response: ApiResponse<Association[]>
```

#### 3.2 更新关联信息
```typescript
PUT /api/ddd/analysis/{domainId}/associations
Body: {
  // 关联数据
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 4. 分析服务

#### 4.1 获取分析报告
```typescript
GET /api/ddd/analysis/{domainId}/analysis/report
Response: ApiResponse<AnalysisReport>
```

#### 4.2 获取统计信息
```typescript
GET /api/ddd/analysis/{domainId}/analysis/statistics
Response: ApiResponse<Statistics>
```

## 📊 数据模型

### AnalysisInfo
```typescript
interface AnalysisInfo {
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
| ANALYSIS.NOT_FOUND | 数据不存在 |
| ANALYSIS.INVALID_DATA | 数据无效 |
| ANALYSIS.DUPLICATE_NAME | 名称重复 |
| ANALYSIS.ACCESS_DENIED | 访问被拒绝 |
| ANALYSIS.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建项目
```typescript
const newItem = {
  name: "示例项目",
  description: "这是一个示例项目",
  isActive: true
};

const response = await fetch('/api/ddd/analysis/domain_001/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newItem)
});
```

### 获取分析报告
```typescript
const response = await fetch('/api/ddd/analysis/domain_001/analysis/report');
const report = await response.json();
console.log('分析报告:', report.data);
```
