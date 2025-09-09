# 计算规则和公式定义Schema文档

## 概述

计算规则Schema（calculation.schemas）是DDD元数据平台中的核心组件之一，提供了完整的计算规则和数学公式定义系统。该模块实现了TODO-7的所有计划成果：

### ✅ 已实现的功能

1. **数学表达式解析器** - 支持多种公式语言和语法类型
2. **复杂业务计算逻辑** - 涵盖财务、数学、统计等多个领域
3. **公式验证和测试框架** - 完整的测试套件和验证机制
4. **计算规则与业务规则的关联** - 与业务规则系统的深度集成
5. **动态计算和缓存策略** - 高性能的计算执行和缓存机制

## Schema架构

### 目录结构
```
calculation.schemas/
├── calculation.schema.json          # 主Schema文件
├── full/
│   └── calculation-rule.schema.json # 完整的计算规则定义
├── fields/
│   └── calculation-fields.schema.json # 可重用的字段定义
├── operations/
│   └── calculation-operations.schema.json # 操作和行为定义
└── examples/
    └── financial-calculation-example.json # 示例文件
```

### 核心组件

#### 1. 计算规则 (calculationRule)
完整的计算规则定义，包括：
- **基本信息**: 规则ID、名称、描述、类别、复杂度
- **公式定义**: 数学表达式、语言类型、变量、函数
- **输入输出**: 参数定义、输出格式、约束条件
- **执行控制**: 前置/后置条件、错误处理、性能配置
- **安全机制**: 访问控制、加密、审计、沙箱
- **测试配置**: 测试套件、覆盖率、自动化
- **生命周期**: 版本管理、状态跟踪、变更日志

#### 2. 公式定义 (formulaDefinition)
数学表达式的详细定义：
- **表达式**: 支持多种语法（中缀、前缀、后缀、函数式）
- **语言类型**: MATHEMATICAL、JAVASCRIPT、PYTHON、GROOVY等
- **变量系统**: 参数、局部变量、全局变量、上下文变量
- **函数库**: 内置函数、自定义函数、外部库函数
- **编译优化**: 编译设置、优化策略、缓存机制

#### 3. 表达式解析器 (expressionParser)
公式解析和执行引擎：
- **语法支持**: ANTLR语法定义、大小写敏感设置
- **执行模式**: 解释执行、编译执行、JIT编译
- **安全沙箱**: 资源限制、操作禁止、执行超时
- **优化技术**: 常量折叠、死代码消除、公共子表达式

#### 4. 计算上下文 (calculationContext)
执行环境和上下文管理：
- **作用域**: 全局、会话、请求、事务、本地
- **变量管理**: 上下文变量、继承关系、生命周期
- **函数库**: 上下文特定的函数定义和实现

#### 5. 测试套件 (testSuite)
完整的测试框架：
- **测试用例**: 正向、负向、边界、性能、安全测试
- **测试配置**: 并行执行、重试策略、报告格式
- **覆盖率统计**: 语句、分支、函数、行覆盖率
- **自动化**: 触发条件、定时执行、持续集成

## 使用示例

### 基本计算规则定义

```json
{
  "calculationRules": [
    {
      "calculationId": "calc_simple_interest",
      "name": "单利计算",
      "category": "FINANCIAL",
      "complexity": "SIMPLE",
      "formula": {
        "formulaId": "formula_simple_interest",
        "expression": "principal * rate * time / 100",
        "language": "MATHEMATICAL",
        "syntax": "INFIX"
      },
      "inputParameters": [
        {
          "parameterId": "param_principal",
          "name": "principal",
          "type": "DECIMAL",
          "required": true,
          "constraints": {
            "minimum": 0,
            "exclusiveMinimum": true
          }
        }
      ],
      "outputDefinition": {
        "type": "DECIMAL",
        "precision": 2,
        "roundingMode": "HALF_UP"
      }
    }
  ]
}
```

### 复杂业务计算

```json
{
  "calculationRules": [
    {
      "calculationId": "calc_tax_calculation",
      "name": "个人所得税计算",
      "category": "BUSINESS_LOGIC",
      "complexity": "COMPLEX",
      "formula": {
        "formulaId": "formula_progressive_tax",
        "expression": "calculateProgressiveTax(income, brackets, rates)",
        "language": "JAVASCRIPT",
        "functions": [
          {
            "name": "calculateProgressiveTax",
            "type": "CUSTOM",
            "implementation": "function calculateProgressiveTax(income, brackets, rates) { /* 累进税率计算逻辑 */ }"
          }
        ]
      },
      "alternatives": [
        {
          "condition": "income <= basicThreshold",
          "formula": {
            "expression": "0",
            "language": "MATHEMATICAL"
          },
          "priority": 1
        }
      ]
    }
  ]
}
```

### 性能优化配置

```json
{
  "performance": {
    "expectedComplexity": "O(1)",
    "maxExecutionTime": 100,
    "cacheStrategy": {
      "type": "REDIS",
      "ttl": 3600,
      "keyPattern": "calc_{ruleId}_{hash}"
    },
    "parallelization": {
      "enabled": true,
      "strategy": "DATA_PARALLEL",
      "threadCount": 4
    },
    "monitoring": {
      "enabled": true,
      "metrics": ["EXECUTION_TIME", "CACHE_HIT_RATE"],
      "alertThresholds": {
        "executionTime": 200,
        "errorRate": 0.05
      }
    }
  }
}
```

## 业务规则集成

计算规则与业务规则系统深度集成：

### 集成映射
```json
{
  "integrations": {
    "mappings": [
      {
        "calculationRuleId": "calc_loan_payment",
        "businessRuleId": "rule_loan_eligibility",
        "relationship": "VALIDATES",
        "configuration": {
          "validationLevel": "STRICT"
        }
      }
    ],
    "synchronization": {
      "mode": "REAL_TIME",
      "conflictResolution": "CALCULATION_WINS"
    }
  }
}
```

### 领域事件集成
```json
{
  "integrations": {
    "domainEvents": {
      "enabled": true,
      "publishEvents": [
        "CALCULATION_COMPLETED",
        "CALCULATION_FAILED",
        "PERFORMANCE_THRESHOLD_EXCEEDED"
      ],
      "subscribeEvents": [
        "BUSINESS_RULE_UPDATED",
        "PARAMETER_CHANGED"
      ]
    }
  }
}
```

## 测试和验证

### 测试用例示例
```json
{
  "testSuites": [
    {
      "suiteId": "suite_financial_calculations",
      "name": "财务计算测试套件",
      "testCases": [
        {
          "caseId": "case_positive_scenario",
          "name": "正常场景测试",
          "category": "POSITIVE",
          "inputs": {
            "principal": 10000,
            "rate": 5.0,
            "time": 2
          },
          "expectedOutput": 1000.00,
          "tolerance": 0.01
        },
        {
          "caseId": "case_boundary_zero",
          "name": "边界值测试",
          "category": "BOUNDARY",
          "inputs": {
            "principal": 10000,
            "rate": 0,
            "time": 2
          },
          "expectedOutput": 0.00
        }
      ]
    }
  ]
}
```

## 安全和审计

### 安全配置
```json
{
  "security": {
    "accessControl": {
      "requiredRoles": ["FINANCIAL_ANALYST"],
      "requiredPermissions": ["CALCULATE_INTEREST"]
    },
    "sandboxing": {
      "enabled": true,
      "resourceLimits": {
        "maxMemory": 1048576,
        "maxCpuTime": 5000
      },
      "forbiddenOperations": ["FILE_ACCESS", "NETWORK_ACCESS"]
    },
    "audit": {
      "enabled": true,
      "events": ["EXECUTION", "ERROR", "ACCESS"],
      "storage": "DATABASE"
    }
  }
}
```

## 最佳实践

### 1. 公式设计
- 使用清晰的变量命名
- 提供详细的文档说明
- 考虑数值精度和舍入策略
- 设计合理的输入验证

### 2. 性能优化
- 合理使用缓存策略
- 避免过于复杂的表达式
- 考虑并行化处理
- 监控性能指标

### 3. 测试覆盖
- 包含正向、负向、边界测试
- 覆盖所有业务场景
- 性能和安全测试
- 自动化测试执行

### 4. 安全考虑
- 启用沙箱机制
- 设置合理的资源限制
- 记录审计日志
- 实施访问控制

## 下一步计划

根据TODO-8的要求，下一步将实现：
1. **领域事件与业务规则的关联** - 建立事件驱动的计算触发机制
2. **事件溯源和审计** - 完整的计算历史跟踪
3. **异步事件处理** - 支持异步计算和结果通知

## 版本历史

- **v3.0.0** (2025-09-08): 初始版本，实现完整的计算规则和公式定义系统
  - ✅ 数学表达式解析器
  - ✅ 复杂业务计算逻辑
  - ✅ 公式验证和测试框架
  - ✅ 业务规则关联
  - ✅ 动态计算和缓存策略

---

**文档更新**: 2025-09-08  
**版本**: v3.0.0  
**状态**: TODO-7 已完成 ✅
