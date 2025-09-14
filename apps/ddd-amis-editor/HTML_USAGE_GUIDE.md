# 🎯 DDD平台 HTML文件使用指南

## 📁 主要文件说明

### 🌟 **生产环境推荐**

#### **simple.html** - 完整版DDD编辑器
- **大小**: 272KB (最大最完整)
- **功能**: 完整的可视化编辑器
- **特点**: 
  - ✅ 拖拽式组件设计
  - ✅ 实时预览功能
  - ✅ 智能代码生成器
  - ✅ Schema验证器
  - ✅ 版本管理系统
  - ✅ 完整的工具链
- **适用**: 🎯 **主力生产环境使用**

#### **modular-fixed.html** - 轻量版DDD编辑器  
- **大小**: 34KB (轻量化)
- **功能**: 模块化版本，CDN已修复
- **特点**:
  - ✅ 动态加载AMIS
  - ✅ 基础编辑功能
  - ✅ CDN链接已修复
  - ✅ 快速启动
- **适用**: 🔧 **轻量场景或备用**

### 📋 **辅助文件**

#### **index.html** - 主页入口
- **用途**: 项目主页和导航
- **状态**: ✅ 保留

#### **preview.html** - 预览页面
- **用途**: Schema预览展示
- **状态**: ✅ 保留

## 🗑️ **可清理的文件**

### 开发测试文件 (建议删除)
- `debug-simple.html` - 调试版本
- `debug.html` - 调试版本  
- `editor.html` - 旧版编辑器
- `local-editor.html` - 本地开发版本
- `modular.html` - 有CDN问题的版本 (已被modular-fixed.html替代)
- `simple-editor.html` - 简化编辑器
- `test-amis.html` - AMIS测试文件
- `test-editor.html` - 编辑器测试文件
- `test-fixed.html` - CDN修复测试文件

## 🚀 **快速使用**

### 方法1: 使用清理脚本
```cmd
# 在 apps/ddd-amis-editor 目录下执行
cleanup.bat
```

### 方法2: 手动选择
1. **生产环境**: 直接使用 `simple.html`
2. **轻量场景**: 使用 `modular-fixed.html`
3. **主页导航**: 使用 `index.html`

## ⚠️ **重要提醒**

1. **备份**: 清理脚本会自动备份到 `backup/` 目录
2. **CDN问题**: `modular.html` 有CDN问题，使用 `modular-fixed.html`
3. **功能完整性**: `simple.html` 功能最完整，推荐生产使用

## 🎯 **最终建议**

**保留这4个文件就够了：**
- ✅ `simple.html` (主力编辑器)
- ✅ `modular-fixed.html` (轻量版本)  
- ✅ `index.html` (主页)
- ✅ `preview.html` (预览)

**其他9个文件都可以删除！**
