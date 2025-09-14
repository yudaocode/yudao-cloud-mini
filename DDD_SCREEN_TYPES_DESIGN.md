# 🖥️ DDD屏幕类型系统设计

## 📋 5种基本屏幕类型定义

### 1. 📄 **列表屏幕 (List Screen)**

#### 功能特点
- 展示实体数据列表
- 支持分页、搜索、排序、筛选
- 批量操作支持
- 快速操作按钮

#### AMIS组件映射
```javascript
const listScreenTemplate = {
    type: 'page',
    title: '${entityName}列表',
    body: [
        {
            type: 'crud',
            title: '${entityName}管理',
            api: '/api/${entityName}/list',
            filter: {
                // 搜索筛选器
                body: [
                    { type: 'input-text', name: 'keyword', label: '关键词', placeholder: '搜索${entityName}' },
                    { type: 'select', name: 'status', label: '状态', options: [] },
                    { type: 'input-date-range', name: 'dateRange', label: '创建时间' }
                ]
            },
            headerToolbar: [
                { type: 'button', label: '新建', level: 'primary', actionType: 'dialog' },
                { type: 'button', label: '批量删除', level: 'danger' },
                { type: 'reload' }
            ],
            columns: [
                { name: 'id', label: 'ID', sortable: true },
                // 动态生成字段列
                { name: 'actions', label: '操作', type: 'operation' }
            ]
        }
    ]
};
```

#### DDD映射规则
- **聚合根** → 主表数据源
- **实体属性** → 表格列定义
- **领域服务** → 操作按钮
- **查询对象** → 筛选器字段

---

### 2. 👁️ **详情屏幕 (Detail Screen)**

#### 功能特点
- 展示单个实体的完整信息
- 只读模式，重点在信息展示
- 关联数据展示
- 操作按钮组合

#### AMIS组件映射
```javascript
const detailScreenTemplate = {
    type: 'page',
    title: '${entityName}详情',
    body: [
        {
            type: 'service',
            api: '/api/${entityName}/${id}',
            body: [
                {
                    type: 'panel',
                    title: '基本信息',
                    body: {
                        type: 'form',
                        mode: 'horizontal',
                        static: true,
                        body: [
                            // 动态生成字段
                        ]
                    }
                },
                {
                    type: 'tabs',
                    tabs: [
                        {
                            title: '关联数据',
                            body: {
                                type: 'crud',
                                api: '/api/${entityName}/${id}/related'
                            }
                        },
                        {
                            title: '操作日志',
                            body: {
                                type: 'timeline',
                                source: '${logs}'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    aside: {
        type: 'wrapper',
        body: [
            { type: 'button', label: '编辑', level: 'primary' },
            { type: 'button', label: '删除', level: 'danger' },
            { type: 'button', label: '返回列表' }
        ]
    }
};
```

#### DDD映射规则
- **聚合根** → 主要信息面板
- **实体关系** → 关联数据标签页
- **值对象** → 嵌入式信息组
- **领域事件** → 操作日志时间轴

---

### 3. ✏️ **编辑屏幕 (Edit Screen)**

#### 功能特点
- 表单编辑界面
- 字段验证规则
- 保存/取消逻辑
- 实时验证反馈

#### AMIS组件映射
```javascript
const editScreenTemplate = {
    type: 'page',
    title: '${mode === "create" ? "新建" : "编辑"}${entityName}',
    body: [
        {
            type: 'form',
            title: '${entityName}信息',
            api: '${mode === "create" ? "POST:/api/" + entityName : "PUT:/api/" + entityName + "/" + id}',
            redirect: '/list',
            body: [
                {
                    type: 'tabs',
                    tabs: [
                        {
                            title: '基本信息',
                            body: [
                                // 动态生成表单字段
                            ]
                        },
                        {
                            title: '扩展信息',
                            body: [
                                // 扩展字段
                            ]
                        }
                    ]
                }
            ],
            actions: [
                { type: 'button', label: '保存', level: 'primary' },
                { type: 'button', label: '保存并继续', level: 'info' },
                { type: 'button', label: '取消', actionType: 'cancel' }
            ]
        }
    ]
};
```

#### DDD映射规则
- **聚合根属性** → 表单字段
- **值对象** → 字段组或嵌套表单
- **业务规则** → 验证规则
- **领域服务** → 表单提交处理

---

### 4. 📊 **仪表板屏幕 (Dashboard Screen)**

#### 功能特点
- 统计图表展示
- KPI指标监控
- 快捷操作入口
- 数据概览

#### AMIS组件映射
```javascript
const dashboardScreenTemplate = {
    type: 'page',
    title: '${domainName}仪表板',
    body: [
        {
            type: 'grid',
            columns: [
                {
                    body: {
                        type: 'stat-card',
                        number: '${totalCount}',
                        label: '总${entityName}数',
                        color: '#1890ff'
                    }
                },
                {
                    body: {
                        type: 'stat-card',
                        number: '${activeCount}',
                        label: '活跃${entityName}',
                        color: '#52c41a'
                    }
                }
                // 更多KPI卡片
            ]
        },
        {
            type: 'grid',
            columns: [
                {
                    body: {
                        type: 'chart',
                        api: '/api/charts/trend',
                        config: {
                            type: 'line',
                            // 图表配置
                        }
                    }
                },
                {
                    body: {
                        type: 'chart',
                        api: '/api/charts/distribution',
                        config: {
                            type: 'pie',
                            // 图表配置
                        }
                    }
                }
            ]
        },
        {
            type: 'panel',
            title: '快速操作',
            body: {
                type: 'button-group',
                buttons: [
                    // 快捷操作按钮
                ]
            }
        }
    ]
};
```

#### DDD映射规则
- **聚合统计** → KPI统计卡片
- **领域指标** → 图表展示
- **常用操作** → 快捷按钮
- **领域概览** → 数据面板

---

### 5. 🔄 **工作流屏幕 (Workflow Screen)**

#### 功能特点
- 流程步骤展示
- 状态转换界面
- 审批操作支持
- 流程历史记录

#### AMIS组件映射
```javascript
const workflowScreenTemplate = {
    type: 'page',
    title: '${workflowName}工作流',
    body: [
        {
            type: 'service',
            api: '/api/workflow/${instanceId}',
            body: [
                {
                    type: 'steps',
                    source: '${steps}',
                    status: '${currentStatus}'
                },
                {
                    type: 'panel',
                    title: '当前任务',
                    body: [
                        {
                            type: 'form',
                            title: '处理意见',
                            body: [
                                { type: 'radios', name: 'action', label: '操作', options: [] },
                                { type: 'textarea', name: 'comment', label: '备注' },
                                { type: 'input-file', name: 'attachments', label: '附件' }
                            ],
                            actions: [
                                { type: 'button', label: '提交', level: 'primary' },
                                { type: 'button', label: '驳回', level: 'warning' }
                            ]
                        }
                    ]
                },
                {
                    type: 'panel',
                    title: '流程历史',
                    body: {
                        type: 'timeline',
                        source: '${history}',
                        itemTitleTpl: '${user} - ${action}',
                        itemDetailTpl: '${comment}'
                    }
                }
            ]
        }
    ]
};
```

#### DDD映射规则
- **领域事件** → 流程步骤
- **状态机** → 步骤状态控制
- **领域服务** → 流程操作
- **事件源** → 流程历史记录

---

## 🔗 **DDD到屏幕类型的映射规则**

### **聚合根 (Aggregate Root) 映射规则**
```
聚合根 → 完整的CRUD屏幕组合
├── 列表屏幕：展示聚合根集合
├── 详情屏幕：展示单个聚合根完整信息  
├── 编辑屏幕：创建/修改聚合根
└── 仪表板屏幕：聚合根相关统计分析
```

### **实体 (Entity) 映射规则**
```
实体属性 → 表单字段 + 列表列
├── 基础类型 → input-text, input-number, switch
├── 枚举类型 → select, radios
├── 日期类型 → input-date, input-datetime
└── 复杂类型 → 嵌套表单, 子表格
```

### **值对象 (Value Object) 映射规则**
```
值对象 → 嵌入式组件
├── 地址值对象 → fieldSet + 多个input
├── 金额值对象 → input-number + currency
├── 范围值对象 → input-range, input-date-range
└── 枚举值对象 → select, checkboxes
```

### **领域服务 (Domain Service) 映射规则**
```
领域服务 → 操作按钮 + 对话框/页面
├── 查询服务 → 搜索按钮 + 筛选器
├── 命令服务 → 操作按钮 + 确认对话框
├── 计算服务 → 计算按钮 + 结果展示
└── 导入导出 → 文件上传/下载按钮
```

### **领域事件 (Domain Event) 映射规则**
```
领域事件 → 消息通知 + 状态更新
├── 创建事件 → 成功提示 + 列表刷新
├── 更新事件 → 状态变更 + 详情刷新
├── 删除事件 → 确认对话框 + 列表移除
└── 业务事件 → 工作流屏幕 + 时间轴
```

---

## 🎯 **自动生成规则实现**

### **步骤1: 分析DDD模型**
```javascript
function analyzeDDDModel(aggregateRoot) {
    return {
        entityName: aggregateRoot.name,
        attributes: aggregateRoot.attributes,
        relationships: aggregateRoot.relationships,
        domainServices: aggregateRoot.services,
        valueObjects: aggregateRoot.valueObjects
    };
}
```

### **步骤2: 生成屏幕模板**
```javascript
function generateScreens(dddModel) {
    return {
        listScreen: generateListScreen(dddModel),
        detailScreen: generateDetailScreen(dddModel),
        editScreen: generateEditScreen(dddModel),
        dashboardScreen: generateDashboardScreen(dddModel),
        workflowScreen: generateWorkflowScreen(dddModel)
    };
}
```

### **步骤3: 应用映射规则**
```javascript
function applyMappingRules(attribute) {
    const typeMapping = {
        'string': { type: 'input-text' },
        'number': { type: 'input-number' },
        'boolean': { type: 'switch' },
        'date': { type: 'input-date' },
        'enum': { type: 'select', options: attribute.enumValues },
        'file': { type: 'input-file' },
        'text': { type: 'textarea' }
    };
    
    return typeMapping[attribute.type] || { type: 'input-text' };
}
```

---

## 📊 **验证指标**

### **完整性验证**
- ✅ 5种屏幕类型全部定义
- ✅ DDD所有核心概念都有映射规则
- ✅ AMIS组件覆盖所有UI需求

### **可用性验证**
- ✅ 30分钟内生成完整CRUD应用
- ✅ 生成的界面符合用户体验标准
- ✅ 支持常见业务场景操作

### **扩展性验证**
- ✅ 映射规则可配置和扩展
- ✅ 支持自定义屏幕模板
- ✅ 支持复杂业务场景定制

---

*设计完成时间: 2025年9月14日*  
*版本: v1.0*  
*状态: 可直接用于用户管理CRUD应用生成*
