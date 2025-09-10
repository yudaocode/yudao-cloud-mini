# 🚀 屏幕定义Schema快速入门指南

## 📖 概述

本指南帮助开发者快速上手使用DDD元数据平台的屏幕定义Schema系统，构建标准化的B端应用界面。

## 🎯 5分钟快速开始

### 步骤1: 了解核心概念
- **屏幕(Screen)**: 应用的一个界面页面或组件
- **字段(Field)**: 表单中的输入控件
- **布局(Layout)**: 字段在页面中的排列方式
- **验证(Validation)**: 字段的数据验证规则

### 步骤2: 选择屏幕类型
```json
{
  "type": "EDIT_PAGE",        // 编辑页面
  "category": "BUSINESS"      // 业务类型
}
```

### 步骤3: 添加基础字段
```json
{
  "fields": [
    {
      "id": "field_name",
      "name": "name", 
      "label": "姓名",
      "type": "TEXT",
      "validation": {
        "required": true,
        "maxLength": 50
      }
    }
  ]
}
```

### 步骤4: 配置表单布局
```json
{
  "formLayout": {
    "layoutType": "GRID",
    "columns": 2,
    "labelPosition": "LEFT"
  }
}
```

## 🛠️ 常用模板

### 1. 简单编辑表单模板
```json
{
  "id": "screen_simple_edit",
  "name": "简单编辑表单",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 2,
    "labelPosition": "LEFT",
    "labelWidth": "100px"
  },
  
  "fields": [
    {
      "id": "field_name",
      "name": "name",
      "label": "名称",
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "id": "field_description", 
      "name": "description",
      "label": "描述",
      "type": "TEXTAREA",
      "layoutConfig": { "span": 12 }
    }
  ],
  
  "actions": [
    { "id": "save", "name": "保存", "type": "SUBMIT" },
    { "id": "cancel", "name": "取消", "type": "CANCEL" }
  ]
}
```

### 2. 列表页面模板
```json
{
  "id": "screen_simple_list",
  "name": "简单列表页面", 
  "type": "LIST_PAGE",
  "category": "BUSINESS",
  
  "components": [
    {
      "id": "search_form",
      "type": "SEARCH_FORM",
      "fields": [
        {
          "name": "keyword",
          "label": "关键词",
          "type": "TEXT",
          "placeholder": "请输入搜索关键词"
        }
      ]
    },
    {
      "id": "data_table",
      "type": "TABLE",
      "props": {
        "columns": [
          { "title": "名称", "dataIndex": "name" },
          { "title": "创建时间", "dataIndex": "createTime" },
          { "title": "操作", "dataIndex": "action" }
        ]
      }
    }
  ]
}
```

### 3. 对话框模板
```json
{
  "id": "screen_simple_dialog",
  "name": "简单对话框",
  "type": "FORM_DIALOG", 
  "category": "INTERACTION",
  
  "props": {
    "title": "添加信息",
    "width": "600px",
    "okText": "确定",
    "cancelText": "取消"
  },
  
  "formLayout": {
    "layoutType": "VERTICAL",
    "columns": 1
  },
  
  "fields": [
    {
      "name": "title",
      "label": "标题", 
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "name": "content",
      "label": "内容",
      "type": "TEXTAREA",
      "validation": { "required": true }
    }
  ]
}
```

## 📋 常用字段类型

| 字段类型 | 说明 | 示例 |
|---------|------|------|
| `TEXT` | 单行文本 | 姓名、标题 |
| `TEXTAREA` | 多行文本 | 描述、备注 |
| `NUMBER` | 数字输入 | 年龄、价格 |
| `DATE` | 日期选择 | 生日、创建日期 |
| `SELECT` | 下拉选择 | 状态、分类 |
| `RADIO` | 单选按钮 | 性别、类型 |
| `CHECKBOX` | 多选框 | 权限、标签 |
| `EMAIL` | 邮箱输入 | 邮箱地址 |
| `PHONE` | 手机号输入 | 手机号码 |
| `PASSWORD` | 密码输入 | 登录密码 |

## 🎨 布局配置

### 网格布局
```json
{
  "formLayout": {
    "layoutType": "GRID",
    "columns": 3,              // 3列布局
    "responsive": {            // 响应式配置
      "xs": 1,                 // 超小屏1列
      "sm": 2,                 // 小屏2列
      "md": 3,                 // 中屏3列
      "lg": 3,                 // 大屏3列
      "xl": 4                  // 超大屏4列
    }
  }
}
```

### 字段跨列
```json
{
  "id": "field_description",
  "name": "description",
  "label": "描述",
  "type": "TEXTAREA",
  "layoutConfig": {
    "span": 12,               // 跨12列(占满整行)
    "fullWidth": true,        // 占满宽度
    "newLine": true           // 独占新行
  }
}
```

## ✅ 验证规则

### 常用验证
```json
{
  "validation": {
    "required": true,                    // 必填
    "minLength": 2,                      // 最小长度
    "maxLength": 50,                     // 最大长度
    "min": 0,                           // 最小值
    "max": 999999,                      // 最大值
    "pattern": "^[a-zA-Z0-9_]+$",       // 正则表达式
    "custom": {                         // 自定义验证
      "validator": "uniqueUsername",
      "message": "用户名已存在"
    }
  }
}
```

### 常用正则表达式
```json
{
  "email": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  "phone": "^1[3-9]\\d{9}$",
  "username": "^[a-zA-Z0-9_]{4,20}$",
  "chinese": "^[\\u4e00-\\u9fa5]+$",
  "idcard": "^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$"
}
```

## 🔄 动态行为

### 条件显示
```json
{
  "conditionalLogic": {
    "showWhen": {
      "field": "userType",
      "operator": "equals",
      "value": "VIP"
    }
  }
}
```

### 联动更新
```json
{
  "events": {
    "onChange": {
      "type": "UPDATE_FIELD",
      "target": "field_city",
      "action": {
        "loadOptions": "/api/cities?province=${value}"
      }
    }
  }
}
```

## 📊 数据源配置

### API数据源
```json
{
  "dataSource": {
    "type": "API",
    "url": "/api/departments",
    "method": "GET",
    "valueField": "id",
    "labelField": "name",
    "params": {
      "status": "active"
    }
  }
}
```

### 静态数据源
```json
{
  "options": [
    { "label": "启用", "value": "ACTIVE" },
    { "label": "禁用", "value": "INACTIVE" }
  ]
}
```

## 🎛️ 预设使用

### 使用标准预设
```json
{
  "formLayout": {
    "$ref": "../presets/form-layout-presets.schema.json#/presets/standardBusinessForm"
  }
}
```

### 可用预设列表
- `standardBusinessForm`: 标准业务表单(2列布局)
- `compactForm`: 紧凑表单(3列布局)
- `detailViewForm`: 详情查看表单(只读)
- `searchForm`: 搜索表单(水平布局)
- `mobileForm`: 移动端表单(1列布局)

## 🚨 常见问题

### Q1: 字段验证不生效?
**A**: 检查字段的`validation`配置是否正确，确保`required`、`pattern`等属性设置正确。

### Q2: 布局显示异常?
**A**: 检查`layoutConfig`中的`span`值是否超过总列数，确保响应式配置合理。

### Q3: 数据源加载失败?
**A**: 检查`dataSource`的`url`、`valueField`、`labelField`配置是否正确。

### Q4: 条件显示不工作?
**A**: 确保`conditionalLogic`中的`field`名称与实际字段名匹配。

## 📚 更多资源

- [详细示例](./SCREEN_DEFINITION_EXAMPLES.md) - 完整的屏幕定义示例
- [Schema文档](./schemas-architecture.md) - Schema架构说明
- [字段定义参考](./field-definition.schema.json) - 字段定义Schema
- [布局配置参考](./form-layout.schema.json) - 表单布局Schema

## 🎯 最佳实践

1. **命名规范**: 使用清晰的语义化命名
2. **布局合理**: 根据内容重要性安排布局
3. **验证完整**: 必要的字段都要加验证
4. **响应式**: 考虑不同屏幕尺寸的显示效果
5. **用户体验**: 合理的标签、提示、帮助信息

开始使用这些模板和配置，快速构建你的B端应用界面吧！
