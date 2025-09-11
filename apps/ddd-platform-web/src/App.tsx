import Layout from '@/components/Layout';
import CodeGeneration from '@/pages/CodeGeneration';
import Dashboard from '@/pages/Dashboard';
import AggregateDesigner from '@/pages/DDD/AggregateDesigner';
import DDDModeling from '@/pages/DDD/DDDModeling';
import ProjectDetail from '@/pages/Project/ProjectDetail';
import ProjectList from '@/pages/Project/ProjectList';
import ScreenEditor from '@/pages/Screen/ScreenEditor';
import ScreenGeneration from '@/pages/Screen/ScreenGeneration';
import ScreenList from '@/pages/Screen/ScreenList';
import Settings from '@/pages/Settings';
import { store } from '@/stores';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// 导入AMIS样式
import 'amis/lib/helper.css';
import 'amis/lib/themes/cxd.css';
import 'amis/sdk/iconfont.css';

// 导入应用样式
import './App.less';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <div className="app">
            <Layout>
              <Routes>
                {/* 默认重定向到工作台 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 工作台 */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* 项目管理 */}
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
                
                {/* DDD建模 */}
                <Route path="/projects/:projectId/ddd" element={<DDDModeling />} />
                <Route path="/projects/:projectId/ddd/aggregates/:aggregateId" element={<AggregateDesigner />} />
                
                {/* 界面设计 */}
                <Route path="/projects/:projectId/screens" element={<ScreenList />} />
                <Route path="/projects/:projectId/screens/generate" element={<ScreenGeneration />} />
                <Route path="/projects/:projectId/screens/:screenId/edit" element={<ScreenEditor />} />
                
                {/* 代码生成 */}
                <Route path="/projects/:projectId/generation" element={<CodeGeneration />} />
                
                {/* 系统设置 */}
                <Route path="/settings" element={<Settings />} />
                
                {/* 404页面 */}
                <Route path="*" element={<div>页面不存在</div>} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
