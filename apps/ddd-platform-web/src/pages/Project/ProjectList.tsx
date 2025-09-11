import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tag } from 'antd';
import React from 'react';

const ProjectList: React.FC = () => {
  // 模拟项目数据
  const projects = [
    {
      key: '1',
      id: '1',
      name: '电商管理系统',
      description: '基于DDD的电商平台管理系统',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      members: ['张三', '李四', '王五']
    },
    {
      key: '2',
      id: '2',
      name: '库存管理平台',
      description: '智能化库存管理和预警系统',
      status: 'inactive',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      members: ['赵六', '钱七']
    },
    {
      key: '3',
      id: '3',
      name: '用户权限系统',
      description: '企业级用户权限管理系统',
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14',
      members: ['孙八', '周九', '吴十', '郑十一']
    }
  ];

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => handleViewProject(record.id)}>{text}</a>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'orange';
        const text = status === 'active' ? '活跃' : '非活跃';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '成员数量',
      dataIndex: 'members',
      key: 'members',
      render: (members: string[]) => members.length
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditProject(record.id)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteProject(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const handleCreateProject = () => {
    console.log('创建新项目');
  };

  const handleViewProject = (id: string) => {
    console.log('查看项目:', id);
  };

  const handleEditProject = (id: string) => {
    console.log('编辑项目:', id);
  };

  const handleDeleteProject = (id: string) => {
    console.log('删除项目:', id);
  };

  return (
    <Card 
      title="项目管理" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreateProject}
        >
          新建项目
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={projects}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: projects.length,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
        }}
      />
    </Card>
  );
};

export default ProjectList;
