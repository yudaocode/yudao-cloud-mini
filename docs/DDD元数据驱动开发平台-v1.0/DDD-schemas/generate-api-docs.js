#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// API文档模板
const apiTemplates = {
  'strategic-design': {
    title: '战略设计管理 API',
    description: '战略设计管理API提供限界上下文、子领域、上下文映射、领域事件等管理功能。',
    structure: `
/api/ddd/strategic-design/
├── /{boundedContextId}              # 限界上下文基本信息
├── /{boundedContextId}/subdomains   # 子领域
├── /{boundedContextId}/context-mappings # 上下文映射
├── /{boundedContextId}/domain-events # 领域事件
├── /{boundedContextId}/associations # 关联服务
└── /{boundedContextId}/analysis     # 分析服务`
  },
  'data-transfer-objects': {
    title: 'DTO管理 API',
    description: 'DTO管理API提供数据传输对象的管理功能，包括DTO、DTO属性、DTO映射等。',
    structure: `
/api/ddd/data-transfer-objects/
├── /{domainId}                      # DTO基本信息
├── /{domainId}/dtos                 # DTO对象
├── /{domainId}/attributes           # DTO属性
├── /{domainId}/mappings             # DTO映射
└── /{domainId}/associations         # 关联服务`
  },
  'tactical-design': {
    title: '战术设计管理 API',
    description: '战术设计管理API提供聚合、实体、值对象、领域服务、仓储、工厂、枚举、防腐层等管理功能。',
    structure: `
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
└── /{boundedContextId}/analysis     # 分析服务`
  },
  'implementation-mapping': {
    title: '实现映射管理 API',
    description: '实现映射管理API提供架构映射、持久化映射、集成映射、API映射、事件映射、安全映射、监控映射等管理功能。',
    structure: `
/api/ddd/implementation-mapping/
├── /{domainId}                      # 实现映射基本信息
├── /{domainId}/architecture         # 架构映射
├── /{domainId}/persistence          # 持久化映射
├── /{domainId}/integration          # 集成映射
├── /{domainId}/api-mappings         # API映射
├── /{domainId}/event-mappings       # 事件映射
├── /{domainId}/security-mappings    # 安全映射
├── /{domainId}/monitoring-mappings  # 监控映射
└── /{domainId}/analysis             # 分析服务`
  },
  'screen-definition': {
    title: '屏幕定义管理 API',
    description: '屏幕定义管理API提供屏幕、组件、端点映射、屏幕DTO映射、布局、主题、权限等管理功能。',
    structure: `
/api/ddd/screen-definition/
├── /{domainId}                      # 屏幕定义基本信息
├── /{domainId}/screens              # 屏幕
├── /{domainId}/components           # 组件
├── /{domainId}/endpoint-mappings    # 端点映射
├── /{domainId}/screen-dto-mappings  # 屏幕DTO映射
├── /{domainId}/layouts              # 布局
├── /{domainId}/themes               # 主题
├── /{domainId}/permissions          # 权限
└── /{domainId}/analysis             # 分析服务`
  },
  'amis-screen-definition': {
    title: 'amis屏幕管理 API',
    description: 'amis屏幕管理API提供amis屏幕、组件、模型映射、全局配置、模板、主题、权限等管理功能。',
    structure: `
/api/ddd/amis-screen-definition/
├── /{domainId}                      # amis屏幕定义基本信息
├── /{domainId}/screens              # amis屏幕
├── /{domainId}/components           # amis组件
├── /{domainId}/model-mappings       # 模型映射
├── /{domainId}/global-config        # 全局配置
├── /{domainId}/templates            # 模板
├── /{domainId}/themes               # 主题
├── /{domainId}/permissions          # 权限
└── /{domainId}/analysis             # 分析服务`
  },
  'relationships': {
    title: '关系管理 API',
    description: '关系管理API提供各种DDD元素之间的关系管理功能。',
    structure: `
/api/ddd/relationships/
├── /{domainId}                      # 关系管理基本信息
├── /{domainId}/relationships        # 关系
├── /{domainId}/constraints          # 约束
└── /{domainId}/analysis             # 分析服务`
  },
  'validation': {
    title: '验证管理 API',
    description: '验证管理API提供验证配置、规则、结果等管理功能。',
    structure: `
/api/ddd/validation/
├── /{domainId}                      # 验证管理基本信息
├── /{domainId}/configurations       # 验证配置
├── /{domainId}/rules                # 验证规则
├── /{domainId}/results              # 验证结果
└── /{domainId}/analysis             # 分析服务`
  },
  'analysis': {
    title: '分析服务 API',
    description: '分析服务API提供引用分析、使用摘要、未使用元素、孤立引用、设计建议、依赖图、一致性分析、完整性分析、质量评估、影响分析、趋势分析、性能分析等功能。',
    structure: `
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
└── /{domainId}/performance-analysis # 性能分析`
  }
};

// 生成API文档的函数
function generateApiDoc(moduleName, template) {
  const content = `# ${template.title}

## 📋 概述

${template.description}

## 🏗️ API结构

\`\`\`
${template.structure}
\`\`\`

## 📚 API详情

### 1. 基本信息管理

#### 1.1 获取基本信息
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}
Response: ApiResponse<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Info>
\`\`\`

#### 1.2 创建/更新基本信息
\`\`\`typescript
PUT /api/ddd/${moduleName}/{domainId}
Body: {
  // 根据具体模块定义
}
Response: ApiResponse<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Info>
\`\`\`

### 2. 核心功能管理

#### 2.1 获取列表
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}/items
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- isActive?: boolean
- sortBy?: 'name' | 'createdAt' | 'updatedAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Item>
\`\`\`

#### 2.2 获取单个项目
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}/items/{itemId}
Response: ApiResponse<Item>
\`\`\`

#### 2.3 创建项目
\`\`\`typescript
POST /api/ddd/${moduleName}/{domainId}/items
Body: {
  name: string;                      // 必填，名称
  description: string;               // 必填，描述
  // 其他字段根据具体模块定义
  isActive?: boolean;                // 是否激活
}
Response: ApiResponse<Item>
\`\`\`

#### 2.4 更新项目
\`\`\`typescript
PUT /api/ddd/${moduleName}/{domainId}/items/{itemId}
Body: {
  name?: string;
  description?: string;
  // 其他字段根据具体模块定义
  isActive?: boolean;
}
Response: ApiResponse<Item>
\`\`\`

#### 2.5 删除项目
\`\`\`typescript
DELETE /api/ddd/${moduleName}/{domainId}/items/{itemId}
Response: ApiResponse<void>
\`\`\`

### 3. 关联服务

#### 3.1 获取关联信息
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}/associations
Response: ApiResponse<Association[]>
\`\`\`

#### 3.2 更新关联信息
\`\`\`typescript
PUT /api/ddd/${moduleName}/{domainId}/associations
Body: {
  // 关联数据
}
Response: ApiResponse<UpdateAssociationsResult>
\`\`\`

### 4. 分析服务

#### 4.1 获取分析报告
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}/analysis/report
Response: ApiResponse<AnalysisReport>
\`\`\`

#### 4.2 获取统计信息
\`\`\`typescript
GET /api/ddd/${moduleName}/{domainId}/analysis/statistics
Response: ApiResponse<Statistics>
\`\`\`

## 📊 数据模型

### ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Info
\`\`\`typescript
interface ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Info {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

### Item
\`\`\`typescript
interface Item {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

### Association
\`\`\`typescript
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
\`\`\`

### AnalysisReport
\`\`\`typescript
interface AnalysisReport {
  id: string;
  type: string;
  data: any;
  generatedAt: string;
}
\`\`\`

### Statistics
\`\`\`typescript
interface Statistics {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  lastUpdated: string;
}
\`\`\`

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| ${moduleName.toUpperCase()}.NOT_FOUND | 数据不存在 |
| ${moduleName.toUpperCase()}.INVALID_DATA | 数据无效 |
| ${moduleName.toUpperCase()}.DUPLICATE_NAME | 名称重复 |
| ${moduleName.toUpperCase()}.ACCESS_DENIED | 访问被拒绝 |
| ${moduleName.toUpperCase()}.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建项目
\`\`\`typescript
const newItem = {
  name: "示例项目",
  description: "这是一个示例项目",
  isActive: true
};

const response = await fetch('/api/ddd/${moduleName}/domain_001/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newItem)
});
\`\`\`

### 获取分析报告
\`\`\`typescript
const response = await fetch('/api/ddd/${moduleName}/domain_001/analysis/report');
const report = await response.json();
console.log('分析报告:', report.data);
\`\`\`
`;

  return content;
}

// 生成所有API文档
function generateAllApiDocs() {
  const apiDetailsDir = path.join(__dirname, 'api-details');
  
  // 确保目录存在
  if (!fs.existsSync(apiDetailsDir)) {
    fs.mkdirSync(apiDetailsDir, { recursive: true });
  }

  // 生成每个模块的API文档
  Object.entries(apiTemplates).forEach(([moduleName, template]) => {
    const fileName = `${moduleName}-api.md`;
    const filePath = path.join(apiDetailsDir, fileName);
    
    const content = generateApiDoc(moduleName, template);
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ 生成 ${fileName}`);
  });

  console.log('\n🎉 所有API文档生成完成！');
}

// 运行脚本
generateAllApiDocs();
