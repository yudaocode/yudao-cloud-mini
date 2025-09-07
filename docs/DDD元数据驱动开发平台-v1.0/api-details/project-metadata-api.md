# 项目元数据管理 API

## 📋 概述

项目元数据管理API提供项目级别的信息管理功能，包括项目基本信息、团队信息、技术栈、业务上下文等。

## 🎯 分层Schema架构 v2.0

### Schema架构设计

本API遵循企业级分层Schema架构模式，提供完整的CRUD操作支持：

### Schema文件组织
```
object-jsonschemas/project-metadata.schemas/
├── fields/                         # 字段级Schema定义
│   ├── common-fields.schema.json   # 通用字段定义
│   ├── project-fields.schema.json  # 项目字段定义
│   └── team-fields.schema.json     # 团队字段定义
├── full/                          # 完整对象Schema
│   ├── project-metadata.schema.json        # 完整项目元数据对象
│   ├── team-info.schema.json               # 完整团队信息对象
│   └── technical-stack.schema.json         # 完整技术栈对象
└── operations/                    # 操作级Schema
    ├── patch/                     # 部分更新操作
    │   ├── project-metadata-patch.schema.json
    │   └── team-info-patch.schema.json
    └── bulk/                      # 批量操作
        └── project-bulk.schema.json
```

### CRUD操作映射
- **CREATE/READ**: 使用 `full/*.schema.json` 完整对象Schema
- **UPDATE (PATCH)**: 使用 `operations/patch/*.schema.json` 部分更新Schema  
- **UPDATE (PUT)**: 使用 `full/*.schema.json` 完整替换Schema
- **BULK**: 使用 `operations/bulk/*.schema.json` 批量操作Schema

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

#### 2.3 获取团队成员列表
```typescript
GET /api/ddd/projects/{projectId}/team-members
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- role?: string
- isActive?: boolean

Response: PaginatedResponse<TeamMember>
```

#### 2.4 添加团队成员
```typescript
POST /api/ddd/projects/{projectId}/team-members
Body: {
  name: string;
  email: string;
  role: string;
  department?: string;
  skills: string[];
  availability: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
Response: ApiResponse<TeamMember>
```

#### 2.5 获取单个团队成员
```typescript
GET /api/ddd/projects/{projectId}/team-members/{memberId}
Response: ApiResponse<TeamMember>
```

#### 2.6 更新团队成员
```typescript
PUT /api/ddd/projects/{projectId}/team-members/{memberId}
Body: {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  skills?: string[];
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  endDate?: string;
  isActive?: boolean;
}
Response: ApiResponse<TeamMember>
```

#### 2.7 删除团队成员
```typescript
DELETE /api/ddd/projects/{projectId}/team-members/{memberId}
Response: ApiResponse<void>
```

#### 2.8 获取角色列表
```typescript
GET /api/ddd/projects/{projectId}/roles
Response: ApiResponse<Role[]>
```

#### 2.9 创建角色
```typescript
POST /api/ddd/projects/{projectId}/roles
Body: {
  name: string;
  description: string;
  permissions: string[];
  level: 'JUNIOR' | 'SENIOR' | 'LEAD' | 'ARCHITECT';
  responsibilities: string[];
  isActive: boolean;
}
Response: ApiResponse<Role>
```

#### 2.10 更新角色
```typescript
PUT /api/ddd/projects/{projectId}/roles/{roleId}
Body: {
  name?: string;
  description?: string;
  permissions?: string[];
  level?: 'JUNIOR' | 'SENIOR' | 'LEAD' | 'ARCHITECT';
  responsibilities?: string[];
  isActive?: boolean;
}
Response: ApiResponse<Role>
```

#### 2.11 删除角色
```typescript
DELETE /api/ddd/projects/{projectId}/roles/{roleId}
Response: ApiResponse<void>
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

#### 3.3 获取框架列表
```typescript
GET /api/ddd/projects/{projectId}/frameworks
Query Parameters:
- category?: 'BACKEND' | 'FRONTEND' | 'MOBILE' | 'TESTING'
- isActive?: boolean

Response: ApiResponse<Framework[]>
```

#### 3.4 添加框架
```typescript
POST /api/ddd/projects/{projectId}/frameworks
Body: {
  name: string;
  version: string;
  category: 'BACKEND' | 'FRONTEND' | 'MOBILE' | 'TESTING';
  description?: string;
  documentation?: string;
  isActive: boolean;
}
Response: ApiResponse<Framework>
```

#### 3.5 更新框架
```typescript
PUT /api/ddd/projects/{projectId}/frameworks/{frameworkId}
Body: {
  name?: string;
  version?: string;
  category?: 'BACKEND' | 'FRONTEND' | 'MOBILE' | 'TESTING';
  description?: string;
  documentation?: string;
  isActive?: boolean;
}
Response: ApiResponse<Framework>
```

#### 3.6 删除框架
```typescript
DELETE /api/ddd/projects/{projectId}/frameworks/{frameworkId}
Response: ApiResponse<void>
```

#### 3.7 获取数据库列表
```typescript
GET /api/ddd/projects/{projectId}/databases
Query Parameters:
- type?: 'RELATIONAL' | 'NOSQL' | 'CACHE' | 'SEARCH'
- isActive?: boolean

Response: ApiResponse<Database[]>
```

#### 3.8 添加数据库
```typescript
POST /api/ddd/projects/{projectId}/databases
Body: {
  name: string;
  type: 'RELATIONAL' | 'NOSQL' | 'CACHE' | 'SEARCH';
  version: string;
  host: string;
  port: number;
  purpose: 'PRIMARY' | 'BACKUP' | 'ANALYTICS' | 'CACHE';
  isActive: boolean;
}
Response: ApiResponse<Database>
```

#### 3.9 更新数据库
```typescript
PUT /api/ddd/projects/{projectId}/databases/{databaseId}
Body: {
  name?: string;
  type?: 'RELATIONAL' | 'NOSQL' | 'CACHE' | 'SEARCH';
  version?: string;
  host?: string;
  port?: number;
  purpose?: 'PRIMARY' | 'BACKUP' | 'ANALYTICS' | 'CACHE';
  isActive?: boolean;
}
Response: ApiResponse<Database>
```

#### 3.10 删除数据库
```typescript
DELETE /api/ddd/projects/{projectId}/databases/{databaseId}
Response: ApiResponse<void>
```

#### 3.11 获取工具列表
```typescript
GET /api/ddd/projects/{projectId}/tools
Query Parameters:
- category?: 'DEVELOPMENT' | 'BUILD' | 'DEPLOYMENT' | 'MONITORING'
- isActive?: boolean

Response: ApiResponse<Tool[]>
```

#### 3.12 添加工具
```typescript
POST /api/ddd/projects/{projectId}/tools
Body: {
  name: string;
  category: 'DEVELOPMENT' | 'BUILD' | 'DEPLOYMENT' | 'MONITORING';
  version?: string;
  description?: string;
  url?: string;
  isActive: boolean;
}
Response: ApiResponse<Tool>
```

#### 3.13 更新工具
```typescript
PUT /api/ddd/projects/{projectId}/tools/{toolId}
Body: {
  name?: string;
  category?: 'DEVELOPMENT' | 'BUILD' | 'DEPLOYMENT' | 'MONITORING';
  version?: string;
  description?: string;
  url?: string;
  isActive?: boolean;
}
Response: ApiResponse<Tool>
```

#### 3.14 删除工具
```typescript
DELETE /api/ddd/projects/{projectId}/tools/{toolId}
Response: ApiResponse<void>
```

#### 3.15 获取基础设施列表
```typescript
GET /api/ddd/projects/{projectId}/infrastructure
Query Parameters:
- type?: 'CLOUD' | 'ON_PREMISE' | 'HYBRID'
- isActive?: boolean

Response: ApiResponse<Infrastructure[]>
```

#### 3.16 添加基础设施
```typescript
POST /api/ddd/projects/{projectId}/infrastructure
Body: {
  name: string;
  type: 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
  provider?: string;
  region?: string;
  specifications: Record<string, any>;
  cost?: number;
  isActive: boolean;
}
Response: ApiResponse<Infrastructure>
```

#### 3.17 更新基础设施
```typescript
PUT /api/ddd/projects/{projectId}/infrastructure/{infrastructureId}
Body: {
  name?: string;
  type?: 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
  provider?: string;
  region?: string;
  specifications?: Record<string, any>;
  cost?: number;
  isActive?: boolean;
}
Response: ApiResponse<Infrastructure>
```

#### 3.18 删除基础设施
```typescript
DELETE /api/ddd/projects/{projectId}/infrastructure/{infrastructureId}
Response: ApiResponse<void>
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

#### 4.3 获取利益相关者列表
```typescript
GET /api/ddd/projects/{projectId}/stakeholders
Query Parameters:
- type?: 'INTERNAL' | 'EXTERNAL' | 'CUSTOMER' | 'PARTNER'
- isActive?: boolean

Response: ApiResponse<Stakeholder[]>
```

#### 4.4 添加利益相关者
```typescript
POST /api/ddd/projects/{projectId}/stakeholders
Body: {
  name: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'CUSTOMER' | 'PARTNER';
  role: string;
  contactInfo: ContactInfo;
  interests: string[];
  influence: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 4.5 更新利益相关者
```typescript
PUT /api/ddd/projects/{projectId}/stakeholders/{stakeholderId}
Body: {
  name?: string;
  type?: 'INTERNAL' | 'EXTERNAL' | 'CUSTOMER' | 'PARTNER';
  role?: string;
  contactInfo?: ContactInfo;
  interests?: string[];
  influence?: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive?: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 4.6 删除利益相关者
```typescript
DELETE /api/ddd/projects/{projectId}/stakeholders/{stakeholderId}
Response: ApiResponse<void>
```

#### 4.7 获取业务规则列表
```typescript
GET /api/ddd/projects/{projectId}/business-rules
Query Parameters:
- category?: 'VALIDATION' | 'CALCULATION' | 'WORKFLOW' | 'POLICY'
- priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
- isActive?: boolean

Response: ApiResponse<BusinessRule[]>
```

#### 4.8 添加业务规则
```typescript
POST /api/ddd/projects/{projectId}/business-rules
Body: {
  name: string;
  description: string;
  category: 'VALIDATION' | 'CALCULATION' | 'WORKFLOW' | 'POLICY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  conditions: string[];
  actions: string[];
  exceptions: string[];
  isActive: boolean;
}
Response: ApiResponse<BusinessRule>
```

#### 4.9 更新业务规则
```typescript
PUT /api/ddd/projects/{projectId}/business-rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  category?: 'VALIDATION' | 'CALCULATION' | 'WORKFLOW' | 'POLICY';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  conditions?: string[];
  actions?: string[];
  exceptions?: string[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessRule>
```

#### 4.10 删除业务规则
```typescript
DELETE /api/ddd/projects/{projectId}/business-rules/{ruleId}
Response: ApiResponse<void>
```

#### 4.11 获取约束条件列表
```typescript
GET /api/ddd/projects/{projectId}/constraints
Query Parameters:
- type?: 'TECHNICAL' | 'BUSINESS' | 'REGULATORY' | 'BUDGET'
- severity?: 'LOW' | 'MEDIUM' | 'HIGH'
- isActive?: boolean

Response: ApiResponse<Constraint[]>
```

#### 4.12 添加约束条件
```typescript
POST /api/ddd/projects/{projectId}/constraints
Body: {
  name: string;
  description: string;
  type: 'TECHNICAL' | 'BUSINESS' | 'REGULATORY' | 'BUDGET';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: string;
  mitigation?: string;
  isActive: boolean;
}
Response: ApiResponse<Constraint>
```

#### 4.13 更新约束条件
```typescript
PUT /api/ddd/projects/{projectId}/constraints/{constraintId}
Body: {
  name?: string;
  description?: string;
  type?: 'TECHNICAL' | 'BUSINESS' | 'REGULATORY' | 'BUDGET';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  impact?: string;
  mitigation?: string;
  isActive?: boolean;
}
Response: ApiResponse<Constraint>
```

#### 4.14 删除约束条件
```typescript
DELETE /api/ddd/projects/{projectId}/constraints/{constraintId}
Response: ApiResponse<void>
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

#### 5.3 获取环境配置列表
```typescript
GET /api/ddd/projects/{projectId}/environment-configs
Query Parameters:
- environment?: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
- isActive?: boolean

Response: ApiResponse<EnvironmentConfig[]>
```

#### 5.4 添加环境配置
```typescript
POST /api/ddd/projects/{projectId}/environment-configs
Body: {
  name: string;
  environment: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION';
  properties: Record<string, any>;
  secrets: Record<string, string>;
  isActive: boolean;
}
Response: ApiResponse<EnvironmentConfig>
```

#### 5.5 更新环境配置
```typescript
PUT /api/ddd/projects/{projectId}/environment-configs/{configId}
Body: {
  name?: string;
  environment?: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION';
  properties?: Record<string, any>;
  secrets?: Record<string, string>;
  isActive?: boolean;
}
Response: ApiResponse<EnvironmentConfig>
```

#### 5.6 删除环境配置
```typescript
DELETE /api/ddd/projects/{projectId}/environment-configs/{configId}
Response: ApiResponse<void>
```

#### 5.7 获取功能开关列表
```typescript
GET /api/ddd/projects/{projectId}/feature-flags
Query Parameters:
- status?: 'ENABLED' | 'DISABLED' | 'TESTING'
- environment?: string
- isActive?: boolean

Response: ApiResponse<FeatureFlag[]>
```

#### 5.8 添加功能开关
```typescript
POST /api/ddd/projects/{projectId}/feature-flags
Body: {
  name: string;
  description: string;
  key: string;
  status: 'ENABLED' | 'DISABLED' | 'TESTING';
  environments: string[];
  percentage?: number;
  conditions?: Record<string, any>;
  isActive: boolean;
}
Response: ApiResponse<FeatureFlag>
```

#### 5.9 更新功能开关
```typescript
PUT /api/ddd/projects/{projectId}/feature-flags/{flagId}
Body: {
  name?: string;
  description?: string;
  status?: 'ENABLED' | 'DISABLED' | 'TESTING';
  environments?: string[];
  percentage?: number;
  conditions?: Record<string, any>;
  isActive?: boolean;
}
Response: ApiResponse<FeatureFlag>
```

#### 5.10 删除功能开关
```typescript
DELETE /api/ddd/projects/{projectId}/feature-flags/{flagId}
Response: ApiResponse<void>
```

#### 5.11 获取集成配置列表
```typescript
GET /api/ddd/projects/{projectId}/integrations
Query Parameters:
- type?: 'API' | 'DATABASE' | 'MESSAGE_QUEUE' | 'EXTERNAL_SERVICE'
- status?: 'ACTIVE' | 'INACTIVE' | 'ERROR'

Response: ApiResponse<Integration[]>
```

#### 5.12 添加集成配置
```typescript
POST /api/ddd/projects/{projectId}/integrations
Body: {
  name: string;
  type: 'API' | 'DATABASE' | 'MESSAGE_QUEUE' | 'EXTERNAL_SERVICE';
  endpoint: string;
  configuration: Record<string, any>;
  authentication?: AuthenticationConfig;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  isActive: boolean;
}
Response: ApiResponse<Integration>
```

#### 5.13 更新集成配置
```typescript
PUT /api/ddd/projects/{projectId}/integrations/{integrationId}
Body: {
  name?: string;
  type?: 'API' | 'DATABASE' | 'MESSAGE_QUEUE' | 'EXTERNAL_SERVICE';
  endpoint?: string;
  configuration?: Record<string, any>;
  authentication?: AuthenticationConfig;
  status?: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  isActive?: boolean;
}
Response: ApiResponse<Integration>
```

#### 5.14 删除集成配置
```typescript
DELETE /api/ddd/projects/{projectId}/integrations/{integrationId}
Response: ApiResponse<void>
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  skills: string[];
  availability: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: 'JUNIOR' | 'SENIOR' | 'LEAD' | 'ARCHITECT';
  responsibilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Responsibility {
  id: string;
  name: string;
  description: string;
  assignedTo: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
}

interface CommunicationChannel {
  id: string;
  name: string;
  type: 'EMAIL' | 'SLACK' | 'TEAMS' | 'WEBHOOK';
  configuration: Record<string, any>;
  isActive: boolean;
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

interface Framework {
  id: string;
  name: string;
  version: string;
  category: 'BACKEND' | 'FRONTEND' | 'MOBILE' | 'TESTING';
  description?: string;
  documentation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Database {
  id: string;
  name: string;
  type: 'RELATIONAL' | 'NOSQL' | 'CACHE' | 'SEARCH';
  version: string;
  host: string;
  port: number;
  purpose: 'PRIMARY' | 'BACKUP' | 'ANALYTICS' | 'CACHE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Tool {
  id: string;
  name: string;
  category: 'DEVELOPMENT' | 'BUILD' | 'DEPLOYMENT' | 'MONITORING';
  version?: string;
  description?: string;
  url?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Infrastructure {
  id: string;
  name: string;
  type: 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
  provider?: string;
  region?: string;
  specifications: Record<string, any>;
  cost?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

interface Stakeholder {
  id: string;
  name: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'CUSTOMER' | 'PARTNER';
  role: string;
  contactInfo: ContactInfo;
  interests: string[];
  influence: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  socialMedia?: Record<string, string>;
}

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: 'VALIDATION' | 'CALCULATION' | 'WORKFLOW' | 'POLICY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  conditions: string[];
  actions: string[];
  exceptions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Constraint {
  id: string;
  name: string;
  description: string;
  type: 'TECHNICAL' | 'BUSINESS' | 'REGULATORY' | 'BUDGET';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: string;
  mitigation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Configuration
```typescript
interface Configuration {
  environmentConfigs: EnvironmentConfig[];
  featureFlags: FeatureFlag[];
  integrations: Integration[];
}

interface EnvironmentConfig {
  id: string;
  name: string;
  environment: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION';
  properties: Record<string, any>;
  secrets: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  status: 'ENABLED' | 'DISABLED' | 'TESTING';
  environments: string[];
  percentage?: number;
  conditions?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Integration {
  id: string;
  name: string;
  type: 'API' | 'DATABASE' | 'MESSAGE_QUEUE' | 'EXTERNAL_SERVICE';
  endpoint: string;
  configuration: Record<string, any>;
  authentication?: AuthenticationConfig;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthenticationConfig {
  type: 'BASIC' | 'BEARER_TOKEN' | 'API_KEY' | 'OAUTH2';
  credentials: Record<string, string>;
  tokenEndpoint?: string;
  refreshToken?: string;
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
