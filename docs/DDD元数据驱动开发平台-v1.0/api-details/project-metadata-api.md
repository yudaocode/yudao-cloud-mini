# 项目元数据管理 API

## 📋 概述

项目元数据管理API提供项目级别的信息管理功能，包括项目基本信息、团队信息、技术栈、业务上下文等。

## 🏗️ API结构

```
/api/ddd/projects/
├── /{projectId}                    # 项目基本信息
├── /{projectId}/team-info          # 团队信息
├── /{projectId}/technical-stack    # 技术栈
├── /{projectId}/business-context    # 业务上下文
├── /{projectId}/configuration      # 配置信息
└── /{projectId}/statistics          # 统计信息
```

## 📚 API详情

### 1. 项目基本信息管理

#### 1.1 获取项目列表
```typescript
GET /api/ddd/projects
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
- sortBy?: 'name' | 'createdAt' | 'updatedAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ProjectMetadata>
```

#### 1.2 获取单个项目
```typescript
GET /api/ddd/projects/{projectId}
Response: ApiResponse<ProjectMetadata>
```

#### 1.3 创建项目
```typescript
POST /api/ddd/projects
Body: {
  projectInfo: {
    name: string;                    // 必填，项目名称
    description: string;             // 必填，项目描述
    version: string;                 // 必填，版本号
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';  // 必填，项目状态
    startDate?: string;              // 开始日期
    endDate?: string;                // 结束日期
    tags?: string[];                 // 标签列表
  };
  teamInfo?: TeamInfo;               // 团队信息
  technicalStack?: TechnicalStack;    // 技术栈
  businessContext?: BusinessContext; // 业务上下文
  configuration?: Configuration;     // 配置信息
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.4 更新项目
```typescript
PUT /api/ddd/projects/{projectId}
Body: {
  projectInfo?: ProjectInfo;
  teamInfo?: TeamInfo;
  technicalStack?: TechnicalStack;
  businessContext?: BusinessContext;
  configuration?: Configuration;
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.5 删除项目
```typescript
DELETE /api/ddd/projects/{projectId}
Response: ApiResponse<void>
```

### 2. 团队信息管理

#### 2.1 获取团队信息
```typescript
GET /api/ddd/projects/{projectId}/team-info
Response: ApiResponse<TeamInfo>
```

#### 2.2 更新团队信息
```typescript
PUT /api/ddd/projects/{projectId}/team-info
Body: {
  teamMembers: TeamMember[];
  roles: Role[];
  responsibilities: Responsibility[];
  communicationChannels: CommunicationChannel[];
}
Response: ApiResponse<TeamInfo>
```

### 3. 技术栈管理

#### 3.1 获取技术栈
```typescript
GET /api/ddd/projects/{projectId}/technical-stack
Response: ApiResponse<TechnicalStack>
```

#### 3.2 更新技术栈
```typescript
PUT /api/ddd/projects/{projectId}/technical-stack
Body: {
  frameworks: Framework[];
  databases: Database[];
  tools: Tool[];
  infrastructure: Infrastructure[];
}
Response: ApiResponse<TechnicalStack>
```

### 4. 业务上下文管理

#### 4.1 获取业务上下文
```typescript
GET /api/ddd/projects/{projectId}/business-context
Response: ApiResponse<BusinessContext>
```

#### 4.2 更新业务上下文
```typescript
PUT /api/ddd/projects/{projectId}/business-context
Body: {
  businessDomain: string;
  businessRules: BusinessRule[];
  stakeholders: Stakeholder[];
  constraints: Constraint[];
}
Response: ApiResponse<BusinessContext>
```

### 5. 配置信息管理

#### 5.1 获取配置信息
```typescript
GET /api/ddd/projects/{projectId}/configuration
Response: ApiResponse<Configuration>
```

#### 5.2 更新配置信息
```typescript
PUT /api/ddd/projects/{projectId}/configuration
Body: {
  environmentConfigs: EnvironmentConfig[];
  featureFlags: FeatureFlag[];
  integrations: Integration[];
}
Response: ApiResponse<Configuration>
```

### 6. 统计信息

#### 6.1 获取项目统计
```typescript
GET /api/ddd/projects/{projectId}/statistics
Response: ApiResponse<ProjectStatistics>
```

## 📊 数据模型

### ProjectMetadata
```typescript
interface ProjectMetadata {
  projectId: string;
  projectInfo: ProjectInfo;
  teamInfo?: TeamInfo;
  technicalStack?: TechnicalStack;
  businessContext?: BusinessContext;
  configuration?: Configuration;
  statistics?: ProjectStatistics;
  createdAt: string;
  updatedAt: string;
}
```

### ProjectInfo
```typescript
interface ProjectInfo {
  name: string;
  description: string;
  version: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  startDate?: string;
  endDate?: string;
  tags?: string[];
}
```

### TeamInfo
```typescript
interface TeamInfo {
  teamMembers: TeamMember[];
  roles: Role[];
  responsibilities: Responsibility[];
  communicationChannels: CommunicationChannel[];
}
```

### TechnicalStack
```typescript
interface TechnicalStack {
  frameworks: Framework[];
  databases: Database[];
  tools: Tool[];
  infrastructure: Infrastructure[];
}
```

### BusinessContext
```typescript
interface BusinessContext {
  businessDomain: string;
  businessRules: BusinessRule[];
  stakeholders: Stakeholder[];
  constraints: Constraint[];
}
```

### Configuration
```typescript
interface Configuration {
  environmentConfigs: EnvironmentConfig[];
  featureFlags: FeatureFlag[];
  integrations: Integration[];
}
```

### ProjectStatistics
```typescript
interface ProjectStatistics {
  totalDomains: number;
  totalBoundedContexts: number;
  totalEntities: number;
  totalAggregates: number;
  totalServices: number;
  totalDTOs: number;
  lastUpdated: string;
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| PROJECT.NOT_FOUND | 项目不存在 |
| PROJECT.INVALID_DATA | 项目数据无效 |
| PROJECT.DUPLICATE_NAME | 项目名称重复 |
| PROJECT.ACCESS_DENIED | 访问被拒绝 |
| PROJECT.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建新项目
```typescript
const newProject = {
  projectInfo: {
    name: "电商平台",
    description: "基于DDD的电商平台项目",
    version: "1.0.0",
    status: "ACTIVE",
    startDate: "2024-01-01",
    tags: ["电商", "DDD", "微服务"]
  },
  teamInfo: {
    teamMembers: [
      {
        name: "张三",
        role: "架构师",
        email: "zhangsan@example.com"
      }
    ]
  }
};

const response = await fetch('/api/ddd/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProject)
});
```

### 获取项目统计
```typescript
const response = await fetch('/api/ddd/projects/project_001/statistics');
const stats = await response.json();
console.log(`项目包含 ${stats.data.totalDomains} 个领域`);
```
