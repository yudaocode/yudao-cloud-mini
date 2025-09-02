import React, { useState, useEffect } from 'react';
import { render as amisRender } from 'amis';
import { amisEnv } from './config/amisEnv';
import { createAmisFetcher } from './services/mockApiService';
import { DDDPlatformService } from './services/dddPlatformService';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/themes/ang.css';
import 'amis/lib/themes/antd.css';
import './App.css';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<string>('ubiquitous-language');
  const [currentScreen, setCurrentScreen] = useState<string>('');
  const [amisSchema, setAmisSchema] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [theme, setTheme] = useState<string>('cxd');

  const dddPlatform = DDDPlatformService.getInstance();

  // 模块配置
  const modules = [
    { id: 'ubiquitous-language', name: '统一语言', icon: '📚' },
    { id: 'strategic-design', name: '战略设计', icon: '🏗️' },
    { id: 'tactical-design', name: '战术设计', icon: '⚙️' },
    { id: 'implementation-mapping', name: '实现映射', icon: '🔗' },
    { id: 'data-transfer-objects', name: 'DTO管理', icon: '📄' },
    { id: 'amis-screen', name: 'amis-screen', icon: '🖥️' },
    { id: 'code-generation', name: '代码生成', icon: '💻' }
  ];

  // 加载模块数据
  const loadModuleData = async (moduleId: string) => {
    setLoading(true);
    setError('');
    
    try {
      const schema = await dddPlatform.getModuleSchema(moduleId);
      setAmisSchema(schema);
    } catch (err) {
      setError(`加载${moduleId}模块失败: ${err}`);
      // 使用默认配置
      setAmisSchema(getDefaultModuleSchema(moduleId));
    } finally {
      setLoading(false);
    }
  };

  // 获取默认模块配置
  const getDefaultModuleSchema = (moduleId: string) => {
    const baseSchema = {
      type: 'page',
      title: getModuleTitle(moduleId),
      body: []
    };

    switch (moduleId) {
      case 'ubiquitous-language':
        return {
          ...baseSchema,
          body: [
            {
              type: 'crud',
              api: '/api/ubiquitous-language/terms',
              title: '术语库管理',
              columns: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'term', label: '术语', type: 'text' },
                { name: 'definition', label: '定义', type: 'text' },
                { name: 'businessRules', label: '业务规则', type: 'text' },
                { name: 'examples', label: '示例', type: 'text' }
              ],
              headerToolbar: [
                { type: 'button', label: '新增术语', actionType: 'dialog' },
                { type: 'button', label: '概念映射', actionType: 'dialog' },
                { type: 'button', label: '版本历史', actionType: 'dialog' }
              ]
            }
          ]
        };
      
      case 'strategic-design':
        return {
          ...baseSchema,
          body: [
            {
              type: 'crud',
              api: '/api/strategic-design/contexts',
              title: '限界上下文管理',
              columns: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'name', label: '上下文名称', type: 'text' },
                { name: 'description', label: '描述', type: 'text' },
                { name: 'isCoreDomain', label: '核心域', type: 'mapping', map: { true: '是', false: '否' } },
                { name: 'ubiquitousLanguage', label: '通用语言', type: 'text' }
              ],
              headerToolbar: [
                { type: 'button', label: '新增上下文', actionType: 'dialog' },
                { type: 'button', label: '上下文映射', actionType: 'dialog' },
                { type: 'button', label: '架构视图', actionType: 'dialog' }
              ]
            }
          ]
        };

      case 'tactical-design':
        return {
          ...baseSchema,
          body: [
            {
              type: 'tabs',
              tabs: [
                {
                  title: '聚合管理',
                  body: {
                    type: 'crud',
                    api: '/api/tactical-design/aggregates',
                    columns: [
                      { name: 'id', label: 'ID', type: 'text' },
                      { name: 'name', label: '聚合名称', type: 'text' },
                      { name: 'aggregateRoot', label: '聚合根', type: 'text' },
                      { name: 'entities', label: '实体', type: 'text' },
                      { name: 'valueObjects', label: '值对象', type: 'text' }
                    ]
                  }
                },
                {
                  title: '实体管理',
                  body: {
                    type: 'crud',
                    api: '/api/tactical-design/entities',
                    columns: [
                      { name: 'id', label: 'ID', type: 'text' },
                      { name: 'name', label: '实体名称', type: 'text' },
                      { name: 'aggregate', label: '所属聚合', type: 'text' },
                      { name: 'properties', label: '属性', type: 'text' }
                    ]
                  }
                },
                {
                  title: '值对象管理',
                  body: {
                    type: 'crud',
                    api: '/api/tactical-design/value-objects',
                    columns: [
                      { name: 'id', label: 'ID', type: 'text' },
                      { name: 'name', label: '值对象名称', type: 'text' },
                      { name: 'type', label: '类型', type: 'text' },
                      { name: 'immutable', label: '不可变', type: 'mapping', map: { true: '是', false: '否' } }
                    ]
                  }
                }
              ]
            }
          ]
        };

      case 'implementation-mapping':
        return {
          ...baseSchema,
          body: [
            {
              type: 'crud',
              api: '/api/implementation-mapping/configs',
              title: '实现映射配置',
              columns: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'technologyStack', label: '技术栈', type: 'text' },
                { name: 'frameworkMapping', label: '框架映射', type: 'text' },
                { name: 'databaseDesign', label: '数据库设计', type: 'text' },
                { name: 'apiDesign', label: 'API设计', type: 'text' }
              ],
              headerToolbar: [
                { type: 'button', label: '新增映射', actionType: 'dialog' },
                { type: 'button', label: '技术栈选择', actionType: 'dialog' },
                { type: 'button', label: '部署配置', actionType: 'dialog' }
              ]
            }
          ]
        };

      case 'data-transfer-objects':
        return {
          ...baseSchema,
          body: [
            {
              type: 'crud',
              api: '/api/data-transfer-objects/dtos',
              title: 'DTO管理',
              columns: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'name', label: 'DTO名称', type: 'text' },
                { name: 'purpose', label: '用途', type: 'text' },
                { name: 'fields', label: '字段', type: 'text' },
                { name: 'validationRules', label: '验证规则', type: 'text' }
              ],
              headerToolbar: [
                { type: 'button', label: '新增DTO', actionType: 'dialog' },
                { type: 'button', label: '映射规则', actionType: 'dialog' },
                { type: 'button', label: 'API文档', actionType: 'dialog' }
              ]
            }
          ]
        };

      case 'amis-screen':
        return {
          ...baseSchema,
          body: [
            {
              type: 'crud',
              api: '/api/amis-screen/screens',
              title: 'amis-screen管理',
              columns: [
                { name: 'id', label: 'ID', type: 'text' },
                { name: 'name', label: 'Screen名称', type: 'text' },
                { name: 'type', label: '类型', type: 'mapping', map: { 'CRUD': '列表', 'FORM': '表单', 'DETAIL': '详情' } },
                { name: 'route', label: '路由', type: 'text' },
                { name: 'dataSource', label: '数据源', type: 'text' },
                { name: 'theme', label: '主题', type: 'mapping', map: { 'cxd': 'cxd', 'ang': 'ang', 'antd': 'antd' } }
              ],
              headerToolbar: [
                { type: 'button', label: '新增Screen', actionType: 'dialog' },
                { type: 'button', label: '组件映射', actionType: 'dialog' },
                { type: 'button', label: '预览测试', actionType: 'dialog' },
                { type: 'button', label: '代码生成', actionType: 'dialog' }
              ]
            }
          ]
        };

      case 'code-generation':
        return {
          ...baseSchema,
          body: [
            {
              type: 'grid',
              columns: [
                {
                  body: {
                    type: 'card',
                    header: { title: '前端代码生成' },
                    body: [
                      { type: 'button', label: '生成React组件', actionType: 'ajax', api: '/api/code-generation/react' },
                      { type: 'button', label: '生成amis配置', actionType: 'ajax', api: '/api/code-generation/amis' }
                    ]
                  }
                },
                {
                  body: {
                    type: 'card',
                    header: { title: '后端代码生成' },
                    body: [
                      { type: 'button', label: '生成Controller', actionType: 'ajax', api: '/api/code-generation/controller' },
                      { type: 'button', label: '生成Service', actionType: 'ajax', api: '/api/code-generation/service' },
                      { type: 'button', label: '生成Repository', actionType: 'ajax', api: '/api/code-generation/repository' }
                    ]
                  }
                }
              ]
            }
          ]
        };

      default:
        return baseSchema;
    }
  };

  // 获取模块标题
  const getModuleTitle = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? `${module.icon} ${module.name}` : '未知模块';
  };

  // 处理模块切换
  const handleModuleChange = (moduleId: string) => {
    setCurrentModule(moduleId);
    loadModuleData(moduleId);
  };

  // 处理主题切换
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  // 初始化
  useEffect(() => {
    loadModuleData(currentModule);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="ddd-platform">
      {/* 顶部导航栏 */}
      <header className="platform-header">
        <div className="header-left">
          <h1>DDD元数据驱动开发平台</h1>
        </div>
        <div className="header-center">
          <div className="module-navigation">
            {modules.map(module => (
              <button
                key={module.id}
                className={`module-btn ${currentModule === module.id ? 'active' : ''}`}
                onClick={() => handleModuleChange(module.id)}
              >
                <span className="module-icon">{module.icon}</span>
                <span className="module-name">{module.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="header-right">
          <div className="theme-selector">
            <select 
              value={theme} 
              onChange={(e) => handleThemeChange(e.target.value)}
              className="theme-select"
              aria-label="选择主题"
            >
              <option value="cxd">CXD主题</option>
              <option value="ang">ANG主题</option>
              <option value="antd">ANTD主题</option>
            </select>
          </div>
          <div className="user-actions">
            <button className="action-btn">设置</button>
            <button className="action-btn">帮助</button>
          </div>
        </div>
      </header>

      {/* 主工作区 */}
      <div className="platform-content">
        {/* 左侧导航树 */}
        <aside className="platform-sidebar">
          <div className="sidebar-header">
            <h3>导航树</h3>
          </div>
          <div className="sidebar-content">
            {modules.map(module => (
              <div
                key={module.id}
                className={`sidebar-item ${currentModule === module.id ? 'active' : ''}`}
                onClick={() => handleModuleChange(module.id)}
              >
                <span className="item-icon">{module.icon}</span>
                <span className="item-name">{module.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* 主工作区 */}
        <main className="platform-main">
          <div className="main-header">
            <h2>{getModuleTitle(currentModule)}</h2>
            <div className="main-actions">
              <button className="action-btn">保存</button>
              <button className="action-btn">导出</button>
              <button className="action-btn">版本历史</button>
            </div>
          </div>
          <div className="main-content">
            {amisSchema && amisRender(amisSchema, {
              theme: theme,
              locale: 'zh-CN'
            }, {
              ...amisEnv,
              fetcher: createAmisFetcher()
            })}
          </div>
        </main>

        {/* 右侧属性面板 */}
        <aside className="platform-properties">
          <div className="properties-header">
            <h3>属性面板</h3>
          </div>
          <div className="properties-content">
            <div className="property-group">
              <h4>当前模块</h4>
              <p>{getModuleTitle(currentModule)}</p>
            </div>
            <div className="property-group">
              <h4>主题设置</h4>
              <select 
                value={theme} 
                onChange={(e) => handleThemeChange(e.target.value)}
                className="property-select"
                aria-label="属性面板主题选择"
              >
                <option value="cxd">CXD主题</option>
                <option value="ang">ANG主题</option>
                <option value="antd">ANTD主题</option>
              </select>
            </div>
            <div className="property-group">
              <h4>快速操作</h4>
              <button className="property-btn">新建</button>
              <button className="property-btn">编辑</button>
              <button className="property-btn">删除</button>
            </div>
          </div>
        </aside>
      </div>

      {/* 底部状态栏 */}
      <footer className="platform-footer">
        <div className="footer-left">
          <span>状态: 就绪</span>
        </div>
        <div className="footer-center">
          <span>版本: v1.0.0</span>
        </div>
        <div className="footer-right">
          <span>用户: Admin</span>
        </div>
      </footer>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <p>错误: {error}</p>
          <button onClick={() => setError('')}>关闭</button>
        </div>
      )}
    </div>
  );
};

export default App;
