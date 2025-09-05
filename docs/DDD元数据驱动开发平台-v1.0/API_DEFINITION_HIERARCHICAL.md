# DDD元数据驱动开发平台 - 分层API定义文档

## 📋 概述

本文档采用分层结构重新组织DDD元数据驱动开发平台的API接口，提高可读性和维护性。

### 🏗️ API分层架构

```
/api/ddd/
├── /projects/                    # 项目元数据管理
├── /domain/                      # 领域管理
├── /ubiquitous-language/        # 统一语言管理
├── /strategic-design/           # 战略设计管理
├── /data-transfer-objects/      # DTO管理
├── /tactical-design/            # 战术设计管理
├── /implementation-mapping/     # 实现映射管理
├── /screen-definition/          # 屏幕定义管理
├── /amis-screen-definition/     # amis屏幕管理
├── /relationships/              # 关系管理
├── /validation/                 # 验证管理
└── /analysis/                   # 分析服务
```

## 📚 详细API文档

### 1. 项目元数据管理 API
- [项目元数据管理详细API](./api-details/project-metadata-api.md)

### 2. 领域管理 API
- [领域管理详细API](./api-details/domain-api.md)

### 3. 统一语言管理 API
- [统一语言管理详细API](./api-details/ubiquitous-language-api.md)

### 4. 战略设计管理 API
- [战略设计管理详细API](./api-details/strategic-design-api.md)

### 5. DTO管理 API
- [DTO管理详细API](./api-details/data-transfer-objects-api.md)

### 6. 战术设计管理 API
- [战术设计管理详细API](./api-details/tactical-design-api.md)

### 7. 实现映射管理 API
- [实现映射管理详细API](./api-details/implementation-mapping-api.md)

### 8. 屏幕定义管理 API
- [屏幕定义管理详细API](./api-details/screen-definition-api.md)

### 9. amis屏幕管理 API
- [amis屏幕管理详细API](./api-details/amis-screen-definition-api.md)

### 10. 关系管理 API
- [关系管理详细API](./api-details/relationships-api.md)

### 11. 验证管理 API
- [验证管理详细API](./api-details/validation-api.md)

### 12. 分析服务 API
- [分析服务详细API](./api-details/analysis-api.md)

## 🔧 通用定义

### 响应格式
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

### 通用查询参数
```typescript
interface BaseQueryParams {
  page?: number;        // 页码，默认1
  size?: number;         // 每页大小，默认20
  search?: string;       // 搜索关键词
  sortBy?: string;       // 排序字段
  sortOrder?: 'ASC' | 'DESC';  // 排序方向
  isActive?: boolean;    // 是否激活
}
```

## 📖 使用指南

### 1. 快速开始
1. 首先创建项目元数据
2. 定义统一语言
3. 进行战略设计
4. 创建DTO
5. 进行战术设计
6. 配置实现映射

### 2. 最佳实践
- 遵循DDD设计流程
- 优先使用业务属性引用
- 合理使用DTO组合
- 及时更新引用关系

### 3. 错误处理
- 所有API都返回统一的错误格式
- 错误码采用分层结构：`MODULE.SUBMODULE.ERROR_TYPE`
- 详细错误信息包含在`details`字段中
