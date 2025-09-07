# 📐 DDD元数据平台 - Schema架构层级关系

## 🎯 当前问题分析

### ❌ **概念混淆问题**
1. **战略设计、战术设计被误认为数据对象** - 实际上它们是**过程性活动**，应该体现在API/UI层，而不是Schema层
2. **层级关系不清晰** - 项目、领域、限界上下文、子域之间的关系模糊
3. **术语作用域混乱** - 没有明确区分全局、项目、领域、上下文级别的术语

## 📊 当前Schema对象清单

### 🗂️ **1. project-metadata.schemas/**
```
project-metadata.schemas/
├── full/
│   ├── project-metadata.schema.json    ← 项目元数据聚合根
│   └── domain.schema.json              ← 领域定义
├── fields/
│   ├── project-fields.schema.json
│   ├── domain-fields.schema.json
│   ├── business-fields.schema.json
│   ├── team-fields.schema.json
│   └── technical-fields.schema.json
└── operations/
    ├── create/, update/, delete/, read/, patch/, bulk/
```

### 🗂️ **2. strategic-design.schemas/** ⚠️ **可能需要重构**
```
strategic-design.schemas/
├── full/
│   ├── strategic-design.schema.json    ← ❌ 过程性活动，不应该是数据对象
│   ├── bounded-context.schema.json     ← ✅ 限界上下文实体
│   └── subdomain.schema.json          ← ✅ 子域实体
├── fields/
│   ├── bounded-context-fields.schema.json
│   └── subdomain-fields.schema.json
└── operations/
```

### 🗂️ **3. tactical-design.schemas/** ⚠️ **可能需要重构**
```
tactical-design.schemas/
├── full/
│   ├── tactical-design.schema.json     ← ❌ 过程性活动，不应该是数据对象
│   ├── aggregate.schema.json          ← ✅ 聚合根实体
│   ├── entity.schema.json            ← ✅ 实体对象
│   └── value-object.schema.json       ← ✅ 值对象
├── fields/
│   ├── aggregate-fields.schema.json
│   ├── entity-fields.schema.json
│   └── value-object-fields.schema.json
└── operations/
```

### 🗂️ **4. ubiquitous-language.schemas/**
```
ubiquitous-language.schemas/
├── full/
│   ├── ubiquitous-language.schema.json ← 统一语言聚合根
│   ├── business-term.schema.json      ← ✅ 业务术语
│   ├── business-attribute.schema.json ← ✅ 业务属性
│   └── constraints.schema.json        ← ✅ 约束条件
├── fields/
│   ├── term-fields.schema.json
│   └── attribute-fields.schema.json
└── operations/
```

### 🗂️ **5. data-transfer-objects.schemas/**
```
data-transfer-objects.schemas/
├── full/
│   ├── data-transfer-objects.schema.json   ← DTO管理聚合根
│   ├── data-transfer-object.schema.json    ← ✅ 单个DTO实体
│   ├── dto-attribute.schema.json          ← ✅ DTO属性
│   ├── dto-mapping.schema.json            ← ✅ DTO映射
│   ├── field-mapping.schema.json          ← ✅ 字段映射
│   ├── serialization.schema.json          ← ✅ 序列化配置
│   ├── transformation-rule.schema.json    ← ✅ 转换规则
│   ├── validation-rule.schema.json        ← ✅ 验证规则
│   ├── usage-status.schema.json           ← ✅ 使用状态
│   ├── constraints.schema.json            ← ✅ 约束条件
│   └── attribute-serialization.schema.json ← ✅ 属性序列化
├── fields/
│   ├── dto-fields.schema.json
│   ├── attribute-fields.schema.json
│   ├── mapping-fields.schema.json
│   ├── serialization-fields.schema.json
│   ├── validation-fields.schema.json
│   ├── collection-fields.schema.json
│   └── common-fields.schema.json
└── operations/
```

### 🗂️ **6. api-definition.schemas/**
```
api-definition.schemas/
├── full/
│   └── api-specification.schema.json   ← ✅ API规范定义
├── fields/
│   ├── endpoint-fields.schema.json
│   ├── parameter-fields.schema.json
│   ├── response-fields.schema.json
│   └── common-fields.schema.json
└── operations/
```

### 🗂️ **7. implementation-mapping.schemas/**
```
implementation-mapping.schemas/
├── full/
│   ├── implementation-mapping.schema.json  ← 实现映射聚合根
│   ├── architecture-mapping.schema.json   ← ✅ 架构映射
│   ├── persistence-mapping.schema.json    ← ✅ 持久化映射
│   └── integration-mapping.schema.json    ← ✅ 集成映射
├── fields/
│   ├── architecture-fields.schema.json
│   ├── persistence-fields.schema.json
│   ├── integration-fields.schema.json
│   ├── mapping-fields.schema.json
│   ├── validation-fields.schema.json
│   └── common-fields.schema.json
└── operations/
```

### 🗂️ **8. screen-definition.schemas/**
```
screen-definition.schemas/
├── full/
│   ├── screen-definition.schema.json   ← 界面定义聚合根
│   ├── screen.schema.json             ← ✅ 界面实体
│   ├── component.schema.json          ← ✅ 组件实体
│   ├── action.schema.json             ← ✅ 操作实体
│   └── permission.schema.json         ← ✅ 权限实体
├── fields/
└── operations/
```
---

```mermaid

```


### 🗂️ **9. validation.schemas/**
```
validation.schemas/
├── full/
│   ├── validation-configuration.schema.json ← 验证配置聚合根
│   └── validation-rule.schema.json         ← ✅ 验证规则实体
├── fields/
└── operations/
```

##  对象层级关系 - 分层分区架构
```mermaid
graph TB
    %% 样式定义 - 采用选项A的详细样式
    classDef problem fill:#42a5f5,stroke:#01579b,stroke-width:2px,color:black;
    classDef solution fill:#66bb6a,stroke:#33691e,stroke-width:2px,color:black;
    classDef language fill:#ffa726,stroke:#ff6f00,stroke-width:2px,color:black;
    classDef integration fill:#66bb6a,stroke:#2e7d32,stroke-width:1px,stroke-dasharray: 5 5,color:black;
    classDef infrastructure fill:#616161,stroke:#424242,stroke-width:1px,color:white;
    classDef method fill:#e53935,stroke:#d32f2f,stroke-width:1px,color:white;
    classDef communication fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:black;

    %% ==================== 第1层：统一语言层 (Language Layer) ====================
    subgraph L1 [🗣️ 统一语言层 - Language Layer]
        UL(统一语言<br/>Unified Language):::language
        TERM(术语<br/>Terminology):::language
        PROP(属性<br/>Property):::language
        
        UL -.-> TERM
        TERM -->|实现为| PROP
    end

    %% ==================== 第2层：问题空间层 (Problem Space Layer) ====================
    subgraph L2 [🎯 问题空间层 - Problem Space Layer]
        %% 问题空间分区 - 领域分析区
        subgraph PS_DOMAIN [领域分析区]
            DOM(领域<br/>Domain):::problem
            SUB(子域<br/>Subdomain):::problem
        end
        
        %% 问题空间分区 - 聚合设计区
        subgraph PS_AGGREGATE [聚合设计区]
            AGG(聚合<br/>Aggregate):::problem
            AR(聚合根<br/>Aggregate Root):::problem
            ENT(实体<br/>Entity):::problem
            VO(值对象<br/>Value Object):::problem
        end
        
        %% 问题空间内部关系
        DOM -->|包含| SUB
        SUB -->|包含| AGG
        AGG -->|有且只有一个| AR
        AR -->|包含| ENT
        AR -->|包含| VO
    end

    %% ==================== 第3层：解决方案空间层 (Solution Space Layer) ====================
    subgraph L3 [⚡ 解决方案空间层 - Solution Space Layer]
        %% 解决方案分区 - 项目组织区
        subgraph SS_PROJECT [项目组织区]
            PROJ(项目<br/>Project):::solution
            MOD(模块<br/>Module):::solution
        end
        
        %% 解决方案分区 - 上下文实现区
        subgraph SS_CONTEXT [上下文实现区]
            BC(限界上下文<br/>Bounded Context):::solution
            DS(领域服务<br/>Domain Service):::solution
            APP_S(应用服务<br/>App Service):::solution
        end
        
        %% 解决方案分区 - 事件与集成区
        subgraph SS_EVENT [事件与集成区]
            DE(领域事件<br/>Domain Event):::solution
            ADPT(适配器<br/>Adapter):::solution
            GATEWAY(防腐网关<br/>ACL Gateway):::integration
        end
        
        %% 解决方案空间内部关系
        PROJ -->|包含| MOD
        PROJ -->|管理| BC
        BC -->|实现| SUB
        BC -->|包含| DS
        BC -->|包含| APP_S
        AR -->|发布| DE
        ADPT -->|实现为| GATEWAY
        MOD -->|包含| APP_S
        MOD -->|包含| ADPT
    end

    %% ==================== 第4层：通信接口层 (Communication Layer) ====================
    subgraph L4 [📡 通信接口层 - Communication Layer]
        %% 通信分区 - API接口区
        subgraph CI_API [API接口区]
            SDK(客户端SDK<br/>Client SDK):::communication
            API(API端点<br/>API Endpoint):::communication
            S_METH(服务方法<br/>Service Method):::communication
        end
        
        %% 通信分区 - 数据传输区
        subgraph CI_DTO [数据传输区]
            DTO(数据传输对象<br/>Data Transfer Object):::communication
        end
        
        %% 通信接口内部关系
        BC -->|暴露| SDK
        SDK -->|提供| API
        SDK -->|定义| DTO
        API -->|定义| S_METH
        APP_S -->|实现| API
        S_METH -->|输入| DTO
        S_METH -->|输出| DTO
    end

    %% ==================== 第5层：方法细节层 (Method Details Layer) ====================
    subgraph L5 [🔧 方法细节层 - Method Details Layer]
        %% 方法分区 - 领域方法区
        subgraph MD_DOMAIN [领域方法区]
            AR_METH(聚合根方法<br/>AggregateRoot Method):::method
            ENT_METH(实体方法<br/>Entity Method):::method
            VO_METH(值对象方法<br/>ValueObject Method):::method
            DS_METH(领域服务方法<br/>DomainService Method):::method
        end
        
        %% 方法分区 - 参数返回区
        subgraph MD_PARAM [参数返回区]
            PARAM(参数<br/>Parameter):::method
            RETURN(返回值<br/>Return Value):::method
        end
        
        %% 方法细节内部关系
        AR -->|包含| AR_METH
        ENT -->|包含| ENT_METH
        VO -->|包含| VO_METH
        DS -->|包含| DS_METH
        
        AR_METH -->|有| PARAM
        AR_METH -->|有| RETURN
        ENT_METH -->|有| PARAM
        ENT_METH -->|有| RETURN
        VO_METH -->|有| PARAM
        VO_METH -->|有| RETURN
        DS_METH -->|有| PARAM
        DS_METH -->|有| RETURN
        
        %% 参数和返回值都是DTO
        PARAM -->|是| DTO
        RETURN -->|是| DTO
    end

    %% ==================== 第6层：基础设施层 (Infrastructure Layer) ====================
    subgraph L6 [🏗️ 基础设施层 - Infrastructure Layer]
        %% 基础设施分区 - 仓储区
        subgraph INFRA_REPO [仓储区]
            REPO_IFACE(仓储接口<br/>Repository Interface):::infrastructure
            REPO_IMPL(仓储实现<br/>Repository Implementation):::infrastructure
        end
        
        %% 基础设施内部关系
        REPO_IFACE -.->|被实现| REPO_IMPL
        AR -->|被持久化| REPO_IFACE
        DS -->|依赖| REPO_IFACE
    end

    %% ==================== 跨层关系：上下文映射 ====================
    BC_A[限界上下文A<br/>Bounded Context A]:::solution
    BC_B[限界上下文B<br/>Bounded Context B]:::solution
    BC_A -->|上游关系<br/>Upstream| BC_B
    BC_B -->|下游关系<br/>Downstream| BC_A

    %% ==================== 跨层关系：术语作用域 ====================
    TERM -->|项目级定义| PROJ
    TERM -->|领域级定义| DOM
    TERM -->|上下文级定义| BC

    %% ==================== 跨层关系：属性构成 ====================
    PROP -.->|构成| AR
    PROP -.->|构成| ENT
    PROP -.->|构成| VO
    PROP -.->|构成| DTO
    DE -->|包含| PROP

    %% ==================== 应用层使用关系 ====================
    APP_S -->|使用| DS
    APP_S -->|操作| AR

```

## 🎯 **需要矫正的层级关系**

### **❓ 问题1: 项目与领域关系**
- **当前**: project-metadata包含domains数组
- **关系**: Project 1:N Domain ✅ 这个是对的

### **❓ 问题2: 领域与限界上下文关系**
- **当前**: domain包含boundedContexts ID数组
- **关系**: Domain 1:N BoundedContext 
- **疑问**: 这个关系对吗？还是应该是 BoundedContext可以跨多个Domain？

### **❓ 问题3: 领域与子域关系**
- **当前**: domain包含subdomains数组，subdomain引用strategic-design
- **关系**: Domain 1:N Subdomain
- **疑问**: 这个关系对吗？

### **❓ 问题4: 限界上下文与子域关系**
- **当前**: 没有明确的关系定义
- **疑问**: 1个限界上下文通常有多个子域？还是1个子域可以属于多个限界上下文？

### **❓ 问题5: 术语的作用域层级**
- **当前**: ubiquitous-language是全局的
- **需要**: 明确术语的作用域：全局 → 项目 → 领域 → 上下文

### **❓ 问题6: 战略设计和战术设计的定位**
- **当前**: 作为数据对象Schema
- **实际**: 应该是过程性活动，在API/UI层体现
- **疑问**: 是否应该完全移除这两个Schema？

### **❓ 问题7: 聚合根的归属**
- **当前**: aggregate在tactical-design.schemas下
- **疑问**: aggregate应该属于哪个限界上下文？如何建立这个关系？

### **❓ 问题8: 实体和值对象的归属**
- **当前**: entity和value-object在tactical-design.schemas下
- **疑问**: 它们应该属于哪个聚合根？如何建立这个关系？

### **❓ 问题9: DTO的归属**
- **当前**: DTO是独立的管理单元
- **疑问**: DTO应该与哪个领域或上下文关联？

### **❓ 问题10: API的归属**
- **当前**: API是独立的规范定义
- **疑问**: API应该与哪个限界上下文关联？

## 🎯 **待矫正的核心问题**

### **1. 清晰的层级关系**
```
Project (项目)
├── Domain (领域) 
│   ├── ？→ BoundedContext (限界上下文)
│   └── ？→ Subdomain (子域)
├── UbiquitousLanguage (统一语言)
│   ├── 作用域：项目级？
│   ├── 作用域：领域级？
│   └── 作用域：上下文级？
└── ？→ 其他对象的归属关系
```

### **2. 战略设计和战术设计的处理**
- **选项A**: 完全移除，作为API/UI层的过程性活动
- **选项B**: 保留为工作流程记录
- **选项C**: 重新定义为设计决策记录

### **3. 对象归属关系**
- Aggregate 归属于哪个 BoundedContext？
- Entity 归属于哪个 Aggregate？
- ValueObject 归属于哪个 Aggregate？
- DTO 归属于哪个 Domain 或 BoundedContext？
- API 归属于哪个 BoundedContext？

## 📝 **请矫正以下内容**

1. **项目、领域、限界上下文、子域的正确层级关系**
2. **术语作用域的正确层级关系**
3. **战略设计、战术设计是否应该作为Schema对象**
4. **聚合根、实体、值对象的归属关系**
5. **DTO、API等技术对象的归属关系**
6. **需要新增的Schema对象**
7. **需要删除的Schema对象**
8. **需要重新组织的Schema目录结构**

---

**请您在此基础上进行矫正，明确每个对象的层级关系和归属，我将根据您的矫正进行Schema重构。**
