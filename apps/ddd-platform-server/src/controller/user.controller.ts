import {
  Inject,
  Controller,
  Get,
  Post,
  Put,
  Del,
  Query,
  Body,
  Param,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

// 用户实体接口
interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  bio?: string;
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

// 分页查询参数
interface ListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  role?: string;
  dateRange?: string[];
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('/api/users')
export class UserController {
  @Inject()
  ctx: Context;

  // 模拟数据库
  private users: User[] = [
    {
      id: 1,
      name: 'admin',
      email: 'admin@ddd-platform.com',
      phone: '13800138001',
      avatar: 'https://via.placeholder.com/64x64/4f46e5/ffffff?text=A',
      role: 'admin',
      status: 'active',
      gender: 'male',
      birthday: '1990-01-01',
      bio: 'DDD平台管理员',
      interests: ['programming', 'reading'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-09-14T00:00:00Z',
      lastLoginAt: '2024-09-14T08:00:00Z',
    },
    {
      id: 2,
      name: 'john_doe',
      email: 'john@example.com',
      phone: '13800138002',
      avatar: 'https://via.placeholder.com/64x64/52c41a/ffffff?text=J',
      role: 'user',
      status: 'active',
      gender: 'male',
      birthday: '1985-05-15',
      bio: '前端开发工程师',
      interests: ['programming', 'music', 'sports'],
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-09-13T00:00:00Z',
      lastLoginAt: '2024-09-13T15:30:00Z',
    },
    {
      id: 3,
      name: 'jane_smith',
      email: 'jane@example.com',
      phone: '13800138003',
      avatar: 'https://via.placeholder.com/64x64/fa8c16/ffffff?text=J',
      role: 'user',
      status: 'active',
      gender: 'female',
      birthday: '1992-08-22',
      bio: 'UI/UX设计师',
      interests: ['reading', 'travel', 'music'],
      createdAt: '2024-03-10T00:00:00Z',
      updatedAt: '2024-09-12T00:00:00Z',
      lastLoginAt: '2024-09-12T10:15:00Z',
    },
    {
      id: 4,
      name: 'bob_wilson',
      email: 'bob@example.com',
      phone: '13800138004',
      avatar: 'https://via.placeholder.com/64x64/722ed1/ffffff?text=B',
      role: 'guest',
      status: 'inactive',
      gender: 'male',
      birthday: '1988-12-03',
      bio: '产品经理',
      interests: ['programming', 'travel'],
      createdAt: '2024-04-20T00:00:00Z',
      updatedAt: '2024-09-10T00:00:00Z',
      lastLoginAt: '2024-09-01T09:45:00Z',
    },
    {
      id: 5,
      name: 'alice_brown',
      email: 'alice@example.com',
      phone: '13800138005',
      avatar: 'https://via.placeholder.com/64x64/f5222d/ffffff?text=A',
      role: 'user',
      status: 'active',
      gender: 'female',
      birthday: '1995-03-18',
      bio: '后端开发工程师',
      interests: ['programming', 'reading', 'sports'],
      createdAt: '2024-05-05T00:00:00Z',
      updatedAt: '2024-09-14T00:00:00Z',
      lastLoginAt: '2024-09-14T07:20:00Z',
    },
  ];

  private nextId = 6;

  /**
   * 获取用户列表 (支持分页、搜索、排序)
   */
  @Get('/')
  async getUserList(@Query() query: ListQuery) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      status = '',
      role = '',
      dateRange = [],
      sortField = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    let filteredUsers = [...this.users];

    // 关键词搜索
    if (keyword) {
      filteredUsers = filteredUsers.filter(
        user =>
          user.name.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 状态筛选
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 角色筛选
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 日期范围筛选
    if (dateRange.length === 2) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      filteredUsers = filteredUsers.filter(user => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= startDate && createdDate <= endDate;
      });
    }

    // 排序
    filteredUsers.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 分页
    const total = filteredUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredUsers.slice(startIndex, endIndex);

    return {
      status: 0,
      msg: '获取成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取单个用户详情
   */
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id);
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      return {
        status: 404,
        msg: '用户不存在',
        data: null,
      };
    }

    return {
      status: 0,
      msg: '获取成功',
      data: user,
    };
  }

  /**
   * 创建新用户
   */
  @Post('/')
  async createUser(@Body() userData: Partial<User>) {
    // 验证必填字段
    if (!userData.name || !userData.email) {
      return {
        status: 400,
        msg: '用户名和邮箱为必填项',
        data: null,
      };
    }

    // 检查邮箱是否已存在
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        status: 400,
        msg: '邮箱已存在',
        data: null,
      };
    }

    // 创建新用户
    const newUser: User = {
      id: this.nextId++,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      avatar:
        userData.avatar ||
        `https://via.placeholder.com/64x64/1890ff/ffffff?text=${userData.name
          .charAt(0)
          .toUpperCase()}`,
      role: userData.role || 'user',
      status: userData.status || 'active',
      gender: userData.gender,
      birthday: userData.birthday,
      bio: userData.bio || '',
      interests: userData.interests || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
    };

    this.users.push(newUser);

    return {
      status: 0,
      msg: '创建成功',
      data: newUser,
    };
  }

  /**
   * 更新用户信息
   */
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() userData: Partial<User>) {
    const userId = parseInt(id);
    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return {
        status: 404,
        msg: '用户不存在',
        data: null,
      };
    }

    // 如果要更新邮箱，检查是否与其他用户重复
    if (
      userData.email &&
      userData.email !== this.users[userIndex].email
    ) {
      const existingUser = this.users.find(
        u => u.email === userData.email && u.id !== userId
      );
      if (existingUser) {
        return {
          status: 400,
          msg: '邮箱已被其他用户使用',
          data: null,
        };
      }
    }

    // 更新用户信息
    const updatedUser = {
      ...this.users[userIndex],
      ...userData,
      id: userId, // 确保ID不被覆盖
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;

    return {
      status: 0,
      msg: '更新成功',
      data: updatedUser,
    };
  }

  /**
   * 删除用户
   */
  @Del('/:id')
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id);
    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return {
        status: 404,
        msg: '用户不存在',
        data: null,
      };
    }

    // 不能删除管理员
    if (this.users[userIndex].role === 'admin') {
      return {
        status: 403,
        msg: '不能删除管理员用户',
        data: null,
      };
    }

    const deletedUser = this.users.splice(userIndex, 1)[0];

    return {
      status: 0,
      msg: '删除成功',
      data: deletedUser,
    };
  }

  /**
   * 批量删除用户
   */
  @Del('/batch')
  async batchDeleteUsers(@Body() { ids }: { ids: number[] }) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return {
        status: 400,
        msg: '请提供要删除的用户ID列表',
        data: null,
      };
    }

    const deletedUsers = [];
    const errors = [];

    for (const id of ids) {
      const userIndex = this.users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        errors.push(`用户ID ${id} 不存在`);
        continue;
      }

      if (this.users[userIndex].role === 'admin') {
        errors.push(
          `不能删除管理员用户 ${this.users[userIndex].name}`
        );
        continue;
      }

      deletedUsers.push(this.users.splice(userIndex, 1)[0]);
    }

    return {
      status: 0,
      msg: `成功删除 ${deletedUsers.length} 个用户`,
      data: {
        deleted: deletedUsers,
        errors,
      },
    };
  }

  /**
   * 获取用户统计数据
   */
  @Get('/stats/overview')
  async getUserStats() {
    const total = this.users.length;
    const active = this.users.filter(u => u.status === 'active').length;
    const adminCount = this.users.filter(u => u.role === 'admin').length;
    const userCount = this.users.filter(u => u.role === 'user').length;
    const guestCount = this.users.filter(u => u.role === 'guest').length;

    // 模拟今日新增用户
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayNewUsers = this.users.filter(
      u => new Date(u.createdAt) >= todayStart
    ).length;

    // 模拟在线用户（最近15分钟有活动）
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const onlineUsers = this.users.filter(
      u => u.lastLoginAt && new Date(u.lastLoginAt) >= fifteenMinutesAgo
    ).length;

    return {
      status: 0,
      msg: '获取成功',
      data: {
        total,
        active,
        todayNewUsers,
        onlineUsers,
        roleDistribution: {
          admin: adminCount,
          user: userCount,
          guest: guestCount,
        },
        statusDistribution: {
          active,
          inactive: total - active,
        },
      },
    };
  }
}
