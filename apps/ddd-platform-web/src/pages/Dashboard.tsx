import {
    BlockOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    DesktopOutlined,
    ProjectOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table, Tag, Timeline, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  // 模拟数据
  const stats = [
    {
      title: '项目总数',
      value: 12,
      icon: <ProjectOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: '聚合根数量',
      value: 85,
      icon: <BlockOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: '界面数量',
      value: 156,
      icon: <DesktopOutlined style={{ color: '#faad14' }} />
    },
    {
      title: '代码生成',
      value: 1240,
      suffix: '行',
      icon: <CodeOutlined style={{ color: '#f5222d' }} />
    }
  ];

  const recentActivities = [
    {
      content: '创建了新项目：电商管理系统',
      time: '2024-01-15 10:30'
    },
    {
      content: '完成了订单聚合根的设计',
      time: '2024-01-15 09:15'
    },
    {
      content: '生成了用户管理界面',
      time: '2024-01-14 16:45'
    },
    {
      content: '导出了商品服务代码',
      time: '2024-01-14 14:20'
    }
  ];

  const recentProjects = [
    {
      key: '1',
      name: '电商管理系统',
      status: '开发中',
      progress: 75,
      updatedAt: '2024-01-15'
    },
    {
      key: '2',
      name: '库存管理平台',
      status: '已完成',
      progress: 100,
      updatedAt: '2024-01-10'
    },
    {
      key: '3',
      name: '用户权限系统',
      status: '设计中',
      progress: 30,
      updatedAt: '2024-01-12'
    }
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '已完成' ? 'green' : status === '开发中' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => `${progress}%`
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    }
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        <TrophyOutlined style={{ marginRight: 8 }} />
        工作台
      </Title>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ fontSize: '24px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                最近活动
              </span>
            }
            style={{ height: 400 }}
          >
            <Timeline
              items={recentActivities.map((activity, index) => ({
                children: (
                  <div>
                    <div>{activity.content}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                      {activity.time}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 最近项目 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <ProjectOutlined style={{ marginRight: 8 }} />
                最近项目
              </span>
            }
            style={{ height: 400 }}
          >
            <Table
              dataSource={recentProjects}
              columns={projectColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 快速开始 */}
      <Card title="快速开始" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
              <ProjectOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>创建新项目</div>
            </Card.Grid>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
              <BlockOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>DDD建模</div>
            </Card.Grid>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
              <DesktopOutlined style={{ fontSize: '32px', color: '#faad14' }} />
              <div style={{ marginTop: 8 }}>界面设计</div>
            </Card.Grid>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
              <CodeOutlined style={{ fontSize: '32px', color: '#f5222d' }} />
              <div style={{ marginTop: 8 }}>代码生成</div>
            </Card.Grid>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
