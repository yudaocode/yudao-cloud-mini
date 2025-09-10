# 🔗 屏幕引用机制 - 详细使用指南

## 🎯 概述

屏幕引用机制允许您在对话框、抽屉、标签页等容器中嵌入已定义的屏幕。这类似于AMIS的Page组件引用机制，实现了屏幕的复用和组合。

## 🏗️ 核心概念

### 1. 屏幕引用 (Screen Reference)
- **目的**: 在容器中嵌入已定义的屏幕
- **支持容器**: DIALOG、DRAWER、TAB、COLLAPSE、CARD、MODAL、POPOVER、INLINE
- **引用模式**: EMBED、IFRAME、COMPONENT、LAZY_LOAD

### 2. 多容器支持 ⭐ 增强功能
- **容器类型**: TABS、ACCORDION、CAROUSEL、SPLIT_PANEL、GRID_LAYOUT等10种
- **动态载入**: 支持懒加载、按需加载、预加载等策略
- **容器管理**: 可增删、拖拽、折叠等交互能力

### 3. 数据绑定
- **父传子**: 主屏幕向嵌入屏幕传递数据
- **子传父**: 嵌入屏幕向主屏幕返回数据  
- **双向绑定**: 实时同步数据状态
- **容器间通信**: 多容器之间的数据流转

### 4. 生命周期管理
- **加载控制**: 预加载、懒加载、缓存策略
- **事件回调**: 开启、关闭、数据变化等事件
- **错误处理**: 加载失败、重试机制

## 📋 基础使用示例

### 示例1: 对话框中嵌入用户编辑屏幕

#### 主屏幕定义 (用户列表页面)
```json
{
  "id": "screen_user_list",
  "name": "用户列表",
  "type": "LIST_PAGE",
  "category": "BUSINESS",
  "title": "用户管理",
  "path": "/users",
  
  "components": [
    {
      "id": "user_table",
      "type": "TABLE",
      "props": {
        "columns": [
          { "title": "用户名", "dataIndex": "username" },
          { "title": "姓名", "dataIndex": "realname" },
          { "title": "邮箱", "dataIndex": "email" },
          { "title": "操作", "dataIndex": "action" }
        ]
      }
    }
  ],
  
  "actions": [
    {
      "id": "action_add_user",
      "name": "添加用户",
      "type": "OPEN_SCREEN_REFERENCE",
      "triggerType": "BUTTON_CLICK",
      "target": {
        "type": "SCREEN_REFERENCE",
        "screenId": "screen_user_edit",
        "containerType": "DIALOG",
        "containerProps": {
          "title": "添加用户",
          "width": "800px",
          "height": "600px",
          "destroyOnClose": true
        },
        "dataBinding": {
          "parentToChild": {
            "mode": "ADD",
            "defaultValues": {
              "status": "ACTIVE"
            }
          },
          "childToParent": {
            "onSuccess": "refreshTable",
            "result": "userInfo"
          }
        },
        "lifecycle": {
          "onAfterClose": "handleUserDialogClose"
        }
      },
      "style": {
        "buttonType": "primary",
        "icon": "plus"
      }
    },
    {
      "id": "action_edit_user",
      "name": "编辑用户",
      "type": "OPEN_SCREEN_REFERENCE", 
      "triggerType": "ROW_CLICK",
      "target": {
        "type": "SCREEN_REFERENCE",
        "screenId": "screen_user_edit",
        "containerType": "DIALOG",
        "containerProps": {
          "title": "编辑用户",
          "width": "800px",
          "height": "600px"
        },
        "dataBinding": {
          "parentToChild": {
            "mode": "EDIT",
            "userId": "${row.id}",
            "initialData": "${row}"
          },
          "childToParent": {
            "onSuccess": "refreshTable",
            "result": "userInfo"
          }
        }
      }
    }
  ]
}
```

#### 被引用的屏幕 (用户编辑表单)
```json
{
  "id": "screen_user_edit",
  "name": "用户编辑表单",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  "title": "用户信息",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 2,
    "labelPosition": "LEFT"
  },
  
  "fields": [
    {
      "id": "field_username",
      "name": "username",
      "label": "用户名",
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "id": "field_realname", 
      "name": "realname",
      "label": "真实姓名",
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "id": "field_email",
      "name": "email",
      "label": "邮箱",
      "type": "EMAIL",
      "validation": { "required": true }
    },
    {
      "id": "field_phone",
      "name": "phone",
      "label": "手机号",
      "type": "PHONE"
    }
  ],
  
  "actions": [
    {
      "id": "action_save",
      "name": "保存",
      "type": "SUBMIT",
      "style": "PRIMARY"
    },
    {
      "id": "action_cancel",
      "name": "取消", 
      "type": "CANCEL",
      "style": "DEFAULT"
    }
  ]
}
```

### 示例2: 抽屉中嵌入详情页面

```json
{
  "id": "screen_order_list",
  "name": "订单列表",
  "type": "LIST_PAGE",
  "category": "BUSINESS",
  
  "actions": [
    {
      "id": "action_view_detail",
      "name": "查看详情",
      "type": "OPEN_SCREEN_REFERENCE",
      "triggerType": "CELL_CLICK",
      "target": {
        "type": "SCREEN_REFERENCE",
        "screenId": "screen_order_detail",
        "containerType": "DRAWER",
        "containerProps": {
          "title": "订单详情",
          "width": "60%",
          "position": "right",
          "closable": true,
          "maskClosable": false
        },
        "dataBinding": {
          "parentToChild": {
            "orderId": "${row.id}",
            "readonly": true
          }
        },
        "performance": {
          "keepAlive": true,
          "preload": false
        }
      }
    }
  ]
}
```

### 示例3: 标签页中嵌入多个屏幕

```json
{
  "id": "screen_system_settings",
  "name": "系统设置",
  "type": "CONTAINER_LAYOUT",
  "category": "SYSTEM",
  
  "components": [
    {
      "id": "settings_tabs",
      "type": "TABS",
      "props": {
        "type": "card",
        "tabPosition": "left"
      }
    }
  ],
  
  "embeddedScreens": {
    "tab_basic_settings": {
      "type": "SCREEN_REFERENCE",
      "screenId": "screen_basic_settings",
      "containerType": "TAB",
      "containerProps": {
        "title": "基础设置",
        "key": "basic"
      },
      "referenceMode": "COMPONENT"
    },
    "tab_user_settings": {
      "type": "SCREEN_REFERENCE", 
      "screenId": "screen_user_settings",
      "containerType": "TAB",
      "containerProps": {
        "title": "用户设置",
        "key": "user"
      },
      "referenceMode": "LAZY_LOAD"
    },
    "tab_system_settings": {
      "type": "SCREEN_REFERENCE",
      "screenId": "screen_system_config",
      "containerType": "TAB", 
      "containerProps": {
        "title": "系统配置",
        "key": "system"
      },
      "conditions": {
        "requireAuth": true,
        "permissions": ["SYSTEM_CONFIG"]
      }
    }
  }
}
```

## 🔧 高级特性

### 1. 数据绑定配置

#### 父传子数据绑定
```json
{
  "dataBinding": {
    "parentToChild": {
      "userId": "${selectedUserId}",           // 简单值传递
      "userInfo": "${users[selectedIndex]}",   // 对象传递
      "mode": "EDIT",                          // 常量值
      "timestamp": "${new Date().getTime()}"   // 表达式
    }
  }
}
```

#### 子传父数据绑定
```json
{
  "dataBinding": {
    "childToParent": {
      "onSave": "handleUserSave",              // 回调函数
      "onCancel": "handleUserCancel",
      "userData": "userFormData",              // 数据字段
      "isModified": "formDirty"                // 状态字段
    }
  }
}
```

#### 双向数据绑定
```json
{
  "dataBinding": {
    "bidirectional": [
      "selectedItems",                         // 选中项双向绑定
      "filterConditions",                      // 筛选条件双向绑定
      "sortOrder"                             // 排序双向绑定
    ]
  }
}
```

### 2. 生命周期回调

```json
{
  "lifecycle": {
    "onBeforeOpen": "function(context) { console.log('即将打开:', context); }",
    "onAfterOpen": "function(context) { console.log('已经打开:', context); }",
    "onBeforeClose": "function(context) { return confirm('确定关闭吗?'); }",
    "onAfterClose": "function(context) { console.log('已经关闭:', context); }",
    "onDataChange": "function(data) { console.log('数据变化:', data); }",
    "onValidation": "function(errors) { console.log('验证结果:', errors); }"
  }
}
```

### 3. 条件显示和权限控制

```json
{
  "conditions": {
    "showWhen": {
      "field": "userRole",
      "operator": "in",
      "value": ["ADMIN", "MANAGER"]
    },
    "enableWhen": {
      "field": "recordStatus", 
      "operator": "equals",
      "value": "DRAFT"
    },
    "requireAuth": true,
    "permissions": ["USER_EDIT", "USER_VIEW"]
  }
}
```

### 4. 缓存和性能优化

```json
{
  "caching": {
    "enabled": true,
    "strategy": "memory",
    "ttl": 300,
    "key": "user_edit_${userId}"
  },
  "performance": {
    "preload": true,
    "keepAlive": true,
    "virtualScrolling": false,
    "debounceDelay": 300
  }
}
```

### 5. 错误处理和重试机制

```json
{
  "errorHandling": {
    "onLoadError": "function(error) { console.error('加载失败:', error); }",
    "fallbackScreen": "screen_error_page",
    "retryCount": 3,
    "retryDelay": 2000
  }
}
```

## 🎨 容器类型详解

### DIALOG (对话框)
```json
{
  "containerType": "DIALOG",
  "containerProps": {
    "title": "标题",
    "width": "800px",
    "height": "600px",
    "resizable": true,
    "draggable": true,
    "destroyOnClose": true,
    "animation": "fade"
  }
}
```

### DRAWER (抽屉)
```json
{
  "containerType": "DRAWER", 
  "containerProps": {
    "title": "标题",
    "width": "50%",
    "position": "right",
    "closable": true,
    "maskClosable": true,
    "keyboard": true
  }
}
```

### TAB (标签页)
```json
{
  "containerType": "TAB",
  "containerProps": {
    "title": "标签标题",
    "key": "tab1",
    "closable": false,
    "disabled": false
  }
}
```

### MODAL (模态框)
```json
{
  "containerType": "MODAL",
  "containerProps": {
    "title": "标题",
    "width": "60%",
    "centered": true,
    "maskClosable": false,
    "keyboard": false
  }
}
```

## 🚀 最佳实践

### 1. 屏幕设计原则
- **单一职责**: 每个屏幕专注一个功能
- **可复用性**: 设计通用的屏幕组件
- **数据独立**: 避免过度依赖父屏幕数据

### 2. 性能优化建议
- **懒加载**: 大屏幕或复杂屏幕使用懒加载
- **缓存策略**: 合理设置缓存提高响应速度  
- **数据最小化**: 只传递必要的数据

### 3. 用户体验优化
- **加载状态**: 显示加载进度和状态
- **错误提示**: 友好的错误信息和重试机制
- **响应式**: 适配不同屏幕尺寸

### 4. 开发和维护
- **命名规范**: 清晰的屏幕和字段命名
- **文档齐全**: 完整的屏幕用途和参数说明
- **版本管理**: 屏幕引用的版本兼容性

## 💡 使用场景

### 1. 表单弹窗
- 列表页面的新增/编辑对话框
- 快速录入表单
- 确认和选择对话框

### 2. 详情查看
- 数据详情抽屉
- 预览弹窗
- 关联信息展示

### 3. 多步骤流程
- 向导式操作
- 分步表单填写
- 流程审批界面

### 4. 多容器复合界面 ⭐ 新增场景
- 系统设置的多标签页面
- 仪表盘的网格布局展示
- 工作台的动态标签页
- 数据分析的分面板显示
- 文档编辑的分屏模式

### 5. 动态工作空间
- 可增删的标签页工作台
- 用户自定义布局
- 多任务并行处理
- 个性化界面配置

## 🔗 相关文档

### 📚 详细指南
- [多容器动态载入指南](./MULTI_CONTAINER_GUIDE.md) - 专门的多容器使用说明 ⭐ 新增
- [AMIS-DDD增强器指南](./AMIS_DDD_ENHANCER_GUIDE.md) - 减少80%开发工作量的革命性方案 🚀 **强烈推荐**
- [AMIS Schema优化计划](./AMIS_SCHEMA_OPTIMIZATION_PLAN.md) - 从抽象定义到AMIS原生的优化策略
- [屏幕引用对比分析](./SCREEN_REFERENCE_COMPARISON.md) - 与传统方式的详细对比

### 🎯 实际应用
- [订单管理优化示例](./examples/order-management-optimized.json) - AMIS-DDD增强器实战案例 ⭐
- [复合系统设置页面示例](./examples/system-settings-multi-container.json) - 多标签页设置
- [网格仪表盘示例](./examples/grid-dashboard.json) - 网格布局应用
- [动态工作台示例](./examples/dynamic-workspace.json) - 可增删标签页

### 🚀 开发效率提升
- **传统抽象Schema方式**: 学习成本高，开发周期长，维护困难
- **AMIS-DDD增强器方式**: 开发效率提升5倍，维护成本降低90% 🏆

这种屏幕引用机制提供了强大的界面组合能力，让您可以像搭积木一样构建复杂的应用界面！ 🎯
