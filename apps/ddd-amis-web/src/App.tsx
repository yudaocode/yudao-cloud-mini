import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'demo' | 'about'>('demo');

  return (
    <div className="App">
      {/* 顶部导航 */}
      <header className="App-header">
        <h1>DDD-AMIS 低代码开发平台</h1>
        <nav>
          <button 
            onClick={() => setViewMode('demo')}
            className={viewMode === 'demo' ? 'active' : ''}
          >
            演示页面
          </button>
          <button 
            onClick={() => setViewMode('about')}
            className={viewMode === 'about' ? 'active' : ''}
          >
            关于项目
          </button>
        </nav>
      </header>

      {/* 主内容区域 */}
      <main className="App-main">
        {viewMode === 'demo' ? (
          <div style={{ padding: 20 }}>
            <h2>🎉 项目创建成功！</h2>
            <p>这是一个基于 Vite + React + TypeScript + AMIS 的前端开发平台。</p>
            
            <div style={{ marginTop: 20 }}>
              <h3>✅ 已完成的功能：</h3>
              <ul>
                <li>项目基础架构搭建</li>
                <li>TypeScript类型定义</li>
                <li>DDD模型解析器</li>
                <li>动态CRUD组件框架</li>
                <li>amis配置编辑器（简化版）</li>
                <li>响应式UI设计</li>
              </ul>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>🚧 待完善的功能：</h3>
              <ul>
                <li>amis-editor完整集成</li>
                <li>amis-screen-definition.json动态加载</li>
                <li>真实API集成</li>
                <li>配置保存和版本管理</li>
              </ul>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>🔧 技术特性：</h3>
              <ul>
                <li>支持DDD模型驱动的amis配置生成</li>
                <li>TypeScript类型安全</li>
                <li>模块化架构设计</li>
                <li>响应式布局</li>
                <li>热重载开发体验</li>
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            <h2>关于项目</h2>
            <p>这是一个演示项目，展示了如何将DDD（领域驱动设计）与AMIS低代码框架结合。</p>
            
            <h3>项目结构：</h3>
            <pre style={{ background: '#f5f5f5', padding: 15, borderRadius: 4 }}>
{`src/
├── components/          # React组件
│   ├── AmisEditor.tsx  # amis配置编辑器
│   └── DynamicCRUD.tsx # 动态CRUD组件
├── services/           # 服务层
│   └── dddParser.ts   # DDD模型解析器
├── types/              # TypeScript类型定义
│   └── ddd.ts         # DDD相关类型
├── config/             # 配置文件
│   └── paths.ts       # 路径配置
├── App.tsx            # 主应用组件
└── main.tsx           # 应用入口`}
            </pre>
          </div>
        )}
      </main>

      {/* 状态栏 */}
      <footer className="App-footer">
        <div>
          状态: 运行中 | 模式: {viewMode} | 版本: 1.0.0
        </div>
      </footer>
    </div>
  );
};

export default App;
