# 战术设计管理 API

## 📋 概述

战术设计管理API提供聚合、实体、值对象、领域服务、仓储、工厂、枚举、防腐层等管理功能。

## 🏗️ API结构

```

/api/ddd/tactical-design/
├── /{boundedContextId}              # 战术设计基本信息
├── /{boundedContextId}/aggregates   # 聚合
├── /{boundedContextId}/entities     # 实体
├── /{boundedContextId}/value-objects # 值对象
├── /{boundedContextId}/domain-services # 领域服务
├── /{boundedContextId}/repositories # 仓储
├── /{boundedContextId}/factories    # 工厂
├── /{boundedContextId}/enums        # 枚举
├── /{boundedContextId}/anti-corruption-layers # 防腐层
└── /{boundedContextId}/analysis     # 分析服务
```

## 📚 API详情

### 1. 基本信息管理

#### 1.1 获取基本信息
```typescript
GET /api/ddd/tactical-design/{domainId}
Response: ApiResponse<TacticalDesignInfo>
```

#### 1.2 创建/更新基本信息
```typescript
PUT /api/ddd/tactical-design/{domainId}
Body: {
  // 根据具体模块定义
}
Response: ApiResponse<TacticalDesignInfo>
```

### 2. 核心功能管理

#### 2.1 获取列表
```typescript
GET /api/ddd/tactical-design/{domainId}/items
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
GET /api/ddd/tactical-design/{domainId}/items/{itemId}
Response: ApiResponse<Item>
```

#### 2.3 创建项目
```typescript
POST /api/ddd/tactical-design/{domainId}/items
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
PUT /api/ddd/tactical-design/{domainId}/items/{itemId}
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
DELETE /api/ddd/tactical-design/{domainId}/items/{itemId}
Response: ApiResponse<void>
```

### 3. 关联服务

#### 3.1 获取关联信息
```typescript
GET /api/ddd/tactical-design/{domainId}/associations
Response: ApiResponse<Association[]>
```

#### 3.2 更新关联信息
```typescript
PUT /api/ddd/tactical-design/{domainId}/associations
Body: {
  // 关联数据
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 4. 分析服务

#### 4.1 获取分析报告
```typescript
GET /api/ddd/tactical-design/{domainId}/analysis/report
Response: ApiResponse<AnalysisReport>
```

#### 4.2 获取统计信息
```typescript
GET /api/ddd/tactical-design/{domainId}/analysis/statistics
Response: ApiResponse<Statistics>
```

## 📊 数据模型

### TacticalDesignInfo
```typescript
interface TacticalDesignInfo {
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
