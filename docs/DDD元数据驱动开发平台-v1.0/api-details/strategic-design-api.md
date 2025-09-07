# 战略设计管理 API

## 📋 概述

战略设计管理API基于DDD战略设计最佳实践，提供限界上下文、子领域、上下文映射、领域事件等全生命周期管理功能。参考Netflix、Uber等大厂微服务架构设计经验。

## 🎯 分层Schema架构 v2.0

### Schema架构设计

本API遵循企业级分层Schema架构模式，提供完整的CRUD操作支持：

### Schema文件组织
```
object-jsonschemas/strategic-design.schemas/
├── fields/                         # 字段级Schema定义
│   ├── common-fields.schema.json   # 通用字段定义
│   ├── bounded-context-fields.schema.json  # 限界上下文字段
│   └── subdomain-fields.schema.json        # 子领域字段
├── full/                          # 完整对象Schema
│   ├── strategic-design.schema.json        # 完整战略设计对象
│   ├── bounded-context.schema.json         # 完整限界上下文对象
│   └── subdomain.schema.json              # 完整子领域对象
└── operations/                    # 操作级Schema
    ├── patch/                     # 部分更新操作
    │   └── strategic-design-patch.schema.json
    ├── update/                    # 完整更新操作
    │   └── strategic-design-update.schema.json
    └── delete/                    # 删除操作
        └── strategic-design-delete.schema.json
```

### CRUD操作映射
- **CREATE/READ**: 使用 `full/*.schema.json` 完整对象Schema
- **UPDATE (PATCH)**: 使用 `operations/patch/*.schema.json` 部分更新Schema  
- **UPDATE (PUT)**: 使用 `operations/update/*.schema.json` 完整更新Schema
- **DELETE**: 使用 `operations/delete/*.schema.json` 删除操作Schema

## 🏗️ API架构设计

### 1. 分层架构
```
/api/ddd/strategic-design/
├── /domains/                        # 领域管理
│   ├── /{domainId}                 # 领域基本信息
│   ├── /{domainId}/stakeholders    # 利益相关者管理
│   ├── /{domainId}/business-goals  # 业务目标管理
│   ├── /{domainId}/metrics         # 领域度量指标
│   ├── /{domainId}/contexts        # 限界上下文
│   ├── /{domainId}/subdomains      # 子领域
│   ├── /{domainId}/mappings        # 上下文映射
│   ├── /{domainId}/events          # 领域事件
│   └── /{domainId}/analysis        # 战略分析
├── /contexts/                       # 上下文详情
│   ├── /{contextId}/details        # 上下文详细信息
│   ├── /{contextId}/capabilities   # 业务能力
│   ├── /{contextId}/services       # 领域服务
│   ├── /{contextId}/integrations   # 集成关系
│   └── /{contextId}/governance     # 治理信息
├── /mappings/                       # 映射关系
│   ├── /patterns                   # 映射模式
│   ├── /validation                 # 映射验证
│   └── /optimization               # 映射优化
└── /governance/                     # 战略治理
    ├── /compliance                 # 合规检查
    ├── /metrics                    # 战略指标
    └── /recommendations            # 优化建议
```

### 2. 核心概念

#### 2.1 Domain（领域）
- **Core Domain**: 核心域
- **Supporting Domain**: 支撑域  
- **Generic Domain**: 通用域

#### 2.2 Bounded Context（限界上下文）
- **Business Capabilities**: 业务能力
- **Team Topology**: 团队拓扑
- **Data Ownership**: 数据归属

#### 2.3 Context Mapping（上下文映射）
- **Partnership**: 合作关系
- **Customer-Supplier**: 客户供应商
- **Conformist**: 遵循者
- **Anti-Corruption Layer**: 防腐层

## 📚 API接口定义

### 1. 领域管理 API

#### 1.1 获取领域列表
```http
GET /api/ddd/strategic-design/domains
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'
- complexity?: 'LOW' | 'MEDIUM' | 'HIGH'
- maturity?: 'CONCEPT' | 'DRAFT' | 'STABLE' | 'LEGACY'
- owner?: string
- sortBy?: 'name' | 'type' | 'complexity' | 'createdAt'
- sortOrder?: 'ASC' | 'DESC'

Response: PaginatedResponse<Domain>
```

#### 1.2 创建领域
```http
POST /api/ddd/strategic-design/domains
Content-Type: application/json

{
  "domainId": "ecommerce-order",
  "name": "订单管理领域",
  "description": "负责订单全生命周期管理",
  "type": "CORE",
  "complexity": "HIGH",
  "businessValue": {
    "revenue_impact": "HIGH",
    "customer_satisfaction": "CRITICAL",
    "competitive_advantage": "HIGH"
  },
  "stakeholders": [
    {
      "role": "DOMAIN_EXPERT",
      "name": "张三",
      "email": "zhangsan@company.com"
    }
  ],
  "metrics": {
    "business_metrics": ["order_conversion_rate", "average_order_value"],
    "technical_metrics": ["service_availability", "response_time"]
  }
}

Response: ApiResponse<Domain>
```

#### 1.3 获取领域详情
```http
GET /api/ddd/strategic-design/domains/{domainId}
Response: ApiResponse<DomainDetail>
```

#### 1.4 更新领域信息
```http
PUT /api/ddd/strategic-design/domains/{domainId}
Content-Type: application/json

{
  "name": "订单管理领域（更新）",
  "description": "负责订单全生命周期管理，包括订单创建、支付、履约、售后",
  "type": "CORE",
  "complexity": "HIGH",
  "priority": 1,
  "businessValue": {
    "revenue_impact": "HIGH",
    "customer_satisfaction": "CRITICAL"
  }
}
```
#### 1.5 删除领域
```http
DELETE /api/ddd/strategic-design/domains/{domainId}
Response: ApiResponse<void>
```

### 2. 利益相关者管理 API

#### 2.1 获取利益相关者列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/stakeholders
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER'
- influence?: 'LOW' | 'MEDIUM' | 'HIGH'
- isActive?: boolean

Response: PaginatedResponse<Stakeholder>
```

#### 2.2 获取单个利益相关者
```http
GET /api/ddd/strategic-design/domains/{domainId}/stakeholders/{stakeholderId}
Response: ApiResponse<Stakeholder>
```

#### 2.3 创建利益相关者
```http
POST /api/ddd/strategic-design/domains/{domainId}/stakeholders
Content-Type: application/json

{
  "name": "产品经理-王五",
  "type": "BUSINESS_USER",
  "description": "负责订单产品规划和需求定义",
  "contact": {
    "email": "wangwu@company.com",
    "phone": "13800138000"
  },
  "influence": "HIGH",
  "responsibilities": ["需求分析", "产品规划", "用户体验设计"]
}

Response: ApiResponse<Stakeholder>
```

#### 2.4 更新利益相关者
```http
PUT /api/ddd/strategic-design/domains/{domainId}/stakeholders/{stakeholderId}
Content-Type: application/json

{
  "influence": "MEDIUM",
  "responsibilities": ["需求分析", "产品规划"]
}

Response: ApiResponse<Stakeholder>
```

#### 2.5 删除利益相关者
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/stakeholders/{stakeholderId}
Response: ApiResponse<void>
```

### 3. 业务目标管理 API

#### 3.1 获取业务目标列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/business-goals
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- priority?: 'LOW' | 'MEDIUM' | 'HIGH'
- status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

Response: PaginatedResponse<BusinessGoal>
```

#### 3.2 获取单个业务目标
```http
GET /api/ddd/strategic-design/domains/{domainId}/business-goals/{goalId}
Response: ApiResponse<BusinessGoal>
```

#### 3.3 创建业务目标
```http
POST /api/ddd/strategic-design/domains/{domainId}/business-goals
Content-Type: application/json

{
  "name": "提升订单转化率",
  "description": "通过优化订单流程，提升用户订单转化率至85%",
  "priority": "HIGH",
  "targetDate": "2025-12-31",
  "successCriteria": [
    "订单转化率达到85%",
    "订单放弃率降低至15%以下",
    "用户满意度评分达到4.5分以上"
  ],
  "kpis": [
    {
      "name": "订单转化率",
      "target": 85,
      "unit": "%"
    }
  ]
}

Response: ApiResponse<BusinessGoal>
```

#### 3.4 更新业务目标
```http
PUT /api/ddd/strategic-design/domains/{domainId}/business-goals/{goalId}
Content-Type: application/json

{
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "successCriteria": [
    "订单转化率达到80%",
    "订单放弃率降低至20%以下"
  ]
}

Response: ApiResponse<BusinessGoal>
```

#### 3.5 删除业务目标
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/business-goals/{goalId}
Response: ApiResponse<void>
```

### 4. 领域度量指标管理 API

#### 4.1 获取度量指标列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/metrics
Query Parameters:
- category?: 'BUSINESS' | 'TECHNICAL' | 'QUALITY'
- type?: 'PERFORMANCE' | 'AVAILABILITY' | 'CONVERSION'

Response: PaginatedResponse<DomainMetric>
```

#### 4.2 获取单个度量指标
```http
GET /api/ddd/strategic-design/domains/{domainId}/metrics/{metricId}
Response: ApiResponse<DomainMetric>
```

#### 4.3 创建度量指标
```http
POST /api/ddd/strategic-design/domains/{domainId}/metrics
Content-Type: application/json

{
  "name": "订单处理时间",
  "description": "从订单创建到订单确认的平均处理时间",
  "category": "TECHNICAL",
  "type": "PERFORMANCE",
  "unit": "秒",
  "targetValue": 5.0,
  "threshold": {
    "warning": 8.0,
    "critical": 15.0
  },
  "formula": "AVG(order_confirmed_time - order_created_time)"
}

Response: ApiResponse<DomainMetric>
```

#### 4.4 更新度量指标
```http
PUT /api/ddd/strategic-design/domains/{domainId}/metrics/{metricId}
Content-Type: application/json

{
  "targetValue": 4.0,
  "threshold": {
    "warning": 6.0,
    "critical": 10.0
  },
  "currentValue": 4.5
}

Response: ApiResponse<DomainMetric>
```

#### 4.5 删除度量指标
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/metrics/{metricId}
Response: ApiResponse<void>
```

### 5. 限界上下文管理 API

#### 5.1 获取限界上下文列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/contexts
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- search?: string
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'
- isActive?: boolean

Response: PaginatedResponse<BoundedContext>
```

#### 5.2 创建限界上下文
```http
POST /api/ddd/strategic-design/domains/{domainId}/contexts
Content-Type: application/json

{
  "name": "订单处理上下文",
  "description": "负责订单创建、修改、状态管理等核心业务",
  "type": "CORE",
  "businessCapabilities": [
    "订单创建",
    "订单修改", 
    "订单状态管理"
  ],
  "teamTopology": {
    "teamName": "订单团队",
    "teamSize": 8,
    "ownership": "FULL"
  }
}

#### 5.3 获取单个限界上下文
```http
GET /api/ddd/strategic-design/domains/{domainId}/contexts/{contextId}
Response: ApiResponse<BoundedContext>
```

#### 5.4 更新限界上下文
```http
PUT /api/ddd/strategic-design/domains/{domainId}/contexts/{contextId}
Content-Type: application/json

{
  "description": "负责订单创建、修改、状态管理、订单查询等核心业务",
  "businessCapabilities": [
    "订单创建",
    "订单修改", 
    "订单状态管理",
    "订单查询"
  ],
  "teamTopology": {
    "teamName": "订单团队",
    "teamSize": 10,
    "ownership": "FULL"
  }
}

Response: ApiResponse<BoundedContext>
```

#### 5.5 删除限界上下文
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/contexts/{contextId}
Response: ApiResponse<void>
```

### 6. 子领域管理 API

#### 6.1 获取子领域列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/subdomains
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- type?: 'CORE' | 'SUPPORTING' | 'GENERIC'

Response: PaginatedResponse<Subdomain>
```

#### 6.2 获取单个子领域
```http
GET /api/ddd/strategic-design/domains/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<Subdomain>
```

#### 6.3 创建子领域
```http
POST /api/ddd/strategic-design/domains/{domainId}/subdomains
Content-Type: application/json

{
  "name": "订单履约子领域",
  "description": "负责订单履约流程管理",
  "type": "CORE",
  "complexity": "HIGH",
  "businessValue": "HIGH"
}

Response: ApiResponse<Subdomain>
```

#### 6.4 更新子领域
```http
PUT /api/ddd/strategic-design/domains/{domainId}/subdomains/{subdomainId}
Content-Type: application/json

{
  "description": "负责订单履约流程管理和物流协调",
  "complexity": "MEDIUM",
  "businessValue": "HIGH"
}

Response: ApiResponse<Subdomain>
```

#### 6.5 删除子领域
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/subdomains/{subdomainId}
Response: ApiResponse<void>
```

### 7. 上下文映射管理 API

#### 7.1 获取上下文映射列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/mappings
Query Parameters:
- pattern?: 'PARTNERSHIP' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTI_CORRUPTION_LAYER'

Response: PaginatedResponse<ContextMapping>
```

#### 7.2 获取单个上下文映射
```http
GET /api/ddd/strategic-design/domains/{domainId}/mappings/{mappingId}
Response: ApiResponse<ContextMapping>
```

#### 7.3 创建上下文映射
```http
POST /api/ddd/strategic-design/domains/{domainId}/mappings
Content-Type: application/json

{
  "sourceContext": "order-context",
  "targetContext": "payment-context", 
  "pattern": "CUSTOMER_SUPPLIER",
  "direction": "DOWNSTREAM",
  "integrationPattern": "API_GATEWAY",
  "dataExchange": "EVENT_DRIVEN"
}

Response: ApiResponse<ContextMapping>
```

#### 7.4 更新上下文映射
```http
PUT /api/ddd/strategic-design/domains/{domainId}/mappings/{mappingId}
Content-Type: application/json

{
  "pattern": "PARTNERSHIP",
  "direction": "BIDIRECTIONAL",
  "integrationPattern": "SHARED_KERNEL",
  "dataExchange": "SYNCHRONOUS_API"
}

Response: ApiResponse<ContextMapping>
```

#### 7.5 删除上下文映射
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/mappings/{mappingId}
Response: ApiResponse<void>
```

### 8. 领域事件管理 API

#### 8.1 获取领域事件列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/events
Query Parameters:
- contextId?: string
- eventType?: 'DOMAIN' | 'INTEGRATION' | 'NOTIFICATION'

Response: PaginatedResponse<DomainEvent>
```

#### 8.2 获取单个领域事件
```http
GET /api/ddd/strategic-design/domains/{domainId}/events/{eventId}
Response: ApiResponse<DomainEvent>
```

#### 8.3 创建领域事件
```http
POST /api/ddd/strategic-design/domains/{domainId}/events
Content-Type: application/json

{
  "name": "OrderCreatedEvent",
  "description": "订单创建事件",
  "eventType": "DOMAIN",
  "contextId": "order-context",
  "payload": {
    "orderId": "string",
    "customerId": "string",
    "orderAmount": "number"
  },
  "triggers": ["ORDER_PAYMENT", "INVENTORY_RESERVATION"]
}

Response: ApiResponse<DomainEvent>
```

#### 8.4 更新领域事件
```http
PUT /api/ddd/strategic-design/domains/{domainId}/events/{eventId}
Content-Type: application/json

{
  "description": "订单创建事件，包含完整的订单信息",
  "payload": {
    "orderId": "string",
    "customerId": "string",
    "orderAmount": "number",
    "orderItems": "array"
  },
  "triggers": ["ORDER_PAYMENT", "INVENTORY_RESERVATION", "CUSTOMER_NOTIFICATION"]
}

Response: ApiResponse<DomainEvent>
```

#### 8.5 删除领域事件
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/events/{eventId}
Response: ApiResponse<void>
```

### 9. 战略分析 API

#### 9.1 获取战略分析报告列表
```http
GET /api/ddd/strategic-design/domains/{domainId}/analysis
Query Parameters:
- analysisType?: 'DOMAIN_COMPLEXITY' | 'CONTEXT_COUPLING' | 'TEAM_ALIGNMENT'
- page: number (default: 1)
- size: number (default: 20)
- dateRange?: string

Response: PaginatedResponse<StrategicAnalysis>
```

#### 9.2 获取单个分析报告
```http
GET /api/ddd/strategic-design/domains/{domainId}/analysis/{analysisId}
Response: ApiResponse<StrategicAnalysis>
```

#### 9.3 执行战略分析
```http
POST /api/ddd/strategic-design/domains/{domainId}/analysis
Content-Type: application/json

{
  "analysisType": "DOMAIN_COMPLEXITY",
  "scope": ["contexts", "subdomains", "mappings"],
  "parameters": {
    "includeMetrics": true,
    "generateRecommendations": true
  }
}

Response: ApiResponse<AnalysisResult>
```

#### 9.4 更新分析配置
```http
PUT /api/ddd/strategic-design/domains/{domainId}/analysis/{analysisId}
Content-Type: application/json

{
  "parameters": {
    "includeMetrics": false,
    "generateRecommendations": true,
    "detailLevel": "HIGH"
  }
}

Response: ApiResponse<StrategicAnalysis>
```

#### 9.5 删除分析报告
```http
DELETE /api/ddd/strategic-design/domains/{domainId}/analysis/{analysisId}
Response: ApiResponse<void>
```

### 10. 上下文详情管理 API

#### 10.1 获取上下文详情
```http
GET /api/ddd/strategic-design/contexts/{contextId}/details
Response: ApiResponse<ContextDetail>
```

#### 10.2 更新上下文详情
```http
PUT /api/ddd/strategic-design/contexts/{contextId}/details
Content-Type: application/json

{
  "vision": "成为订单处理领域的核心引擎",
  "mission": "提供高效、可靠的订单处理服务",
  "principles": ["用户第一", "数据驱动", "持续改进"],
  "constraints": ["高可用性要求", "数据一致性", "性能要求"]
}

Response: ApiResponse<ContextDetail>
```

#### 10.3 获取业务能力列表
```http
GET /api/ddd/strategic-design/contexts/{contextId}/capabilities
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- category?: string

Response: PaginatedResponse<BusinessCapability>
```

#### 10.4 创建业务能力
```http
POST /api/ddd/strategic-design/contexts/{contextId}/capabilities
Content-Type: application/json

{
  "name": "订单状态管理",
  "description": "管理订单在各个阶段的状态变迁",
  "category": "CORE_CAPABILITY",
  "maturityLevel": "OPTIMIZED",
  "businessValue": "HIGH"
}

Response: ApiResponse<BusinessCapability>
```

#### 10.5 更新业务能力
```http
PUT /api/ddd/strategic-design/contexts/{contextId}/capabilities/{capabilityId}
Content-Type: application/json

{
  "maturityLevel": "DEFINED",
  "businessValue": "MEDIUM",
  "improvementPlan": "优化状态变迁逻辑，提升处理效率"
}

Response: ApiResponse<BusinessCapability>
```

#### 10.6 删除业务能力
```http
DELETE /api/ddd/strategic-design/contexts/{contextId}/capabilities/{capabilityId}
Response: ApiResponse<void>
```

#### 10.7 获取领域服务列表
```http
GET /api/ddd/strategic-design/contexts/{contextId}/services
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- serviceType?: 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE'

Response: PaginatedResponse<DomainService>
```

#### 10.8 创建领域服务
```http
POST /api/ddd/strategic-design/contexts/{contextId}/services
Content-Type: application/json

{
  "name": "OrderProcessingService",
  "description": "订单处理核心服务",
  "serviceType": "DOMAIN",
  "responsibilities": ["订单验证", "库存检查", "价格计算"],
  "dependencies": ["InventoryService", "PricingService"]
}

Response: ApiResponse<DomainService>
```

#### 10.9 更新领域服务
```http
PUT /api/ddd/strategic-design/contexts/{contextId}/services/{serviceId}
Content-Type: application/json

{
  "responsibilities": ["订单验证", "库存检查", "价格计算", "优惠券处理"],
  "dependencies": ["InventoryService", "PricingService", "CouponService"]
}

Response: ApiResponse<DomainService>
```

#### 10.10 删除领域服务
```http
DELETE /api/ddd/strategic-design/contexts/{contextId}/services/{serviceId}
Response: ApiResponse<void>
```

#### 10.11 获取集成关系列表
```http
GET /api/ddd/strategic-design/contexts/{contextId}/integrations
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- integrationType?: 'UPSTREAM' | 'DOWNSTREAM' | 'PEER'

Response: PaginatedResponse<Integration>
```

#### 10.12 创建集成关系
```http
POST /api/ddd/strategic-design/contexts/{contextId}/integrations
Content-Type: application/json

{
  "targetContext": "payment-context",
  "integrationType": "DOWNSTREAM",
  "protocol": "HTTP_REST",
  "dataFormat": "JSON",
  "securityLevel": "HIGH",
  "sla": {
    "availability": "99.9%",
    "responseTime": "200ms"
  }
}

Response: ApiResponse<Integration>
```

#### 10.13 更新集成关系
```http
PUT /api/ddd/strategic-design/contexts/{contextId}/integrations/{integrationId}
Content-Type: application/json

{
  "protocol": "HTTP_GRAPHQL",
  "sla": {
    "availability": "99.95%",
    "responseTime": "150ms"
  }
}

Response: ApiResponse<Integration>
```

#### 10.14 删除集成关系
```http
DELETE /api/ddd/strategic-design/contexts/{contextId}/integrations/{integrationId}
Response: ApiResponse<void>
```

#### 10.15 获取治理信息
```http
GET /api/ddd/strategic-design/contexts/{contextId}/governance
Response: ApiResponse<GovernanceInfo>
```

#### 10.16 更新治理信息
```http
PUT /api/ddd/strategic-design/contexts/{contextId}/governance
Content-Type: application/json

{
  "owner": "订单团队",
  "decisionMakers": ["技术负责人", "产品经理"],
  "architectureStandards": ["RESTful API", "Event Sourcing", "CQRS"],
  "qualityGates": ["代码覆盖率>80%", "性能测试通过", "安全扫描通过"],
  "complianceRequirements": ["GDPR", "SOX", "PCI-DSS"]
}

Response: ApiResponse<GovernanceInfo>
```

### 11. 映射关系管理 API

#### 11.1 获取映射模式列表
```http
GET /api/ddd/strategic-design/mappings/patterns
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- patternType?: 'PARTNERSHIP' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTI_CORRUPTION_LAYER'

Response: PaginatedResponse<MappingPattern>
```

#### 11.2 获取单个映射模式
```http
GET /api/ddd/strategic-design/mappings/patterns/{patternId}
Response: ApiResponse<MappingPattern>
```

#### 11.3 创建映射模式
```http
POST /api/ddd/strategic-design/mappings/patterns
Content-Type: application/json

{
  "name": "订单支付映射模式",
  "patternType": "CUSTOMER_SUPPLIER",
  "description": "订单上下文作为客户，支付上下文作为供应商",
  "applicableScenarios": ["订单支付", "退款处理"],
  "implementationGuidelines": ["使用事件驱动", "异步处理", "幂等性保证"]
}

Response: ApiResponse<MappingPattern>
```

#### 11.4 更新映射模式
```http
PUT /api/ddd/strategic-design/mappings/patterns/{patternId}
Content-Type: application/json

{
  "description": "订单上下文作为客户，支付上下文作为供应商，支持多种支付方式",
  "applicableScenarios": ["订单支付", "退款处理", "分期付款"],
  "implementationGuidelines": ["使用事件驱动", "异步处理", "幂等性保证", "补偿机制"]
}

Response: ApiResponse<MappingPattern>
```

#### 11.5 删除映射模式
```http
DELETE /api/ddd/strategic-design/mappings/patterns/{patternId}
Response: ApiResponse<void>
```

#### 11.6 映射验证
```http
POST /api/ddd/strategic-design/mappings/validation
Content-Type: application/json

{
  "mappingIds": ["mapping_001", "mapping_002"],
  "validationRules": ["CIRCULAR_DEPENDENCY", "COUPLING_ANALYSIS"]
}

Response: ApiResponse<ValidationResult>
```

#### 11.7 获取验证结果
```http
GET /api/ddd/strategic-design/mappings/validation/{validationId}
Response: ApiResponse<ValidationResult>
```

#### 11.8 映射优化
```http
POST /api/ddd/strategic-design/mappings/optimization
Content-Type: application/json

{
  "domainId": "ecommerce-order",
  "optimizationGoals": ["REDUCE_COUPLING", "IMPROVE_COHESION"]
}

Response: ApiResponse<OptimizationRecommendation>
```

#### 11.9 获取优化建议
```http
GET /api/ddd/strategic-design/mappings/optimization/{optimizationId}
Response: ApiResponse<OptimizationRecommendation>
```

### 12. 战略治理 API

#### 12.1 获取合规检查列表
```http
GET /api/ddd/strategic-design/governance/compliance
Query Parameters:
- domainId?: string
- complianceType?: 'ARCHITECTURE' | 'SECURITY' | 'PERFORMANCE'
- status?: 'PASSED' | 'FAILED' | 'WARNING'
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<ComplianceReport>
```

#### 12.2 获取单个合规检查
```http
GET /api/ddd/strategic-design/governance/compliance/{complianceId}
Response: ApiResponse<ComplianceReport>
```

#### 12.3 执行合规检查
```http
POST /api/ddd/strategic-design/governance/compliance
Content-Type: application/json

{
  "domainId": "ecommerce-order",
  "complianceType": "ARCHITECTURE",
  "checkpoints": ["LAYER_SEPARATION", "DEPENDENCY_RULES", "NAMING_CONVENTIONS"],
  "scope": ["contexts", "services", "events"]
}

Response: ApiResponse<ComplianceReport>
```

#### 12.4 更新合规配置
```http
PUT /api/ddd/strategic-design/governance/compliance/{complianceId}
Content-Type: application/json

{
  "checkpoints": ["LAYER_SEPARATION", "DEPENDENCY_RULES", "NAMING_CONVENTIONS", "API_STANDARDS"],
  "thresholds": {
    "coupling_threshold": 0.3,
    "cohesion_threshold": 0.8
  }
}

Response: ApiResponse<ComplianceReport>
```

#### 12.5 删除合规检查
```http
DELETE /api/ddd/strategic-design/governance/compliance/{complianceId}
Response: ApiResponse<void>
```

#### 12.6 获取战略指标列表
```http
GET /api/ddd/strategic-design/governance/metrics
Query Parameters:
- metricType?: 'DOMAIN_HEALTH' | 'CONTEXT_MATURITY' | 'TEAM_EFFICIENCY'
- timeRange?: string
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<StrategicMetric>
```

#### 12.7 获取单个战略指标
```http
GET /api/ddd/strategic-design/governance/metrics/{metricId}
Response: ApiResponse<StrategicMetric>
```

#### 12.8 创建战略指标
```http
POST /api/ddd/strategic-design/governance/metrics
Content-Type: application/json

{
  "name": "领域健康度",
  "metricType": "DOMAIN_HEALTH",
  "description": "评估领域设计的健康程度",
  "formula": "weighted_average(coupling, cohesion, complexity)",
  "thresholds": {
    "excellent": 0.9,
    "good": 0.7,
    "poor": 0.5
  }
}

Response: ApiResponse<StrategicMetric>
```

#### 12.9 更新战略指标
```http
PUT /api/ddd/strategic-design/governance/metrics/{metricId}
Content-Type: application/json

{
  "formula": "weighted_average(coupling*0.3, cohesion*0.4, complexity*0.3)",
  "thresholds": {
    "excellent": 0.85,
    "good": 0.65,
    "poor": 0.45
  }
}

Response: ApiResponse<StrategicMetric>
```

#### 12.10 删除战略指标
```http
DELETE /api/ddd/strategic-design/governance/metrics/{metricId}
Response: ApiResponse<void>
```

#### 12.11 获取优化建议列表
```http
GET /api/ddd/strategic-design/governance/recommendations
Query Parameters:
- priority?: 'HIGH' | 'MEDIUM' | 'LOW'
- category?: 'ARCHITECTURE' | 'PROCESS' | 'TEAM'
- status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED'
- page: number (default: 1)
- size: number (default: 20)

Response: PaginatedResponse<Recommendation>
```

#### 12.12 获取单个优化建议
```http
GET /api/ddd/strategic-design/governance/recommendations/{recommendationId}
Response: ApiResponse<Recommendation>
```

#### 12.13 创建优化建议
```http
POST /api/ddd/strategic-design/governance/recommendations
Content-Type: application/json

{
  "title": "优化订单-支付上下文映射",
  "description": "建议将订单-支付上下文映射从CONFORMIST模式改为CUSTOMER_SUPPLIER模式",
  "category": "ARCHITECTURE",
  "priority": "HIGH",
  "rationale": "减少耦合，提高支付服务的独立性",
  "implementationSteps": ["分析当前依赖", "设计新的接口", "逐步迁移", "验证效果"],
  "expectedBenefits": ["降低耦合度", "提升可维护性", "支持多支付渠道"]
}

Response: ApiResponse<Recommendation>
```

#### 12.14 更新优化建议
```http
PUT /api/ddd/strategic-design/governance/recommendations/{recommendationId}
Content-Type: application/json

{
  "status": "APPROVED",
  "assignee": "architecture-team",
  "estimatedEffort": "2 weeks",
  "deadline": "2025-10-01"
}

Response: ApiResponse<Recommendation>
```

#### 12.15 删除优化建议
```http
DELETE /api/ddd/strategic-design/governance/recommendations/{recommendationId}
Response: ApiResponse<void>
```

## 📊 数据模型

### Domain
```typescript
interface Domain {
  domainId: string;
  name: string;
  description: string;
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: number;
  businessValue: {
    revenue_impact: string;
    customer_satisfaction: string;
    competitive_advantage: string;
  };
  stakeholders: Stakeholder[];
  metrics: {
    business_metrics: string[];
    technical_metrics: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Stakeholder
```typescript
interface Stakeholder {
  id: string;
  name: string;
  type: 'BUSINESS_USER' | 'TECHNICAL_USER' | 'MANAGER' | 'CUSTOMER' | 'PARTNER';
  description: string;
  contact: {
    email: string;
    phone?: string;
  };
  influence: 'LOW' | 'MEDIUM' | 'HIGH';
  responsibilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### BusinessGoal
```typescript
interface BusinessGoal {
  id: string;
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  targetDate: string;
  successCriteria: string[];
  kpis: {
    name: string;
    target: number;
    unit: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### DomainMetric
```typescript
interface DomainMetric {
  id: string;
  name: string;
  description: string;
  category: 'BUSINESS' | 'TECHNICAL' | 'QUALITY';
  type: 'PERFORMANCE' | 'AVAILABILITY' | 'CONVERSION';
  unit: string;
  targetValue: number;
  currentValue?: number;
  threshold: {
    warning: number;
    critical: number;
  };
  formula: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### BoundedContext
```typescript
interface BoundedContext {
  id: string;
  name: string;
  description: string;
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';
  businessCapabilities: string[];
  teamTopology: {
    teamName: string;
    teamSize: number;
    ownership: 'FULL' | 'SHARED' | 'EXTERNAL';
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Subdomain
```typescript
interface Subdomain {
  id: string;
  name: string;
  description: string;
  type: 'CORE' | 'SUPPORTING' | 'GENERIC';
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  businessValue: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### ContextMapping
```typescript
interface ContextMapping {
  id: string;
  sourceContext: string;
  targetContext: string;
  pattern: 'PARTNERSHIP' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTI_CORRUPTION_LAYER';
  direction: 'UPSTREAM' | 'DOWNSTREAM' | 'BIDIRECTIONAL';
  integrationPattern: string;
  dataExchange: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### DomainEvent
```typescript
interface DomainEvent {
  id: string;
  name: string;
  description: string;
  eventType: 'DOMAIN' | 'INTEGRATION' | 'NOTIFICATION';
  contextId: string;
  payload: Record<string, any>;
  triggers: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### StrategicAnalysis
```typescript
interface StrategicAnalysis {
  id: string;
  domainId: string;
  analysisType: 'DOMAIN_COMPLEXITY' | 'CONTEXT_COUPLING' | 'TEAM_ALIGNMENT';
  results: {
    scores: Record<string, number>;
    recommendations: string[];
    riskAreas: string[];
  };
  generatedAt: string;
}
```

### ContextDetail
```typescript
interface ContextDetail {
  contextId: string;
  vision: string;
  mission: string;
  principles: string[];
  constraints: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### BusinessCapability
```typescript
interface BusinessCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  maturityLevel: 'INITIAL' | 'MANAGED' | 'DEFINED' | 'QUANTITATIVELY_MANAGED' | 'OPTIMIZED';
  businessValue: 'LOW' | 'MEDIUM' | 'HIGH';
  improvementPlan?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### DomainService
```typescript
interface DomainService {
  id: string;
  name: string;
  description: string;
  serviceType: 'APPLICATION' | 'DOMAIN' | 'INFRASTRUCTURE';
  responsibilities: string[];
  dependencies: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Integration
```typescript
interface Integration {
  id: string;
  targetContext: string;
  integrationType: 'UPSTREAM' | 'DOWNSTREAM' | 'PEER';
  protocol: 'HTTP_REST' | 'HTTP_GRAPHQL' | 'MESSAGE_QUEUE' | 'RPC';
  dataFormat: 'JSON' | 'XML' | 'PROTOBUF' | 'AVRO';
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  sla: {
    availability: string;
    responseTime: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### GovernanceInfo
```typescript
interface GovernanceInfo {
  contextId: string;
  owner: string;
  decisionMakers: string[];
  architectureStandards: string[];
  qualityGates: string[];
  complianceRequirements: string[];
  lastReviewDate: string;
  nextReviewDate: string;
  isActive: boolean;
  updatedAt: string;
}
```

### MappingPattern
```typescript
interface MappingPattern {
  id: string;
  name: string;
  patternType: 'PARTNERSHIP' | 'CUSTOMER_SUPPLIER' | 'CONFORMIST' | 'ANTI_CORRUPTION_LAYER';
  description: string;
  applicableScenarios: string[];
  implementationGuidelines: string[];
  benefits: string[];
  risks: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### ValidationResult
```typescript
interface ValidationResult {
  id: string;
  validationType: 'CIRCULAR_DEPENDENCY' | 'COUPLING_ANALYSIS' | 'CONSISTENCY_CHECK';
  status: 'PASSED' | 'FAILED' | 'WARNING';
  issues: {
    severity: 'ERROR' | 'WARNING' | 'INFO';
    message: string;
    affectedElements: string[];
    suggestedFix?: string;
  }[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
  };
  executedAt: string;
}
```

### OptimizationRecommendation
```typescript
interface OptimizationRecommendation {
  id: string;
  domainId: string;
  optimizationGoals: string[];
  recommendations: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'COUPLING' | 'COHESION' | 'COMPLEXITY' | 'PERFORMANCE';
    description: string;
    currentState: string;
    targetState: string;
    implementationSteps: string[];
    estimatedImpact: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  generatedAt: string;
}
```

### ComplianceReport
```typescript
interface ComplianceReport {
  id: string;
  domainId: string;
  complianceType: 'ARCHITECTURE' | 'SECURITY' | 'PERFORMANCE';
  status: 'PASSED' | 'FAILED' | 'WARNING';
  checkpoints: {
    name: string;
    status: 'PASSED' | 'FAILED' | 'WARNING';
    description: string;
    details?: string;
  }[];
  thresholds: Record<string, number>;
  score: number;
  executedAt: string;
}
```

### StrategicMetric
```typescript
interface StrategicMetric {
  id: string;
  name: string;
  metricType: 'DOMAIN_HEALTH' | 'CONTEXT_MATURITY' | 'TEAM_EFFICIENCY';
  description: string;
  formula: string;
  currentValue: number;
  targetValue: number;
  thresholds: {
    excellent: number;
    good: number;
    poor: number;
  };
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  lastCalculated: string;
  isActive: boolean;
}
```

### Recommendation
```typescript
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'ARCHITECTURE' | 'PROCESS' | 'TEAM';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  rationale: string;
  implementationSteps: string[];
  expectedBenefits: string[];
  risks?: string[];
  assignee?: string;
  estimatedEffort?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
  id: string;
  analysisType: string;
  domainId: string;
  scope: string[];
  parameters: Record<string, any>;
  results: {
    metrics: Record<string, number>;
    insights: string[];
    recommendations: string[];
    riskAreas: string[];
  };
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  executedAt: string;
  completedAt?: string;
}
```

## 🔧 错误码

| 错误码 | 描述 |
|--------|------|
| STRATEGIC_DESIGN.DOMAIN_NOT_FOUND | 领域不存在 |
| STRATEGIC_DESIGN.CONTEXT_NOT_FOUND | 限界上下文不存在 |
| STRATEGIC_DESIGN.STAKEHOLDER_NOT_FOUND | 利益相关者不存在 |
| STRATEGIC_DESIGN.BUSINESS_GOAL_NOT_FOUND | 业务目标不存在 |
| STRATEGIC_DESIGN.INVALID_DATA | 数据无效 |
| STRATEGIC_DESIGN.DUPLICATE_NAME | 名称重复 |
| STRATEGIC_DESIGN.MAPPING_CONFLICT | 映射关系冲突 |
| STRATEGIC_DESIGN.ACCESS_DENIED | 访问被拒绝 |
| STRATEGIC_DESIGN.DELETE_FAILED | 删除失败 |

## 📖 使用示例

### 创建领域
```typescript
const newDomain = {
  domainId: "ecommerce-payment",
  name: "支付管理领域",
  description: "负责支付流程管理和风控",
  type: "CORE",
  complexity: "HIGH",
  businessValue: {
    revenue_impact: "CRITICAL",
    customer_satisfaction: "HIGH",
    competitive_advantage: "MEDIUM"
  }
};

const response = await fetch('/api/ddd/strategic-design/domains', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newDomain)
});
```

### 创建限界上下文
```typescript
const newContext = {
  name: "支付处理上下文",
  description: "负责支付请求处理和状态管理",
  type: "CORE",
  businessCapabilities: ["支付处理", "支付状态查询", "退款处理"],
  teamTopology: {
    teamName: "支付团队",
    teamSize: 6,
    ownership: "FULL"
  }
};

const response = await fetch('/api/ddd/strategic-design/domains/ecommerce-payment/contexts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newContext)
});
```

### 获取战略分析报告
```typescript
const response = await fetch('/api/ddd/strategic-design/domains/ecommerce-payment/analysis?analysisType=DOMAIN_COMPLEXITY');
const analysis = await response.json();
console.log('领域复杂度分析:', analysis.data);
```

### 创建上下文映射
```typescript
const contextMapping = {
  sourceContext: "payment-context",
  targetContext: "notification-context",
  pattern: "CUSTOMER_SUPPLIER",
  direction: "DOWNSTREAM",
  integrationPattern: "EVENT_DRIVEN",
  dataExchange: "ASYNC_MESSAGING"
};

const response = await fetch('/api/ddd/strategic-design/domains/ecommerce-payment/mappings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(contextMapping)
});
```
