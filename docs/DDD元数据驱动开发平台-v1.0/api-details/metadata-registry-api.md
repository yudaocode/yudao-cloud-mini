# 元数据注册表 API

## 📋 概述

元数据注册表API提供统一的元数据管理、发现、版本控制和治理功能，参考LinkedIn DataHub、Apache Atlas等大厂最佳实践。

## 🏗️ API架构设计

### 1. 分层架构
```
/api/metadata/
├── /registry/           # 元数据注册中心
├── /catalog/           # 元数据目录
├── /lineage/           # 数据血缘
├── /governance/        # 数据治理
├── /search/            # 搜索发现
├── /monitoring/        # 监控统计
└── /webhook/           # 事件回调
```

### 2. 核心概念

#### 2.1 Entity（实体）
- **Dataset**: 数据集（表、文件、流等）
- **Schema**: 数据模式
- **Pipeline**: 数据管道
- **Service**: 业务服务
- **Domain**: 业务域
- **Glossary**: 业务词汇表

#### 2.2 Aspect（切面）
- **Properties**: 基本属性
- **Schema**: 结构信息
- **Ownership**: 归属信息
- **Documentation**: 文档说明
- **Tags**: 标签分类
- **Lineage**: 血缘关系

## 📚 API接口定义

### 1. 元数据注册 API

#### 1.1 注册元数据实体
```http
POST /api/metadata/registry/entities
Content-Type: application/json

{
  "entity": {
    "urn": "urn:li:dataset:(oss,foobar.table_baz,PROD)",
    "type": "dataset",
    "aspects": {
      "datasetProperties": {
        "name": "table_baz",
        "description": "用户行为数据表",
        "tags": ["pii", "user-data"],
        "customProperties": {
          "data_classification": "sensitive",
          "retention_period": "7years"
        }
      },
      "schemaMetadata": {
        "schemaName": "table_baz_schema",
        "platform": "oss",
        "version": "1.0",
        "fields": [
          {
            "fieldPath": "user_id",
            "type": "BIGINT",
            "nativeDataType": "bigint",
            "description": "用户唯一标识",
            "tags": ["primary_key", "pii"]
          }
        ]
      },
      "ownership": {
        "owners": [
          {
            "owner": "urn:li:corpuser:jdoe",
            "type": "DATAOWNER"
          }
        ],
        "lastModified": {
          "time": 1640995200000,
          "actor": "urn:li:corpuser:jdoe"
        }
      }
    }
  }
}
```

#### 1.2 批量注册元数据
```http
POST /api/metadata/registry/entities/batch
Content-Type: application/json

{
  "entities": [
    {
      "urn": "urn:li:dataset:...",
      "type": "dataset",
      "aspects": { ... }
    }
  ],
  "options": {
    "mode": "PATCH", // PATCH | UPSERT | CREATE_ONLY
    "validateBeforeWrite": true,
    "skipAuditLog": false
  }
}
```

#### 1.3 获取元数据实体
```http
GET /api/metadata/registry/entities/{urn}?aspects=datasetProperties,schemaMetadata,ownership

Response:
{
  "entity": {
    "urn": "urn:li:dataset:(oss,foobar.table_baz,PROD)",
    "type": "dataset",
    "aspects": { ... }
  }
}
```

### 2. 元数据目录 API

#### 2.1 浏览元数据目录
```http
GET /api/metadata/catalog/browse?path=/prod/ecommerce&types=dataset,pipeline&limit=20

Response:
{
  "path": "/prod/ecommerce",
  "entities": [
    {
      "urn": "urn:li:dataset:...",
      "name": "user_events",
      "type": "dataset",
      "platform": "kafka",
      "description": "用户行为事件流"
    }
  ],
  "totalCount": 156,
  "hasMore": true
}
```

#### 2.2 获取元数据统计
```http
GET /api/metadata/catalog/stats

Response:
{
  "totalEntities": 15420,
  "entitiesByType": {
    "dataset": 8900,
    "pipeline": 1200,
    "service": 450,
    "domain": 25
  },
  "platformDistribution": {
    "mysql": 3400,
    "kafka": 2100,
    "elasticsearch": 1800
  },
  "governanceStats": {
    "documented": 85.2,
    "owned": 78.5,
    "tagged": 92.1
  }
}
```

### 3. 数据血缘 API

#### 3.1 获取上游血缘
```http
GET /api/metadata/lineage/upstream/{urn}?levels=3&direction=UPSTREAM

Response:
{
  "urn": "urn:li:dataset:(kafka,user_events,PROD)",
  "upstreamLineage": {
    "edges": [
      {
        "sourceUrn": "urn:li:dataset:(mysql,users,PROD)",
        "destinationUrn": "urn:li:dataset:(kafka,user_events,PROD)",
        "type": "TRANSFORMED_BY",
        "properties": {
          "pipeline": "urn:li:dataJob:(airflow,user_etl,PROD)"
        }
      }
    ]
  }
}
```

#### 3.2 获取下游血缘
```http
GET /api/metadata/lineage/downstream/{urn}?levels=2&direction=DOWNSTREAM

Response:
{
  "urn": "urn:li:dataset:(mysql,users,PROD)",
  "downstreamLineage": {
    "edges": [...]
  }
}
```

#### 3.3 获取完整血缘图
```http
GET /api/metadata/lineage/graph/{urn}?levels=2

Response:
{
  "entities": [
    {
      "urn": "urn:li:dataset:...",
      "type": "dataset",
      "properties": { ... }
    }
  ],
  "relationships": [
    {
      "source": "urn:li:dataset:...",
      "destination": "urn:li:dataset:...",
      "type": "CONSUMES"
    }
  ]
}
```

### 4. 搜索发现 API

#### 4.1 全文搜索
```http
POST /api/metadata/search/query
Content-Type: application/json

{
  "input": "用户行为",
  "entityTypes": ["dataset", "pipeline"],
  "filters": [
    {
      "field": "platform",
      "values": ["kafka", "mysql"]
    },
    {
      "field": "tags",
      "values": ["pii"]
    }
  ],
  "sortCriteria": [
    {
      "field": "relevance",
      "sortOrder": "DESCENDING"
    }
  ],
  "start": 0,
  "count": 20
}

Response:
{
  "entities": [
    {
      "entity": {
        "urn": "urn:li:dataset:...",
        "type": "dataset",
        "aspects": { ... }
      },
      "matchedFields": [
        {
          "name": "name",
          "value": "用户行为事件表"
        }
      ],
      "score": 0.95
    }
  ],
  "searchResultMetadata": {
    "totalCount": 156,
    "aggregations": {
      "platform": {
        "kafka": 45,
        "mysql": 32
      }
    }
  }
}
```

#### 4.2 自动补全
```http
GET /api/metadata/search/autocomplete?query=user&entityTypes=dataset&limit=10

Response:
{
  "suggestions": [
    {
      "text": "user_events",
      "score": 0.98,
      "entity": {
        "urn": "urn:li:dataset:...",
        "type": "dataset"
      }
    }
  ]
}
```

### 5. 数据治理 API

#### 5.1 设置数据所有者
```http
POST /api/metadata/governance/ownership
Content-Type: application/json

{
  "entityUrn": "urn:li:dataset:(mysql,users,PROD)",
  "owners": [
    {
      "owner": "urn:li:corpuser:jdoe",
      "type": "DATAOWNER"
    },
    {
      "owner": "urn:li:corpGroup:data-platform",
      "type": "TECHNICAL_OWNER"
    }
  ]
}
```

#### 5.2 添加数据标签
```http
POST /api/metadata/governance/tags
Content-Type: application/json

{
  "entityUrn": "urn:li:dataset:(mysql,users,PROD)",
  "tags": [
    {
      "tag": "urn:li:tag:PII",
      "propagate": true
    },
    {
      "tag": "urn:li:tag:HighQuality",
      "propagate": false
    }
  ]
}
```

#### 5.3 添加文档
```http
POST /api/metadata/governance/documentation
Content-Type: application/json

{
  "entityUrn": "urn:li:dataset:(mysql,users,PROD)",
  "documentation": {
    "description": "用户基础信息表，包含用户注册信息、个人资料等",
    "links": [
      {
        "label": "数据字典",
        "url": "https://wiki.company.com/data/users"
      }
    ]
  }
}
```

### 6. 监控统计 API

#### 6.1 获取数据质量报告
```http
GET /api/metadata/monitoring/quality/{urn}?timeRange=7d

Response:
{
  "entity": "urn:li:dataset:(mysql,users,PROD)",
  "qualityMetrics": {
    "completeness": 98.5,
    "accuracy": 96.2,
    "consistency": 99.1,
    "timeliness": 94.8
  },
  "issues": [
    {
      "type": "MISSING_VALUES",
      "field": "email",
      "count": 142,
      "severity": "MEDIUM"
    }
  ],
  "trends": {
    "daily": [
      {
        "date": "2024-01-01",
        "completeness": 98.2
      }
    ]
  }
}
```

#### 6.2 获取使用统计
```http
GET /api/metadata/monitoring/usage/{urn}?timeRange=30d

Response:
{
  "entity": "urn:li:dataset:(mysql,users,PROD)",
  "usageStats": {
    "totalQueries": 1524,
    "uniqueUsers": 45,
    "topUsers": [
      {
        "user": "urn:li:corpuser:analyst1",
        "queryCount": 156
      }
    ],
    "queryPatterns": [
      {
        "pattern": "SELECT * FROM users WHERE...",
        "count": 89
      }
    ]
  }
}
```

### 7. 事件回调 API

#### 7.1 注册Webhook
```http
POST /api/metadata/webhook/register
Content-Type: application/json

{
  "name": "data-catalog-sync",
  "url": "https://api.company.com/webhooks/metadata",
  "events": [
    "ENTITY_CREATED",
    "ENTITY_UPDATED",
    "SCHEMA_CHANGED"
  ],
  "filters": {
    "entityTypes": ["dataset"],
    "platforms": ["mysql", "kafka"]
  },
  "secret": "webhook-secret-key"
}
```

#### 7.2 获取事件日志
```http
GET /api/metadata/webhook/events?webhookId=123&timeRange=1d&limit=100

Response:
{
  "events": [
    {
      "id": "evt_123",
      "type": "ENTITY_UPDATED",
      "entityUrn": "urn:li:dataset:...",
      "timestamp": 1640995200000,
      "payload": { ... },
      "status": "DELIVERED"
    }
  ]
}
```

## 🔧 高级特性

### 1. 版本控制
```http
GET /api/metadata/registry/entities/{urn}/versions
POST /api/metadata/registry/entities/{urn}/versions
GET /api/metadata/registry/entities/{urn}/versions/{version}
```

### 2. 批量操作
```http
POST /api/metadata/registry/entities/batch/delete
POST /api/metadata/registry/entities/batch/update
POST /api/metadata/registry/entities/batch/tag
```

### 3. 元数据导入导出
```http
POST /api/metadata/import/excel
POST /api/metadata/import/json
GET /api/metadata/export/excel
GET /api/metadata/export/json
```

### 4. API配额和限流
```http
Headers:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📊 性能优化

### 1. 缓存策略
- Redis缓存热点数据
- CDN缓存静态资源
- 应用层缓存查询结果

### 2. 分页和游标
```http
GET /api/metadata/search?cursor=eyJpZCI6MTIzfQ==&limit=20
```

### 3. 字段选择
```http
GET /api/metadata/entities/{urn}?aspects=properties,schema&fields=name,description
```

### 4. 异步处理
```http
POST /api/metadata/async/lineage-analysis
Location: /api/metadata/async/jobs/job_123
```

## 🛡️ 安全控制

### 1. 认证授权
```http
Authorization: Bearer <token>
X-API-Key: <api-key>
```

### 2. 权限控制
- 基于角色的访问控制(RBAC)
- 细粒度权限管理
- 数据级权限控制

### 3. 审计日志
```http
GET /api/metadata/audit/logs?entityUrn={urn}&action=READ
```

## 📈 监控告警

### 1. 健康检查
```http
GET /api/metadata/health
```

### 2. 指标监控
```http
GET /api/metadata/metrics
```

### 3. 告警配置
```http
POST /api/metadata/alerts/rules
```
