# DDD元数据驱动开发平台 - API实现总结

## 📋 概述

本文档总结了DDD元数据驱动开发平台的API实现，包括后端API定义和前端服务实现。

## 🏗️ 架构设计

### 1. 核心设计理念

- **后向引用自动发现**：系统自动发现和维护引用关系，避免复杂的验证阶段
- **渐进式开发**：允许在任何阶段创建数据，不受时序限制
- **界面提醒机制**：通过视觉反馈辅助发现问题，而不是强制验证
- **统一API接口**：提供一致的API设计和服务实现

### 2. 技术栈

- **前端**：React + TypeScript + amis
- **API层**：RESTful API + 统一响应格式
- **状态管理**：React Hooks + 自定义Hook
- **UI组件**：自定义组件 + amis组件

## 📡 API接口设计

### 1. 统一响应格式

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

### 2. API层次结构

```
/api/ddd/
├── /metadata/          # 元数据管理
├── /domain/            # 领域管理
├── /ubiquitous-language/  # 统一语言管理
├── /strategic-design/     # 战略设计管理
├── /tactical-design/      # 战术设计管理
├── /data-transfer-objects/ # DTO管理
├── /implementation-mapping/ # 实现映射管理
├── /screen-definition/      # 屏幕定义管理
├── /amis-screen-definition/ # amis屏幕管理
├── /relationships/         # 关系管理
├── /validation/           # 验证管理
└── /analysis/             # 分析服务
```

### 3. 核心API模块

#### 3.1 统一语言管理
- `GET /api/ddd/ubiquitous-language/{domainId}` - 获取统一语言数据
- `PUT /api/ddd/ubiquitous-language/{domainId}` - 创建/更新统一语言
- `GET /api/ddd/ubiquitous-language/{domainId}/terms` - 获取业务术语列表
- `POST /api/ddd/ubiquitous-language/{domainId}/terms` - 创建业务术语
- `PUT /api/ddd/ubiquitous-language/{domainId}/terms/{termId}` - 更新业务术语
- `DELETE /api/ddd/ubiquitous-language/{domainId}/terms/{termId}` - 删除业务术语

#### 3.2 战略设计管理
- `GET /api/ddd/strategic-design/{domainId}` - 获取战略设计数据
- `PUT /api/ddd/strategic-design/{domainId}` - 创建/更新战略设计
- `GET /api/ddd/strategic-design/{domainId}/bounded-contexts` - 获取限界上下文列表
- `POST /api/ddd/strategic-design/{domainId}/bounded-contexts` - 创建限界上下文
- `PUT /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}` - 更新限界上下文
- `DELETE /api/ddd/strategic-design/{domainId}/bounded-contexts/{contextId}` - 删除限界上下文

#### 3.3 分析服务
- `POST /api/ddd/analysis/references` - 分析引用关系
- `GET /api/ddd/analysis/usage-summary` - 获取使用状态摘要
- `GET /api/ddd/analysis/unused-elements` - 获取未使用元素
- `GET /api/ddd/analysis/orphaned-references` - 获取孤立引用
- `POST /api/ddd/analysis/recommendations` - 生成设计建议

## 🔧 前端服务实现

### 1. 基础Service类

```typescript
export abstract class BaseService {
  protected baseUrl: string;
  protected headers: Record<string, string>;

  constructor(baseUrl: string = '/api/ddd') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>>;
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>>;
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}
```

### 2. 专用服务类

#### 2.1 UbiquitousLanguageService
- `getUbiquitousLanguage(domainId: string)` - 获取统一语言数据
- `updateUbiquitousLanguage(domainId: string, data: any)` - 更新统一语言数据
- `getTerms(domainId: string, params?: any)` - 获取业务术语列表
- `createTerm(domainId: string, term: any)` - 创建业务术语
- `updateTerm(domainId: string, termId: string, term: any)` - 更新业务术语
- `deleteTerm(domainId: string, termId: string)` - 删除业务术语

#### 2.2 StrategicDesignService
- `getStrategicDesign(domainId: string)` - 获取战略设计数据
- `updateStrategicDesign(domainId: string, data: any)` - 更新战略设计数据
- `getBoundedContexts(domainId: string, params?: any)` - 获取限界上下文列表
- `createBoundedContext(domainId: string, context: any)` - 创建限界上下文
- `updateBoundedContext(domainId: string, contextId: string, context: any)` - 更新限界上下文
- `deleteBoundedContext(domainId: string, contextId: string)` - 删除限界上下文

#### 2.3 AnalysisService
- `analyzeReferences(params?: any)` - 分析引用关系
- `getUsageSummary(params?: any)` - 获取使用状态摘要
- `getUnusedElements(params?: any)` - 获取未使用元素
- `getOrphanedReferences(params?: any)` - 获取孤立引用
- `getRecommendations(params?: any)` - 获取设计建议

### 3. React Hooks

#### 3.1 useUsageStatus
```typescript
export function useUsageStatus(options: UseUsageStatusOptions = {}): UseUsageStatusReturn {
  // 获取使用状态摘要
  // 提供使用状态类型判断
  // 提供颜色和文本获取
  // 支持自动刷新
}
```

#### 3.2 useUnusedElements
```typescript
export function useUnusedElements(options: UseUsageStatusOptions = {}) {
  // 获取未使用元素列表
  // 支持分页和搜索
  // 提供刷新和分页控制
}
```

#### 3.3 useOrphanedReferences
```typescript
export function useOrphanedReferences(options: UseUsageStatusOptions = {}) {
  // 获取孤立引用列表
  // 支持分页和搜索
  // 提供刷新和分页控制
}
```

#### 3.4 useDesignRecommendations
```typescript
export function useDesignRecommendations(options: UseUsageStatusOptions & {
  focusArea?: 'TERMS' | 'CONTEXTS' | 'ENTITIES' | 'DTOS' | 'MAPPINGS';
} = {}) {
  // 获取设计建议
  // 支持按焦点区域过滤
  // 提供刷新功能
}
```

### 4. UI组件

#### 4.1 UsageStatusIndicator
```typescript
export const UsageStatusIndicator: React.FC<UsageStatusIndicatorProps> = ({
  usageStatus,
  domainId,
  boundedContextId,
  showTooltip = true,
  size = 'medium',
  className = '',
  onClick,
}) => {
  // 显示使用状态指示器
  // 支持工具提示
  // 支持点击事件
  // 支持不同尺寸
}
```

#### 4.2 UsageStatusBadge
```typescript
export const UsageStatusBadge: React.FC<UsageStatusBadgeProps> = ({
  statusType,
  size = 'medium',
  className = '',
  showText = true,
}) => {
  // 显示使用状态徽章
  // 支持不同状态类型
  // 支持不同尺寸
  // 支持显示/隐藏文本
}
```

#### 4.3 UsageStatsCard
```typescript
export const UsageStatsCard: React.FC<UsageStatsCardProps> = ({
  title,
  total,
  used,
  unused,
  partiallyUsed = 0,
  className = '',
  onClick,
}) => {
  // 显示使用统计卡片
  // 支持百分比显示
  // 支持进度条
  // 支持点击事件
}
```

#### 4.4 UsageOverview
```typescript
export const UsageOverview: React.FC<UsageOverviewProps> = ({
  usageSummary,
  domainId,
  boundedContextId,
  className = '',
}) => {
  // 显示使用状态概览
  // 包含所有模块的统计
  // 支持响应式布局
}
```

## 📊 使用状态管理

### 1. 使用状态类型

```typescript
export interface UsageStatus {
  isReferencedByStrategic?: boolean;
  isReferencedByTactical?: boolean;
  isReferencedByDto?: boolean;
  isReferencedByImplementation?: boolean;
  isReferencedByScreen?: boolean;
  lastReferencedAt?: string;
}

export type UsageStatusType = 'USED' | 'PARTIALLY_USED' | 'UNUSED';
```

### 2. 使用状态摘要

```typescript
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

### 3. 状态判断逻辑

```typescript
const getUsageStatusType = (usageStatus: any): UsageStatusType => {
  if (!usageStatus) return 'UNUSED';

  const referenceCount = [
    usageStatus.isReferencedByStrategic,
    usageStatus.isReferencedByTactical,
    usageStatus.isReferencedByDto,
    usageStatus.isReferencedByImplementation,
    usageStatus.isReferencedByScreen
  ].filter(Boolean).length;

  if (referenceCount === 0) return 'UNUSED';
  if (referenceCount === 1) return 'PARTIALLY_USED';
  return 'USED';
};
```

## 🎯 最佳实践

### 1. 错误处理

```typescript
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
export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void;
  get(key: string): any | null;
  clear(): void;
}
```

### 3. 乐观更新

```typescript
export function useOptimisticUpdate<T>(
  updateFn: (data: T) => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  // 先更新本地状态
  // 发送请求
  // 处理成功/失败
}
```

## 📋 文件结构

```
apps/ddd-amis-web/src/
├── services/
│   ├── dddApiService.ts          # 统一API服务
│   ├── dddPlatformService.ts    # 平台服务（已集成API服务）
│   ├── dddParser.ts             # DDD解析器
│   ├── dddTemplates.ts          # DDD模板
│   └── ...                      # 其他服务
├── hooks/
│   └── useUsageStatus.ts        # 使用状态管理Hook
├── components/
│   └── UsageStatusIndicator.tsx # 使用状态指示器组件
└── types/
    └── usageStatus.ts           # 使用状态类型定义
```

## 🚀 使用示例

### 1. 基本使用

```typescript
import { ubiquitousLanguageService } from '../services/dddApiService';
import { useUsageStatus } from '../hooks/useUsageStatus';
import { UsageStatusIndicator } from '../components/UsageStatusIndicator';

// 获取统一语言数据
const response = await ubiquitousLanguageService.getUbiquitousLanguage('domain_1');

// 使用Hook获取使用状态
const { usageSummary, loading, error } = useUsageStatus({ domainId: 'domain_1' });

// 使用组件显示状态
<UsageStatusIndicator 
  usageStatus={term.usageStatus}
  domainId="domain_1"
  showTooltip={true}
/>
```

### 2. 完整工作流

```typescript
// 1. 创建术语
const term = await ubiquitousLanguageService.createTerm('domain_1', {
  name: '订单',
  programmingName: 'Order',
  description: '客户购买商品或服务的记录',
  category: 'DOMAIN_ENTITY'
});

// 2. 在战略设计中使用术语
const context = await strategicDesignService.createBoundedContext('domain_1', {
  name: '订单管理',
  description: '订单相关的业务上下文',
  ubiquitousLanguage: [term.id]
});

// 3. 系统自动更新使用状态
const analysis = await analysisService.analyzeReferences({ domainId: 'domain_1' });

// 4. 界面显示使用状态
const { usageSummary } = useUsageStatus({ domainId: 'domain_1' });
```

## 📈 优势总结

### 1. 设计优势
- **简洁性**：不需要复杂的验证阶段，逻辑更简单
- **灵活性**：允许在任何阶段创建数据，不受时序限制
- **自动化**：系统自动发现和维护引用关系
- **辅助性**：通过界面提醒帮助发现问题，而不是强制验证
- **自然性**：符合DDD设计的自然流程

### 2. 技术优势
- **类型安全**：完整的TypeScript类型定义
- **可复用性**：模块化的服务和组件设计
- **可扩展性**：易于添加新的API和功能
- **性能优化**：支持缓存和乐观更新
- **用户体验**：响应式设计和交互反馈

### 3. 开发优势
- **开发效率**：统一的API接口和服务实现
- **维护性**：清晰的代码结构和文档
- **测试性**：易于编写单元测试和集成测试
- **部署性**：支持不同的部署环境
- **协作性**：标准化的开发流程和规范

这个API实现完全符合您的理解，提供了简洁优雅的解决方案，支持渐进式开发，通过自动发现和界面提醒来辅助设计过程！
