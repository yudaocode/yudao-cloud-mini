# DDD元数据驱动开发平台 - API定义文档

## 📋 概述

本文档定义了DDD元数据驱动开发平台的完整API接口，考虑了创建顺序和引用关系更新，为前端services开发提供指导。

### DDD设计流程说明

按照DDD（领域驱动设计）的标准流程，API接口的设计顺序应该遵循以下逻辑：

1. **项目元数据管理** - 创建和管理项目基本信息
2. **统一语言管理** - 定义业务术语、属性和规则（这是DDD的基础）
3. **战略设计** - 定义限界上下文、子领域、上下文映射和领域事件
4. **DTO管理** - 定义数据传输对象，为战术设计提供数据基础
5. **战术设计** - 定义聚合、实体、值对象、领域服务、仓储、工厂、枚举（使用DTO）
6. **实现映射** - 映射到技术实现
7. **屏幕定义** - 定义用户界面
8. **分析服务** - 提供设计分析和建议

### 方法参数与DTO关系说明

在DDD中，方法参数和DTO属性的设计遵循以下原则：

1. **DTO在DDD中的完整作用**：
   - **领域服务方法**：输入参数DTO、输出结果DTO
   - **实体方法**：参数DTO、返回值DTO
   - **聚合方法**：命令DTO、查询DTO、事件DTO
   - **应用服务**：请求DTO、响应DTO
   - **仓储接口**：查询条件DTO、结果DTO
   - **跨边界传输**：限界上下文之间的数据传输

2. **参数来源优先级**：
   - **业务属性引用**：`businessAttributeId` - 直接引用统一语言中定义的业务属性（最高优先级）
   - **DTO属性引用**：`dtoAttributeId` - 引用其他DTO中定义的属性
   - **直接类型定义**：`dataType` - 直接定义数据类型（当不引用业务属性或DTO属性时）

3. **DTO属性设计原则**：
   - **优先引用业务属性**：DTO属性应该优先引用业务属性，确保数据定义的一致性
   - **继承业务属性特性**：DTO属性继承业务属性的数据类型、验证规则、约束等特性
   - **避免重复定义**：通过引用业务属性，避免在DTO中重复定义相同的数据结构
   - **支持DTO间引用**：DTO属性可以引用其他DTO的属性，形成DTO组合

4. **方法参数设计原则**：
   - **领域服务方法**：参数可以是业务属性或DTO属性，返回值通常是DTO
   - **实体方法**：参数可以是业务属性或DTO属性，返回值可以是业务属性或DTO
   - **聚合方法**：命令参数通常是DTO，查询结果通常是DTO
   - **应用服务方法**：输入输出都是DTO，处理跨边界的数据

5. **数据转换机制**：
   - **业务属性到数据类型**：系统自动将业务属性的定义转换为具体的数据类型
   - **DTO属性组合**：支持DTO属性之间的组合和引用
   - **验证规则继承**：DTO属性和方法参数继承业务属性的验证规则
   - **约束条件传递**：业务属性的约束条件自动传递给DTO属性和方法参数

**注意**：虽然API按此顺序定义，但实际使用时支持渐进式开发，允许在任何阶段创建数据，系统会自动发现和维护引用关系。

## 🏗️ 架构设计

### 1. API层次结构

```
/api/ddd/
├── /projects/                    # 项目元数据管理
│   └── /{projectId}/statistics/ # 项目统计信息
├── /domain/                      # 领域管理（领域信息、利益相关者、业务目标、度量指标）
├── /ubiquitous-language/        # 统一语言管理（术语、属性、规则、关系）
├── /strategic-design/           # 战略设计管理（限界上下文、子领域、上下文映射、领域事件）
├── /data-transfer-objects/      # DTO管理（DTO、DTO属性、DTO映射）
├── /tactical-design/            # 战术设计管理（聚合、实体、值对象、领域服务、仓储、工厂、枚举）
├── /implementation-mapping/     # 实现映射管理
├── /screen-definition/          # 屏幕定义管理
├── /amis-screen-definition/     # amis屏幕管理
├── /relationships/              # 关系管理
├── /validation/                 # 验证管理
└── /analysis/                   # 分析服务
```

### 2. 通用响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}
```

## 📡 API接口定义

### 1. 项目元数据管理 API

#### 1.1 获取项目列表
```typescript
GET /api/ddd/projects
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- status?: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DEPLOYED' | 'ARCHIVED'
- priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
- industry?: 'E_COMMERCE' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MANUFACTURING' | 'LOGISTICS' | 'ENTERTAINMENT' | 'GOVERNMENT' | 'OTHER'
- businessType?: 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'INTERNAL' | 'OTHER'
- createdBy?: string
- startDate?: string (format: date)
- endDate?: string (format: date)
- tags?: string[] (支持多标签过滤)
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'priority' | 'status'
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
  projectId: string;  // 必填，项目唯一标识符
  projectInfo: {
    name: string;  // 必填，项目名称
    englishName?: string;  // 项目英文名称，用于代码生成
    description?: string;  // 项目描述
    version?: string;  // 项目版本号，格式：x.y.z
    status: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DEPLOYED' | 'ARCHIVED';  // 必填
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';  // 必填
    startDate?: string;  // 项目开始日期，格式：YYYY-MM-DD
    endDate?: string;  // 项目结束日期，格式：YYYY-MM-DD
    tags?: string[];  // 项目标签，用于分类和搜索
  };
  teamInfo?: {
    productOwner?: {
      name: string;  // 必填，产品负责人姓名
      email: string;  // 必填，邮箱地址
      phone?: string;  // 电话号码
    };
    technicalLead?: {
      name: string;  // 必填，技术负责人姓名
      email: string;  // 必填，邮箱地址
      phone?: string;  // 电话号码
    };
    teamMembers?: Array<{
      name: string;  // 必填，团队成员姓名
      email: string;  // 必填，邮箱地址
      role: 'DEVELOPER' | 'TESTER' | 'DESIGNER' | 'ANALYST' | 'ARCHITECT' | 'DEVOPS';  // 必填
      skills?: string[];  // 技能列表，用于团队能力评估
    }>;
  };
  technicalStack?: {
    frontend?: {
      framework?: 'REACT' | 'VUE' | 'ANGULAR' | 'SVELTE' | 'SOLID' | 'OTHER';  // 前端框架
      uiLibrary?: string;  // UI库，如：amis、Ant Design等
      language?: 'JAVASCRIPT' | 'TYPESCRIPT' | 'OTHER';  // 编程语言
      buildTool?: 'VITE' | 'WEBPACK' | 'ROLLUP' | 'ESBUILD' | 'OTHER';  // 构建工具
    };
    backend?: {
      framework?: 'SPRING_BOOT' | 'EXPRESS' | 'FASTAPI' | 'ASP_NET' | 'LARAVEL' | 'OTHER';  // 后端框架
      language?: 'JAVA' | 'JAVASCRIPT' | 'PYTHON' | 'C_SHARP' | 'PHP' | 'GO' | 'RUST' | 'OTHER';  // 编程语言
      database?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS' | 'OTHER';  // 数据库
      orm?: string;  // ORM框架
    };
    infrastructure?: {
      deployment?: 'DOCKER' | 'KUBERNETES' | 'CLOUD' | 'TRADITIONAL' | 'OTHER';  // 部署方式
      cloud?: 'AWS' | 'AZURE' | 'GCP' | 'ALIYUN' | 'TENCENT' | 'OTHER';  // 云平台
      monitoring?: string[];  // 监控工具列表
    };
  };
  businessContext?: {
    industry?: 'E_COMMERCE' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MANUFACTURING' | 'LOGISTICS' | 'ENTERTAINMENT' | 'GOVERNMENT' | 'OTHER';  // 所属行业
    businessType?: 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'INTERNAL' | 'OTHER';  // 业务类型
    targetUsers?: string[];  // 目标用户群体
    businessGoals?: Array<{
      goal: string;  // 必填，业务目标描述
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';  // 必填，优先级
      metrics?: string[];  // 相关指标列表
    }>;
  };
  configuration?: {
    dddSettings?: {
      enableValidation?: boolean;  // 是否启用DDD验证，默认true
      strictMode?: boolean;  // 严格模式，默认false
      autoDiscovery?: boolean;  // 自动发现引用关系，默认true
      namingConvention?: 'CAMEL_CASE' | 'SNAKE_CASE' | 'PASCAL_CASE' | 'KEBAB_CASE';  // 命名规范，默认CAMEL_CASE
    };
    codeGeneration?: {
      enableAutoGeneration?: boolean;  // 启用自动代码生成，默认true
      targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';  // 目标语言
      framework?: string;  // 目标框架
      outputPath?: string;  // 输出路径
      templateEngine?: 'VELOCITY' | 'FREEMARKER' | 'THYMELEAF' | 'HANDLEBARS';  // 模板引擎
    };
    uiSettings?: {
      theme?: 'LIGHT' | 'DARK' | 'AUTO';  // 主题，默认LIGHT
      language?: 'ZH_CN' | 'EN_US' | 'JA_JP';  // 界面语言，默认ZH_CN
      layout?: 'SIDEBAR' | 'TOP_NAV' | 'COMPACT';  // 布局方式，默认SIDEBAR
    };
  };
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.4 更新项目
```typescript
PUT /api/ddd/projects/{projectId}
Body: {
  projectInfo?: {
    name?: string;
    englishName?: string;
    description?: string;
    version?: string;
    status?: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DEPLOYED' | 'ARCHIVED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    startDate?: string;
    endDate?: string;
    tags?: string[];
  };
  teamInfo?: {
    productOwner?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    technicalLead?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    teamMembers?: Array<{
      name?: string;
      email?: string;
      role?: 'DEVELOPER' | 'TESTER' | 'DESIGNER' | 'ANALYST' | 'ARCHITECT' | 'DEVOPS';
      skills?: string[];
    }>;
  };
  technicalStack?: {
    frontend?: {
      framework?: 'REACT' | 'VUE' | 'ANGULAR' | 'SVELTE' | 'SOLID' | 'OTHER';
      uiLibrary?: string;
      language?: 'JAVASCRIPT' | 'TYPESCRIPT' | 'OTHER';
      buildTool?: 'VITE' | 'WEBPACK' | 'ROLLUP' | 'ESBUILD' | 'OTHER';
    };
    backend?: {
      framework?: 'SPRING_BOOT' | 'EXPRESS' | 'FASTAPI' | 'ASP_NET' | 'LARAVEL' | 'OTHER';
      language?: 'JAVA' | 'JAVASCRIPT' | 'PYTHON' | 'C_SHARP' | 'PHP' | 'GO' | 'RUST' | 'OTHER';
      database?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS' | 'OTHER';
      orm?: string;
    };
    infrastructure?: {
      deployment?: 'DOCKER' | 'KUBERNETES' | 'CLOUD' | 'TRADITIONAL' | 'OTHER';
      cloud?: 'AWS' | 'AZURE' | 'GCP' | 'ALIYUN' | 'TENCENT' | 'OTHER';
      monitoring?: string[];
    };
  };
  businessContext?: {
    industry?: 'E_COMMERCE' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MANUFACTURING' | 'LOGISTICS' | 'ENTERTAINMENT' | 'GOVERNMENT' | 'OTHER';
    businessType?: 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'INTERNAL' | 'OTHER';
    targetUsers?: string[];
    businessGoals?: Array<{
      goal?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      metrics?: string[];
    }>;
  };
  configuration?: {
    dddSettings?: {
      enableValidation?: boolean;
      strictMode?: boolean;
      autoDiscovery?: boolean;
      namingConvention?: 'CAMEL_CASE' | 'SNAKE_CASE' | 'PASCAL_CASE' | 'KEBAB_CASE';
    };
    codeGeneration?: {
      enableAutoGeneration?: boolean;
      targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';
      framework?: string;
      outputPath?: string;
      templateEngine?: 'VELOCITY' | 'FREEMARKER' | 'THYMELEAF' | 'HANDLEBARS';
    };
    uiSettings?: {
      theme?: 'LIGHT' | 'DARK' | 'AUTO';
      language?: 'ZH_CN' | 'EN_US' | 'JA_JP';
      layout?: 'SIDEBAR' | 'TOP_NAV' | 'COMPACT';
    };
  };
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.5 删除项目
```typescript
DELETE /api/ddd/projects/{projectId}
Response: ApiResponse<void>
```

#### 1.6 获取项目统计信息
```typescript
GET /api/ddd/projects/{projectId}/statistics
Response: ApiResponse<ProjectStatistics>
```

#### 1.7 更新项目统计信息
```typescript
PUT /api/ddd/projects/{projectId}/statistics
Body: {
  elementCounts?: {
    businessTerms?: number;
    boundedContexts?: number;
    aggregates?: number;
    entities?: number;
    valueObjects?: number;
    domainServices?: number;
    dataTransferObjects?: number;
    screenDefinitions?: number;
  };
  usageStatus?: {
    usedElements?: number;
    unusedElements?: number;
    orphanedReferences?: number;
  };
  completionRate?: {
    ubiquitousLanguage?: number;
    strategicDesign?: number;
    tacticalDesign?: number;
    dataTransferObjects?: number;
    implementationMapping?: number;
    screenDefinition?: number;
    overall?: number;
  };
}
Response: ApiResponse<ProjectStatistics>
```

#### 1.8 项目关联服务 - 获取项目的技术栈关联
```typescript
GET /api/ddd/projects/{projectId}/technical-stack-associations
Response: ApiResponse<TechnicalStackAssociation[]>
```

#### 1.9 项目关联服务 - 获取项目的业务上下文关联
```typescript
GET /api/ddd/projects/{projectId}/business-context-associations
Response: ApiResponse<BusinessContextAssociation[]>
```

#### 1.10 项目关联服务 - 获取项目的团队关联
```typescript
GET /api/ddd/projects/{projectId}/team-associations
Response: ApiResponse<TeamAssociation[]>
```

#### 1.11 项目关联服务 - 批量更新项目关联
```typescript
PUT /api/ddd/projects/{projectId}/associations
Body: {
  technicalStackAssociations?: TechnicalStackAssociation[];
  businessContextAssociations?: BusinessContextAssociation[];
  teamAssociations?: TeamAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 1.12 项目模板管理 - 获取项目模板列表
```typescript
GET /api/ddd/projects/templates
Query Parameters:
- industry?: string
- businessType?: string
- framework?: string
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<ProjectTemplate>
```

#### 1.13 项目模板管理 - 获取单个项目模板
```typescript
GET /api/ddd/projects/templates/{templateId}
Response: ApiResponse<ProjectTemplate>
```

#### 1.14 项目模板管理 - 从模板创建项目
```typescript
POST /api/ddd/projects/from-template/{templateId}
Body: {
  projectId: string;
  projectInfo: {
    name: string;
    description?: string;
    version?: string;
    tags?: string[];
  };
  customizations?: {
    teamInfo?: Partial<TeamInfo>;
    technicalStack?: Partial<TechnicalStack>;
    businessContext?: Partial<BusinessContext>;
    configuration?: Partial<Configuration>;
  };
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.15 项目导入导出 - 导出项目配置
```typescript
GET /api/ddd/projects/{projectId}/export
Query Parameters:
- format?: 'JSON' | 'YAML' | 'XML'
- includeStatistics?: boolean
- includeTemplates?: boolean

Response: ApiResponse<ProjectExport>
```

#### 1.16 项目导入导出 - 导入项目配置
```typescript
POST /api/ddd/projects/import
Body: {
  file: File;  // 项目配置文件
  overwrite?: boolean;  // 是否覆盖现有项目
  validateOnly?: boolean;  // 仅验证不导入
}
Response: ApiResponse<ProjectImportResult>
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
  projectId: string;
  projectInfo: {
    name: string;
    englishName?: string;
    description?: string;
    version?: string;
    status: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DEPLOYED' | 'ARCHIVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    startDate?: string;
    endDate?: string;
    tags?: string[];
  };
  teamInfo?: {
    productOwner?: {
      name: string;
      email: string;
      phone?: string;
    };
    technicalLead?: {
      name: string;
      email: string;
      phone?: string;
    };
    teamMembers?: Array<{
      name: string;
      email: string;
      role: 'DEVELOPER' | 'TESTER' | 'DESIGNER' | 'ANALYST' | 'ARCHITECT' | 'DEVOPS';
      skills?: string[];
    }>;
  };
  technicalStack?: {
    frontend?: {
      framework?: 'REACT' | 'VUE' | 'ANGULAR' | 'SVELTE' | 'SOLID' | 'OTHER';
      uiLibrary?: string;
      language?: 'JAVASCRIPT' | 'TYPESCRIPT' | 'OTHER';
      buildTool?: 'VITE' | 'WEBPACK' | 'ROLLUP' | 'ESBUILD' | 'OTHER';
    };
    backend?: {
      framework?: 'SPRING_BOOT' | 'EXPRESS' | 'FASTAPI' | 'ASP_NET' | 'LARAVEL' | 'OTHER';
      language?: 'JAVA' | 'JAVASCRIPT' | 'PYTHON' | 'C_SHARP' | 'PHP' | 'GO' | 'RUST' | 'OTHER';
      database?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS' | 'OTHER';
      orm?: string;
    };
    infrastructure?: {
      deployment?: 'DOCKER' | 'KUBERNETES' | 'CLOUD' | 'TRADITIONAL' | 'OTHER';
      cloud?: 'AWS' | 'AZURE' | 'GCP' | 'ALIYUN' | 'TENCENT' | 'OTHER';
      monitoring?: string[];
    };
  };
  businessContext?: {
    industry?: 'E_COMMERCE' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MANUFACTURING' | 'LOGISTICS' | 'ENTERTAINMENT' | 'GOVERNMENT' | 'OTHER';
    businessType?: 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'INTERNAL' | 'OTHER';
    targetUsers?: string[];
    businessGoals?: Array<{
      goal: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      metrics?: string[];
    }>;
  };
  configuration?: {
    dddSettings?: {
      enableValidation?: boolean;
      strictMode?: boolean;
      autoDiscovery?: boolean;
      namingConvention?: 'CAMEL_CASE' | 'SNAKE_CASE' | 'PASCAL_CASE' | 'KEBAB_CASE';
    };
    codeGeneration?: {
      enableAutoGeneration?: boolean;
      targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';
      framework?: string;
      outputPath?: string;
      templateEngine?: 'VELOCITY' | 'FREEMARKER' | 'THYMELEAF' | 'HANDLEBARS';
    };
    uiSettings?: {
      theme?: 'LIGHT' | 'DARK' | 'AUTO';
      language?: 'ZH_CN' | 'EN_US' | 'JA_JP';
      layout?: 'SIDEBAR' | 'TOP_NAV' | 'COMPACT';
    };
  };
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.4 更新项目
```typescript
PUT /api/ddd/projects/{projectId}
Body: {
  projectInfo?: {
    name?: string;
    englishName?: string;
    description?: string;
    version?: string;
    status?: 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DEPLOYED' | 'ARCHIVED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    startDate?: string;
    endDate?: string;
    tags?: string[];
  };
  teamInfo?: {
    productOwner?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    technicalLead?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    teamMembers?: Array<{
      name?: string;
      email?: string;
      role?: 'DEVELOPER' | 'TESTER' | 'DESIGNER' | 'ANALYST' | 'ARCHITECT' | 'DEVOPS';
      skills?: string[];
    }>;
  };
  technicalStack?: {
    frontend?: {
      framework?: 'REACT' | 'VUE' | 'ANGULAR' | 'SVELTE' | 'SOLID' | 'OTHER';
      uiLibrary?: string;
      language?: 'JAVASCRIPT' | 'TYPESCRIPT' | 'OTHER';
      buildTool?: 'VITE' | 'WEBPACK' | 'ROLLUP' | 'ESBUILD' | 'OTHER';
    };
    backend?: {
      framework?: 'SPRING_BOOT' | 'EXPRESS' | 'FASTAPI' | 'ASP_NET' | 'LARAVEL' | 'OTHER';
      language?: 'JAVA' | 'JAVASCRIPT' | 'PYTHON' | 'C_SHARP' | 'PHP' | 'GO' | 'RUST' | 'OTHER';
      database?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS' | 'OTHER';
      orm?: string;
    };
    infrastructure?: {
      deployment?: 'DOCKER' | 'KUBERNETES' | 'CLOUD' | 'TRADITIONAL' | 'OTHER';
      cloud?: 'AWS' | 'AZURE' | 'GCP' | 'ALIYUN' | 'TENCENT' | 'OTHER';
      monitoring?: string[];
    };
  };
  businessContext?: {
    industry?: 'E_COMMERCE' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MANUFACTURING' | 'LOGISTICS' | 'ENTERTAINMENT' | 'GOVERNMENT' | 'OTHER';
    businessType?: 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'INTERNAL' | 'OTHER';
    targetUsers?: string[];
    businessGoals?: Array<{
      goal?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      metrics?: string[];
    }>;
  };
  configuration?: {
    dddSettings?: {
      enableValidation?: boolean;
      strictMode?: boolean;
      autoDiscovery?: boolean;
      namingConvention?: 'CAMEL_CASE' | 'SNAKE_CASE' | 'PASCAL_CASE' | 'KEBAB_CASE';
    };
    codeGeneration?: {
      enableAutoGeneration?: boolean;
      targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';
      framework?: string;
      outputPath?: string;
      templateEngine?: 'VELOCITY' | 'FREEMARKER' | 'THYMELEAF' | 'HANDLEBARS';
    };
    uiSettings?: {
      theme?: 'LIGHT' | 'DARK' | 'AUTO';
      language?: 'ZH_CN' | 'EN_US' | 'JA_JP';
      layout?: 'SIDEBAR' | 'TOP_NAV' | 'COMPACT';
    };
  };
}
Response: ApiResponse<ProjectMetadata>
```

#### 1.5 删除项目
```typescript
DELETE /api/ddd/projects/{projectId}
Response: ApiResponse<void>
```

#### 1.6 获取项目统计信息
```typescript
GET /api/ddd/projects/{projectId}/statistics
Response: ApiResponse<ProjectStatistics>
```

#### 1.7 更新项目统计信息
```typescript
PUT /api/ddd/projects/{projectId}/statistics
Body: {
  elementCounts?: {
    businessTerms?: number;
    boundedContexts?: number;
    aggregates?: number;
    entities?: number;
    valueObjects?: number;
    domainServices?: number;
    dataTransferObjects?: number;
    screenDefinitions?: number;
  };
  usageStatus?: {
    usedElements?: number;
    unusedElements?: number;
    orphanedReferences?: number;
  };
  completionRate?: {
    ubiquitousLanguage?: number;
    strategicDesign?: number;
    tacticalDesign?: number;
    dataTransferObjects?: number;
    implementationMapping?: number;
    screenDefinition?: number;
    overall?: number;
  };
}
Response: ApiResponse<ProjectStatistics>
```

### 2. 统一语言管理 API

#### 2.1 获取统一语言数据
```typescript
GET /api/ddd/ubiquitous-language/{domainId}
Response: ApiResponse<UbiquitousLanguage>
```

#### 2.2 创建/更新统一语言
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}
Body: {
  version: string;
  businessTerms: BusinessTerm[];
  businessAttributes?: BusinessAttribute[];
  businessRules?: BusinessRule[];
  termRelationships?: TermRelationship[];
}
Response: ApiResponse<UbiquitousLanguage>
```

#### 2.3 获取业务术语列表
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- category?: string
- isCore?: boolean
- usageStatus?: 'USED' | 'PARTIALLY_USED' | 'UNUSED'

Response: PaginatedResponse<BusinessTerm>
```

#### 2.4 创建业务术语
```typescript
POST /api/ddd/ubiquitous-language/{domainId}/terms
Body: {
  name: string;
  programmingName: string;
  description: string;
  category: 'DOMAIN_ENTITY' | 'BUSINESS_CONCEPT' | 'BUSINESS_PROCESS' | 'BUSINESS_RULE' | 'BUSINESS_EVENT' | 'BUSINESS_VALUE';
  englishName?: string;
  boundedContextId?: string;
  attributes?: string[];
  relatedTerms?: string[];
  examples?: string[];
  businessRules?: string[];
  synonyms?: string[];
  antonyms?: string[];
  usageNotes?: string;
  isCore?: boolean;
  priority?: number;
}
Response: ApiResponse<BusinessTerm>
```

#### 2.5 更新业务术语
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}/terms/{termId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  category?: string;
  englishName?: string;
  boundedContextId?: string;
  attributes?: string[];
  relatedTerms?: string[];
  examples?: string[];
  businessRules?: string[];
  synonyms?: string[];
  antonyms?: string[];
  usageNotes?: string;
  isCore?: boolean;
  priority?: number;
}
Response: ApiResponse<BusinessTerm>
```

#### 2.6 删除业务术语
```typescript
DELETE /api/ddd/ubiquitous-language/{domainId}/terms/{termId}
Response: ApiResponse<void>
```

#### 2.7 获取业务属性列表
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/attributes
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- dataType?: string
- isRequired?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- termId?: string
- isCore?: boolean

Response: PaginatedResponse<BusinessAttribute>
```

#### 2.8 获取单个业务属性
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/attributes/{attributeId}
Response: ApiResponse<BusinessAttribute>
```

#### 2.9 创建业务属性
```typescript
POST /api/ddd/ubiquitous-language/{domainId}/attributes
Body: {
  name: string;  // 必填，属性名称
  programmingName: string;  // 必填，编程名称
  description: string;  // 必填，属性描述
  dataType: 'String' | 'Integer' | 'Long' | 'Double' | 'Boolean' | 'BigDecimal' | 'LocalDate' | 'LocalDateTime' | 'LocalTime' | 'Enum' | 'Custom';  // 必填，数据类型
  customType?: string;  // 自定义类型名称
  unit?: string;  // 单位
  format?: string;  // 格式
  constraints?: Constraints;  // 约束条件
  defaultValue?: any;  // 默认值
  isRequired?: boolean;  // 是否必填
  isUnique?: boolean;  // 是否唯一
  isReadOnly?: boolean;  // 是否只读
  validationRules?: string[];  // 验证规则列表
  businessLogic?: string;  // 业务逻辑描述
  examples?: string[];  // 示例值列表
}
Response: ApiResponse<BusinessAttribute>
```

#### 2.10 更新业务属性
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}/attributes/{attributeId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  dataType?: string;
  customType?: string;
  unit?: string;
  format?: string;
  constraints?: Constraints;
  defaultValue?: any;
  isRequired?: boolean;
  isUnique?: boolean;
  isReadOnly?: boolean;
  validationRules?: string[];
  businessLogic?: string;
  examples?: string[];
  termId?: string;
  isCore?: boolean;
}
Response: ApiResponse<BusinessAttribute>
```

#### 2.11 删除业务属性
```typescript
DELETE /api/ddd/ubiquitous-language/{domainId}/attributes/{attributeId}
Response: ApiResponse<void>
```

#### 2.12 获取业务规则列表
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/rules
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'INVARIANT' | 'BUSINESS_RULE' | 'VALIDATION_RULE'
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'

Response: PaginatedResponse<BusinessRule>
```

#### 2.13 获取单个业务规则
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/rules/{ruleId}
Response: ApiResponse<BusinessRule>
```

#### 2.14 创建业务规则
```typescript
POST /api/ddd/ubiquitous-language/{domainId}/rules
Body: {
  name: string;
  description: string;
  type: 'INVARIANT' | 'BUSINESS_RULE' | 'VALIDATION_RULE';
  expression: string;
  errorMessage?: string;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  isActive?: boolean;
  termId?: string;
  attributeId?: string;
}
Response: ApiResponse<BusinessRule>
```

#### 2.15 更新业务规则
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}/rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  type?: string;
  expression?: string;
  errorMessage?: string;
  severity?: string;
  isActive?: boolean;
  termId?: string;
  attributeId?: string;
}
Response: ApiResponse<BusinessRule>
```

#### 2.16 删除业务规则
```typescript
DELETE /api/ddd/ubiquitous-language/{domainId}/rules/{ruleId}
Response: ApiResponse<void>
```

#### 2.17 获取术语关系列表
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/relationships
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- sourceTermId?: string
- targetTermId?: string
- type?: 'ASSOCIATION' | 'INHERITANCE' | 'COMPOSITION' | 'AGGREGATION'
- isActive?: boolean

Response: PaginatedResponse<TermRelationship>
```

#### 2.18 创建术语关系
```typescript
POST /api/ddd/ubiquitous-language/{domainId}/relationships
Body: {
  sourceTermId: string;
  targetTermId: string;
  type: 'ASSOCIATION' | 'INHERITANCE' | 'COMPOSITION' | 'AGGREGATION';
  description?: string;
  cardinality?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  isActive?: boolean;
}
Response: ApiResponse<TermRelationship>
```

#### 2.19 更新术语关系
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}/relationships/{relationshipId}
Body: {
  sourceTermId?: string;
  targetTermId?: string;
  type?: string;
  description?: string;
  cardinality?: string;
  isActive?: boolean;
}
Response: ApiResponse<TermRelationship>
```

#### 2.20 删除术语关系
```typescript
DELETE /api/ddd/ubiquitous-language/{domainId}/relationships/{relationshipId}
Response: ApiResponse<void>
```

#### 2.21 术语关联服务 - 获取术语的领域关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/domain-associations
Response: ApiResponse<DomainAssociation[]>
```

#### 2.22 术语关联服务 - 获取术语的限界上下文关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/bounded-context-associations
Response: ApiResponse<BoundedContextAssociation[]>
```

#### 2.23 术语关联服务 - 获取术语的聚合关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/aggregate-associations
Response: ApiResponse<AggregateAssociation[]>
```

#### 2.24 术语关联服务 - 获取术语的实体关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/entity-associations
Response: ApiResponse<EntityAssociation[]>
```

#### 2.25 术语关联服务 - 获取术语的DTO关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 2.26 术语关联服务 - 获取术语的屏幕关联
```typescript
GET /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 2.27 术语关联服务 - 批量更新术语关联
```typescript
PUT /api/ddd/ubiquitous-language/{domainId}/terms/{termId}/associations
Body: {
  domainAssociations?: DomainAssociation[];
  boundedContextAssociations?: BoundedContextAssociation[];
  aggregateAssociations?: AggregateAssociation[];
  entityAssociations?: EntityAssociation[];
  dtoAssociations?: DtoAssociation[];
  screenAssociations?: ScreenAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 3. 领域管理 API

#### 3.1 获取领域信息
```typescript
GET /api/ddd/domain
Response: ApiResponse<Domain>
```

#### 3.2 创建/更新领域信息
```typescript
PUT /api/ddd/domain
Body: {
  id: string;  // 必填，领域唯一标识符
  name: string;  // 必填，领域名称
  description?: string;  // 领域描述
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';  // 必填，领域类型
  boundedContexts?: string[];  // 限界上下文ID列表
  stakeholders?: Stakeholder[];  // 利益相关者列表
  businessGoals?: BusinessGoal[];  // 业务目标列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Domain>
```

#### 3.3 获取利益相关者列表
```typescript
GET /api/ddd/domain/stakeholders
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Stakeholder>
```

#### 3.4 获取单个利益相关者
```typescript
GET /api/ddd/domain/stakeholders/{stakeholderId}
Response: ApiResponse<Stakeholder>
```

#### 3.5 创建利益相关者
```typescript
POST /api/ddd/domain/stakeholders
Body: {
  id: string;  // 必填，利益相关者唯一标识符
  name: string;  // 必填，姓名
  description?: string;  // 描述
  type: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER';  // 必填，类型
  contact?: {
    email?: string;  // 邮箱地址
    phone?: string;  // 电话号码
  };
  responsibilities?: string[];  // 职责列表
  influence?: 'HIGH' | 'MEDIUM' | 'LOW';  // 影响力级别
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Stakeholder>
```

#### 3.6 更新利益相关者
```typescript
PUT /api/ddd/domain/stakeholders/{stakeholderId}
Body: {
  name?: string;
  description?: string;
  type?: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER';
  contact?: {
    email?: string;
    phone?: string;
  };
  responsibilities?: string[];
  influence?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 3.7 删除利益相关者
```typescript
DELETE /api/ddd/domain/stakeholders/{stakeholderId}
Response: ApiResponse<void>
```

#### 3.8 获取业务目标列表
```typescript
GET /api/ddd/domain/business-goals
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- priority?: 'HIGH' | 'MEDIUM' | 'LOW'
- isActive?: boolean
- sortBy?: 'name' | 'priority' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BusinessGoal>
```

#### 3.9 获取单个业务目标
```typescript
GET /api/ddd/domain/business-goals/{goalId}
Response: ApiResponse<BusinessGoal>
```

#### 3.10 创建业务目标
```typescript
POST /api/ddd/domain/business-goals
Body: {
  id: string;  // 必填，业务目标唯一标识符
  name: string;  // 必填，目标名称
  description?: string;  // 目标描述
  priority: 'HIGH' | 'MEDIUM' | 'LOW';  // 必填，优先级
  metrics?: Metric[];  // 度量指标列表
  targetValue?: number;  // 目标值
  currentValue?: number;  // 当前值
  unit?: string;  // 单位
  deadline?: string;  // 截止日期，格式：YYYY-MM-DD
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<BusinessGoal>
```

#### 3.11 更新业务目标
```typescript
PUT /api/ddd/domain/business-goals/{goalId}
Body: {
  name?: string;
  description?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  metrics?: Metric[];
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  isActive?: boolean;
}
Response: ApiResponse<BusinessGoal>
```

#### 3.12 删除业务目标
```typescript
DELETE /api/ddd/domain/business-goals/{goalId}
Response: ApiResponse<void>
```

#### 3.13 获取度量指标列表
```typescript
GET /api/ddd/domain/business-goals/{goalId}/metrics
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'KPI' | 'KVI' | 'CUSTOM'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Metric>
```

#### 3.14 创建度量指标
```typescript
POST /api/ddd/domain/business-goals/{goalId}/metrics
Body: {
  id: string;  // 必填，度量指标唯一标识符
  name: string;  // 必填，指标名称
  description?: string;  // 指标描述
  type: 'KPI' | 'KVI' | 'CUSTOM';  // 必填，指标类型
  unit?: string;  // 单位
  target?: number;  // 目标值
  current?: number;  // 当前值
  min?: number;  // 最小值
  max?: number;  // 最大值
  formula?: string;  // 计算公式
  dataSource?: string;  // 数据来源
  frequency?: 'REAL_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';  // 更新频率
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Metric>
```

#### 3.15 更新度量指标
```typescript
PUT /api/ddd/domain/business-goals/{goalId}/metrics/{metricId}
Body: {
  name?: string;
  description?: string;
  type?: 'KPI' | 'KVI' | 'CUSTOM';
  unit?: string;
  target?: number;
  current?: number;
  min?: number;
  max?: number;
  formula?: string;
  dataSource?: string;
  frequency?: 'REAL_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  isActive?: boolean;
}
Response: ApiResponse<Metric>
```

#### 3.16 删除度量指标
```typescript
DELETE /api/ddd/domain/business-goals/{goalId}/metrics/{metricId}
Response: ApiResponse<void>
```

#### 3.17 领域关联服务 - 获取领域的限界上下文关联
```typescript
GET /api/ddd/domain/bounded-context-associations
Response: ApiResponse<BoundedContextAssociation[]>
```

#### 3.18 领域关联服务 - 获取领域的术语关联
```typescript
GET /api/ddd/domain/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 3.19 领域关联服务 - 获取领域的聚合关联
```typescript
GET /api/ddd/domain/aggregate-associations
Response: ApiResponse<AggregateAssociation[]>
```

#### 3.20 领域关联服务 - 批量更新领域关联
```typescript
PUT /api/ddd/domain/associations
Body: {
  boundedContextAssociations?: BoundedContextAssociation[];
  termAssociations?: TermAssociation[];
  aggregateAssociations?: AggregateAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 3.21 领域分析服务 - 获取领域健康度报告
```typescript
GET /api/ddd/domain/health-report
Response: ApiResponse<DomainHealthReport>
```

#### 3.22 领域分析服务 - 获取领域完成度分析
```typescript
GET /api/ddd/domain/completion-analysis
Response: ApiResponse<DomainCompletionAnalysis>
```

#### 3.23 领域分析服务 - 获取领域依赖关系图
```typescript
GET /api/ddd/domain/dependency-graph
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean

Response: ApiResponse<DomainDependencyGraph>
```

#### 3.3 获取利益相关者列表
```typescript
GET /api/ddd/domain/stakeholders
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER'
- isActive?: boolean

Response: PaginatedResponse<Stakeholder>
```

#### 3.4 获取单个利益相关者
```typescript
GET /api/ddd/domain/stakeholders/{stakeholderId}
Response: ApiResponse<Stakeholder>
```

#### 3.5 创建利益相关者
```typescript
POST /api/ddd/domain/stakeholders
Body: {
  id: string;
  name: string;
  description?: string;
  type: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER';
  contact?: {
    email?: string;
    phone?: string;
  };
  isActive?: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 3.6 更新利益相关者
```typescript
PUT /api/ddd/domain/stakeholders/{stakeholderId}
Body: {
  name?: string;
  description?: string;
  type?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  isActive?: boolean;
}
Response: ApiResponse<Stakeholder>
```

#### 3.7 删除利益相关者
```typescript
DELETE /api/ddd/domain/stakeholders/{stakeholderId}
Response: ApiResponse<void>
```

#### 3.8 获取业务目标列表
```typescript
GET /api/ddd/domain/business-goals
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- priority?: 'HIGH' | 'MEDIUM' | 'LOW'
- isActive?: boolean

Response: PaginatedResponse<BusinessGoal>
```

#### 3.9 获取单个业务目标
```typescript
GET /api/ddd/domain/business-goals/{goalId}
Response: ApiResponse<BusinessGoal>
```

#### 3.10 创建业务目标
```typescript
POST /api/ddd/domain/business-goals
Body: {
  id: string;
  name: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  metrics?: Metric[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessGoal>
```

#### 3.11 更新业务目标
```typescript
PUT /api/ddd/domain/business-goals/{goalId}
Body: {
  name?: string;
  description?: string;
  priority?: string;
  metrics?: Metric[];
  isActive?: boolean;
}
Response: ApiResponse<BusinessGoal>
```

#### 3.12 删除业务目标
```typescript
DELETE /api/ddd/domain/business-goals/{goalId}
Response: ApiResponse<void>
```

#### 3.13 获取度量指标列表
```typescript
GET /api/ddd/domain/business-goals/{goalId}/metrics
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'KPI' | 'KVI' | 'CUSTOM'
- isActive?: boolean

Response: PaginatedResponse<Metric>
```

#### 3.14 创建度量指标
```typescript
POST /api/ddd/domain/business-goals/{goalId}/metrics
Body: {
  id: string;
  name: string;
  description?: string;
  type: 'KPI' | 'KVI' | 'CUSTOM';
  unit?: string;
  target?: number;
  isActive?: boolean;
}
Response: ApiResponse<Metric>
```

#### 3.15 更新度量指标
```typescript
PUT /api/ddd/domain/business-goals/{goalId}/metrics/{metricId}
Body: {
  name?: string;
  description?: string;
  type?: string;
  unit?: string;
  target?: number;
  isActive?: boolean;
}
Response: ApiResponse<Metric>
```

#### 3.16 删除度量指标
```typescript
DELETE /api/ddd/domain/business-goals/{goalId}/metrics/{metricId}
Response: ApiResponse<void>
```

### 4. 战略设计管理 API

#### 4.1 获取战略设计数据
```typescript
GET /api/ddd/strategic-design/{domainId}
Response: ApiResponse<StrategicDesign>
```

#### 4.2 创建/更新战略设计
```typescript
PUT /api/ddd/strategic-design/{domainId}
Body: {
  version: string;  // 必填，版本号
  domainId?: string;  // 领域ID
  boundedContexts: BoundedContext[];  // 必填，限界上下文列表
  contextMappings?: ContextMapping[];  // 上下文映射列表
  subdomains?: Subdomain[];  // 子领域列表
  domainEvents?: DomainEvent[];  // 领域事件列表
}
Response: ApiResponse<StrategicDesign>
```

#### 4.3 获取限界上下文列表
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'type' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<BoundedContext>
```

#### 4.4 获取单个限界上下文
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Response: ApiResponse<BoundedContext>
```

#### 4.5 创建限界上下文
```typescript
POST /api/ddd/strategic-design/{domainId}/bounded-contexts
Body: {
  name: string;  // 必填，上下文名称
  description: string;  // 必填，上下文描述
  subdomainId?: string;  // 子领域ID
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';  // 必填，上下文类型
  ubiquitousLanguage?: string[];  // 统一语言术语ID列表
  businessCapabilities?: BusinessCapability[];  // 业务能力列表
  team?: Team;  // 团队信息
  technologyStack?: TechnologyStack;  // 技术栈信息
  deployment?: Deployment;  // 部署信息
  metrics?: Metric[];  // 度量指标列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<BoundedContext>
```

#### 4.6 更新限界上下文
```typescript
PUT /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Body: {
  name?: string;
  description?: string;
  subdomainId?: string;
  type?: 'CORE' | 'SUPPORTING' | 'GENERIC';
  ubiquitousLanguage?: string[];
  businessCapabilities?: BusinessCapability[];
  team?: Team;
  technologyStack?: TechnologyStack;
  deployment?: Deployment;
  metrics?: Metric[];
  isActive?: boolean;
}
Response: ApiResponse<BoundedContext>
```

#### 4.7 删除限界上下文
```typescript
DELETE /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Response: ApiResponse<void>
```

#### 4.8 获取子领域列表
```typescript
GET /api/ddd/strategic-design/{domainId}/subdomains
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Subdomain>
```

#### 4.9 获取单个子领域
```typescript
GET /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<Subdomain>
```

#### 4.10 创建子领域
```typescript
POST /api/ddd/strategic-design/{domainId}/subdomains
Body: {
  name: string;  // 必填，子领域名称
  description: string;  // 必填，子领域描述
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';  // 必填，子领域类型
  priority?: number;  // 优先级 (1-5)
  businessObjectives?: string[];  // 业务目标列表
  keyStakeholders?: string[];  // 关键干系人列表
}
Response: ApiResponse<Subdomain>
```

#### 4.11 更新子领域
```typescript
PUT /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Body: {
  name?: string;
  description?: string;
  type?: 'CORE' | 'SUPPORTING' | 'GENERIC';
  priority?: number;  // 优先级 (1-5)
  businessObjectives?: string[];
  keyStakeholders?: string[];
}
Response: ApiResponse<Subdomain>
```

#### 4.12 删除子领域
```typescript
DELETE /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<void>
```

#### 4.13 获取上下文映射列表
```typescript
GET /api/ddd/strategic-design/{domainId}/context-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- sourceContextId?: string
- targetContextId?: string
- type?: 'SHARED_KERNEL' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTICORRUPTION_LAYER' | 'OPEN_HOST_SERVICE' | 'PUBLISHED_LANGUAGE'
- isActive?: boolean
- sortBy?: 'type' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ContextMapping>
```

#### 4.14 创建上下文映射
```typescript
POST /api/ddd/strategic-design/{domainId}/context-mappings
Body: {
  sourceContextId: string;  // 必填，源上下文ID
  targetContextId: string;  // 必填，目标上下文ID
  type: 'SHARED_KERNEL' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTICORRUPTION_LAYER' | 'OPEN_HOST_SERVICE' | 'PUBLISHED_LANGUAGE';  // 必填，映射类型
  description?: string;  // 映射描述
  contract?: Contract;  // 契约信息
  integrationPoints?: IntegrationPoint[];  // 集成点列表
  dataFlow?: DataFlow[];  // 数据流列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<ContextMapping>
```

#### 4.15 更新上下文映射
```typescript
PUT /api/ddd/strategic-design/{domainId}/context-mappings/{mappingId}
Body: {
  sourceContextId?: string;
  targetContextId?: string;
  type?: 'SHARED_KERNEL' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTICORRUPTION_LAYER' | 'OPEN_HOST_SERVICE' | 'PUBLISHED_LANGUAGE';
  description?: string;
  contract?: Contract;
  integrationPoints?: IntegrationPoint[];
  dataFlow?: DataFlow[];
  isActive?: boolean;
}
Response: ApiResponse<ContextMapping>
```

#### 4.16 删除上下文映射
```typescript
DELETE /api/ddd/strategic-design/{domainId}/context-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 4.17 获取领域事件列表
```typescript
GET /api/ddd/strategic-design/{domainId}/domain-events
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'BUSINESS_EVENT' | 'DOMAIN_EVENT' | 'INTEGRATION_EVENT'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DomainEvent>
```

#### 4.18 创建领域事件
```typescript
POST /api/ddd/strategic-design/{domainId}/domain-events
Body: {
  name: string;  // 必填，事件名称
  description: string;  // 必填，事件描述
  eventType: 'DOMAIN_EVENT' | 'INTEGRATION_EVENT' | 'SYSTEM_EVENT';  // 必填，事件类型
  sourceContextId: string;  // 必填，源上下文ID
  targetContextIds?: string[];  // 目标上下文ID列表
  payload?: Record<string, any>;  // 事件载荷
  version?: string;  // 事件版本
  isPublished?: boolean;  // 是否已发布
}
Response: ApiResponse<DomainEvent>
```

#### 4.19 更新领域事件
```typescript
PUT /api/ddd/strategic-design/{domainId}/domain-events/{eventId}
Body: {
  name?: string;
  description?: string;
  eventType?: 'DOMAIN_EVENT' | 'INTEGRATION_EVENT' | 'SYSTEM_EVENT';
  sourceContextId?: string;
  targetContextIds?: string[];
  payload?: Record<string, any>;
  version?: string;
  isPublished?: boolean;
}
Response: ApiResponse<DomainEvent>
```

#### 4.20 删除领域事件
```typescript
DELETE /api/ddd/strategic-design/{domainId}/domain-events/{eventId}
Response: ApiResponse<void>
```

#### 4.21 限界上下文关联服务 - 获取上下文的术语关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 4.22 限界上下文关联服务 - 获取上下文的聚合关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/aggregate-associations
Response: ApiResponse<AggregateAssociation[]>
```

#### 4.23 限界上下文关联服务 - 获取上下文的DTO关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 4.24 限界上下文关联服务 - 获取上下文的屏幕关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 4.25 限界上下文关联服务 - 批量更新上下文关联
```typescript
PUT /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/associations
Body: {
  termAssociations?: TermAssociation[];
  aggregateAssociations?: AggregateAssociation[];
  dtoAssociations?: DtoAssociation[];
  screenAssociations?: ScreenAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 4.26 战略设计分析服务 - 获取上下文映射图
```typescript
GET /api/ddd/strategic-design/{domainId}/context-map
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- highlightType?: 'CORE' | 'SUPPORTING' | 'GENERIC'

Response: ApiResponse<ContextMap>
```

#### 4.27 战略设计分析服务 - 获取领域事件流图
```typescript
GET /api/ddd/strategic-design/{domainId}/event-flow
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- eventType?: 'BUSINESS_EVENT' | 'DOMAIN_EVENT' | 'INTEGRATION_EVENT'

Response: ApiResponse<EventFlow>
```

#### 4.28 战略设计分析服务 - 获取业务能力矩阵
```typescript
GET /api/ddd/strategic-design/{domainId}/capability-matrix
Response: ApiResponse<CapabilityMatrix>
```

#### 4.29 战略设计分析服务 - 获取上下文依赖分析
```typescript
GET /api/ddd/strategic-design/{domainId}/dependency-analysis
Response: ApiResponse<ContextDependencyAnalysis>
```

#### 4.4 获取单个限界上下文
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Response: ApiResponse<BoundedContext>
```

#### 4.5 创建限界上下文
```typescript
POST /api/ddd/strategic-design/{domainId}/bounded-contexts
Body: {
  name: string;
  description: string;
  subdomainId?: string;
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';
  ubiquitousLanguage?: string[];
  businessCapabilities?: BusinessCapability[];
  team?: Team;
  technologyStack?: TechnologyStack;
  deployment?: Deployment;
  metrics?: Metric[];
  isActive?: boolean;
}
Response: ApiResponse<BoundedContext>
```

#### 4.6 更新限界上下文
```typescript
PUT /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Body: {
  name?: string;
  description?: string;
  subdomainId?: string;
  type?: 'CORE' | 'SUPPORTING' | 'GENERIC';
  ubiquitousLanguage?: string[];
  businessCapabilities?: BusinessCapability[];
  team?: Team;
  technologyStack?: TechnologyStack;
  deployment?: Deployment;
  metrics?: Metric[];
  isActive?: boolean;
}
Response: ApiResponse<BoundedContext>
```

#### 4.7 删除限界上下文
```typescript
DELETE /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}
Response: ApiResponse<void>
```

#### 4.8 获取子领域列表
```typescript
GET /api/ddd/strategic-design/{domainId}/subdomains
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'
- isActive?: boolean

Response: PaginatedResponse<Subdomain>
```

#### 4.9 获取单个子领域
```typescript
GET /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<Subdomain>
```

#### 4.10 创建子领域
```typescript
POST /api/ddd/strategic-design/{domainId}/subdomains
Body: {
  name: string;
  description: string;
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';
  boundedContextIds?: string[];
  isActive?: boolean;
}
Response: ApiResponse<Subdomain>
```

#### 4.11 更新子领域
```typescript
PUT /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Body: {
  name?: string;
  description?: string;
  type?: string;
  boundedContextIds?: string[];
  isActive?: boolean;
}
Response: ApiResponse<Subdomain>
```

#### 4.12 删除子领域
```typescript
DELETE /api/ddd/strategic-design/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<void>
```

#### 4.13 获取上下文映射列表
```typescript
GET /api/ddd/strategic-design/{domainId}/context-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- sourceContextId?: string
- targetContextId?: string
- type?: 'SHARED_KERNEL' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTICORRUPTION_LAYER' | 'OPEN_HOST_SERVICE' | 'PUBLISHED_LANGUAGE'
- isActive?: boolean

Response: PaginatedResponse<ContextMapping>
```

#### 4.14 创建上下文映射
```typescript
POST /api/ddd/strategic-design/{domainId}/context-mappings
Body: {
  sourceContextId: string;
  targetContextId: string;
  type: 'SHARED_KERNEL' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTICORRUPTION_LAYER' | 'OPEN_HOST_SERVICE' | 'PUBLISHED_LANGUAGE';
  description?: string;
  contract?: Contract;
  isActive?: boolean;
}
Response: ApiResponse<ContextMapping>
```

#### 4.15 更新上下文映射
```typescript
PUT /api/ddd/strategic-design/{domainId}/context-mappings/{mappingId}
Body: {
  sourceContextId?: string;
  targetContextId?: string;
  type?: string;
  description?: string;
  contract?: Contract;
  isActive?: boolean;
}
Response: ApiResponse<ContextMapping>
```

#### 4.16 删除上下文映射
```typescript
DELETE /api/ddd/strategic-design/{domainId}/context-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 4.17 获取领域事件列表
```typescript
GET /api/ddd/strategic-design/{domainId}/domain-events
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'BUSINESS_EVENT' | 'DOMAIN_EVENT' | 'INTEGRATION_EVENT'
- isActive?: boolean

Response: PaginatedResponse<DomainEvent>
```

#### 4.18 创建领域事件
```typescript
POST /api/ddd/strategic-design/{domainId}/domain-events
Body: {
  name: string;
  description: string;
  type: 'BUSINESS_EVENT' | 'DOMAIN_EVENT' | 'INTEGRATION_EVENT';
  sourceContextId?: string;
  targetContextIds?: string[];
  eventData?: any;
  isActive?: boolean;
}
Response: ApiResponse<DomainEvent>
```

#### 4.19 更新领域事件
```typescript
PUT /api/ddd/strategic-design/{domainId}/domain-events/{eventId}
Body: {
  name?: string;
  description?: string;
  type?: string;
  sourceContextId?: string;
  targetContextIds?: string[];
  eventData?: any;
  isActive?: boolean;
}
Response: ApiResponse<DomainEvent>
```

#### 4.20 删除领域事件
```typescript
DELETE /api/ddd/strategic-design/{domainId}/domain-events/{eventId}
Response: ApiResponse<void>
```

#### 4.21 限界上下文关联服务 - 获取上下文的术语关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 4.22 限界上下文关联服务 - 获取上下文的聚合关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/aggregate-associations
Response: ApiResponse<AggregateAssociation[]>
```

#### 4.23 限界上下文关联服务 - 获取上下文的DTO关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 4.24 限界上下文关联服务 - 获取上下文的屏幕关联
```typescript
GET /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 4.25 限界上下文关联服务 - 批量更新上下文关联
```typescript
PUT /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}/associations
Body: {
  termAssociations?: TermAssociation[];
  aggregateAssociations?: AggregateAssociation[];
  dtoAssociations?: DtoAssociation[];
  screenAssociations?: ScreenAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

### 5. DTO管理 API

#### 5.1 获取DTO管理数据
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}
Response: ApiResponse<DataTransferObjects>
```

#### 5.2 创建/更新DTO管理
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}
Body: {
  version: string;
  boundedContextId?: string;
  dataTransferObjects: DataTransferObject[];
  dtoMappings?: DtoMapping[];
}
Response: ApiResponse<DataTransferObjects>
```

#### 5.3 获取DTO列表
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dtos
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'COMMAND' | 'QUERY' | 'REQUEST' | 'RESPONSE' | 'EVENT' | 'VIEW' | 'PROJECTION' | 'VALUE_OBJECT'
- layer?: 'CLIENT' | 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE'
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'

Response: PaginatedResponse<DataTransferObject>
```

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
  programmingName?: string;
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
  unit?: string;                 // 单位
  format?: string;               // 格式
  constraints?: Constraints;     // 约束条件
  isUnique?: boolean;           // 是否唯一
  isReadOnly?: boolean;         // 是否只读
  businessLogic?: string;       // 业务逻辑描述
  examples?: string[];          // 示例值列表
  isCollection?: boolean;        // 是否为集合类型
  collectionType?: 'LIST' | 'SET' | 'MAP' | 'ARRAY';  // 集合类型
  mapKeyType?: string;           // Map键类型
  mapValueType?: string;         // Map值类型
  nestedType?: string;           // 嵌套类型名称
  nestedDtoId?: string;          // 嵌套DTO ID
  nestedEntityId?: string;       // 嵌套实体ID
  nestedValueObjectId?: string;  // 嵌套值对象ID
  nestedAggregateId?: string;    // 嵌套聚合ID
  genericTypes?: string[];       // 泛型类型参数列表
  isDeprecated?: boolean;        // 是否已废弃
  replacementAttributeId?: string; // 替代属性ID
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
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用其他DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
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
  mapKeyType?: string;
  mapValueType?: string;
  nestedType?: string;
  nestedDtoId?: string;
  nestedEntityId?: string;
  nestedValueObjectId?: string;
  nestedAggregateId?: string;
  genericTypes?: string[];
  isDeprecated?: boolean;
  replacementAttributeId?: string;
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
- mappingType?: 'ENTITY_TO_DTO' | 'DTO_TO_ENTITY' | 'DTO_TO_DTO' | 'VALUE_OBJECT_TO_DTO'
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

#### 5.23 DTO分析服务 - 获取DTO依赖关系图
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dto-dependency-graph
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- dtoType?: 'COMMAND' | 'QUERY' | 'REQUEST' | 'RESPONSE' | 'EVENT' | 'VIEW' | 'PROJECTION' | 'VALUE_OBJECT'

Response: ApiResponse<DtoDependencyGraph>
```

#### 5.24 DTO分析服务 - 获取DTO使用情况分析
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dto-usage-analysis
Response: ApiResponse<DtoUsageAnalysis>
```

#### 5.25 DTO分析服务 - 获取DTO一致性检查
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/dto-consistency-check
Response: ApiResponse<DtoConsistencyCheck>
```

#### 5.26 DTO代码生成服务 - 生成DTO代码
```typescript
POST /api/ddd/data-transfer-objects/{boundedContextId}/code-generation
Body: {
  dtoIds?: string[];  // 指定DTO ID列表，为空则生成所有
  targetLanguage: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';  // 目标语言
  framework?: string;  // 目标框架
  includeValidation?: boolean;  // 是否包含验证注解
  includeDocumentation?: boolean;  // 是否包含文档注释
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<CodeGenerationResult>
```

#### 5.27 DTO代码生成服务 - 获取代码生成模板
```typescript
GET /api/ddd/data-transfer-objects/{boundedContextId}/code-templates
Query Parameters:
- targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP'
- framework?: string

Response: ApiResponse<CodeTemplate[]>
```

#### 5.28 DTO代码生成服务 - 更新代码生成模板
```typescript
PUT /api/ddd/data-transfer-objects/{boundedContextId}/code-templates/{templateId}
Body: {
  name?: string;
  description?: string;
  content?: string;
  targetLanguage?: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';
  framework?: string;
  isActive?: boolean;
}
Response: ApiResponse<CodeTemplate>
```


### 6. 战术设计管理 API

#### 6.1 获取战术设计数据
```typescript
GET /api/ddd/tactical-design/{boundedContextId}
Response: ApiResponse<TacticalDesign>
```

#### 6.2 创建/更新战术设计
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}
Body: {
  version: string;  // 必填，版本号
  boundedContextId?: string;  // 限界上下文ID
  aggregates: Aggregate[];  // 必填，聚合列表
  entities: Entity[];  // 必填，实体列表
  valueObjects?: ValueObject[];  // 值对象列表
  domainServices?: DomainService[];  // 领域服务列表
  repositories?: Repository[];  // 仓储列表
  factories?: Factory[];  // 工厂列表
  domainEvents?: DomainEvent[];  // 领域事件列表
  enums?: EnumDefinition[];  // 枚举定义列表
}
Response: ApiResponse<TacticalDesign>
```

#### 6.3 获取聚合列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority' | 'complexity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Aggregate>
```

#### 6.4 获取单个聚合
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}
Response: ApiResponse<Aggregate>
```

#### 6.5 创建聚合
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/aggregates
Body: {
  name: string;  // 必填，聚合名称
  description: string;  // 必填，聚合描述
  termId: string;  // 必填，术语ID
  rootEntityId: string;  // 必填，根实体ID
  invariants?: Invariant[];  // 不变量列表
  entityIds?: string[];  // 实体ID列表
  valueObjectIds?: string[];  // 值对象ID列表
  businessRules?: string[];  // 业务规则列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';  // 复杂度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Aggregate>
```

#### 6.6 更新聚合
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}
Body: {
  name?: string;
  description?: string;
  termId?: string;
  rootEntityId?: string;
  invariants?: Invariant[];
  entityIds?: string[];
  valueObjectIds?: string[];
  businessRules?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Aggregate>
```

#### 6.7 删除聚合
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}
Response: ApiResponse<void>
```

#### 6.8 获取聚合命令列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/commands
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<AggregateCommand>
```

#### 6.9 获取单个聚合命令
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/commands/{commandId}
Response: ApiResponse<AggregateCommand>
```

#### 6.10 创建聚合命令
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/commands
Body: {
  name: string;  // 必填，命令名称
  description: string;  // 必填，命令描述
  dtoId: string;  // 必填，引用DTO
  businessLogic?: string;  // 业务逻辑
  preconditions?: string[];  // 前置条件列表
  postconditions?: string[];  // 后置条件列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  validationRules?: string[];  // 验证规则列表
  errorHandling?: string;  // 错误处理策略
}
Response: ApiResponse<AggregateCommand>
```

#### 6.11 更新聚合命令
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/commands/{commandId}
Body: {
  name?: string;
  description?: string;
  dtoId?: string;
  businessLogic?: string;
  preconditions?: string[];
  postconditions?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  validationRules?: string[];
  errorHandling?: string;
}
Response: ApiResponse<AggregateCommand>
```

#### 6.12 删除聚合命令
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/commands/{commandId}
Response: ApiResponse<void>
```

#### 6.13 获取聚合查询列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/queries
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<AggregateQuery>
```

#### 6.14 获取单个聚合查询
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/queries/{queryId}
Response: ApiResponse<AggregateQuery>
```

#### 6.15 创建聚合查询
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/queries
Body: {
  name: string;  // 必填，查询名称
  description: string;  // 必填，查询描述
  inputDtoId?: string;  // 输入DTO（可选）
  outputDtoId: string;  // 必填，输出DTO
  businessLogic?: string;  // 业务逻辑
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  cachingStrategy?: 'NONE' | 'MEMORY' | 'REDIS' | 'DATABASE';  // 缓存策略
  performanceOptimization?: string;  // 性能优化策略
}
Response: ApiResponse<AggregateQuery>
```

#### 6.16 更新聚合查询
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/queries/{queryId}
Body: {
  name?: string;
  description?: string;
  inputDtoId?: string;
  outputDtoId?: string;
  businessLogic?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  cachingStrategy?: 'NONE' | 'MEMORY' | 'REDIS' | 'DATABASE';
  performanceOptimization?: string;
}
Response: ApiResponse<AggregateQuery>
```

#### 6.17 删除聚合查询
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/queries/{queryId}
Response: ApiResponse<void>
```

#### 6.18 获取实体列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- aggregateId?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority' | 'complexity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Entity>
```

#### 6.19 获取单个实体
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}
Response: ApiResponse<Entity>
```

#### 6.20 创建实体
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/entities
Body: {
  name: string;  // 必填，实体名称
  description: string;  // 必填，实体描述
  termId: string;  // 必填，术语ID
  aggregateId: string;  // 必填，聚合ID
  attributes: EntityAttribute[];  // 必填，实体属性列表
  methods?: Method[];  // 方法列表
  lifecycle?: Lifecycle;  // 生命周期管理
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';  // 复杂度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Entity>
```

#### 6.21 更新实体
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}
Body: {
  name?: string;
  description?: string;
  termId?: string;
  aggregateId?: string;
  attributes?: EntityAttribute[];
  methods?: Method[];
  lifecycle?: Lifecycle;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Entity>
```

#### 6.22 删除实体
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}
Response: ApiResponse<void>
```

#### 6.23 获取实体方法列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- visibility?: 'PUBLIC' | 'PROTECTED' | 'PRIVATE'
- isActive?: boolean
- sortBy?: 'name' | 'visibility' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Method>
```

#### 6.24 获取单个实体方法
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}
Response: ApiResponse<Method>
```

#### 6.25 创建实体方法
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods
Body: {
  name: string;  // 必填，方法名称
  description: string;  // 必填，方法描述
  visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';  // 必填，可见性
  parameters: MethodParameter[];  // 必填，参数列表
  returnType: MethodReturnType;  // 必填，返回类型
  businessLogic?: string;  // 业务逻辑
  preconditions?: string[];  // 前置条件列表
  postconditions?: string[];  // 后置条件列表
  exceptions?: string[];  // 异常列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  performance?: string;  // 性能考虑
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';  // 线程安全性
}
Response: ApiResponse<Method>
```

#### 6.26 更新实体方法
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}
Body: {
  name?: string;
  description?: string;
  visibility?: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
  parameters?: MethodParameter[];
  returnType?: MethodReturnType;
  businessLogic?: string;
  preconditions?: string[];
  postconditions?: string[];
  exceptions?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  performance?: string;
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';
}
Response: ApiResponse<Method>
```

#### 6.27 删除实体方法
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}
Response: ApiResponse<void>
```

#### 6.28 获取实体方法参数列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/parameters
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- isRequired?: boolean
- sortBy?: 'name' | 'isRequired' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<MethodParameter>
```

#### 6.29 创建实体方法参数
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/parameters
Body: {
  name: string;  // 必填，参数名称
  description: string;  // 必填，参数描述
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isRequired?: boolean;           // 是否必填
  defaultValue?: any;            // 默认值
  validationRules?: string[];    // 验证规则列表
  // 以下字段从业务属性或DTO属性继承
  unit?: string;                 // 单位
  format?: string;               // 格式
  constraints?: Constraints;     // 约束条件
  isUnique?: boolean;           // 是否唯一
  isReadOnly?: boolean;         // 是否只读
  businessLogic?: string;       // 业务逻辑
  examples?: string[];          // 示例列表
  documentation?: string;       // 文档说明
}
Response: ApiResponse<MethodParameter>
```

#### 6.30 更新实体方法参数
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/parameters/{parameterId}
Body: {
  name?: string;
  description?: string;
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isRequired?: boolean;
  defaultValue?: any;
  validationRules?: string[];
  // 以下字段从业务属性或DTO属性继承
  unit?: string;
  format?: string;
  constraints?: Constraints;
  isUnique?: boolean;
  isReadOnly?: boolean;
  businessLogic?: string;
  examples?: string[];
  documentation?: string;
}
Response: ApiResponse<MethodParameter>
```

#### 6.31 删除实体方法参数
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/parameters/{parameterId}
Response: ApiResponse<void>
```

#### 6.32 获取实体方法返回值信息
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/return-value
Response: ApiResponse<MethodReturnValue>
```

#### 6.33 创建/更新实体方法返回值
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/methods/{methodId}/return-value
Body: {
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isCollection?: boolean;         // 是否为集合类型
  collectionType?: 'LIST' | 'SET' | 'MAP';  // 集合类型
  description?: string;          // 返回值描述
  examples?: string[];          // 示例列表
  documentation?: string;       // 文档说明
}
Response: ApiResponse<MethodReturnValue>
```

#### 6.34 获取值对象列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/value-objects
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ValueObject>
```

#### 6.35 获取单个值对象
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/value-objects/{valueObjectId}
Response: ApiResponse<ValueObject>
```

#### 6.36 创建值对象
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/value-objects
Body: {
  name: string;  // 必填，值对象名称
  description: string;  // 必填，值对象描述
  termId: string;  // 必填，术语ID
  attributes: ValueObjectAttribute[];  // 必填，属性列表
  isImmutable?: boolean;  // 是否不可变
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ValueObject>
```

#### 6.37 更新值对象
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/value-objects/{valueObjectId}
Body: {
  name?: string;
  description?: string;
  termId?: string;
  attributes?: ValueObjectAttribute[];
  isImmutable?: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ValueObject>
```

#### 6.38 删除值对象
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/value-objects/{valueObjectId}
Response: ApiResponse<void>
```

#### 6.39 获取领域服务列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority' | 'complexity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DomainService>
```

#### 6.40 获取单个领域服务
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}
Response: ApiResponse<DomainService>
```

#### 6.41 创建领域服务
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/domain-services
Body: {
  name: string;  // 必填，服务名称
  description: string;  // 必填，服务描述
  termId: string;  // 必填，术语ID
  methods: Method[];  // 必填，方法列表
  dependencies?: string[];  // 依赖列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';  // 复杂度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
  performance?: string;  // 性能考虑
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';  // 线程安全性
}
Response: ApiResponse<DomainService>
```

#### 6.42 更新领域服务
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}
Body: {
  name?: string;
  description?: string;
  termId?: string;
  methods?: Method[];
  dependencies?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
  performance?: string;
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';
}
Response: ApiResponse<DomainService>
```

#### 6.43 删除领域服务
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}
Response: ApiResponse<void>
```

#### 6.44 获取领域服务方法列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- visibility?: 'PUBLIC' | 'PROTECTED' | 'PRIVATE'
- isActive?: boolean
- sortBy?: 'name' | 'visibility' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Method>
```

#### 6.45 获取单个领域服务方法
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}
Response: ApiResponse<Method>
```

#### 6.46 创建领域服务方法
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods
Body: {
  name: string;  // 必填，方法名称
  description: string;  // 必填，方法描述
  visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';  // 必填，可见性
  parameters: MethodParameter[];  // 必填，参数列表
  returnType: MethodReturnType;  // 必填，返回类型
  businessLogic?: string;  // 业务逻辑
  preconditions?: string[];  // 前置条件列表
  postconditions?: string[];  // 后置条件列表
  exceptions?: string[];  // 异常列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  performance?: string;  // 性能考虑
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';  // 线程安全性
}
Response: ApiResponse<Method>
```

#### 6.47 更新领域服务方法
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}
Body: {
  name?: string;
  description?: string;
  visibility?: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
  parameters?: MethodParameter[];
  returnType?: MethodReturnType;
  businessLogic?: string;
  preconditions?: string[];
  postconditions?: string[];
  exceptions?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  performance?: string;
  threadSafety?: 'THREAD_SAFE' | 'NOT_THREAD_SAFE' | 'UNKNOWN';
}
Response: ApiResponse<Method>
```

#### 6.48 删除领域服务方法
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}
Response: ApiResponse<void>
```

#### 6.49 获取方法参数列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/parameters
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- isRequired?: boolean
- sortBy?: 'name' | 'isRequired' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<MethodParameter>
```

#### 6.50 创建方法参数
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/parameters
Body: {
  name: string;  // 必填，参数名称
  description: string;  // 必填，参数描述
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;       // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isRequired?: boolean;          // 是否必填
  defaultValue?: any;            // 默认值
  validationRules?: string[];    // 验证规则列表
  // 以下字段从业务属性或DTO属性继承
  unit?: string;                 // 单位
  format?: string;               // 格式
  constraints?: Constraints;     // 约束条件
  isUnique?: boolean;           // 是否唯一
  isReadOnly?: boolean;         // 是否只读
  businessLogic?: string;       // 业务逻辑
  examples?: string[];          // 示例列表
  documentation?: string;       // 文档说明
}
Response: ApiResponse<MethodParameter>
```

#### 6.51 更新方法参数
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/parameters/{parameterId}
Body: {
  name?: string;
  description?: string;
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isRequired?: boolean;
  defaultValue?: any;
  validationRules?: string[];
  // 以下字段从业务属性或DTO属性继承
  unit?: string;
  format?: string;
  constraints?: Constraints;
  isUnique?: boolean;
  isReadOnly?: boolean;
  businessLogic?: string;
  examples?: string[];
  documentation?: string;
}
Response: ApiResponse<MethodParameter>
```

#### 6.52 删除方法参数
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/parameters/{parameterId}
Response: ApiResponse<void>
```

#### 6.53 获取方法返回值信息
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/return-value
Response: ApiResponse<MethodReturnValue>
```

#### 6.54 创建/更新方法返回值
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/domain-services/{serviceId}/methods/{methodId}/return-value
Body: {
  businessAttributeId?: string;  // 引用业务属性（最高优先级）
  dtoAttributeId?: string;        // 引用DTO属性（次优先级）
  dataType?: string;              // 直接数据类型定义（最低优先级）
  isCollection?: boolean;         // 是否为集合类型
  collectionType?: 'LIST' | 'SET' | 'MAP';  // 集合类型
  description?: string;          // 返回值描述
  examples?: string[];          // 示例列表
  documentation?: string;       // 文档说明
}
Response: ApiResponse<MethodReturnValue>
```

#### 6.55 获取仓储列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/repositories
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Repository>
```

#### 6.56 获取单个仓储
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/repositories/{repositoryId}
Response: ApiResponse<Repository>
```

#### 6.57 创建仓储
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/repositories
Body: {
  name: string;  // 必填，仓储名称
  description: string;  // 必填，仓储描述
  aggregateId: string;  // 必填，聚合ID
  methods: Method[];  // 必填，方法列表
  dataSource?: string;  // 数据源
  cachingStrategy?: 'NONE' | 'MEMORY' | 'REDIS' | 'DATABASE';  // 缓存策略
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Repository>
```

#### 6.58 更新仓储
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/repositories/{repositoryId}
Body: {
  name?: string;
  description?: string;
  aggregateId?: string;
  methods?: Method[];
  dataSource?: string;
  cachingStrategy?: 'NONE' | 'MEMORY' | 'REDIS' | 'DATABASE';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Repository>
```

#### 6.59 删除仓储
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/repositories/{repositoryId}
Response: ApiResponse<void>
```

#### 6.60 获取工厂列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/factories
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Factory>
```

#### 6.61 获取单个工厂
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/factories/{factoryId}
Response: ApiResponse<Factory>
```

#### 6.62 创建工厂
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/factories
Body: {
  name: string;  // 必填，工厂名称
  description: string;  // 必填，工厂描述
  aggregateId: string;  // 必填，聚合ID
  methods: Method[];  // 必填，方法列表
  creationStrategy?: 'SIMPLE' | 'BUILDER' | 'FACTORY_METHOD' | 'ABSTRACT_FACTORY';  // 创建策略
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Factory>
```

#### 6.63 更新工厂
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/factories/{factoryId}
Body: {
  name?: string;
  description?: string;
  aggregateId?: string;
  methods?: Method[];
  creationStrategy?: 'SIMPLE' | 'BUILDER' | 'FACTORY_METHOD' | 'ABSTRACT_FACTORY';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Factory>
```

#### 6.64 删除工厂
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/factories/{factoryId}
Response: ApiResponse<void>
```

#### 6.65 获取枚举定义列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/enums
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- usageStatus?: 'USED' | 'UNUSED'
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<EnumDefinition>
```

#### 6.66 获取单个枚举定义
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/enums/{enumId}
Response: ApiResponse<EnumDefinition>
```

#### 6.67 创建枚举定义
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/enums
Body: {
  name: string;  // 必填，枚举名称
  description: string;  // 必填，枚举描述
  values: EnumValue[];  // 必填，枚举值列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<EnumDefinition>
```

#### 6.68 更新枚举定义
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/enums/{enumId}
Body: {
  name?: string;
  description?: string;
  values?: EnumValue[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<EnumDefinition>
```

#### 6.69 删除枚举定义
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/enums/{enumId}
Response: ApiResponse<void>
```

#### 6.70 聚合关联服务 - 获取聚合的术语关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 6.71 聚合关联服务 - 获取聚合的DTO关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 6.72 聚合关联服务 - 获取聚合的屏幕关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregates/{aggregateId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 6.73 实体关联服务 - 获取实体的术语关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 6.74 实体关联服务 - 获取实体的属性关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/attribute-associations
Response: ApiResponse<AttributeAssociation[]>
```

#### 6.75 实体关联服务 - 获取实体的DTO关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 6.76 实体关联服务 - 获取实体的屏幕关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/entities/{entityId}/screen-associations
Response: ApiResponse<ScreenAssociation[]>
```

#### 6.77 战术设计关联服务 - 批量更新关联
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/associations
Body: {
  aggregateAssociations?: AggregateAssociation[];
  entityAssociations?: EntityAssociation[];
  valueObjectAssociations?: ValueObjectAssociation[];
  serviceAssociations?: ServiceAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 6.78 战术设计分析服务 - 获取聚合关系图
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/aggregate-relationship-graph
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- highlightType?: 'CORE' | 'SUPPORTING' | 'GENERIC'

Response: ApiResponse<AggregateRelationshipGraph>
```

#### 6.79 战术设计分析服务 - 获取方法调用链分析
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/method-call-chain-analysis
Response: ApiResponse<MethodCallChainAnalysis>
```

#### 6.80 战术设计分析服务 - 获取业务规则分析
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/business-rule-analysis
Response: ApiResponse<BusinessRuleAnalysis>
```

#### 6.81 战术设计代码生成服务 - 生成聚合代码
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/code-generation
Body: {
  aggregateIds?: string[];  // 指定聚合ID列表，为空则生成所有
  entityIds?: string[];     // 指定实体ID列表
  serviceIds?: string[];     // 指定服务ID列表
  targetLanguage: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';  // 目标语言
  framework?: string;  // 目标框架
  includeValidation?: boolean;  // 是否包含验证注解
  includeDocumentation?: boolean;  // 是否包含文档注释
  includeTests?: boolean;  // 是否包含测试代码
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<CodeGenerationResult>
```

#### 6.80 获取防腐层列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- externalSystemType?: 'LEGACY' | 'THIRD_PARTY' | 'MICROSERVICE' | 'DATABASE' | 'API' | 'FILE_SYSTEM'
- isolationLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'COMPLETE'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'isolationLevel'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<AntiCorruptionLayer>
```

#### 6.81 获取单个防腐层
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}
Response: ApiResponse<AntiCorruptionLayer>
```

#### 6.82 创建防腐层
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers
Body: {
  name: string;  // 必填，防腐层名称（Anti-Corruption Layer）
  programmingName: string;  // 必填，编程名称
  description: string;  // 必填，防腐层描述
  externalSystemId: string;  // 必填，外部系统ID
  externalSystemName: string;  // 必填，外部系统名称
  externalSystemType: 'LEGACY' | 'THIRD_PARTY' | 'MICROSERVICE' | 'DATABASE' | 'API' | 'FILE_SYSTEM';  // 必填，外部系统类型
  translationLayer?: {
    inputTranslator?: string;  // 输入转换器类名
    outputTranslator?: string;  // 输出转换器类名
    dataMapper?: string;  // 数据映射器类名
  };
  adapters?: Adapter[];  // 适配器列表
  facades?: Facade[];  // 外观模式列表
  isolationLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'COMPLETE';  // 隔离级别
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<AntiCorruptionLayer>
```

#### 6.83 更新防腐层
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}
Body: {
  name?: string;
  programmingName?: string;
  description?: string;
  externalSystemId?: string;
  externalSystemName?: string;
  externalSystemType?: 'LEGACY' | 'THIRD_PARTY' | 'MICROSERVICE' | 'DATABASE' | 'API' | 'FILE_SYSTEM';
  translationLayer?: {
    inputTranslator?: string;
    outputTranslator?: string;
    dataMapper?: string;
  };
  adapters?: Adapter[];
  facades?: Facade[];
  isolationLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'COMPLETE';
  isActive?: boolean;
}
Response: ApiResponse<AntiCorruptionLayer>
```

#### 6.84 删除防腐层
```typescript
DELETE /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}
Response: ApiResponse<void>
```

#### 6.85 获取适配器列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}/adapters
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- adapterType?: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL'
- isActive?: boolean

Response: PaginatedResponse<Adapter>
```

#### 6.86 创建适配器
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}/adapters
Body: {
  name: string;  // 必填，适配器名称
  description: string;  // 必填，适配器描述
  adapterType: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL';  // 必填，适配器类型
  sourceFormat?: string;  // 源数据格式
  targetFormat?: string;  // 目标数据格式
  transformationRules?: string[];  // 转换规则列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Adapter>
```

#### 6.87 获取外观列表
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}/facades
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- facadeType?: 'SERVICE' | 'DATA' | 'UI' | 'INTEGRATION'
- isActive?: boolean

Response: PaginatedResponse<Facade>
```

#### 6.88 创建外观
```typescript
POST /api/ddd/tactical-design/{boundedContextId}/anti-corruption-layers/{aclId}/facades
Body: {
  name: string;  // 必填，外观名称
  description: string;  // 必填，外观描述
  facadeType: 'SERVICE' | 'DATA' | 'UI' | 'INTEGRATION';  // 必填，外观类型
  methods?: Method[];  // 方法列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Facade>
```

#### 6.89 仓储工厂关系管理 - 获取仓储的工厂关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/repositories/{repositoryId}/factory-association
Response: ApiResponse<FactoryAssociation>
```

#### 6.90 仓储工厂关系管理 - 更新仓储的工厂关联
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/repositories/{repositoryId}/factory-association
Body: {
  factoryId: string;  // 关联的工厂ID
  relationshipType: 'SIMPLE' | 'COMPLEX' | 'ABSTRACT' | 'SPECIALIZED';  // 关系类型
  creationStrategy: 'NEW' | 'BUILDER' | 'PROTOTYPE' | 'SINGLETON' | 'POOL';  // 创建策略
  description?: string;  // 关系描述
}
Response: ApiResponse<FactoryAssociation>
```

#### 6.91 仓储工厂关系管理 - 获取工厂的仓储关联
```typescript
GET /api/ddd/tactical-design/{boundedContextId}/factories/{factoryId}/repository-associations
Response: ApiResponse<RepositoryAssociation[]>
```

#### 6.92 仓储工厂关系管理 - 批量更新工厂的仓储关联
```typescript
PUT /api/ddd/tactical-design/{boundedContextId}/factories/{factoryId}/repository-associations
Body: {
  repositoryAssociations: RepositoryAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```


### 7. 实现映射管理 API

#### 7.1 获取实现映射数据
```typescript
GET /api/ddd/implementation-mapping/{domainId}
Response: ApiResponse<ImplementationMapping>
```

#### 7.2 创建/更新实现映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}
Body: {
  version: string;  // 必填，版本号
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  architectureMapping: ArchitectureMapping;  // 必填，架构映射
  dtoMappings?: DtoMapping[];  // DTO映射列表
  persistenceMappings?: PersistenceMapping[];  // 持久化映射列表
  integrationMappings?: IntegrationMapping[];  // 集成映射列表
  screenMappings?: ScreenMapping[];  // 屏幕映射列表
  apiMappings?: ApiMapping[];  // API映射列表
  eventMappings?: EventMapping[];  // 事件映射列表
  securityMappings?: SecurityMapping[];  // 安全映射列表
  monitoringMappings?: MonitoringMapping[];  // 监控映射列表
}
Response: ApiResponse<ImplementationMapping>
```

#### 7.3 获取架构映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/architecture
Response: ApiResponse<ArchitectureMapping>
```

#### 7.4 更新架构映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/architecture
Body: {
  layers: Layer[];  // 必填，分层架构定义
  patterns: Pattern[];  // 设计模式列表
  technologies: Technology[];  // 技术栈列表
  deployment: Deployment;  // 部署配置
  scaling: Scaling;  // 扩展策略
  performance: Performance;  // 性能配置
  security: Security;  // 安全配置
  monitoring: Monitoring;  // 监控配置
}
Response: ApiResponse<ArchitectureMapping>
```

#### 7.5 获取持久化映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/persistence-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- entityId?: string
- aggregateId?: string
- databaseType?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<PersistenceMapping>
```

#### 7.6 获取单个持久化映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/persistence-mappings/{mappingId}
Response: ApiResponse<PersistenceMapping>
```

#### 7.7 创建持久化映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/persistence-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  entityId: string;  // 必填，实体ID
  aggregateId: string;  // 必填，聚合ID
  tableName: string;  // 必填，表名
  schema?: string;  // 数据库模式
  columnMappings: ColumnMapping[];  // 必填，字段映射列表
  indexMappings?: IndexMapping[];  // 索引映射列表
  constraintMappings?: ConstraintMapping[];  // 约束映射列表
  databaseType: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS';  // 必填，数据库类型
  connectionPool?: ConnectionPool;  // 连接池配置
  caching?: Caching;  // 缓存配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<PersistenceMapping>
```

#### 7.8 更新持久化映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/persistence-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  entityId?: string;
  aggregateId?: string;
  tableName?: string;
  schema?: string;
  columnMappings?: ColumnMapping[];
  indexMappings?: IndexMapping[];
  constraintMappings?: ConstraintMapping[];
  databaseType?: 'MYSQL' | 'POSTGRESQL' | 'ORACLE' | 'SQLSERVER' | 'MONGODB' | 'REDIS';
  connectionPool?: ConnectionPool;
  caching?: Caching;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<PersistenceMapping>
```

#### 7.9 删除持久化映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/persistence-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.10 获取集成映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/integration-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- sourceContextId?: string
- targetContextId?: string
- integrationType?: 'API' | 'MESSAGE' | 'DATABASE' | 'FILE' | 'EVENT'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<IntegrationMapping>
```

#### 7.11 获取单个集成映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/integration-mappings/{mappingId}
Response: ApiResponse<IntegrationMapping>
```

#### 7.12 创建集成映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/integration-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  sourceContextId: string;  // 必填，源上下文ID
  targetContextId: string;  // 必填，目标上下文ID
  integrationType: 'API' | 'MESSAGE' | 'DATABASE' | 'FILE' | 'EVENT';  // 必填，集成类型
  protocol?: string;  // 协议
  endpoint?: string;  // 端点
  authentication?: Authentication;  // 认证配置
  dataTransformation?: DataTransformation;  // 数据转换配置
  errorHandling?: ErrorHandling;  // 错误处理配置
  retryPolicy?: RetryPolicy;  // 重试策略
  monitoring?: Monitoring;  // 监控配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<IntegrationMapping>
```

#### 7.13 更新集成映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/integration-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  sourceContextId?: string;
  targetContextId?: string;
  integrationType?: 'API' | 'MESSAGE' | 'DATABASE' | 'FILE' | 'EVENT';
  protocol?: string;
  endpoint?: string;
  authentication?: Authentication;
  dataTransformation?: DataTransformation;
  errorHandling?: ErrorHandling;
  retryPolicy?: RetryPolicy;
  monitoring?: Monitoring;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<IntegrationMapping>
```

#### 7.14 删除集成映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/integration-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.15 获取API映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/api-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- serviceId?: string
- methodId?: string
- httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ApiMapping>
```

#### 7.16 获取单个API映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/api-mappings/{mappingId}
Response: ApiResponse<ApiMapping>
```

#### 7.17 创建API映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/api-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  serviceId: string;  // 必填，服务ID
  methodId: string;  // 必填，方法ID
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // 必填，HTTP方法
  path: string;  // 必填，API路径
  version?: string;  // API版本
  requestMapping?: RequestMapping;  // 请求映射配置
  responseMapping?: ResponseMapping;  // 响应映射配置
  authentication?: Authentication;  // 认证配置
  authorization?: Authorization;  // 授权配置
  rateLimiting?: RateLimiting;  // 限流配置
  caching?: Caching;  // 缓存配置
  documentation?: string;  // API文档
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
}
Response: ApiResponse<ApiMapping>
```

#### 7.18 更新API映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/api-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  serviceId?: string;
  methodId?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path?: string;
  version?: string;
  requestMapping?: RequestMapping;
  responseMapping?: ResponseMapping;
  authentication?: Authentication;
  authorization?: Authorization;
  rateLimiting?: RateLimiting;
  caching?: Caching;
  documentation?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
}
Response: ApiResponse<ApiMapping>
```

#### 7.19 删除API映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/api-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.20 获取事件映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/event-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- eventId?: string
- eventType?: 'DOMAIN_EVENT' | 'INTEGRATION_EVENT' | 'BUSINESS_EVENT'
- messageBroker?: 'KAFKA' | 'RABBITMQ' | 'ROCKETMQ' | 'REDIS'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<EventMapping>
```

#### 7.21 获取单个事件映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/event-mappings/{mappingId}
Response: ApiResponse<EventMapping>
```

#### 7.22 创建事件映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/event-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  eventId: string;  // 必填，事件ID
  eventType: 'DOMAIN_EVENT' | 'INTEGRATION_EVENT' | 'BUSINESS_EVENT';  // 必填，事件类型
  messageBroker: 'KAFKA' | 'RABBITMQ' | 'ROCKETMQ' | 'REDIS';  // 必填，消息代理
  topic?: string;  // 主题
  queue?: string;  // 队列
  routingKey?: string;  // 路由键
  serialization?: Serialization;  // 序列化配置
  partitioning?: Partitioning;  // 分区配置
  retryPolicy?: RetryPolicy;  // 重试策略
  deadLetterQueue?: string;  // 死信队列
  monitoring?: Monitoring;  // 监控配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<EventMapping>
```

#### 7.23 更新事件映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/event-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  eventId?: string;
  eventType?: 'DOMAIN_EVENT' | 'INTEGRATION_EVENT' | 'BUSINESS_EVENT';
  messageBroker?: 'KAFKA' | 'RABBITMQ' | 'ROCKETMQ' | 'REDIS';
  topic?: string;
  queue?: string;
  routingKey?: string;
  serialization?: Serialization;
  partitioning?: Partitioning;
  retryPolicy?: RetryPolicy;
  deadLetterQueue?: string;
  monitoring?: Monitoring;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<EventMapping>
```

#### 7.24 删除事件映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/event-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.25 获取安全映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/security-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- securityType?: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ENCRYPTION' | 'AUDIT'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<SecurityMapping>
```

#### 7.26 获取单个安全映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/security-mappings/{mappingId}
Response: ApiResponse<SecurityMapping>
```

#### 7.27 创建安全映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/security-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  securityType: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ENCRYPTION' | 'AUDIT';  // 必填，安全类型
  targetElement: string;  // 必填，目标元素
  authenticationMethod?: 'JWT' | 'OAUTH2' | 'API_KEY' | 'CERTIFICATE';  // 认证方法
  authorizationModel?: 'RBAC' | 'ABAC' | 'PBAC';  // 授权模型
  encryptionAlgorithm?: 'AES' | 'RSA' | 'SHA256';  // 加密算法
  auditTrail?: AuditTrail;  // 审计配置
  compliance?: Compliance;  // 合规配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<SecurityMapping>
```

#### 7.28 更新安全映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/security-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  securityType?: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ENCRYPTION' | 'AUDIT';
  targetElement?: string;
  authenticationMethod?: 'JWT' | 'OAUTH2' | 'API_KEY' | 'CERTIFICATE';
  authorizationModel?: 'RBAC' | 'ABAC' | 'PBAC';
  encryptionAlgorithm?: 'AES' | 'RSA' | 'SHA256';
  auditTrail?: AuditTrail;
  compliance?: Compliance;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<SecurityMapping>
```

#### 7.29 删除安全映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/security-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.30 获取监控映射列表
```typescript
GET /api/ddd/implementation-mapping/{domainId}/monitoring-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- monitoringType?: 'METRICS' | 'LOGGING' | 'TRACING' | 'ALERTING'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<MonitoringMapping>
```

#### 7.31 获取单个监控映射
```typescript
GET /api/ddd/implementation-mapping/{domainId}/monitoring-mappings/{mappingId}
Response: ApiResponse<MonitoringMapping>
```

#### 7.32 创建监控映射
```typescript
POST /api/ddd/implementation-mapping/{domainId}/monitoring-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  monitoringType: 'METRICS' | 'LOGGING' | 'TRACING' | 'ALERTING';  // 必填，监控类型
  targetElement: string;  // 必填，目标元素
  metrics?: Metrics;  // 指标配置
  logging?: Logging;  // 日志配置
  tracing?: Tracing;  // 链路追踪配置
  alerting?: Alerting;  // 告警配置
  dashboard?: Dashboard;  // 仪表板配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<MonitoringMapping>
```

#### 7.33 更新监控映射
```typescript
PUT /api/ddd/implementation-mapping/{domainId}/monitoring-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  monitoringType?: 'METRICS' | 'LOGGING' | 'TRACING' | 'ALERTING';
  targetElement?: string;
  metrics?: Metrics;
  logging?: Logging;
  tracing?: Tracing;
  alerting?: Alerting;
  dashboard?: Dashboard;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<MonitoringMapping>
```

#### 7.34 删除监控映射
```typescript
DELETE /api/ddd/implementation-mapping/{domainId}/monitoring-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 7.35 实现映射分析服务 - 获取架构图
```typescript
GET /api/ddd/implementation-mapping/{domainId}/architecture-diagram
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- layer?: 'PRESENTATION' | 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE'

Response: ApiResponse<ArchitectureDiagram>
```

#### 7.36 实现映射分析服务 - 获取部署图
```typescript
GET /api/ddd/implementation-mapping/{domainId}/deployment-diagram
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- environment?: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'

Response: ApiResponse<DeploymentDiagram>
```

#### 7.37 实现映射分析服务 - 获取数据流图
```typescript
GET /api/ddd/implementation-mapping/{domainId}/data-flow-diagram
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- flowType?: 'REQUEST_RESPONSE' | 'EVENT_DRIVEN' | 'BATCH_PROCESSING'

Response: ApiResponse<DataFlowDiagram>
```

#### 7.38 实现映射代码生成服务 - 生成架构代码
```typescript
POST /api/ddd/implementation-mapping/{domainId}/code-generation
Body: {
  mappingIds?: string[];  // 指定映射ID列表，为空则生成所有
  targetLanguage: 'JAVA' | 'TYPESCRIPT' | 'PYTHON' | 'C_SHARP';  // 目标语言
  framework?: string;  // 目标框架
  includeConfiguration?: boolean;  // 是否包含配置文件
  includeDocumentation?: boolean;  // 是否包含文档
  includeTests?: boolean;  // 是否包含测试代码
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<CodeGenerationResult>
```

### 8. 屏幕定义管理 API

#### 8.1 获取屏幕定义数据
```typescript
GET /api/ddd/screen-definition/{domainId}
Response: ApiResponse<ScreenDefinition>
```

#### 8.2 创建/更新屏幕定义
```typescript
PUT /api/ddd/screen-definition/{domainId}
Body: {
  version: string;  // 必填，版本号
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  screens: Screen[];  // 必填，屏幕列表
  endpointMappings?: EndpointMapping[];  // 端点映射列表
  screenDtoMappings?: ScreenDtoMapping[];  // 屏幕DTO映射列表
  layouts?: Layout[];  // 布局列表
  themes?: Theme[];  // 主题列表
  permissions?: Permission[];  // 权限列表
}
Response: ApiResponse<ScreenDefinition>
```

#### 8.3 获取屏幕列表
```typescript
GET /api/ddd/screen-definition/{domainId}/screens
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenType?: 'LIST' | 'DETAIL' | 'FORM' | 'DASHBOARD' | 'WIZARD' | 'MODAL'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority' | 'complexity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Screen>
```

#### 8.4 获取单个屏幕
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}
Response: ApiResponse<Screen>
```

#### 8.5 创建屏幕
```typescript
POST /api/ddd/screen-definition/{domainId}/screens
Body: {
  name: string;  // 必填，屏幕名称
  description: string;  // 必填，屏幕描述
  screenType: 'LIST' | 'DETAIL' | 'FORM' | 'DASHBOARD' | 'WIZARD' | 'MODAL';  // 必填，屏幕类型
  layout: Layout;  // 必填，布局配置
  components: Component[];  // 必填，组件列表
  dataBindings?: DataBinding[];  // 数据绑定列表
  eventHandlers?: EventHandler[];  // 事件处理器列表
  validationRules?: ValidationRule[];  // 验证规则列表
  navigation?: Navigation;  // 导航配置
  responsive?: Responsive;  // 响应式配置
  accessibility?: Accessibility;  // 无障碍配置
  performance?: Performance;  // 性能配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';  // 复杂度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Screen>
```

#### 8.6 更新屏幕
```typescript
PUT /api/ddd/screen-definition/{domainId}/screens/{screenId}
Body: {
  name?: string;
  description?: string;
  screenType?: 'LIST' | 'DETAIL' | 'FORM' | 'DASHBOARD' | 'WIZARD' | 'MODAL';
  layout?: Layout;
  components?: Component[];
  dataBindings?: DataBinding[];
  eventHandlers?: EventHandler[];
  validationRules?: ValidationRule[];
  navigation?: Navigation;
  responsive?: Responsive;
  accessibility?: Accessibility;
  performance?: Performance;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Screen>
```

#### 8.7 删除屏幕
```typescript
DELETE /api/ddd/screen-definition/{domainId}/screens/{screenId}
Response: ApiResponse<void>
```

#### 8.8 获取组件列表
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}/components
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- componentType?: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Component>
```

#### 8.9 获取单个组件
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Response: ApiResponse<Component>
```

#### 8.10 创建组件
```typescript
POST /api/ddd/screen-definition/{domainId}/screens/{screenId}/components
Body: {
  name: string;  // 必填，组件名称
  componentType: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL';  // 必填，组件类型
  properties: ComponentProperty[];  // 必填，组件属性列表
  dataSource?: DataSource;  // 数据源配置
  styling?: Styling;  // 样式配置
  behavior?: Behavior;  // 行为配置
  validation?: Validation;  // 验证配置
  accessibility?: Accessibility;  // 无障碍配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Component>
```

#### 8.11 更新组件
```typescript
PUT /api/ddd/screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Body: {
  name?: string;
  componentType?: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL';
  properties?: ComponentProperty[];
  dataSource?: DataSource;
  styling?: Styling;
  behavior?: Behavior;
  validation?: Validation;
  accessibility?: Accessibility;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Component>
```

#### 8.12 删除组件
```typescript
DELETE /api/ddd/screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Response: ApiResponse<void>
```

#### 8.13 获取端点映射列表
```typescript
GET /api/ddd/screen-definition/{domainId}/endpoint-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenId?: string
- httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<EndpointMapping>
```

#### 8.14 获取单个端点映射
```typescript
GET /api/ddd/screen-definition/{domainId}/endpoint-mappings/{mappingId}
Response: ApiResponse<EndpointMapping>
```

#### 8.15 创建端点映射
```typescript
POST /api/ddd/screen-definition/{domainId}/endpoint-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  screenId: string;  // 必填，屏幕ID
  endpoint: string;  // 必填，端点URL
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // 必填，HTTP方法
  requestMapping?: RequestMapping;  // 请求映射配置
  responseMapping?: ResponseMapping;  // 响应映射配置
  errorHandling?: ErrorHandling;  // 错误处理配置
  caching?: Caching;  // 缓存配置
  authentication?: Authentication;  // 认证配置
  authorization?: Authorization;  // 授权配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<EndpointMapping>
```

#### 8.16 更新端点映射
```typescript
PUT /api/ddd/screen-definition/{domainId}/endpoint-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  screenId?: string;
  endpoint?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requestMapping?: RequestMapping;
  responseMapping?: ResponseMapping;
  errorHandling?: ErrorHandling;
  caching?: Caching;
  authentication?: Authentication;
  authorization?: Authorization;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<EndpointMapping>
```

#### 8.17 删除端点映射
```typescript
DELETE /api/ddd/screen-definition/{domainId}/endpoint-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 8.18 获取屏幕DTO映射列表
```typescript
GET /api/ddd/screen-definition/{domainId}/screen-dto-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenId?: string
- dtoId?: string
- mappingType?: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ScreenDtoMapping>
```

#### 8.19 获取单个屏幕DTO映射
```typescript
GET /api/ddd/screen-definition/{domainId}/screen-dto-mappings/{mappingId}
Response: ApiResponse<ScreenDtoMapping>
```

#### 8.20 创建屏幕DTO映射
```typescript
POST /api/ddd/screen-definition/{domainId}/screen-dto-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  screenId: string;  // 必填，屏幕ID
  dtoId: string;  // 必填，DTO ID
  mappingType: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL';  // 必填，映射类型
  fieldMappings: FieldMapping[];  // 必填，字段映射列表
  validationRules?: ValidationRule[];  // 验证规则列表
  transformation?: Transformation;  // 数据转换配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ScreenDtoMapping>
```

#### 8.21 更新屏幕DTO映射
```typescript
PUT /api/ddd/screen-definition/{domainId}/screen-dto-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  screenId?: string;
  dtoId?: string;
  mappingType?: 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL';
  fieldMappings?: FieldMapping[];
  validationRules?: ValidationRule[];
  transformation?: Transformation;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ScreenDtoMapping>
```

#### 8.22 删除屏幕DTO映射
```typescript
DELETE /api/ddd/screen-definition/{domainId}/screen-dto-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 8.23 获取布局列表
```typescript
GET /api/ddd/screen-definition/{domainId}/layouts
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- layoutType?: 'GRID' | 'FLEXBOX' | 'CSS_GRID' | 'TABLE' | 'CUSTOM'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Layout>
```

#### 8.24 获取单个布局
```typescript
GET /api/ddd/screen-definition/{domainId}/layouts/{layoutId}
Response: ApiResponse<Layout>
```

#### 8.25 创建布局
```typescript
POST /api/ddd/screen-definition/{domainId}/layouts
Body: {
  name: string;  // 必填，布局名称
  description: string;  // 必填，布局描述
  layoutType: 'GRID' | 'FLEXBOX' | 'CSS_GRID' | 'TABLE' | 'CUSTOM';  // 必填，布局类型
  configuration: LayoutConfiguration;  // 必填，布局配置
  responsive?: Responsive;  // 响应式配置
  accessibility?: Accessibility;  // 无障碍配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Layout>
```

#### 8.26 更新布局
```typescript
PUT /api/ddd/screen-definition/{domainId}/layouts/{layoutId}
Body: {
  name?: string;
  description?: string;
  layoutType?: 'GRID' | 'FLEXBOX' | 'CSS_GRID' | 'TABLE' | 'CUSTOM';
  configuration?: LayoutConfiguration;
  responsive?: Responsive;
  accessibility?: Accessibility;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Layout>
```

#### 8.27 删除布局
```typescript
DELETE /api/ddd/screen-definition/{domainId}/layouts/{layoutId}
Response: ApiResponse<void>
```

#### 8.28 获取主题列表
```typescript
GET /api/ddd/screen-definition/{domainId}/themes
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- themeType?: 'LIGHT' | 'DARK' | 'CUSTOM'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Theme>
```

#### 8.29 获取单个主题
```typescript
GET /api/ddd/screen-definition/{domainId}/themes/{themeId}
Response: ApiResponse<Theme>
```

#### 8.30 创建主题
```typescript
POST /api/ddd/screen-definition/{domainId}/themes
Body: {
  name: string;  // 必填，主题名称
  description: string;  // 必填，主题描述
  themeType: 'LIGHT' | 'DARK' | 'CUSTOM';  // 必填，主题类型
  colorScheme: ColorScheme;  // 必填，配色方案
  typography?: Typography;  // 字体配置
  spacing?: Spacing;  // 间距配置
  shadows?: Shadows;  // 阴影配置
  animations?: Animations;  // 动画配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Theme>
```

#### 8.31 更新主题
```typescript
PUT /api/ddd/screen-definition/{domainId}/themes/{themeId}
Body: {
  name?: string;
  description?: string;
  themeType?: 'LIGHT' | 'DARK' | 'CUSTOM';
  colorScheme?: ColorScheme;
  typography?: Typography;
  spacing?: Spacing;
  shadows?: Shadows;
  animations?: Animations;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Theme>
```

#### 8.32 删除主题
```typescript
DELETE /api/ddd/screen-definition/{domainId}/themes/{themeId}
Response: ApiResponse<void>
```

#### 8.33 获取权限列表
```typescript
GET /api/ddd/screen-definition/{domainId}/permissions
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenId?: string
- permissionType?: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Permission>
```

#### 8.34 获取单个权限
```typescript
GET /api/ddd/screen-definition/{domainId}/permissions/{permissionId}
Response: ApiResponse<Permission>
```

#### 8.35 创建权限
```typescript
POST /api/ddd/screen-definition/{domainId}/permissions
Body: {
  name: string;  // 必填，权限名称
  description: string;  // 必填，权限描述
  screenId: string;  // 必填，屏幕ID
  permissionType: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';  // 必填，权限类型
  roles?: string[];  // 角色列表
  users?: string[];  // 用户列表
  conditions?: Condition[];  // 条件列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Permission>
```

#### 8.36 更新权限
```typescript
PUT /api/ddd/screen-definition/{domainId}/permissions/{permissionId}
Body: {
  name?: string;
  description?: string;
  screenId?: string;
  permissionType?: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  roles?: string[];
  users?: string[];
  conditions?: Condition[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Permission>
```

#### 8.37 删除权限
```typescript
DELETE /api/ddd/screen-definition/{domainId}/permissions/{permissionId}
Response: ApiResponse<void>
```

#### 8.38 屏幕定义关联服务 - 获取屏幕的术语关联
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 8.39 屏幕定义关联服务 - 获取屏幕的实体关联
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}/entity-associations
Response: ApiResponse<EntityAssociation[]>
```

#### 8.40 屏幕定义关联服务 - 获取屏幕的DTO关联
```typescript
GET /api/ddd/screen-definition/{domainId}/screens/{screenId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 8.41 屏幕定义关联服务 - 批量更新屏幕关联
```typescript
PUT /api/ddd/screen-definition/{domainId}/screens/{screenId}/associations
Body: {
  termAssociations?: TermAssociation[];
  entityAssociations?: EntityAssociation[];
  dtoAssociations?: DtoAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 8.42 屏幕定义分析服务 - 获取屏幕流程图
```typescript
GET /api/ddd/screen-definition/{domainId}/screen-flow-diagram
Query Parameters:
- format?: 'JSON' | 'DOT' | 'SVG' | 'PNG'
- includeDetails?: boolean
- screenType?: 'LIST' | 'DETAIL' | 'FORM' | 'DASHBOARD' | 'WIZARD' | 'MODAL'

Response: ApiResponse<ScreenFlowDiagram>
```

#### 8.43 屏幕定义分析服务 - 获取用户体验分析
```typescript
GET /api/ddd/screen-definition/{domainId}/user-experience-analysis
Response: ApiResponse<UserExperienceAnalysis>
```

#### 8.44 屏幕定义分析服务 - 获取性能分析
```typescript
GET /api/ddd/screen-definition/{domainId}/performance-analysis
Response: ApiResponse<PerformanceAnalysis>
```

#### 8.45 屏幕定义代码生成服务 - 生成前端代码
```typescript
POST /api/ddd/screen-definition/{domainId}/code-generation
Body: {
  screenIds?: string[];  // 指定屏幕ID列表，为空则生成所有
  targetFramework: 'REACT' | 'VUE' | 'ANGULAR' | 'SVELTE' | 'SOLID';  // 目标框架
  uiLibrary?: string;  // UI库
  includeStyling?: boolean;  // 是否包含样式
  includeDocumentation?: boolean;  // 是否包含文档
  includeTests?: boolean;  // 是否包含测试代码
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<CodeGenerationResult>
```

### 9. amis屏幕管理 API

#### 9.1 获取amis屏幕定义数据
```typescript
GET /api/ddd/amis-screen-definition/{domainId}
Response: ApiResponse<AmisScreenDefinition>
```

#### 9.2 创建/更新amis屏幕定义
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}
Body: {
  version: string;  // 必填，版本号
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  screens: AmisScreen[];  // 必填，amis屏幕列表
  modelMappings?: ModelMapping[];  // 模型映射列表
  amisGlobalConfig?: AmisGlobalConfig;  // amis全局配置
  templates?: ScreenTemplate[];  // 屏幕模板列表
  themes?: ScreenTheme[];  // 屏幕主题列表
  permissions?: ScreenPermission[];  // 屏幕权限列表
}
Response: ApiResponse<AmisScreenDefinition>
```

#### 9.3 获取amis屏幕列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenType?: 'PAGE' | 'DIALOG' | 'DRAWER' | 'WIZARD' | 'DASHBOARD'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority' | 'complexity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<AmisScreen>
```

#### 9.4 获取单个amis屏幕
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}
Response: ApiResponse<AmisScreen>
```

#### 9.5 创建amis屏幕
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/screens
Body: {
  name: string;  // 必填，屏幕名称
  description: string;  // 必填，屏幕描述
  screenType: 'PAGE' | 'DIALOG' | 'DRAWER' | 'WIZARD' | 'DASHBOARD';  // 必填，屏幕类型
  amisSchema: AmisSchema;  // 必填，amis Schema配置
  dataSource?: DataSource;  // 数据源配置
  apiConfig?: ApiConfig;  // API配置
  eventHandlers?: EventHandler[];  // 事件处理器列表
  validationRules?: ValidationRule[];  // 验证规则列表
  styling?: AmisStyling;  // amis样式配置
  responsive?: Responsive;  // 响应式配置
  accessibility?: Accessibility;  // 无障碍配置
  performance?: Performance;  // 性能配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';  // 复杂度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<AmisScreen>
```

#### 9.6 更新amis屏幕
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}
Body: {
  name?: string;
  description?: string;
  screenType?: 'PAGE' | 'DIALOG' | 'DRAWER' | 'WIZARD' | 'DASHBOARD';
  amisSchema?: AmisSchema;
  dataSource?: DataSource;
  apiConfig?: ApiConfig;
  eventHandlers?: EventHandler[];
  validationRules?: ValidationRule[];
  styling?: AmisStyling;
  responsive?: Responsive;
  accessibility?: Accessibility;
  performance?: Performance;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<AmisScreen>
```

#### 9.7 删除amis屏幕
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}
Response: ApiResponse<void>
```

#### 9.8 获取amis组件列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/components
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- componentType?: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL' | 'WIZARD' | 'DRAWER'
- isActive?: boolean
- sortBy?: 'name' | 'type' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<AmisComponent>
```

#### 9.9 获取单个amis组件
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Response: ApiResponse<AmisComponent>
```

#### 9.10 创建amis组件
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/components
Body: {
  name: string;  // 必填，组件名称
  componentType: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL' | 'WIZARD' | 'DRAWER';  // 必填，组件类型
  amisConfig: AmisComponentConfig;  // 必填，amis组件配置
  dataBinding?: DataBinding;  // 数据绑定配置
  eventBinding?: EventBinding;  // 事件绑定配置
  validation?: Validation;  // 验证配置
  styling?: AmisStyling;  // 样式配置
  accessibility?: Accessibility;  // 无障碍配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<AmisComponent>
```

#### 9.11 更新amis组件
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Body: {
  name?: string;
  componentType?: 'FORM' | 'TABLE' | 'CHART' | 'BUTTON' | 'INPUT' | 'SELECT' | 'MODAL' | 'WIZARD' | 'DRAWER';
  amisConfig?: AmisComponentConfig;
  dataBinding?: DataBinding;
  eventBinding?: EventBinding;
  validation?: Validation;
  styling?: AmisStyling;
  accessibility?: Accessibility;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<AmisComponent>
```

#### 9.12 删除amis组件
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/components/{componentId}
Response: ApiResponse<void>
```

#### 9.13 获取模型映射列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/model-mappings
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenId?: string
- entityId?: string
- dtoId?: string
- mappingType?: 'ENTITY_TO_FORM' | 'DTO_TO_TABLE' | 'AGGREGATE_TO_DASHBOARD'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ModelMapping>
```

#### 9.14 获取单个模型映射
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/model-mappings/{mappingId}
Response: ApiResponse<ModelMapping>
```

#### 9.15 创建模型映射
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/model-mappings
Body: {
  name: string;  // 必填，映射名称
  description: string;  // 必填，映射描述
  screenId: string;  // 必填，屏幕ID
  entityId?: string;  // 实体ID
  dtoId?: string;  // DTO ID
  aggregateId?: string;  // 聚合ID
  mappingType: 'ENTITY_TO_FORM' | 'DTO_TO_TABLE' | 'AGGREGATE_TO_DASHBOARD';  // 必填，映射类型
  fieldMappings: AmisFieldMapping[];  // 必填，字段映射列表
  validationMappings?: ValidationMapping[];  // 验证映射列表
  eventMappings?: EventMapping[];  // 事件映射列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ModelMapping>
```

#### 9.16 更新模型映射
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/model-mappings/{mappingId}
Body: {
  name?: string;
  description?: string;
  screenId?: string;
  entityId?: string;
  dtoId?: string;
  aggregateId?: string;
  mappingType?: 'ENTITY_TO_FORM' | 'DTO_TO_TABLE' | 'AGGREGATE_TO_DASHBOARD';
  fieldMappings?: AmisFieldMapping[];
  validationMappings?: ValidationMapping[];
  eventMappings?: EventMapping[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ModelMapping>
```

#### 9.17 删除模型映射
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/model-mappings/{mappingId}
Response: ApiResponse<void>
```

#### 9.18 获取amis全局配置
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/global-config
Response: ApiResponse<AmisGlobalConfig>
```

#### 9.19 更新amis全局配置
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/global-config
Body: {
  theme?: string;  // 主题
  locale?: string;  // 语言
  api?: AmisApiConfig;  // API配置
  validation?: AmisValidationConfig;  // 验证配置
  styling?: AmisGlobalStyling;  // 全局样式配置
  performance?: AmisPerformanceConfig;  // 性能配置
  accessibility?: AmisAccessibilityConfig;  // 无障碍配置
  security?: AmisSecurityConfig;  // 安全配置
}
Response: ApiResponse<AmisGlobalConfig>
```

#### 9.20 获取屏幕模板列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/templates
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- templateType?: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD' | 'WIZARD'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ScreenTemplate>
```

#### 9.21 获取单个屏幕模板
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/templates/{templateId}
Response: ApiResponse<ScreenTemplate>
```

#### 9.22 创建屏幕模板
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/templates
Body: {
  name: string;  // 必填，模板名称
  description: string;  // 必填，模板描述
  templateType: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD' | 'WIZARD';  // 必填，模板类型
  amisSchema: AmisSchema;  // 必填，amis Schema
  parameters?: TemplateParameter[];  // 模板参数列表
  variables?: TemplateVariable[];  // 模板变量列表
  slots?: TemplateSlot[];  // 模板插槽列表
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ScreenTemplate>
```

#### 9.23 更新屏幕模板
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/templates/{templateId}
Body: {
  name?: string;
  description?: string;
  templateType?: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD' | 'WIZARD';
  amisSchema?: AmisSchema;
  parameters?: TemplateParameter[];
  variables?: TemplateVariable[];
  slots?: TemplateSlot[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ScreenTemplate>
```

#### 9.24 删除屏幕模板
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/templates/{templateId}
Response: ApiResponse<void>
```

#### 9.25 获取屏幕主题列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/themes
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- themeType?: 'LIGHT' | 'DARK' | 'CUSTOM'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ScreenTheme>
```

#### 9.26 获取单个屏幕主题
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/themes/{themeId}
Response: ApiResponse<ScreenTheme>
```

#### 9.27 创建屏幕主题
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/themes
Body: {
  name: string;  // 必填，主题名称
  description: string;  // 必填，主题描述
  themeType: 'LIGHT' | 'DARK' | 'CUSTOM';  // 必填，主题类型
  amisTheme: AmisTheme;  // 必填，amis主题配置
  colorScheme?: ColorScheme;  // 配色方案
  typography?: Typography;  // 字体配置
  spacing?: Spacing;  // 间距配置
  shadows?: Shadows;  // 阴影配置
  animations?: Animations;  // 动画配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ScreenTheme>
```

#### 9.28 更新屏幕主题
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/themes/{themeId}
Body: {
  name?: string;
  description?: string;
  themeType?: 'LIGHT' | 'DARK' | 'CUSTOM';
  amisTheme?: AmisTheme;
  colorScheme?: ColorScheme;
  typography?: Typography;
  spacing?: Spacing;
  shadows?: Shadows;
  animations?: Animations;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ScreenTheme>
```

#### 9.29 删除屏幕主题
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/themes/{themeId}
Response: ApiResponse<void>
```

#### 9.30 获取屏幕权限列表
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/permissions
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- screenId?: string
- permissionType?: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ScreenPermission>
```

#### 9.31 获取单个屏幕权限
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/permissions/{permissionId}
Response: ApiResponse<ScreenPermission>
```

#### 9.32 创建屏幕权限
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/permissions
Body: {
  name: string;  // 必填，权限名称
  description: string;  // 必填，权限描述
  screenId: string;  // 必填，屏幕ID
  permissionType: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';  // 必填，权限类型
  roles?: string[];  // 角色列表
  users?: string[];  // 用户列表
  conditions?: Condition[];  // 条件列表
  amisPermissions?: AmisPermission[];  // amis权限配置
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ScreenPermission>
```

#### 9.33 更新屏幕权限
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/permissions/{permissionId}
Body: {
  name?: string;
  description?: string;
  screenId?: string;
  permissionType?: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  roles?: string[];
  users?: string[];
  conditions?: Condition[];
  amisPermissions?: AmisPermission[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ScreenPermission>
```

#### 9.34 删除屏幕权限
```typescript
DELETE /api/ddd/amis-screen-definition/{domainId}/permissions/{permissionId}
Response: ApiResponse<void>
```

#### 9.35 amis屏幕关联服务 - 获取屏幕的术语关联
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/term-associations
Response: ApiResponse<TermAssociation[]>
```

#### 9.36 amis屏幕关联服务 - 获取屏幕的实体关联
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/entity-associations
Response: ApiResponse<EntityAssociation[]>
```

#### 9.37 amis屏幕关联服务 - 获取屏幕的DTO关联
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/dto-associations
Response: ApiResponse<DtoAssociation[]>
```

#### 9.38 amis屏幕关联服务 - 批量更新屏幕关联
```typescript
PUT /api/ddd/amis-screen-definition/{domainId}/screens/{screenId}/associations
Body: {
  termAssociations?: TermAssociation[];
  entityAssociations?: EntityAssociation[];
  dtoAssociations?: DtoAssociation[];
}
Response: ApiResponse<UpdateAssociationsResult>
```

#### 9.39 amis屏幕分析服务 - 获取amis Schema分析
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/amis-schema-analysis
Response: ApiResponse<AmisSchemaAnalysis>
```

#### 9.40 amis屏幕分析服务 - 获取组件使用分析
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/component-usage-analysis
Response: ApiResponse<ComponentUsageAnalysis>
```

#### 9.41 amis屏幕分析服务 - 获取性能分析
```typescript
GET /api/ddd/amis-screen-definition/{domainId}/performance-analysis
Response: ApiResponse<AmisPerformanceAnalysis>
```

#### 9.42 amis屏幕代码生成服务 - 生成amis配置
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/code-generation
Body: {
  screenIds?: string[];  // 指定屏幕ID列表，为空则生成所有
  includeGlobalConfig?: boolean;  // 是否包含全局配置
  includeTemplates?: boolean;  // 是否包含模板
  includeThemes?: boolean;  // 是否包含主题
  includePermissions?: boolean;  // 是否包含权限
  includeDocumentation?: boolean;  // 是否包含文档
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<CodeGenerationResult>
```

#### 9.43 amis屏幕预览服务 - 预览amis屏幕
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/preview
Body: {
  screenId: string;  // 必填，屏幕ID
  data?: any;  // 预览数据
  theme?: string;  // 主题
  locale?: string;  // 语言
  mode?: 'EDIT' | 'VIEW';  // 预览模式
}
Response: ApiResponse<AmisPreview>
```

#### 9.44 amis屏幕验证服务 - 验证amis Schema
```typescript
POST /api/ddd/amis-screen-definition/{domainId}/validate
Body: {
  screenId?: string;  // 屏幕ID，为空则验证所有
  schema?: AmisSchema;  // 直接验证Schema
  strict?: boolean;  // 严格模式
}
Response: ApiResponse<AmisValidationResult>
```

### 10. 关系管理 API

#### 10.1 获取关系列表
```typescript
GET /api/ddd/relationships
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- relationshipType?: 'ASSOCIATION' | 'AGGREGATION' | 'COMPOSITION' | 'INHERITANCE' | 'DEPENDENCY' | 'REALIZATION'
- sourceType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN'
- targetType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN'
- sourceId?: string
- targetId?: string
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'relationshipType' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Relationship>
```

#### 10.2 获取单个关系
```typescript
GET /api/ddd/relationships/{relationshipId}
Response: ApiResponse<Relationship>
```

#### 10.3 创建关系
```typescript
POST /api/ddd/relationships
Body: {
  name: string;  // 必填，关系名称
  description: string;  // 必填，关系描述
  relationshipType: 'ASSOCIATION' | 'AGGREGATION' | 'COMPOSITION' | 'INHERITANCE' | 'DEPENDENCY' | 'REALIZATION';  // 必填，关系类型
  sourceType: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';  // 必填，源类型
  sourceId: string;  // 必填，源ID
  targetType: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';  // 必填，目标类型
  targetId: string;  // 必填，目标ID
  multiplicity?: string;  // 多重性
  direction?: 'BIDIRECTIONAL' | 'UNIDIRECTIONAL';  // 方向
  navigability?: 'BOTH' | 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'NONE';  // 可导航性
  constraints?: Constraint[];  // 约束列表
  properties?: Record<string, any>;  // 属性
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}

Response: ApiResponse<Relationship>
```

#### 10.4 更新关系
```typescript
PUT /api/ddd/relationships/{relationshipId}
Body: {
  name?: string;
  description?: string;
  relationshipType?: 'ASSOCIATION' | 'AGGREGATION' | 'COMPOSITION' | 'INHERITANCE' | 'DEPENDENCY' | 'REALIZATION';
  sourceType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';
  sourceId?: string;
  targetType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';
  targetId?: string;
  multiplicity?: string;
  direction?: 'BIDIRECTIONAL' | 'UNIDIRECTIONAL';
  navigability?: 'BOTH' | 'SOURCE_TO_TARGET' | 'TARGET_TO_SOURCE' | 'NONE';
  constraints?: Constraint[];
  properties?: Record<string, any>;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}

Response: ApiResponse<Relationship>
```

#### 10.5 删除关系
```typescript
DELETE /api/ddd/relationships/{relationshipId}
Response: ApiResponse<void>
```

#### 10.6 获取关系类型列表
```typescript
GET /api/ddd/relationships/types
Response: ApiResponse<RelationshipType[]>
```

#### 10.7 获取关系约束列表
```typescript
GET /api/ddd/relationships/{relationshipId}/constraints
Response: ApiResponse<Constraint[]>
```

#### 10.8 添加关系约束
```typescript
POST /api/ddd/relationships/{relationshipId}/constraints
Body: {
  name: string;  // 必填，约束名称
  description: string;  // 必填，约束描述
  constraintType: 'UNIQUE' | 'NOT_NULL' | 'FOREIGN_KEY' | 'CHECK' | 'CUSTOM';  // 必填，约束类型
  expression?: string;  // 约束表达式
  parameters?: Record<string, any>;  // 参数
  severity?: 'ERROR' | 'WARNING' | 'INFO';  // 严重程度
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<Constraint>
```

#### 10.9 更新关系约束
```typescript
PUT /api/ddd/relationships/{relationshipId}/constraints/{constraintId}
Body: {
  name?: string;
  description?: string;
  constraintType?: 'UNIQUE' | 'NOT_NULL' | 'FOREIGN_KEY' | 'CHECK' | 'CUSTOM';
  expression?: string;
  parameters?: Record<string, any>;
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<Constraint>
```

#### 10.10 删除关系约束
```typescript
DELETE /api/ddd/relationships/{relationshipId}/constraints/{constraintId}
Response: ApiResponse<void>
```

#### 10.11 关系关联服务 - 获取源对象信息
```typescript
GET /api/ddd/relationships/{relationshipId}/source
Response: ApiResponse<RelationshipSource>
```

#### 10.12 关系关联服务 - 获取目标对象信息
```typescript
GET /api/ddd/relationships/{relationshipId}/target
Response: ApiResponse<RelationshipTarget>
```

#### 10.13 关系关联服务 - 获取相关关系
```typescript
GET /api/ddd/relationships/{relationshipId}/related
Query Parameters:
- depth?: number (default: 1)
- includeInactive?: boolean
Response: ApiResponse<RelatedRelationship[]>
```

#### 10.14 关系分析服务 - 获取关系图
```typescript
GET /api/ddd/relationships/graph
Query Parameters:
- sourceType?: string
- targetType?: string
- relationshipType?: string
- depth?: number (default: 2)
- includeInactive?: boolean
Response: ApiResponse<RelationshipGraph>
```

#### 10.15 关系分析服务 - 获取关系统计
```typescript
GET /api/ddd/relationships/statistics
Query Parameters:
- groupBy?: 'type' | 'sourceType' | 'targetType' | 'direction'
- timeRange?: string
Response: ApiResponse<RelationshipStatistics>
```

#### 10.16 关系分析服务 - 获取循环依赖分析
```typescript
GET /api/ddd/relationships/circular-dependencies
Response: ApiResponse<CircularDependencyAnalysis>
```

#### 10.17 关系验证服务 - 验证关系完整性
```typescript
POST /api/ddd/relationships/validate
Body: {
  relationshipIds?: string[];  // 关系ID列表，为空则验证所有
  validateReferences?: boolean;  // 是否验证引用
  validateConstraints?: boolean;  // 是否验证约束
  strict?: boolean;  // 严格模式
}
Response: ApiResponse<RelationshipValidationResult>
```

#### 10.18 关系代码生成服务 - 生成关系代码
```typescript
POST /api/ddd/relationships/code-generation
Body: {
  relationshipIds?: string[];  // 关系ID列表，为空则生成所有
  targetLanguage?: 'JAVA' | 'C_SHARP' | 'PYTHON' | 'TYPESCRIPT' | 'JAVASCRIPT'
  includeDocumentation?: boolean;  // 是否包含文档
  includeValidation?: boolean;  // 是否包含验证
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<RelationshipCodeGenerationResult>
```

### 11. 验证管理 API

#### 11.1 获取验证配置
```typescript
GET /api/ddd/validation/{id}
Response: ApiResponse<Validation>
```

#### 11.2 创建/更新验证配置
```typescript
PUT /api/ddd/validation/{id}
Body: {
  crossSchemaValidation?: boolean;  // 跨Schema验证
  businessRuleValidation?: boolean;  // 业务规则验证
  consistencyValidation?: boolean;  // 一致性验证
  rules?: ValidationRule[];  // 验证规则列表
  isActive?: boolean;  // 是否激活
}
Response: ApiResponse<Validation>
```

#### 11.3 获取验证规则列表
```typescript
GET /api/ddd/validation/{id}/rules
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- ruleType?: 'SCHEMA' | 'BUSINESS' | 'CONSISTENCY' | 'CUSTOM'
- severity?: 'ERROR' | 'WARNING' | 'INFO'
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'severity' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ValidationRule>
```

#### 11.4 获取单个验证规则
```typescript
GET /api/ddd/validation/{id}/rules/{ruleId}
Response: ApiResponse<ValidationRule>
```

#### 11.5 创建验证规则
```typescript
POST /api/ddd/validation/{id}/rules
Body: {
  name: string;  // 必填，规则名称
  description: string;  // 必填，规则描述
  ruleType: 'SCHEMA' | 'BUSINESS' | 'CONSISTENCY' | 'CUSTOM';  // 必填，规则类型
  severity: 'ERROR' | 'WARNING' | 'INFO';  // 必填，严重程度
  expression: string;  // 必填，验证表达式
  parameters?: Record<string, any>;  // 参数
  targetSchema?: string;  // 目标Schema
  targetElement?: string;  // 目标元素
  conditions?: Condition[];  // 条件列表
  errorMessage?: string;  // 错误消息
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
  isActive?: boolean;  // 是否激活
  tags?: string[];  // 标签列表
  documentation?: string;  // 文档说明
}
Response: ApiResponse<ValidationRule>
```

#### 11.6 更新验证规则
```typescript
PUT /api/ddd/validation/{id}/rules/{ruleId}
Body: {
  name?: string;
  description?: string;
  ruleType?: 'SCHEMA' | 'BUSINESS' | 'CONSISTENCY' | 'CUSTOM';
  severity?: 'ERROR' | 'WARNING' | 'INFO';
  expression?: string;
  parameters?: Record<string, any>;
  targetSchema?: string;
  targetElement?: string;
  conditions?: Condition[];
  errorMessage?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  tags?: string[];
  documentation?: string;
}
Response: ApiResponse<ValidationRule>
```

#### 11.7 删除验证规则
```typescript
DELETE /api/ddd/validation/{id}/rules/{ruleId}
Response: ApiResponse<void>
```

#### 11.8 获取验证结果列表
```typescript
GET /api/ddd/validation/{id}/results
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- status?: 'PASS' | 'FAIL' | 'WARNING' | 'ERROR'
- ruleId?: string
- targetSchema?: string
- targetElement?: string
- startDate?: string
- endDate?: string
- sortBy?: 'createdAt' | 'status' | 'severity' | 'ruleName'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<ValidationResult>
```

#### 11.9 获取单个验证结果
```typescript
GET /api/ddd/validation/{id}/results/{resultId}
Response: ApiResponse<ValidationResult>
```

#### 11.10 执行验证
```typescript
POST /api/ddd/validation/{id}/execute
Body: {
  targetSchemas?: string[];  // 目标Schema列表，为空则验证所有
  targetElements?: string[];  // 目标元素列表
  ruleIds?: string[];  // 规则ID列表，为空则执行所有
  includeWarnings?: boolean;  // 是否包含警告
  includeInfo?: boolean;  // 是否包含信息
  strict?: boolean;  // 严格模式
  generateReport?: boolean;  // 是否生成报告
}
Response: ApiResponse<ValidationExecutionResult>
```

#### 11.11 获取验证统计
```typescript
GET /api/ddd/validation/{id}/statistics
Query Parameters:
- timeRange?: string
- groupBy?: 'rule' | 'schema' | 'element' | 'status' | 'severity'
Response: ApiResponse<ValidationStatistics>
```

#### 11.12 验证关联服务 - 获取规则影响分析
```typescript
GET /api/ddd/validation/{id}/rules/{ruleId}/impact-analysis
Response: ApiResponse<RuleImpactAnalysis>
```

#### 11.13 验证关联服务 - 获取Schema验证状态
```typescript
GET /api/ddd/validation/{id}/schemas/{schemaId}/status
Response: ApiResponse<SchemaValidationStatus>
```

#### 11.14 验证分析服务 - 获取验证趋势分析
```typescript
GET /api/ddd/validation/{id}/trend-analysis
Query Parameters:
- timeRange?: string
- interval?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'
- groupBy?: 'rule' | 'schema' | 'element'
Response: ApiResponse<ValidationTrendAnalysis>
```

#### 11.15 验证分析服务 - 获取验证质量报告
```typescript
GET /api/ddd/validation/{id}/quality-report
Query Parameters:
- timeRange?: string
- includeDetails?: boolean
Response: ApiResponse<ValidationQualityReport>
```

#### 11.16 验证代码生成服务 - 生成验证代码
```typescript
POST /api/ddd/validation/{id}/code-generation
Body: {
  ruleIds?: string[];  // 规则ID列表，为空则生成所有
  targetLanguage?: 'JAVA' | 'C_SHARP' | 'PYTHON' | 'TYPESCRIPT' | 'JAVASCRIPT'
  includeDocumentation?: boolean;  // 是否包含文档
  includeTests?: boolean;  // 是否包含测试
  outputFormat?: 'SINGLE_FILE' | 'MULTIPLE_FILES' | 'ARCHIVE';  // 输出格式
}
Response: ApiResponse<ValidationCodeGenerationResult>
```

#### 11.17 验证配置服务 - 导入验证配置
```typescript
POST /api/ddd/validation/{id}/import
Body: {
  config: ValidationConfig;  // 验证配置
  overwrite?: boolean;  // 是否覆盖现有配置
  validateImport?: boolean;  // 是否验证导入
}
Response: ApiResponse<ImportResult>
```

#### 11.18 验证配置服务 - 导出验证配置
```typescript
GET /api/ddd/validation/{id}/export
Query Parameters:
- includeRules?: boolean;  // 是否包含规则
- includeResults?: boolean;  // 是否包含结果
- includeStatistics?: boolean;  // 是否包含统计
- format?: 'JSON' | 'XML' | 'YAML'
Response: ApiResponse<ValidationConfig>
```

### 12. 分析服务 API

#### 12.1 分析引用关系
```typescript
POST /api/ddd/analysis/references
Body: {
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  includeUnused?: boolean;  // 是否包含未使用元素
  includeOrphaned?: boolean;  // 是否包含孤立引用
  depth?: number;  // 分析深度
  includeInactive?: boolean;  // 是否包含非激活元素
}
Response: ApiResponse<ReferenceAnalysisReport>
```

#### 12.2 获取使用状态摘要
```typescript
GET /api/ddd/analysis/usage-summary
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- timeRange?: string;  // 时间范围
- groupBy?: 'elementType' | 'schema' | 'status';  // 分组方式

Response: ApiResponse<UsageSummary>
```

#### 12.3 获取未使用元素
```typescript
GET /api/ddd/analysis/unused-elements
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- elementType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';  // 元素类型
- page: number (default: 1)
- size: number (default: 20)
- sortBy?: 'name' | 'createdAt' | 'elementType' | 'priority'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<UnusedElement>
```

#### 12.4 获取孤立引用
```typescript
GET /api/ddd/analysis/orphaned-references
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- referenceType?: 'TERM' | 'ENTITY' | 'AGGREGATE' | 'DTO' | 'DOMAIN' | 'BOUNDED_CONTEXT' | 'SUBDOMAIN';  // 引用类型
- page: number (default: 1)
- size: number (default: 20)
- sortBy?: 'name' | 'createdAt' | 'referenceType' | 'severity'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<OrphanedReference>
```

#### 12.5 获取设计建议
```typescript
GET /api/ddd/analysis/design-recommendations
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- recommendationType?: 'REFACTORING' | 'OPTIMIZATION' | 'CONSISTENCY' | 'COMPLETENESS';  // 建议类型
- priority?: 'HIGH' | 'MEDIUM' | 'LOW';  // 优先级
- page: number (default: 1)
- size: number (default: 20)
- sortBy?: 'priority' | 'createdAt' | 'recommendationType' | 'impact'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<DesignRecommendation>
```

#### 12.6 获取依赖关系图
```typescript
GET /api/ddd/analysis/dependency-graph
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- elementType?: string;  // 元素类型
- depth?: number (default: 2);  // 深度
- includeInactive?: boolean;  // 是否包含非激活元素
- direction?: 'INBOUND' | 'OUTBOUND' | 'BOTH';  // 方向

Response: ApiResponse<DependencyGraph>
```

#### 12.7 获取一致性分析
```typescript
POST /api/ddd/analysis/consistency
Body: {
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  checkTypes?: ('NAMING' | 'STRUCTURE' | 'RELATIONSHIP' | 'BUSINESS_RULE')[];  // 检查类型
  strict?: boolean;  // 严格模式
  generateReport?: boolean;  // 是否生成报告
}
Response: ApiResponse<ConsistencyAnalysis>
```

#### 12.8 获取完整性分析
```typescript
POST /api/ddd/analysis/completeness
Body: {
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  checkTypes?: ('TERMS' | 'ENTITIES' | 'AGGREGATES' | 'DTOS' | 'RELATIONSHIPS')[];  // 检查类型
  includeSuggestions?: boolean;  // 是否包含建议
  generateReport?: boolean;  // 是否生成报告
}
Response: ApiResponse<CompletenessAnalysis>
```

#### 12.9 获取质量评估
```typescript
GET /api/ddd/analysis/quality-assessment
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- assessmentType?: 'OVERALL' | 'STRUCTURAL' | 'SEMANTIC' | 'CONSISTENCY';  // 评估类型
- timeRange?: string;  // 时间范围
- includeTrends?: boolean;  // 是否包含趋势

Response: ApiResponse<QualityAssessment>
```

#### 12.10 获取影响分析
```typescript
POST /api/ddd/analysis/impact
Body: {
  elementId: string;  // 必填，元素ID
  elementType: string;  // 必填，元素类型
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE';  // 必填，变更类型
  depth?: number (default: 2);  // 影响深度
  includeIndirect?: boolean;  // 是否包含间接影响
}
Response: ApiResponse<ImpactAnalysis>
```

#### 12.11 获取趋势分析
```typescript
GET /api/ddd/analysis/trends
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- metric?: 'ELEMENTS' | 'RELATIONSHIPS' | 'QUALITY' | 'USAGE';  // 指标
- timeRange?: string;  // 时间范围
- interval?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';  // 间隔
- groupBy?: 'elementType' | 'schema' | 'status';  // 分组方式

Response: ApiResponse<TrendAnalysis>
```

#### 12.12 获取性能分析
```typescript
GET /api/ddd/analysis/performance
Query Parameters:
- domainId?: string;  // 领域ID
- boundedContextId?: string;  // 限界上下文ID
- analysisType?: 'QUERY' | 'VALIDATION' | 'GENERATION' | 'OVERALL';  // 分析类型
- timeRange?: string;  // 时间范围
- includeDetails?: boolean;  // 是否包含详细信息

Response: ApiResponse<PerformanceAnalysis>
```

#### 12.13 分析关联服务 - 获取元素使用情况
```typescript
GET /api/ddd/analysis/elements/{elementId}/usage
Query Parameters:
- elementType?: string;  // 元素类型
- includeInactive?: boolean;  // 是否包含非激活引用
- depth?: number (default: 1);  // 深度

Response: ApiResponse<ElementUsage>
```

#### 12.14 分析关联服务 - 获取元素依赖关系
```typescript
GET /api/ddd/analysis/elements/{elementId}/dependencies
Query Parameters:
- direction?: 'INBOUND' | 'OUTBOUND' | 'BOTH';  // 方向
- depth?: number (default: 2);  // 深度
- includeInactive?: boolean;  // 是否包含非激活依赖

Response: ApiResponse<ElementDependencies>
```

#### 12.15 分析代码生成服务 - 生成分析报告
```typescript
POST /api/ddd/analysis/report-generation
Body: {
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  reportType?: 'SUMMARY' | 'DETAILED' | 'QUALITY' | 'TREND';  // 报告类型
  includeCharts?: boolean;  // 是否包含图表
  includeRecommendations?: boolean;  // 是否包含建议
  outputFormat?: 'PDF' | 'HTML' | 'JSON' | 'EXCEL';  // 输出格式
  timeRange?: string;  // 时间范围
}
Response: ApiResponse<AnalysisReport>
```

#### 12.16 分析配置服务 - 获取分析配置
```typescript
GET /api/ddd/analysis/config
Response: ApiResponse<AnalysisConfig>
```

#### 12.17 分析配置服务 - 更新分析配置
```typescript
PUT /api/ddd/analysis/config
Body: {
  defaultDepth?: number;  // 默认深度
  includeInactive?: boolean;  // 是否包含非激活元素
  qualityThresholds?: QualityThresholds;  // 质量阈值
  performanceThresholds?: PerformanceThresholds;  // 性能阈值
  reportTemplates?: ReportTemplate[];  // 报告模板
  notificationSettings?: NotificationSettings;  // 通知设置
}
Response: ApiResponse<AnalysisConfig>
```

#### 12.18 分析监控服务 - 获取分析监控状态
```typescript
GET /api/ddd/analysis/monitoring/status
Response: ApiResponse<AnalysisMonitoringStatus>
```

#### 12.19 分析监控服务 - 启动分析监控
```typescript
POST /api/ddd/analysis/monitoring/start
Body: {
  domainId?: string;  // 领域ID
  boundedContextId?: string;  // 限界上下文ID
  monitoringTypes?: ('QUALITY' | 'PERFORMANCE' | 'USAGE' | 'CONSISTENCY')[];  // 监控类型
  interval?: number;  // 监控间隔（分钟）
  alertThresholds?: AlertThresholds;  // 告警阈值
}
Response: ApiResponse<MonitoringResult>
```

#### 12.20 分析监控服务 - 停止分析监控
```typescript
POST /api/ddd/analysis/monitoring/stop
Body: {
  monitoringId: string;  // 必填，监控ID
}
Response: ApiResponse<void>
```
- size: number (default: 20)

Response: PaginatedResponse<OrphanedReference>
```

#### 12.5 生成设计建议
```typescript
POST /api/ddd/analysis/recommendations
Body: {
  domainId?: string;
  boundedContextId?: string;
  focusArea?: 'TERMS' | 'CONTEXTS' | 'ENTITIES' | 'DTOS' | 'MAPPINGS';
}
Response: ApiResponse<DesignRecommendation[]>
```

## 🔧 前端Services实现指导

### 1. 基础Service类

```typescript
// services/baseService.ts
export abstract class BaseService {
  protected baseUrl: string;
  protected headers: Record<string, string>;

  constructor(baseUrl: string = '/api/ddd') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: this.headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}
```

### 2. 统一语言Service

```typescript
// services/ubiquitousLanguageService.ts
export class UbiquitousLanguageService extends BaseService {
  async getUbiquitousLanguage(domainId: string): Promise<ApiResponse<UbiquitousLanguage>> {
    return this.get<UbiquitousLanguage>(`/ubiquitous-language/${domainId}`);
  }

  async updateUbiquitousLanguage(domainId: string, data: Partial<UbiquitousLanguage>): Promise<ApiResponse<UbiquitousLanguage>> {
    return this.put<UbiquitousLanguage>(`/ubiquitous-language/${domainId}`, data);
  }

  async getTerms(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    isCore?: boolean;
    usageStatus?: 'USED' | 'PARTIALLY_USED' | 'UNUSED';
  }): Promise<PaginatedResponse<BusinessTerm>> {
    return this.get<BusinessTerm[]>(`/ubiquitous-language/${domainId}/terms`, params);
  }

  async createTerm(domainId: string, term: Partial<BusinessTerm>): Promise<ApiResponse<BusinessTerm>> {
    return this.post<BusinessTerm>(`/ubiquitous-language/${domainId}/terms`, term);
  }

  async updateTerm(domainId: string, termId: string, term: Partial<BusinessTerm>): Promise<ApiResponse<BusinessTerm>> {
    return this.put<BusinessTerm>(`/ubiquitous-language/${domainId}/terms/${termId}`, term);
  }

  async deleteTerm(domainId: string, termId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/ubiquitous-language/${domainId}/terms/${termId}`);
  }

  async getAttributes(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    dataType?: string;
    isRequired?: boolean;
    usageStatus?: 'USED' | 'UNUSED';
  }): Promise<PaginatedResponse<BusinessAttribute>> {
    return this.get<BusinessAttribute[]>(`/ubiquitous-language/${domainId}/attributes`, params);
  }

  async createAttribute(domainId: string, attribute: Partial<BusinessAttribute>): Promise<ApiResponse<BusinessAttribute>> {
    return this.post<BusinessAttribute>(`/ubiquitous-language/${domainId}/attributes`, attribute);
  }
}
```

### 3. 战略设计Service

```typescript
// services/strategicDesignService.ts
export class StrategicDesignService extends BaseService {
  async getStrategicDesign(domainId: string): Promise<ApiResponse<StrategicDesign>> {
    return this.get<StrategicDesign>(`/strategic-design/${domainId}`);
  }

  async updateStrategicDesign(domainId: string, data: Partial<StrategicDesign>): Promise<ApiResponse<StrategicDesign>> {
    return this.put<StrategicDesign>(`/strategic-design/${domainId}`, data);
  }

  async getBoundedContexts(domainId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: 'CORE' | 'SUPPORTING' | 'GENERIC';
    isActive?: boolean;
    usageStatus?: 'USED' | 'UNUSED';
  }): Promise<PaginatedResponse<BoundedContext>> {
    return this.get<BoundedContext[]>(`/strategic-design/${domainId}/bounded-contexts`, params);
  }

  async createBoundedContext(domainId: string, context: Partial<BoundedContext>): Promise<ApiResponse<BoundedContext>> {
    return this.post<BoundedContext>(`/strategic-design/${domainId}/bounded-contexts`, context);
  }

  async updateBoundedContext(domainId: string, contextId: string, context: Partial<BoundedContext>): Promise<ApiResponse<BoundedContext>> {
    return this.put<BoundedContext>(`/strategic-design/${domainId}/bounded-contexts/${contextId}`, context);
  }

  async deleteBoundedContext(domainId: string, contextId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/strategic-design/${domainId}/bounded-contexts/${contextId}`);
  }
}
```

### 4. 分析Service

```typescript
// services/analysisService.ts
export class AnalysisService extends BaseService {
  async analyzeReferences(params?: {
    domainId?: string;
    boundedContextId?: string;
    includeUnused?: boolean;
    includeOrphaned?: boolean;
  }): Promise<ApiResponse<ReferenceAnalysisReport>> {
    return this.post<ReferenceAnalysisReport>('/analysis/references', params);
  }

  async getUsageSummary(params?: {
    domainId?: string;
    boundedContextId?: string;
  }): Promise<ApiResponse<UsageSummary>> {
    return this.get<UsageSummary>('/analysis/usage-summary', params);
  }

  async getUnusedElements(params?: {
    domainId?: string;
    boundedContextId?: string;
    elementType?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<UnusedElement>> {
    return this.get<UnusedElement[]>('/analysis/unused-elements', params);
  }

  async getOrphanedReferences(params?: {
    domainId?: string;
    boundedContextId?: string;
    referenceType?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<OrphanedReference>> {
    return this.get<OrphanedReference[]>('/analysis/orphaned-references', params);
  }

  async getRecommendations(params?: {
    domainId?: string;
    boundedContextId?: string;
    focusArea?: 'TERMS' | 'CONTEXTS' | 'ENTITIES' | 'DTOS' | 'MAPPINGS';
  }): Promise<ApiResponse<DesignRecommendation[]>> {
    return this.post<DesignRecommendation[]>('/analysis/recommendations', params);
  }
}
```

## 📊 使用状态管理

### 1. 使用状态类型定义

```typescript
// types/usageStatus.ts
export interface UsageStatus {
  isReferencedByStrategic?: boolean;
  isReferencedByTactical?: boolean;
  isReferencedByDto?: boolean;
  isReferencedByImplementation?: boolean;
  isReferencedByScreen?: boolean;
  lastReferencedAt?: string;
}

export type UsageStatusType = 'USED' | 'PARTIALLY_USED' | 'UNUSED';

export interface UsageSummary {
  ubiquitousLanguage: {
    totalTerms: number;
    usedTerms: number;
    totalAttributes: number;
    usedAttributes: number;
  };
  strategicDesign: {
    totalContexts: number;
    usedContexts: number;
  };
  tacticalDesign: {
    totalEntities: number;
    usedEntities: number;
  };
  dtoManagement: {
    totalDtos: number;
    usedDtos: number;
  };
}
```

### 2. 使用状态Hook

```typescript
// hooks/useUsageStatus.ts
import { useState, useEffect } from 'react';
import { analysisService } from '../services/analysisService';

export function useUsageStatus(domainId?: string, boundedContextId?: string) {
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (domainId) {
      setLoading(true);
      analysisService.getUsageSummary({ domainId, boundedContextId })
        .then(response => {
          if (response.success && response.data) {
            setUsageSummary(response.data);
          }
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [domainId, boundedContextId]);

  return { usageSummary, loading, error };
}
```

## 🎯 最佳实践

### 1. 错误处理

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: any): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    const { data } = error.response;
    return new ApiError(data.error?.code || 'UNKNOWN', data.error?.message || 'Unknown error', data.error?.details);
  }

  return new ApiError('NETWORK_ERROR', error.message || 'Network error');
}
```

### 2. 缓存策略

```typescript
// utils/cache.ts
export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}
```

### 3. 乐观更新

```typescript
// hooks/useOptimisticUpdate.ts
export function useOptimisticUpdate<T>(
  updateFn: (data: T) => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  const [loading, setLoading] = useState(false);

  const update = async (data: T, optimisticData?: T) => {
    setLoading(true);
    
    try {
      // 先更新本地状态（乐观更新）
      if (optimisticData && onSuccess) {
        onSuccess(optimisticData);
      }

      // 发送请求
      const response = await updateFn(data);
      
      if (response.success && response.data) {
        onSuccess?.(response.data);
      } else {
        throw new Error(response.error?.message || 'Update failed');
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
```

## 📋 总结

这个API定义文件提供了：

### 1. 完整的CRUD操作体系
- **项目元数据管理**：项目基本信息的完整CRUD
- **领域管理**：领域信息、利益相关者、业务目标、度量指标的完整CRUD
- **统一语言管理**：术语、属性、规则、关系的完整CRUD
- **战略设计管理**：限界上下文、子领域、上下文映射、领域事件的完整CRUD
- **战术设计管理**：聚合、实体、值对象、领域服务、仓储、工厂、枚举的完整CRUD，包括方法和方法参数的完整管理
- **DTO管理**：DTO、DTO属性、DTO映射的完整CRUD

### 2. 全面的关联服务API
- **术语关联服务**：术语与领域、限界上下文、聚合、实体、DTO、屏幕的关联
- **限界上下文关联服务**：上下文与术语、聚合、DTO、屏幕的关联
- **聚合关联服务**：聚合与术语、DTO、屏幕的关联
- **实体关联服务**：实体与术语、属性、DTO、屏幕的关联
- **DTO关联服务**：DTO与术语、实体、聚合、屏幕的关联

### 3. 高级功能支持
- **分页和搜索**：支持大数据量的分页查询和高级搜索
- **引用关系分析**：自动发现和维护引用关系
- **使用状态管理**：跟踪元素的使用情况和使用状态
- **批量操作**：支持批量更新关联关系
- **错误处理**：统一的错误处理机制
- **缓存策略**：提高性能的缓存机制
- **乐观更新**：提升用户体验的乐观更新

### 4. API设计顺序说明

API接口按照DDD标准流程设计：

1. **项目元数据管理** - 管理项目基本信息
2. **统一语言管理** - DDD的基础，定义业务术语、属性和规则
3. **领域管理** - 定义业务领域和子领域
4. **战略设计** - 定义限界上下文和上下文映射
5. **DTO管理** - 定义数据传输对象，为战术设计提供数据基础
6. **战术设计** - 定义聚合、实体、值对象、领域服务（使用DTO）
7. **实现映射** - 映射到技术实现
8. **屏幕定义** - 定义用户界面
9. **分析服务** - 提供设计分析和建议

**关键设计原则：**
- ✅ **DTO在战术设计之前**：确保战术设计中的方法参数和返回值有可用的DTO
- ✅ **聚合命令/查询使用DTO**：聚合的命令和查询都引用预定义的DTO
- ✅ **领域服务方法使用DTO**：领域服务方法的参数和返回值使用DTO
- ✅ **实体方法使用DTO**：实体方法的参数和返回值可以使用DTO

### 5. 渐进式开发支持

虽然API按DDD流程顺序定义，但实际使用时支持渐进式开发：
- 允许在任何阶段创建数据
- 系统自动发现和维护引用关系
- 通过界面提醒辅助发现问题
- 不强制验证，避免复杂的阶段限制

### 6. API完整性保证

每个模块都包含：
- ✅ **完整的CRUD操作**：GET、POST、PUT、DELETE
- ✅ **单个和列表查询**：支持获取单个元素和分页列表
- ✅ **关联服务API**：支持跨模块的关联关系管理
- ✅ **批量操作**：支持批量更新和关联操作
- ✅ **状态管理**：支持使用状态跟踪和查询
- ✅ **搜索和过滤**：支持多维度搜索和过滤
- ✅ **方法参数管理**：支持方法参数的完整生命周期管理，包括与业务属性和DTO的关联

### 7. 方法参数与DTO关系处理

API设计正确处理了方法参数与DTO的关系：

- ✅ **DTO在DDD中的完整作用**：领域服务、实体、聚合、应用服务、仓储接口的数据传输
- ✅ **参数来源优先级**：业务属性 > DTO属性 > 直接类型定义
- ✅ **DTO属性设计**：DTO属性优先引用业务属性，支持DTO间引用，避免重复定义
- ✅ **数据转换机制**：系统自动将业务属性转换为具体数据类型
- ✅ **验证规则继承**：DTO属性和方法参数继承业务属性的验证规则
- ✅ **约束条件传递**：业务属性的约束条件自动传递给DTO属性和方法参数
- ✅ **方法返回值管理**：支持方法返回值的完整管理，包括集合类型
- ✅ **聚合命令查询**：支持聚合的命令DTO和查询DTO管理
- ✅ **领域一致性**：领域服务、实体、聚合优先使用业务属性
- ✅ **跨边界处理**：应用服务可以使用DTO属性处理跨边界数据

这个设计考虑了DDD的实际使用场景，支持渐进式开发，通过自动发现和界面提醒来辅助设计过程，而不是强制验证。每个模块都提供了完整的API覆盖，确保前端开发时能够获得所有必要的功能支持。
