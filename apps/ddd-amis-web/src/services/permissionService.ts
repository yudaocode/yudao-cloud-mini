// 权限控制服务
export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

export class PermissionService {
  private currentUser: User | null = null;
  private permissions: Permission[] = [];

  // 模拟权限数据
  constructor() {
    this.permissions = [
      { id: '1', name: '订单查看', code: 'order:view', description: '查看订单列表和详情' },
      { id: '2', name: '订单创建', code: 'order:create', description: '创建新订单' },
      { id: '3', name: '订单编辑', code: 'order:edit', description: '编辑订单信息' },
      { id: '4', name: '订单删除', code: 'order:delete', description: '删除订单' },
      { id: '5', name: '订单导出', code: 'order:export', description: '导出订单数据' },
      { id: '6', name: '用户管理', code: 'user:manage', description: '管理用户信息' },
      { id: '7', name: '角色管理', code: 'role:manage', description: '管理角色权限' },
      { id: '8', name: '系统配置', code: 'system:config', description: '系统配置管理' }
    ];
  }

  // 检查用户是否有指定权限
  hasPermission(user: User, permissionCode: string): boolean {
    return user.roles.some(role => 
      role.permissions.some(permission => permission.code === permissionCode)
    );
  }

  // 检查当前用户是否有指定权限
  hasCurrentUserPermission(permissionCode: string): boolean {
    if (!this.currentUser) return false;
    return this.hasPermission(this.currentUser, permissionCode);
  }

  // 获取用户所有权限
  getUserPermissions(user: User): Permission[] {
    const permissionSet = new Set<string>();
    const permissions: Permission[] = [];
    
    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        if (!permissionSet.has(permission.code)) {
          permissionSet.add(permission.code);
          permissions.push(permission);
        }
      });
    });
    
    return permissions;
  }

  // 设置当前用户
  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 模拟登录
  async login(username: string, password: string): Promise<User | null> {
    // 模拟用户数据
    const users: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: [
          {
            id: '1',
            name: '超级管理员',
            code: 'SUPER_ADMIN',
            permissions: this.permissions
          }
        ]
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@example.com',
        roles: [
          {
            id: '2',
            name: '订单管理员',
            code: 'ORDER_MANAGER',
            permissions: this.permissions.filter(p => p.code.startsWith('order:'))
          }
        ]
      },
      {
        id: '3',
        username: 'viewer',
        email: 'viewer@example.com',
        roles: [
          {
            id: '3',
            name: '查看者',
            code: 'VIEWER',
            permissions: this.permissions.filter(p => p.code === 'order:view')
          }
        ]
      }
    ];

    const user = users.find(u => u.username === username);
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  // 登出
  logout(): void {
    this.currentUser = null;
  }

  // 获取所有权限
  getAllPermissions(): Permission[] {
    return this.permissions;
  }

  // 创建角色
  createRole(name: string, code: string, permissionCodes: string[]): Role {
    const permissions = this.permissions.filter(p => permissionCodes.includes(p.code));
    return {
      id: Date.now().toString(),
      name,
      code,
      permissions
    };
  }

  // 更新角色权限
  updateRolePermissions(roleId: string, permissionCodes: string[]): boolean {
    // 这里应该更新数据库中的角色权限
    return true;
  }
}

export const permissionService = new PermissionService();
