# 📱 DDD元数据平台 - 屏幕定义Schema系统

## 🎯 系统概述

屏幕定义Schema系统是DDD元数据驱动开发平台的核心组件，提供了标准化的B端应用界面定义规范。通过JSON Schema技术，实现了屏幕、字段、布局的声明式配置，支持复杂的业务场景和灵活的界面定制。

## 🏗️ 架构概览

```
screen-definition.schemas/
├── 📋 核心Schema文件
│   ├── screen.schema.json              # 主屏幕定义Schema
│   ├── screen-fields.schema.json       # 屏幕字段核心定义
│   ├── field-definition.schema.json    # 完整字段定义Schema
│   ├── form-layout.schema.json         # 表单布局Schema
│   ├── form-layout-presets.schema.json # 布局预设配置
│   └── screen-reference.schema.json    # 屏幕引用Schema ⭐ 新增
│
├── 📚 文档和指南
│   ├── schemas-architecture.md         # 架构说明文档
│   ├── QUICK_START_GUIDE.md           # 快速入门指南
│   ├── SCREEN_DEFINITION_EXAMPLES.md  # 详细使用示例
│   ├── SCREEN_REFERENCE_GUIDE.md      # 屏幕引用指南 ⭐ 新增
│   ├── VALIDATION_TOOLS.md            # 验证工具说明
│   └── README.md                      # 本文档
│
└── 🧪 示例和测试
    ├── examples/                      # 使用示例文件
    ├── tests/                        # 测试用例
    └── validation/                   # 验证脚本
```

## ✨ 核心特性

### 🎨 丰富的屏幕类型
- **27种屏幕类型**: 覆盖所有B端应用场景
- **8大屏幕分类**: BUSINESS、INTERACTION、NOTIFICATION、LAYOUT、ANALYSIS、SYSTEM、MOBILE、CUSTOM
- **智能分类**: 基于用途和交互方式的科学分类

### 🔗 屏幕引用机制 ⭐ 核心功能
- **容器嵌入**: 在对话框、抽屉、标签页等容器中嵌入已定义屏幕
- **数据绑定**: 支持父子屏幕间的数据传递和双向绑定
- **生命周期**: 完整的加载、显示、关闭生命周期管理
- **性能优化**: 懒加载、缓存、预加载等性能优化策略

### 📋 强大的字段系统
- **25+字段类型**: 从基础的TEXT到复杂的TABLE
- **智能验证**: 内置常用验证规则和自定义验证器
- **动态行为**: 支持条件显示、联动更新、事件响应

### 🎛️ 灵活的布局系统
- **响应式设计**: 自适应不同屏幕尺寸
- **网格布局**: 12列栅格系统，支持跨列和独占行
- **智能规则**: 基于字段类型的自动布局优化
- **预设模板**: 5种常用布局预设，开箱即用

### 🔧 完善的工具链
- **Schema验证**: 严格的JSON Schema验证
- **开发工具**: 验证脚本、测试用例、报告生成
- **文档系统**: 完整的使用指南和最佳实践

## 🚀 快速开始

### 1. 5分钟上手
```json
{
  "id": "my_first_screen",
  "name": "我的第一个屏幕",
  "type": "EDIT_PAGE",
  "category": "BUSINESS",
  
  "formLayout": {
    "layoutType": "GRID",
    "columns": 2
  },
  
  "fields": [
    {
      "id": "field_name",
      "name": "name",
      "label": "姓名",
      "type": "TEXT",
      "validation": { "required": true }
    }
  ]
}
```

### 2. 使用屏幕引用机制 ⭐ 强大功能
```json
{
  "actions": [
    {
      "id": "action_open_user_dialog",
      "name": "编辑用户",
      "type": "OPEN_SCREEN_REFERENCE",
      "target": {
        "type": "SCREEN_REFERENCE",
        "screenId": "screen_user_edit",
        "containerType": "DIALOG",
        "containerProps": {
          "title": "用户编辑",
          "width": "800px"
        },
        "dataBinding": {
          "parentToChild": {
            "userId": "${selectedUserId}",
            "mode": "EDIT"
          },
          "childToParent": {
            "onSuccess": "refreshUserList"
          }
        }
      }
    }
  ]
}
```

### 3. 选择合适的模板
- **标准编辑表单**: 适用于大部分业务数据录入
- **主从表页面**: 适用于订单、发票等一对多关系
- **列表查询页面**: 适用于数据展示和检索
- **仪表盘页面**: 适用于数据分析和监控
- **嵌入式对话框**: 在现有页面中打开子页面 ⭐ 新增

### 4. 使用布局预设
```json
{
  "formLayout": {
    "$ref": "../presets/form-layout-presets.schema.json#/presets/standardBusinessForm"
  }
}
```

## 📊 支持的屏幕类型

### 业务页面 (8种)
| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `LIST_PAGE` | 列表页面 | 数据列表、表格展示 |
| `EDIT_PAGE` | 编辑页面 | 数据录入、信息修改 |
| `DETAIL_PAGE` | 详情页面 | 信息查看、详情展示 |
| `SEARCH_PAGE` | 搜索页面 | 高级搜索、条件筛选 |
| `DASHBOARD_PAGE` | 仪表盘 | 数据分析、统计报告 |
| `WIZARD_PAGE` | 向导页面 | 分步骤操作、引导流程 |
| `MASTER_DETAIL_PAGE` | 主从页面 | 主子表编辑、关联数据 |
| `REPORT_PAGE` | 报表页面 | 报表设计、数据展示 |

### 交互对话框 (6种)
| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `FORM_DIALOG` | 表单对话框 | 快速录入、简单编辑 |
| `CONFIRM_DIALOG` | 确认对话框 | 操作确认、风险提示 |
| `INFO_DIALOG` | 信息对话框 | 详情查看、信息展示 |
| `SELECT_DIALOG` | 选择对话框 | 数据选择、关联选择 |
| `UPLOAD_DIALOG` | 上传对话框 | 文件上传、批量导入 |
| `SETTINGS_DIALOG` | 设置对话框 | 参数配置、偏好设置 |

## 🎨 字段类型系统

### 基础输入类型
- `TEXT` - 单行文本
- `TEXTAREA` - 多行文本  
- `NUMBER` - 数字输入
- `PASSWORD` - 密码输入
- `EMAIL` - 邮箱输入
- `PHONE` - 电话输入
- `URL` - 网址输入

### 选择类型
- `SELECT` - 下拉选择
- `RADIO` - 单选按钮
- `CHECKBOX` - 复选框
- `SWITCH` - 开关切换
- `TREE_SELECT` - 树形选择

### 日期时间类型
- `DATE` - 日期选择
- `TIME` - 时间选择
- `DATETIME` - 日期时间
- `DATE_RANGE` - 日期范围

### 特殊类型
- `FILE` - 文件上传
- `IMAGE` - 图片上传
- `RICH_TEXT` - 富文本编辑
- `CODE` - 代码编辑
- `JSON` - JSON编辑
- `TABLE` - 表格编辑

## 🎛️ 布局配置

### 网格布局
```json
{
  "formLayout": {
    "layoutType": "GRID",
    "columns": 3,
    "responsive": {
      "xs": 1, "sm": 2, "md": 3, "lg": 3, "xl": 4
    },
    "spacing": {
      "horizontal": "16px",
      "vertical": "16px"  
    }
  }
}
```

### 字段布局控制
```json
{
  "layoutConfig": {
    "span": 12,      // 跨列数
    "fullWidth": true, // 占满宽度
    "newLine": true   // 独占新行
  }
}
```

### 智能布局规则
```json
{
  "fieldLayoutRules": [
    {
      "ruleName": "备注字段独占一行",
      "condition": { "fieldName": "remark" },
      "layout": { "span": 12, "newLine": true },
      "priority": 100
    }
  ]
}
```

## 📚 文档导航

### 🎯 开发者文档
- [🚀 快速入门指南](./QUICK_START_GUIDE.md) - 5分钟上手使用
- [📋 详细使用示例](./SCREEN_DEFINITION_EXAMPLES.md) - 完整的实际案例
- [🔗 屏幕引用指南](./SCREEN_REFERENCE_GUIDE.md) - 屏幕嵌入和复用 ⭐ 新增
- [🏗️ 架构说明文档](./schemas-architecture.md) - 深入了解设计理念

### 🔧 技术参考
- [🔍 验证工具说明](./VALIDATION_TOOLS.md) - 质量保证工具
- [📊 Schema文件索引](#schema文件说明) - 技术规范参考

### 💡 最佳实践
- [命名规范](#命名规范) - 统一的命名约定
- [性能优化](#性能优化) - 提升渲染性能
- [用户体验](#用户体验) - 界面设计原则
- [屏幕引用最佳实践](./SCREEN_REFERENCE_GUIDE.md#最佳实践) - 引用机制优化建议 ⭐ 新增

## 📋 Schema文件说明

### 核心Schema文件

#### 1. screen.schema.json
- **用途**: 屏幕定义的主Schema文件
- **功能**: 定义屏幕的基本结构、类型、分类
- **依赖**: 引用字段定义、布局配置Schema

#### 2. screen-fields.schema.json  
- **用途**: 屏幕字段的核心定义
- **功能**: 定义屏幕类型枚举、分类枚举
- **特色**: 27种屏幕类型，8大分类体系

#### 3. field-definition.schema.json
- **用途**: 完整的字段定义Schema
- **功能**: 字段类型、验证规则、布局配置
- **特色**: 25+字段类型，丰富的验证规则

#### 4. form-layout.schema.json
- **用途**: 表单布局系统Schema
- **功能**: 网格布局、响应式配置、智能规则
- **特色**: 12列栅格，自适应断点

#### 5. form-layout-presets.schema.json
- **用途**: 布局预设配置Schema
- **功能**: 常用布局模板，开箱即用
- **特色**: 5种预设，覆盖主要使用场景

#### 6. screen-reference.schema.json ⭐ 新增
- **用途**: 屏幕引用系统Schema
- **功能**: 容器嵌入、数据绑定、生命周期管理
- **特色**: 8种容器类型，4种引用模式，完整的数据流管理

## 🎯 设计原则

### 1. 声明式配置
- 通过JSON配置而非代码实现界面
- 配置即文档，便于维护和理解
- 支持可视化设计工具生成配置

### 2. 类型安全
- 严格的JSON Schema验证
- 编译时类型检查
- 运行时数据验证

### 3. 扩展性
- 开放的字段类型系统
- 可插拔的验证器
- 自定义布局规则

### 4. 组合性 ⭐ 新增
- 屏幕引用和嵌入机制
- 灵活的容器和数据绑定
- 可复用的界面组件

### 5. 用户体验
- 响应式设计优先
- 智能布局算法
- 无障碍访问支持

## 🔧 开发工具

### 验证工具
```bash
# Node.js验证
node validate-schemas.js

# Python验证  
python validate_schemas.py

# 批量验证
npm run validate:all
```

### 测试工具
```bash
# 运行测试用例
npm test

# 生成测试报告
npm run test:report
```

### 构建工具
```bash
# 生成TypeScript类型定义
npm run build:types

# 生成文档
npm run build:docs
```

## 📈 版本规划

### v1.0 (当前版本)
- ✅ 基础屏幕类型系统
- ✅ 完整字段定义Schema
- ✅ 响应式布局系统
- ✅ 验证工具和文档

### v1.1 (计划中)
- 🔄 主题和样式定制
- 🔄 国际化支持
- 🔄 动画和过渡效果
- 🔄 可视化设计器

### v2.0 (未来版本)
- 📋 组件级复用
- 📋 微前端支持
- 📋 实时协同编辑
- 📋 AI辅助设计

## 🤝 贡献指南

### 贡献流程
1. Fork本项目
2. 创建特性分支
3. 提交变更
4. 创建Pull Request

### 开发规范
- 遵循JSON Schema标准
- 编写完整的测试用例
- 更新相关文档
- 通过代码审查

## 📞 技术支持

### 问题反馈
- GitHub Issues: 提交Bug和功能请求
- 技术讨论: 参与社区讨论
- 文档贡献: 改进文档和示例

### 联系方式
- 项目维护者: DDD元数据平台团队
- 技术支持: 通过GitHub Issues
- 社区交流: 技术交流群

---

**DDD元数据平台 - 让B端应用开发更简单、更高效、更标准** 🚀
