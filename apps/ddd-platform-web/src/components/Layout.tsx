import {
    BlockOutlined,
    CodeOutlined,
    DashboardOutlined,
    DesktopOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProjectOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout as AntLayout, Avatar, Breadcrumb, Dropdown, Menu, Space } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
      path: '/dashboard'
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
      path: '/projects'
    },
    {
      key: 'ddd',
      icon: <BlockOutlined />,
      label: 'DDD建模',
      path: '/ddd'
    },
    {
      key: 'screens',
      icon: <DesktopOutlined />,
      label: '界面设计',
      path: '/screens'
    },
    {
      key: 'generation',
      icon: <CodeOutlined />,
      label: '代码生成',
      path: '/generation'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      path: '/settings'
    }
  ];

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ];

  // 菜单点击处理
  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find(item => item.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  // 用户菜单点击处理
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录
      console.log('退出登录');
    } else if (key === 'profile') {
      // 处理个人资料
      console.log('个人资料');
    }
  };

  // 获取当前选中的菜单项
  const getCurrentSelectedKey = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (path.startsWith(item.path)) {
        return item.key;
      }
    }
    return 'dashboard';
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbItems = [
      {
        title: '首页'
      }
    ];

    if (segments[0] === 'projects' && segments[1]) {
      breadcrumbItems.push({
        title: '项目管理'
      });
      breadcrumbItems.push({
        title: '项目详情'
      });
    } else {
      const currentItem = menuItems.find(item => item.key === getCurrentSelectedKey());
      if (currentItem) {
        breadcrumbItems.push({
          title: currentItem.label
        });
      }
    }

    return breadcrumbItems;
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)'
        }}
      >
        <div style={{ 
          height: 64, 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {!collapsed && (
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#1890ff'
            }}>
              DDD开发平台
            </h1>
          )}
          {collapsed && (
            <div style={{
              width: 32,
              height: 32,
              background: '#1890ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold'
            }}>
              D
            </div>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentSelectedKey()]}
          onClick={handleMenuClick}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px 0 rgba(29, 35, 41, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              style: { fontSize: '18px', cursor: 'pointer' },
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div>
            <Dropdown 
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>管理员</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <div style={{ margin: '16px 24px 0', minHeight: 'auto' }}>
          <Breadcrumb items={generateBreadcrumb()} />
        </div>
        <Content style={{ 
          margin: '16px 24px', 
          padding: 24, 
          background: '#fff',
          borderRadius: 8,
          minHeight: 'calc(100vh - 140px)'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
