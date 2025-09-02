<!--
 * @Author: liuxin liuin@sweib.com
 * @Date: 2025-09-01 15:37:57
 * @LastEditors: liuxin liuin@sweib.com
 * @LastEditTime: 2025-09-01 17:52:31
 * @FilePath: /yudao-cloud-mini/apps/ddd-amis-web/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# DDD-AMIS 低代码开发平台

基于 Vite + React + TypeScript + AMIS 的前端开发平台，支持DDD模型驱动的amis配置自动生成和可视化编辑。

## 🚀 功能特性

### 1. 动态CRUD生成
- 基于 `amis-screen-definition.json` 自动生成amis配置
- 支持模型绑定和字段映射
- 自动应用验证规则和业务约束

### 2. 可视化编辑器
- 集成 `amis-editor` 可视化编辑amis配置
- 支持拖拽式组件配置
- 实时预览和配置保存

### 3. DDD模型集成
- 支持聚合根、实体、值对象等DDD概念
- 自动生成amis组件配置
- 业务规则和验证规则继承

### 4. 屏幕管理
- 多屏幕配置管理
- 屏幕切换和预览
- 配置版本管理

## 🛠️ 技术栈

- **前端框架**: React 16 + TypeScript
- **构建工具**: Vite
- **低代码框架**: AMIS
- **可视化编辑器**: amis-editor
- **样式**: CSS3 + 响应式设计

## 📦 安装依赖

```bash
npm install
```

## 🚀 启动开发服务器

```bash
npm run dev
```

打开浏览器访问: http://localhost:5173

## 🏗️ 构建生产版本

```bash
npm run build
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # React组件
│   └── AmisEditor.tsx  # amis可视化编辑器
├── services/           # 服务层
│   └── dddParser.ts   # DDD模型解析器
├── types/              # TypeScript类型定义
│   └── ddd.ts         # DDD相关类型
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── App.css            # 应用样式
```

## 🎯 使用说明

### 1. 加载屏幕定义

1. 点击"加载屏幕定义"按钮
2. 系统会自动加载 `amis-screen-definition.json` 文件
3. 加载成功后可以在不同模式间切换

### 2. 动态CRUD模式

- 选择要显示的屏幕
- 系统根据DDD模型自动生成amis配置
- 支持CRUD操作和表单验证

### 3. 可视化编辑器模式

- 使用amis-editor编辑amis配置
- 支持拖拽式组件配置
- 实时预览和配置保存

### 4. 屏幕定义预览

- 查看所有可用屏幕
- 查看模型映射配置
- 了解DDD模型结构

## 🔧 配置说明

### 屏幕定义文件路径

在 `src/App.tsx` 中配置：

```typescript
const definition = await dddParser.loadScreenDefinition('/docs/DDD元数据驱动开发平台-v1.0/samples/order-inv-pay/amis-screen-definition.json');
```

### 环境配置

- **开发环境**: 启用Mock数据和调试日志
- **生产环境**: 禁用Mock，使用真实API

## 🔌 扩展开发

### 添加新的DDD模型

1. 在 `src/types/ddd.ts` 中定义新的类型
2. 在 `src/services/dddParser.ts` 中添加解析逻辑
3. 在组件中使用新的模型

### 自定义amis组件

1. 在 `src/components/` 中创建新的组件
2. 在 `AmisEditor` 中注册自定义组件
3. 配置组件的属性和验证规则

### 集成真实API

1. 修改 `src/services/dddParser.ts` 中的API调用
2. 配置环境变量和API地址
3. 实现错误处理和重试机制

## 🐛 常见问题

### Q: 加载屏幕定义失败怎么办？

A: 检查文件路径是否正确，确保 `amis-screen-definition.json` 文件存在且格式正确。

### Q: amis-editor无法正常显示？

A: 确保已正确安装 `amis-editor` 依赖，检查浏览器控制台是否有错误信息。

### Q: 如何添加新的验证规则？

A: 在DDD模型中定义业务规则，系统会自动应用到amis配置中。

## 📝 开发计划

- [ ] 支持更多DDD模型类型
- [ ] 添加配置模板管理
- [ ] 集成代码生成器
- [ ] 支持团队协作
- [ ] 添加权限管理
- [ ] 支持多主题切换

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**注意**: 本项目依赖 `amis-screen-definition.json` 文件，请确保该文件存在且格式正确。
