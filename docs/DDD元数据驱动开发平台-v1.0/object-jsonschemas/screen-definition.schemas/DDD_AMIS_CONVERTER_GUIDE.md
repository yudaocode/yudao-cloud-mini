# DDD-AMIS自动转换器使用指南

## 快速开始

```typescript
import { DDDToAmisAutoConverter } from './ddd-amis-auto-converter';

// 创建转换器实例
const converter = new DDDToAmisAutoConverter('./config/ddd-amis-sync-config.json');

// 启动自动同步
await converter.startAutoSync();

// 手动转换特定聚合
const screens = await converter.convertAggregate('agg_order');
```

## 核心功能

### 1. 自动监听与同步

转换器会自动监听以下文件变化：
- `./schemas/tactical-design/aggregate/*.json` - 聚合定义文件
- `./schemas/tactical-design/entity/*.json` - 实体定义文件

当检测到文件变化时，系统会：
1. 解析DDD元数据
2. 生成对应的AMIS屏幕配置
3. 保存到指定目录
4. 输出转换日志

### 2. 智能类型映射

系统提供完整的DDD数据类型到AMIS组件类型的映射：

| DDD类型 | AMIS列表组件 | AMIS表单组件 | 特殊处理 |
|---------|-------------|-------------|----------|
| STRING | text | input-text | 根据长度自动选择textarea |
| INTEGER | text | input-number | 数值验证 |
| DECIMAL | text | input-number | 精度控制 |
| BOOLEAN | switch | switch | 真假值映射 |
| ENUM | mapping | select | 自动生成选项 |
| DATE | date | input-date | 日期格式化 |
| DATETIME | datetime | input-datetime | 时间格式化 |
| EMAIL | link | input-email | 邮箱验证 |
| URL | link | input-url | 链接处理 |

### 3. 条件映射规则

系统支持基于业务上下文的条件映射：

```typescript
// 示例：根据字段长度选择不同组件
if (maxLength > 200) {
  formFieldType = 'textarea';
  listColumnType = 'text';
} else {
  formFieldType = 'input-text';
  listColumnType = 'text';
}
```

### 4. 自动验证规则生成

基于DDD约束自动生成AMIS验证规则：

| DDD约束 | AMIS验证 | 说明 |
|---------|----------|------|
| isRequired | required: true | 必填验证 |
| maxLength | maxLength: n | 最大长度 |
| pattern | matchRegexp | 正则验证 |
| isUnique | remote API | 远程唯一性检查 |
| minValue/maxValue | minimum/maximum | 数值范围 |

## 使用示例

### 基本用法

```typescript
// 1. 启动自动同步
const converter = new DDDToAmisAutoConverter('./config.json');
await converter.startAutoSync();

// 2. 程序会自动监听文件变化并同步生成AMIS配置

// 3. 手动转换（可选）
await converter.convertAggregate('agg_user');
```

### 自定义配置

```json
{
  "syncConfiguration": {
    "enabled": true,
    "watchPaths": [
      "./schemas/tactical-design/aggregate/*.json",
      "./schemas/tactical-design/entity/*.json"
    ],
    "debounceTime": 1000,
    "conflictResolution": "PRESERVE_CUSTOM"
  },
  "typeMapping": {
    "dataTypeMapping": {
      "STRING": {
        "listColumnType": "text",
        "formFieldType": "input-text",
        "conditionalMapping": [
          {
            "condition": "maxLength > 200",
            "amisType": "textarea"
          }
        ]
      }
    }
  }
}
```

### 生成的屏幕类型

系统会为每个聚合自动生成4种标准屏幕：

1. **列表屏幕** (`entity-list`)
   - CRUD表格
   - 分页、排序、搜索
   - 操作按钮（新增、编辑、删除）

2. **创建表单屏幕** (`entity-create`)
   - 完整的创建表单
   - 字段验证
   - 提交API集成

3. **编辑表单屏幕** (`entity-edit`)
   - 预填充的编辑表单
   - 数据加载API
   - 更新API集成

4. **详情屏幕** (`entity-detail`)
   - 只读详情显示
   - 格式化展示
   - 关联数据展示

## 高级特性

### 1. 业务规则映射

支持DDD业务规则到AMIS交互行为的映射：

```typescript
// DDD业务规则
businessRules: ["BR_SHOW_WHEN_VIP"]

// 自动转换为AMIS显示条件
visibleOn: "${user.vipLevel >= 3}"
```

### 2. 统一语言术语集成

自动从术语库获取显示标签：

```typescript
// DDD属性定义
{
  "name": "customerName",
  "ubiquitousLanguageTermId": "TERM_CUSTOMER_NAME"
}

// 自动生成AMIS标签
label: "客户姓名" // 从术语库获取
```

### 3. API路径自动生成

基于聚合名称自动生成标准的RESTful API路径：

```typescript
// 订单聚合自动生成：
listApi: "/api/order"           // GET 列表
createApi: "/api/order"         // POST 创建
updateApi: "/api/order/${id}"   // PUT 更新
detailApi: "/api/order/${id}"   // GET 详情
```

### 4. 冲突解决策略

当检测到手动修改的配置与自动生成的配置冲突时：

- `OVERWRITE`：直接覆盖
- `PRESERVE_CUSTOM`：保留自定义修改，备份原文件
- `MERGE`：智能合并（保留自定义字段，更新标准字段）

## 性能优化

### 1. 防抖处理

文件变化监听使用防抖机制，避免频繁的重复转换：

```json
{
  "syncConfiguration": {
    "debounceTime": 1000  // 1秒内的多次变化只触发一次转换
  }
}
```

### 2. 增量更新

只更新发生变化的实体相关的屏幕，而不是重新生成所有配置。

### 3. 备份策略

自动备份现有配置，支持版本回滚：

```json
{
  "backupStrategy": {
    "enabled": true,
    "location": "./backups/screens",
    "retentionDays": 30
  }
}
```

## 错误处理

### 常见错误及解决方案

1. **配置文件格式错误**
   ```
   ❌ 配置文件格式错误：JSON解析失败
   💡 检查config文件语法，确保JSON格式正确
   ```

2. **DDD元数据不完整**
   ```
   ❌ 聚合元数据缺少必要字段：aggregateRoot
   💡 确保聚合定义包含aggregateRoot字段
   ```

3. **类型映射失败**
   ```
   ❌ 未找到类型映射：CUSTOM_TYPE
   💡 在typeMapping配置中添加自定义类型映射
   ```

## 扩展开发

### 添加自定义类型映射

```typescript
// 扩展类型映射
converter.addCustomTypeMapping('MONEY', {
  listColumnType: 'text',
  formFieldType: 'input-number',
  props: {
    precision: 2,
    prefix: '¥'
  }
});
```

### 添加自定义屏幕生成器

```typescript
// 添加自定义屏幕类型
converter.addScreenGenerator('DASHBOARD', (entity, metadata) => {
  return {
    screenType: 'DASHBOARD',
    amisSchema: {
      type: 'page',
      body: [
        // 自定义仪表板配置
      ]
    }
  };
});
```

## 日志和监控

转换器提供详细的日志输出：

```
🚀 启动DDD-AMIS自动同步监听...
📝 检测到聚合变更: agg_order (MODIFY)
🔄 转换实体 Order 为表格列...
🔄 转换实体 Order 为表单字段...
💾 已保存屏幕配置: ./generated/order/order-list.json
✅ 成功转换聚合 agg_order，生成 4 个屏幕
```

## 注意事项

1. **文件监听权限**：确保程序有读写权限
2. **内存使用**：大型项目建议配置合适的debounceTime
3. **并发安全**：避免同时手动修改和自动同步
4. **备份重要**：启用备份策略，防止配置丢失

## 总结

DDD-AMIS自动转换器实现了DDD模型到AMIS界面的完全自动化，核心优势：

- ✅ **零重复定义**：DDD模型是唯一数据源
- ✅ **实时同步**：模型变化自动更新界面
- ✅ **智能转换**：基于业务语义的智能映射
- ✅ **标准化**：统一的界面生成规则
- ✅ **可扩展**：支持自定义映射和生成器

通过这个系统，开发团队可以专注于DDD建模，界面配置完全自动化生成，极大提升开发效率并确保模型与界面的一致性。
