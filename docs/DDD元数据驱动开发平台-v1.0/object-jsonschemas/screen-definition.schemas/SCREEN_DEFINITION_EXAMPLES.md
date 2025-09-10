# 📋 B端屏幕定义使用示例

本文档展示了如何使用我们的屏幕定义Schema来创建各种类型的B端应用页面。

## 🎯 1. 标准业务表单示例

### 1.1 用户编辑表单
```json
{
  "id": "screen_user_edit",
  "name": "用户编辑表单",
  "title": "用户信息编辑",
  "description": "用户基本信息和详细信息的编辑表单",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  "path": "/user/edit",
  "icon": "user-edit",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 2,
    "responsive": {
      "xs": 1,
      "sm": 1,
      "md": 2,
      "lg": 2,
      "xl": 3
    },
    "labelPosition": "LEFT",
    "labelWidth": "120px",
    "spacing": {
      "horizontal": "16px",
      "vertical": "16px"
    },
    "sections": [
      {
        "id": "section_basic",
        "title": "基础信息",
        "description": "用户的基本信息",
        "fieldIds": ["field_username", "field_realname", "field_email", "field_phone"],
        "order": 1
      },
      {
        "id": "section_detail",
        "title": "详细信息",
        "description": "用户的详细信息",
        "collapsible": true,
        "fieldIds": ["field_birthday", "field_gender", "field_address", "field_remark"],
        "order": 2
      }
    ],
    "fieldLayoutRules": [
      {
        "ruleName": "备注字段独占一行",
        "condition": {
          "fieldName": "remark"
        },
        "layout": {
          "span": 12,
          "fullWidth": true,
          "newLine": true
        },
        "priority": 100
      },
      {
        "ruleName": "地址字段独占一行",
        "condition": {
          "fieldName": "address"
        },
        "layout": {
          "span": 12,
          "fullWidth": true
        },
        "priority": 90
      }
    ]
  },
  
  "fields": [
    {
      "id": "field_username",
      "name": "username",
      "label": "用户名",
      "type": "TEXT",
      "dataType": "STRING",
      "validation": {
        "required": true,
        "pattern": "^[a-zA-Z0-9_]{4,20}$",
        "minLength": 4,
        "maxLength": 20
      },
      "placeholder": "请输入用户名",
      "help": "用户名由4-20位字母、数字、下划线组成",
      "order": 1
    },
    {
      "id": "field_realname",
      "name": "realname",
      "label": "真实姓名",
      "type": "TEXT",
      "dataType": "STRING",
      "validation": {
        "required": true,
        "maxLength": 50
      },
      "placeholder": "请输入真实姓名",
      "order": 2
    },
    {
      "id": "field_email",
      "name": "email",
      "label": "邮箱",
      "type": "EMAIL",
      "dataType": "STRING",
      "validation": {
        "required": true,
        "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
      },
      "placeholder": "请输入邮箱地址",
      "order": 3
    },
    {
      "id": "field_phone",
      "name": "phone",
      "label": "手机号",
      "type": "PHONE",
      "dataType": "STRING",
      "validation": {
        "pattern": "^1[3-9]\\d{9}$"
      },
      "placeholder": "请输入手机号码",
      "order": 4
    },
    {
      "id": "field_birthday",
      "name": "birthday",
      "label": "生日",
      "type": "DATE",
      "dataType": "DATE",
      "placeholder": "请选择生日",
      "order": 5
    },
    {
      "id": "field_gender",
      "name": "gender",
      "label": "性别",
      "type": "RADIO",
      "dataType": "STRING",
      "options": [
        { "label": "男", "value": "M" },
        { "label": "女", "value": "F" }
      ],
      "defaultValue": "M",
      "order": 6
    },
    {
      "id": "field_address",
      "name": "address",
      "label": "详细地址",
      "type": "TEXTAREA",
      "dataType": "STRING",
      "layoutConfig": {
        "span": 12,
        "fullWidth": true
      },
      "validation": {
        "maxLength": 500
      },
      "placeholder": "请输入详细地址",
      "order": 7
    },
    {
      "id": "field_remark",
      "name": "remark",
      "label": "备注信息",
      "type": "TEXTAREA",
      "dataType": "STRING",
      "layoutConfig": {
        "span": 12,
        "fullWidth": true,
        "newLine": true
      },
      "validation": {
        "maxLength": 1000
      },
      "placeholder": "请输入备注信息",
      "order": 8
    }
  ],
  
  "dataTypes": {
    "primary": "SINGLE_TABLE",
    "subTypes": ["USER_PROFILE"]
  },
  
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

## 📊 2. 主从表页面示例

### 2.1 订单管理页面
```json
{
  "id": "screen_order_master_detail",
  "name": "订单管理",
  "title": "订单信息管理",
  "description": "订单主表和明细子表的联动管理",
  "type": "MASTER_DETAIL_PAGE",
  "category": "BUSINESS",
  "path": "/order/manage",
  "icon": "order",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 3,
    "sections": [
      {
        "id": "section_order_header",
        "title": "订单信息",
        "fieldIds": ["field_order_no", "field_customer", "field_order_date", "field_status"],
        "order": 1
      },
      {
        "id": "section_order_details",
        "title": "订单明细",
        "fieldIds": ["field_order_items"],
        "columns": 1,
        "order": 2
      }
    ]
  },
  
  "fields": [
    {
      "id": "field_order_no",
      "name": "orderNo",
      "label": "订单号",
      "type": "TEXT",
      "validation": {
        "required": true
      },
      "readonly": true
    },
    {
      "id": "field_customer",
      "name": "customer",
      "label": "客户",
      "type": "SELECT",
      "dataSource": {
        "type": "API",
        "url": "/api/customers",
        "method": "GET",
        "valueField": "id",
        "labelField": "name"
      },
      "validation": {
        "required": true
      }
    },
    {
      "id": "field_order_date",
      "name": "orderDate",
      "label": "订单日期",
      "type": "DATE",
      "validation": {
        "required": true
      },
      "defaultValue": "today"
    },
    {
      "id": "field_status",
      "name": "status",
      "label": "订单状态",
      "type": "SELECT",
      "options": [
        { "label": "草稿", "value": "DRAFT" },
        { "label": "已提交", "value": "SUBMITTED" },
        { "label": "已确认", "value": "CONFIRMED" },
        { "label": "已完成", "value": "COMPLETED" },
        { "label": "已取消", "value": "CANCELLED" }
      ],
      "defaultValue": "DRAFT"
    },
    {
      "id": "field_order_items",
      "name": "orderItems",
      "label": "订单明细",
      "type": "TABLE",
      "dataType": "ARRAY",
      "layoutConfig": {
        "span": 12,
        "fullWidth": true
      },
      "props": {
        "columns": [
          { "title": "商品名称", "dataIndex": "productName", "editable": true },
          { "title": "规格", "dataIndex": "specification", "editable": true },
          { "title": "数量", "dataIndex": "quantity", "editable": true, "type": "number" },
          { "title": "单价", "dataIndex": "unitPrice", "editable": true, "type": "number" },
          { "title": "金额", "dataIndex": "amount", "calculated": true }
        ],
        "addable": true,
        "deletable": true
      }
    }
  ],
  
  "dataTypes": {
    "primary": "MASTER_DETAIL",
    "subTypes": ["ORDER_HEADER", "ORDER_DETAIL"]
  }
}
```

## 🔔 3. 通知类型示例

### 3.1 消息提示
```json
{
  "id": "screen_success_toast",
  "name": "成功提示",
  "type": "MESSAGE_TOAST",
  "category": "NOTIFICATION",
  "content": {
    "message": "操作成功",
    "type": "success",
    "duration": 3000,
    "showClose": true
  }
}
```

### 3.2 确认对话框
```json
{
  "id": "screen_delete_confirm",
  "name": "删除确认",
  "type": "CONFIRM_DIALOG",
  "category": "INTERACTION",
  "content": {
    "title": "删除确认",
    "message": "确定要删除选中的记录吗？此操作不可恢复。",
    "confirmText": "确定删除",
    "cancelText": "取消",
    "type": "warning"
  }
}
```

## 📈 4. 仪表盘页面示例

### 4.1 业务仪表盘
```json
{
  "id": "screen_business_dashboard",
  "name": "业务仪表盘",
  "title": "业务数据总览",
  "type": "DASHBOARD_PAGE",
  "category": "ANALYSIS",
  "path": "/dashboard/business",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 4,
    "spacing": {
      "horizontal": "16px",
      "vertical": "16px"
    }
  },
  
  "components": [
    {
      "id": "comp_sales_summary",
      "type": "STATISTIC_CARD",
      "title": "销售概况",
      "span": 4,
      "props": {
        "metrics": [
          { "label": "今日销售额", "value": "¥128,690", "trend": "up", "trendValue": "12.5%" },
          { "label": "本月销售额", "value": "¥2,456,890", "trend": "up", "trendValue": "8.3%" },
          { "label": "今日订单", "value": "156", "trend": "down", "trendValue": "-2.1%" },
          { "label": "本月订单", "value": "3,247", "trend": "up", "trendValue": "15.2%" }
        ]
      }
    },
    {
      "id": "comp_sales_chart",
      "type": "LINE_CHART",
      "title": "销售趋势",
      "span": 2,
      "props": {
        "dataSource": "/api/sales/trend",
        "xField": "date",
        "yField": "amount"
      }
    },
    {
      "id": "comp_category_chart",
      "type": "PIE_CHART",
      "title": "商品分类占比",
      "span": 2,
      "props": {
        "dataSource": "/api/products/category-stats",
        "angleField": "value",
        "colorField": "category"
      }
    }
  ],
  
  "dataTypes": {
    "primary": "MULTI_DIMENSIONAL",
    "subTypes": ["SALES_DATA", "ORDER_DATA", "PRODUCT_DATA"]
  }
}
```

## 🏗️ 5. 布局预设使用示例

### 5.1 使用标准业务表单预设
```json
{
  "id": "screen_product_edit",
  "name": "商品编辑",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  
  "formLayout": {
    "$ref": "../presets/form-layout-presets.schema.json#/presets/standardBusinessForm"
  },
  
  "fields": [
    {
      "id": "field_product_name",
      "name": "productName",
      "label": "商品名称",
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "id": "field_product_code",
      "name": "productCode", 
      "label": "商品编码",
      "type": "TEXT",
      "validation": { "required": true }
    },
    {
      "id": "field_category",
      "name": "category",
      "label": "商品分类",
      "type": "TREE_SELECT"
    },
    {
      "id": "field_price",
      "name": "price",
      "label": "销售价格",
      "type": "NUMBER",
      "validation": { "min": 0 }
    },
    {
      "id": "field_description",
      "name": "description",
      "label": "商品描述",
      "type": "TEXTAREA",
      "validation": { "maxLength": 1000 }
    },
    {
      "id": "field_remark",
      "name": "remark",
      "label": "备注信息",
      "type": "TEXTAREA"
    }
  ]
}
```

### 5.2 移动端表单示例
```json
{
  "id": "screen_mobile_user_profile",
  "name": "个人资料",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  
  "formLayout": {
    "$ref": "../presets/form-layout-presets.schema.json#/presets/mobileForm"
  },
  
  "fields": [
    {
      "id": "field_avatar",
      "name": "avatar", 
      "label": "头像",
      "type": "IMAGE"
    },
    {
      "id": "field_nickname",
      "name": "nickname",
      "label": "昵称",
      "type": "TEXT"
    },
    {
      "id": "field_signature",
      "name": "signature",
      "label": "个性签名",
      "type": "TEXTAREA"
    }
  ]
}
```

## 💡 使用建议

### 6.1 布局规则优先级
1. 字段级别的 `layoutConfig` (最高优先级)
2. 表单布局规则 `fieldLayoutRules` 
3. 分组级别的 `columns` 设置
4. 全局的 `columns` 设置 (最低优先级)

### 6.2 响应式设计建议
- 超小屏幕(xs): 建议1列布局
- 小屏幕(sm): 建议1-2列布局
- 中等屏幕(md): 建议2-3列布局
- 大屏幕(lg/xl): 建议3-4列布局

### 6.3 字段命名约定
- 使用驼峰命名法: `userName`, `orderDate`
- 备注类字段: `remark`, `note`, `description`
- 地址类字段: `address`, `location`
- 时间类字段: `createTime`, `updateTime`

### 6.4 验证规则建议
- 必填字段务必设置 `required: true`
- 字符串字段建议设置 `maxLength`
- 数字字段建议设置 `min`, `max`
- 邮箱、手机号使用相应的 `type` 和 `pattern`

这些示例展示了如何灵活使用我们的屏幕定义Schema来构建各种复杂的B端应用界面。通过合理的布局配置和字段定义，可以快速创建符合用户体验要求的表单和页面。
