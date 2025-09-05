# DTO管理 API

## 📋 概述

DTO管理API提供数据传输对象的管理功能，包括DTO、DTO属性、DTO映射等。

## 🏗️ API结构

```

/api/ddd/data-transfer-objects/
├── /{domainId}                      # DTO基本信息
├── /{domainId}/dtos                 # DTO对象
├── /{domainId}/attributes           # DTO属性
├── /{domainId}/mappings             # DTO映射
└── /{domainId}/associations         # 关联服务
```

## 📚 API详情

### 1. 基本信息管理

#### 1.1 获取基本信息
```typescript
GET /api/ddd/data-transfer-objects/{domainId}
Response: ApiResponse<DataTransferObjectsInfo>
```

#### 1.2 创建/更新基本信息
```typescript
PUT /api/ddd/data-transfer-objects/{domainId}
Body: {
  // 根据具体模块定义
}
Response: ApiResponse<DataTransferObjectsInfo>
```

### 2. 核心功能管理

#### 2.1 获取列表
```typescript
GET /api/ddd/data-transfer-objects/{domainId}/items
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
GET /api/ddd/data-transfer-objects/{domainId}/items/{itemId}
Response: ApiResponse<Item>
```

#### 2.3 创建项目
```typescript
POST /api/ddd/data-transfer-objects/{domainId}/items
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
PUT /api/ddd/data-transfer-objects/{domainId}/items/{itemId}
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
DELETE /api/ddd/data-transfer-objects/{domainId}/items/{itemId}
Response: ApiResponse<void>
```

### 3. 关联服务

#### 3.1 获取关联信息
```typescript
GET /api/ddd/data-transfer-objects/{domainId}/associations
Response: ApiResponse<Association[]>
```

#### 3.2 更新关联信息
```typescript
PUT /api/ddd/data-transfer-objects/{domainId}/associations
Body: {
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
