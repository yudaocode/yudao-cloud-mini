# 🎛️ 多容器动态载入子屏幕 - 完整指南

## 🎯 功能概述

回答您的问题：**是的！** 当前设计完全支持：

1. ✅ **一个屏幕包含多个子容器**（如多个Tab标签、折叠面板等）
2. ✅ **每个容器可以动态载入其他子屏幕**
3. ✅ **支持懒加载、按需加载、预加载等策略**
4. ✅ **完整的生命周期管理和数据绑定**

## 📋 支持的容器类型

| 容器类型 | 说明 | 适用场景 |
|---------|------|----------|
| `TABS` | 标签页容器 | 分模块展示不同功能 |
| `ACCORDION` | 手风琴容器 | 分层级展示相关内容 |
| `COLLAPSE` | 折叠面板 | 可选展示的信息区域 |
| `CAROUSEL` | 轮播容器 | 多屏幕轮播展示 |
| `SPLIT_PANEL` | 分割面板 | 左右或上下分屏 |
| `GRID_LAYOUT` | 网格布局 | 多屏幕网格排列 |
| `FLEX_LAYOUT` | 弹性布局 | 自适应布局容器 |
| `CARD_LAYOUT` | 卡片布局 | 卡片式多屏幕 |
| `TREE_LAYOUT` | 树形布局 | 层级结构展示 |
| `DYNAMIC_TABS` | 动态标签页 | 可增删的标签页 |

## 🚀 完整示例：系统设置页面

### 示例1: 多标签页动态载入
```json
{
  "id": "screen_system_settings",
  "name": "系统设置",
  "title": "系统设置中心",
  "type": "CONTAINER_LAYOUT",
  "category": "SYSTEM",
  "path": "/system/settings",
  
  "containers": [
    {
      "id": "container_main_tabs",
      "name": "主要设置标签页",
      "type": "TABS",
      "layout": {
        "direction": "horizontal"
      },
      "props": {
        "tabPosition": "top",
        "tabType": "card",
        "closable": false,
        "addable": false,
        "draggable": true,
        "size": "large",
        "animated": true
      },
      "dynamicLoading": {
        "enabled": true,
        "strategy": "LAZY",
        "loadOnVisible": true,
        "cacheStrategy": "MEMORY",
        "maxCacheSize": 5,
        "preloadCount": 1
      },
      "children": [
        {
          "id": "tab_basic_settings",
          "title": "基础设置",
          "icon": "setting",
          "type": "SCREEN_REFERENCE",
          "key": "basic",
          "order": 1,
          "screenReference": {
            "type": "SCREEN_REFERENCE",
            "screenId": "screen_basic_settings_form",
            "containerType": "INLINE",
            "referenceMode": "LAZY_LOAD",
            "dataBinding": {
              "parentToChild": {
                "settingsType": "BASIC",
                "readonly": false
              },
              "childToParent": {
                "onSave": "handleBasicSettingsSave",
                "onChange": "handleBasicSettingsChange"
              }
            },
            "lifecycle": {
              "onBeforeLoad": "function() { showLoading('基础设置加载中...'); }",
              "onAfterLoad": "function() { hideLoading(); }",
              "onAfterShow": "function() { trackPageView('basic_settings'); }"
            }
          }
        },
        {
          "id": "tab_user_management",
          "title": "用户管理",
          "icon": "user",
          "type": "SCREEN_REFERENCE",
          "key": "user",
          "order": 2,
          "screenReference": {
            "type": "SCREEN_REFERENCE",
            "screenId": "screen_user_management_page",
            "containerType": "INLINE",
            "referenceMode": "LAZY_LOAD",
            "conditions": {
              "permissions": ["USER_MANAGEMENT"]
            },
            "caching": {
              "enabled": true,
              "strategy": "memory",
              "ttl": 600
            }
          }
        },
        {
          "id": "tab_security_settings",
          "title": "安全设置",
          "icon": "security",
          "type": "SCREEN_REFERENCE",
          "key": "security",
          "order": 3,
          "screenReference": {
            "type": "SCREEN_REFERENCE",
            "screenId": "screen_security_settings_form",
            "containerType": "INLINE",
            "referenceMode": "PRELOAD",
            "conditions": {
              "permissions": ["SECURITY_ADMIN"]
            }
          }
        },
        {
          "id": "tab_logs_analysis",
          "title": "日志分析",
          "icon": "file-text",
          "type": "SCREEN_REFERENCE",
          "key": "logs",
          "order": 4,
          "screenReference": {
            "type": "SCREEN_REFERENCE",
            "screenId": "screen_logs_analysis_dashboard",
            "containerType": "INLINE",
            "referenceMode": "ON_DEMAND",
            "performance": {
              "keepAlive": true,
              "virtualScrolling": true
            }
          }
        }
      ],
      "events": {
        "onTabChange": "function(activeKey) { updateBreadcrumb(activeKey); trackTabSwitch(activeKey); }",
        "onChildLoad": "function(childId) { console.log('子屏幕加载完成:', childId); }",
        "onChildError": "function(childId, error) { showError('加载失败: ' + error.message); }"
      }
    }
  ],
  
  "containerLayout": {
    "type": "VERTICAL",
    "spacing": "16px",
    "padding": "20px",
    "responsive": true
  }
}
```

### 示例2: 复合容器 - 标签页 + 手风琴
```json
{
  "id": "screen_dashboard_complex",
  "name": "复合仪表盘",
  "title": "企业数据分析仪表盘",
  "type": "DASHBOARD_PAGE",
  "category": "ANALYSIS",
  
  "containers": [
    {
      "id": "container_top_tabs",
      "name": "顶部功能标签",
      "type": "TABS",
      "props": {
        "tabPosition": "top",
        "tabType": "line"
      },
      "children": [
        {
          "id": "tab_realtime",
          "title": "实时监控",
          "type": "SCREEN_REFERENCE",
          "screenReference": {
            "screenId": "screen_realtime_monitor",
            "containerType": "INLINE",
            "referenceMode": "PRELOAD",
            "performance": {
              "keepAlive": true
            }
          }
        },
        {
          "id": "tab_reports", 
          "title": "报表分析",
          "type": "SCREEN_REFERENCE",
          "screenReference": {
            "screenId": "screen_report_analysis",
            "containerType": "INLINE",
            "referenceMode": "LAZY_LOAD"
          }
        }
      ]
    },
    {
      "id": "container_side_accordion",
      "name": "侧边功能面板",
      "type": "ACCORDION",
      "props": {
        "accordion": false,
        "collapsible": true
      },
      "children": [
        {
          "id": "panel_filters",
          "title": "数据筛选",
          "type": "SCREEN_REFERENCE",
          "screenReference": {
            "screenId": "screen_data_filters",
            "containerType": "INLINE",
            "referenceMode": "EMBED",
            "dataBinding": {
              "bidirectional": ["filterConditions", "selectedDateRange"]
            }
          }
        },
        {
          "id": "panel_quick_actions",
          "title": "快捷操作",
          "type": "SCREEN_REFERENCE", 
          "screenReference": {
            "screenId": "screen_quick_actions",
            "containerType": "INLINE"
          }
        },
        {
          "id": "panel_notifications",
          "title": "系统通知",
          "type": "DYNAMIC_CONTENT",
          "dynamicContent": {
            "source": "/api/notifications/recent",
            "refresh": {
              "interval": 30,
              "trigger": ["NOTIFICATION_UPDATE"]
            }
          }
        }
      ]
    }
  ],
  
  "containerLayout": {
    "type": "GRID",
    "spacing": "12px"
  }
}
```

### 示例3: 网格布局多屏幕
```json
{
  "id": "screen_grid_dashboard",
  "name": "网格仪表盘",
  "type": "DASHBOARD_PAGE",
  "category": "ANALYSIS",
  
  "containers": [
    {
      "id": "container_grid_layout",
      "name": "网格布局容器",
      "type": "GRID_LAYOUT",
      "layout": {
        "direction": "grid",
        "gridTemplate": {
          "columns": "1fr 1fr 1fr",
          "rows": "auto 1fr auto",
          "areas": [
            "header header header",
            "sidebar main main",
            "footer footer footer"
          ]
        },
        "gap": "16px"
      },
      "children": [
        {
          "id": "grid_header",
          "title": "页面头部",
          "type": "SCREEN_REFERENCE",
          "style": {
            "gridArea": "header"
          },
          "screenReference": {
            "screenId": "screen_dashboard_header",
            "containerType": "INLINE",
            "referenceMode": "EMBED"
          }
        },
        {
          "id": "grid_sidebar",
          "title": "侧边栏",
          "type": "SCREEN_REFERENCE",
          "style": {
            "gridArea": "sidebar"
          },
          "screenReference": {
            "screenId": "screen_dashboard_sidebar", 
            "containerType": "INLINE",
            "referenceMode": "LAZY_LOAD"
          }
        },
        {
          "id": "grid_main",
          "title": "主要内容",
          "type": "SCREEN_REFERENCE",
          "style": {
            "gridArea": "main"
          },
          "screenReference": {
            "screenId": "screen_dashboard_main",
            "containerType": "INLINE",
            "referenceMode": "PRELOAD",
            "dataBinding": {
              "parentToChild": {
                "layoutMode": "GRID",
                "columns": 3
              }
            }
          }
        },
        {
          "id": "grid_footer",
          "title": "页面底部",
          "type": "SCREEN_REFERENCE",
          "style": {
            "gridArea": "footer"
          },
          "screenReference": {
            "screenId": "screen_dashboard_footer",
            "containerType": "INLINE",
            "referenceMode": "EMBED"
          }
        }
      ]
    }
  ]
}
```

### 示例4: 动态标签页（可增删）
```json
{
  "id": "screen_dynamic_workspace",
  "name": "动态工作空间",
  "type": "CONTAINER_LAYOUT",
  "category": "BUSINESS",
  
  "containers": [
    {
      "id": "container_dynamic_tabs",
      "name": "动态标签页容器",
      "type": "DYNAMIC_TABS",
      "props": {
        "tabPosition": "top",
        "tabType": "card",
        "closable": true,
        "addable": true,
        "draggable": true
      },
      "dynamicLoading": {
        "enabled": true,
        "strategy": "ON_DEMAND",
        "cacheStrategy": "SESSION",
        "maxCacheSize": 10
      },
      "children": [
        {
          "id": "tab_default_workspace",
          "title": "默认工作台",
          "type": "SCREEN_REFERENCE",
          "closable": false,
          "screenReference": {
            "screenId": "screen_default_workspace",
            "containerType": "INLINE",
            "referenceMode": "EMBED"
          }
        }
      ],
      "events": {
        "onTabAdd": "function() { return openNewTabDialog(); }",
        "onTabRemove": "function(targetKey) { return confirmCloseTab(targetKey); }",
        "onTabChange": "function(activeKey) { updateWorkspaceContext(activeKey); }"
      }
    }
  ]
}
```

## ⚡ 动态加载策略

### 1. 加载策略详解

| 策略 | 说明 | 使用场景 | 性能影响 |
|------|------|----------|----------|
| `LAZY` | 标签页激活时才加载 | 多标签页，不常用页面 | 最优首屏，按需资源 |
| `ON_DEMAND` | 用户操作时才加载 | 交互触发的内容 | 减少预加载开销 |
| `PRELOAD` | 页面初始化时预加载 | 重要或常用功能 | 提升用户体验 |
| `PROGRESSIVE` | 渐进式加载 | 大数据量页面 | 平衡性能体验 |

### 2. 缓存策略配置

```json
{
  "dynamicLoading": {
    "cacheStrategy": "MEMORY",     // 内存缓存，页面刷新失效
    "maxCacheSize": 5,             // 最多缓存5个屏幕
    "preloadCount": 2              // 预加载相邻2个屏幕
  }
}
```

| 缓存策略 | 生存期 | 适用场景 |
|---------|--------|----------|
| `NONE` | 不缓存 | 实时数据页面 |
| `MEMORY` | 页面会话期间 | 一般业务页面 |
| `SESSION` | 浏览器会话期间 | 用户会话数据 |
| `LOCAL` | 持久化本地 | 配置类数据 |
| `CUSTOM` | 自定义策略 | 特殊需求 |

## 🔧 高级特性

### 1. 容器间数据通信

```json
{
  "containers": [
    {
      "id": "container_filter_panel",
      "children": [
        {
          "screenReference": {
            "dataBinding": {
              "childToParent": {
                "onFilterChange": "updateMainContent"  // 筛选变化时更新主内容
              }
            }
          }
        }
      ]
    },
    {
      "id": "container_main_content", 
      "children": [
        {
          "screenReference": {
            "dataBinding": {
              "parentToChild": {
                "filterData": "${globalState.filterData}"  // 接收筛选数据
              }
            }
          }
        }
      ]
    }
  ]
}
```

### 2. 条件显示和权限控制

```json
{
  "children": [
    {
      "id": "admin_panel",
      "conditions": {
        "showWhen": {
          "field": "userRole",
          "operator": "equals", 
          "value": "ADMIN"
        },
        "permissions": ["ADMIN_ACCESS"]
      },
      "screenReference": {
        "screenId": "screen_admin_panel"
      }
    }
  ]
}
```

### 3. 生命周期管理

```json
{
  "lifecycle": {
    "onBeforeLoad": "function() { showLoadingIndicator(); }",
    "onAfterLoad": "function() { hideLoadingIndicator(); }",
    "onBeforeShow": "function() { refreshData(); }",
    "onAfterShow": "function() { trackPageView(); }",
    "onBeforeHide": "function() { saveState(); }",
    "onBeforeDestroy": "function() { cleanup(); }"
  }
}
```

## 🎯 最佳实践

### 1. 性能优化
- ✅ 合理使用懒加载，避免首屏过慢
- ✅ 设置合适的缓存策略和大小
- ✅ 预加载常用标签页
- ✅ 对大数据量页面使用虚拟滚动

### 2. 用户体验
- ✅ 提供加载状态反馈
- ✅ 支持键盘导航
- ✅ 合理的标签页关闭确认
- ✅ 保存用户的标签页状态

### 3. 开发维护
- ✅ 子屏幕保持独立性
- ✅ 明确的数据流向
- ✅ 完整的错误处理
- ✅ 统一的生命周期管理

### 4. 架构设计
- ✅ 容器与内容分离
- ✅ 可配置的加载策略
- ✅ 灵活的布局系统
- ✅ 扩展性考虑

## 📊 功能对比总结

| 功能特性 | 是否支持 | 详细说明 |
|---------|---------|----------|
| **多容器支持** | ✅ 完全支持 | 10种容器类型，满足各种布局需求 |
| **动态载入子屏幕** | ✅ 完全支持 | 4种加载策略，灵活可控 |
| **标签页管理** | ✅ 完全支持 | 静态/动态标签页，可增删拖拽 |
| **数据绑定** | ✅ 完全支持 | 父子双向绑定，自动数据流 |
| **生命周期管理** | ✅ 完全支持 | 7个生命周期钩子函数 |
| **缓存策略** | ✅ 完全支持 | 5种缓存策略，性能可控 |
| **权限控制** | ✅ 完全支持 | 基于角色和权限的显示控制 |
| **错误处理** | ✅ 完全支持 | 统一的错误处理和降级方案 |

**结论**: 当前设计完全支持您提到的需求，可以实现复杂的多容器动态载入场景！🎉
