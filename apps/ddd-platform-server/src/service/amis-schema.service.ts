import { Inject, Provide } from '@midwayjs/core';
import { AggregateService } from './aggregate.service';
import { DomainService } from './domain.service';
import { EntityService } from './entity.service';
import { ProjectService } from './project.service';

/**
 * AMIS Schema 生成服务
 * 负责将DDD元数据转换为AMIS页面配置
 */
@Provide()
export class AmisSchemaService {

  @Inject()
  projectService: ProjectService;

  @Inject()
  domainService: DomainService;

  @Inject()
  aggregateService: AggregateService;

  @Inject()
  entityService: EntityService;

  /**
   * 生成项目管理页面的AMIS配置
   */
  async generateProjectListPage(): Promise<any> {
    return {
      type: 'page',
      title: 'DDD项目管理',
      body: [
        {
          type: 'crud',
          api: '/api/projects',
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: '项目ID',
              type: 'text',
              width: 150
            },
            {
              name: 'name',
              label: '项目名称',
              type: 'text'
            },
            {
              name: 'description',
              label: '项目描述',
              type: 'text'
            },
            {
              name: 'status',
              label: '状态',
              type: 'status',
              map: {
                'ACTIVE': { status: 'success', text: '激活' },
                'INACTIVE': { status: 'default', text: '停用' },
                'ARCHIVED': { status: 'warning', text: '归档' }
              }
            },
            {
              name: 'createdAt',
              label: '创建时间',
              type: 'datetime',
              format: 'YYYY-MM-DD HH:mm:ss'
            }
          ],
          headerToolbar: [
            {
              type: 'button',
              label: '新建项目',
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: '新建项目',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'post:/api/projects',
                  body: [
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '项目名称',
                      required: true,
                      placeholder: '请输入项目名称',
                      validations: {
                        minLength: 2,
                        maxLength: 50,
                        isAlphanumeric: true,
                      },
                      validationErrors: {
                        minLength: '项目名称至少需要2个字符',
                        maxLength: '项目名称不能超过50个字符',
                        isAlphanumeric: '项目名称只能包含字母、数字和中文',
                        required: '请输入项目名称',
                      },
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '项目描述',
                      placeholder: '请输入项目描述',
                      maxLength: 500,
                      showCounter: true,
                      validations: {
                        maxLength: 500,
                      },
                      validationErrors: {
                        maxLength: '项目描述不能超过500个字符',
                      },
                    },
                    {
                      type: 'select',
                      name: 'status',
                      label: '状态',
                      value: 'ACTIVE',
                      options: [
                        { label: '激活', value: 'ACTIVE' },
                        { label: '停用', value: 'INACTIVE' }
                      ]
                    }
                  ]
                }
              }
            },
            {
              type: 'reload',
              align: 'right'
            }
          ],
          itemActions: [
            {
              type: 'button',
              label: '查看',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '项目详情',
                size: 'lg',
                body: {
                  type: 'service',
                  api: '/api/projects/${id}',
                  body: [
                    {
                      type: 'property',
                      title: '基本信息',
                      items: [
                        { label: '项目ID', content: '${id}' },
                        { label: '项目名称', content: '${name}' },
                        { label: '项目描述', content: '${description}' },
                        { label: '状态', content: '${status}' },
                        { label: '创建时间', content: '${createdAt}' },
                        { label: '更新时间', content: '${updatedAt}' }
                      ]
                    }
                  ]
                }
              }
            },
            {
              type: 'button',
              label: '编辑',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '编辑项目',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'put:/api/projects/${id}',
                  initApi: '/api/projects/${id}',
                  body: [
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '项目名称',
                      required: true,
                      placeholder: '请输入项目名称',
                      validations: {
                        minLength: 2,
                        maxLength: 50,
                      },
                      validationErrors: {
                        minLength: '项目名称至少需要2个字符',
                        maxLength: '项目名称不能超过50个字符',
                        required: '请输入项目名称',
                      },
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '项目描述',
                      placeholder: '请输入项目描述',
                      maxLength: 500,
                      showCounter: true,
                      validations: {
                        maxLength: 500,
                      },
                      validationErrors: {
                        maxLength: '项目描述不能超过500个字符',
                      },
                    },
                    {
                      type: 'select',
                      name: 'status',
                      label: '状态',
                      required: true,
                      options: [
                        { label: '激活', value: 'ACTIVE' },
                        { label: '停用', value: 'INACTIVE' },
                        { label: '归档', value: 'ARCHIVED' },
                      ],
                      validationErrors: {
                        required: '请选择项目状态',
                      },
                    },
                  ],
                }
              }
            },
            {
              type: 'button',
              label: '删除',
              level: 'link',
              className: 'text-danger',
              actionType: 'ajax',
              api: 'delete:/api/projects/${id}',
              confirmText: '确定要删除该项目吗？删除后不可恢复！'
            }
          ]
        }
      ]
    };
  }

  /**
   * 生成领域管理页面的AMIS配置
   */
  async generateDomainListPage(projectId?: string): Promise<any> {
    return {
      type: 'page',
      title: 'DDD领域管理',
      body: [
        {
          type: 'crud',
          api: projectId ? `/api/domains?projectId=${projectId}` : '/api/domains',
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: '领域ID',
              type: 'text',
              width: 150
            },
            {
              name: 'name',
              label: '领域名称',
              type: 'text'
            },
            {
              name: 'description',
              label: '领域描述',
              type: 'text'
            },
            {
              name: 'project.name',
              label: '所属项目',
              type: 'text'
            },
            {
              name: 'createdAt',
              label: '创建时间',
              type: 'datetime',
              format: 'YYYY-MM-DD HH:mm:ss'
            }
          ],
          headerToolbar: [
            {
              type: 'button',
              label: '新建领域',
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: '新建领域',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'post:/api/domains',
                  body: [
                    {
                      type: 'select',
                      name: 'projectId',
                      label: '所属项目',
                      required: true,
                      source: '/api/projects',
                      labelField: 'name',
                      valueField: 'id',
                      value: projectId
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '领域名称',
                      required: true,
                      placeholder: '请输入领域名称'
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '领域描述',
                      placeholder: '请输入领域描述'
                    }
                  ]
                }
              }
            }
          ],
          itemActions: [
            {
              type: 'button',
              label: '查看聚合',
              level: 'link',
              actionType: 'url',
              url: '/amis/aggregates?domainId=${id}'
            },
            {
              type: 'button',
              label: '编辑',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '编辑领域',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'put:/api/domains/${id}',
                  initApi: '/api/domains/${id}',
                  body: [
                    {
                      type: 'static',
                      name: 'project.name',
                      label: '所属项目'
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '领域名称',
                      required: true
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '领域描述'
                    }
                  ]
                }
              }
            },
            {
              type: 'button',
              label: '删除',
              level: 'link',
              className: 'text-danger',
              actionType: 'ajax',
              api: 'delete:/api/domains/${id}',
              confirmText: '确定要删除该领域吗？删除后不可恢复！'
            }
          ]
        }
      ]
    };
  }

  /**
   * 生成聚合管理页面的AMIS配置
   */
  async generateAggregateListPage(domainId?: string): Promise<any> {
    return {
      type: 'page',
      title: 'DDD聚合管理',
      body: [
        {
          type: 'crud',
          api: domainId ? `/api/aggregates?domainId=${domainId}` : '/api/aggregates',
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: '聚合ID',
              type: 'text',
              width: 150
            },
            {
              name: 'name',
              label: '聚合名称',
              type: 'text'
            },
            {
              name: 'description',
              label: '聚合描述',
              type: 'text'
            },
            {
              name: 'domain.name',
              label: '所属领域',
              type: 'text'
            },
            {
              name: 'domain.project.name',
              label: '所属项目',
              type: 'text'
            },
            {
              name: 'createdAt',
              label: '创建时间',
              type: 'datetime',
              format: 'YYYY-MM-DD HH:mm:ss'
            }
          ],
          headerToolbar: [
            {
              type: 'button',
              label: '新建聚合',
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: '新建聚合',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'post:/api/aggregates',
                  body: [
                    {
                      type: 'select',
                      name: 'domainId',
                      label: '所属领域',
                      required: true,
                      source: '/api/domains',
                      labelField: 'name',
                      valueField: 'id',
                      value: domainId
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '聚合名称',
                      required: true,
                      placeholder: '请输入聚合名称'
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '聚合描述',
                      placeholder: '请输入聚合描述'
                    }
                  ]
                }
              }
            }
          ],
          itemActions: [
            {
              type: 'button',
              label: '查看实体',
              level: 'link',
              actionType: 'url',
              url: '/amis/entities?aggregateId=${id}'
            },
            {
              type: 'button',
              label: '编辑',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '编辑聚合',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'put:/api/aggregates/${id}',
                  initApi: '/api/aggregates/${id}',
                  body: [
                    {
                      type: 'static',
                      name: 'domain.name',
                      label: '所属领域'
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '聚合名称',
                      required: true
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '聚合描述'
                    }
                  ]
                }
              }
            },
            {
              type: 'button',
              label: '删除',
              level: 'link',
              className: 'text-danger',
              actionType: 'ajax',
              api: 'delete:/api/aggregates/${id}',
              confirmText: '确定要删除该聚合吗？删除后不可恢复！'
            }
          ]
        }
      ]
    };
  }

  /**
   * 生成实体管理页面的AMIS配置
   */
  async generateEntityListPage(aggregateId?: string): Promise<any> {
    return {
      type: 'page',
      title: 'DDD实体管理',
      body: [
        {
          type: 'crud',
          api: aggregateId ? `/api/entities?aggregateId=${aggregateId}` : '/api/entities',
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: '实体ID',
              type: 'text',
              width: 150
            },
            {
              name: 'name',
              label: '实体名称',
              type: 'text'
            },
            {
              name: 'type',
              label: '类型',
              type: 'status',
              map: {
                'ENTITY': { status: 'success', text: '实体' },
                'VALUE_OBJECT': { status: 'info', text: '值对象' }
              }
            },
            {
              name: 'description',
              label: '描述',
              type: 'text'
            },
            {
              name: 'aggregate.name',
              label: '所属聚合',
              type: 'text'
            },
            {
              name: 'createdAt',
              label: '创建时间',
              type: 'datetime',
              format: 'YYYY-MM-DD HH:mm:ss'
            }
          ],
          headerToolbar: [
            {
              type: 'button',
              label: '新建实体',
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: '新建实体',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'post:/api/entities',
                  body: [
                    {
                      type: 'select',
                      name: 'aggregateId',
                      label: '所属聚合',
                      required: true,
                      source: '/api/aggregates',
                      labelField: 'name',
                      valueField: 'id',
                      value: aggregateId
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '实体名称',
                      required: true,
                      placeholder: '请输入实体名称'
                    },
                    {
                      type: 'radios',
                      name: 'type',
                      label: '类型',
                      value: 'ENTITY',
                      options: [
                        { label: '实体', value: 'ENTITY' },
                        { label: '值对象', value: 'VALUE_OBJECT' }
                      ]
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '描述',
                      placeholder: '请输入实体描述'
                    }
                  ]
                }
              }
            }
          ],
          itemActions: [
            {
              type: 'button',
              label: '编辑',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '编辑实体',
                size: 'lg',
                body: {
                  type: 'form',
                  api: 'put:/api/entities/${id}',
                  initApi: '/api/entities/${id}',
                  body: [
                    {
                      type: 'static',
                      name: 'aggregate.name',
                      label: '所属聚合'
                    },
                    {
                      type: 'input-text',
                      name: 'name',
                      label: '实体名称',
                      required: true
                    },
                    {
                      type: 'radios',
                      name: 'type',
                      label: '类型',
                      options: [
                        { label: '实体', value: 'ENTITY' },
                        { label: '值对象', value: 'VALUE_OBJECT' }
                      ]
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: '描述'
                    }
                  ]
                }
              }
            },
            {
              type: 'button',
              label: '删除',
              level: 'link',
              className: 'text-danger',
              actionType: 'ajax',
              api: 'delete:/api/entities/${id}',
              confirmText: '确定要删除该实体吗？删除后不可恢复！'
            }
          ]
        }
      ]
    };
  }

  /**
   * 生成主应用布局的AMIS配置
   */
  async generateAppLayoutPage(): Promise<any> {
    return {
      type: 'app',
      brandName: 'DDD元数据驱动开发平台',
      logo: 'https://aisuda.bce.baidu.com/amis/static/logo_408c434.png',
      className: 'app-layout-enhanced',
      css: this.generateCustomStyles(),
      header: {
        type: 'flex',
        className: 'app-header px-4 py-2',
        items: [
          {
            type: 'flex',
            className: 'flex-1',
            items: [
              {
                type: 'tpl',
                tpl: '<i class="fa fa-cube text-2xl text-blue-400 mr-3"></i>',
              },
              {
                type: 'tpl',
                className: 'brand-title',
                tpl: 'DDD元数据驱动开发平台',
              },
              {
                type: 'tpl',
                className: 'version-badge ml-3',
                tpl: '<span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">v1.0.0</span>',
              },
            ],
          },
          {
            type: 'flex',
            className: 'header-actions',
            items: [
              {
                type: 'button',
                icon: 'fa fa-search',
                level: 'link',
                className: 'text-gray-600 hover:text-blue-500',
                tooltip: '全局搜索',
              },
              {
                type: 'button',
                icon: 'fa fa-bell',
                level: 'link',
                className: 'text-gray-600 hover:text-blue-500 relative',
                tooltip: '通知',
                badge: {
                  text: '3',
                  level: 'danger',
                },
              },
              {
                type: 'button',
                icon: 'fa fa-question-circle',
                level: 'link',
                className: 'text-gray-600 hover:text-blue-500',
                tooltip: '帮助文档',
              },
              {
                type: 'dropdown-button',
                icon: 'fa fa-user-circle',
                level: 'link',
                className: 'text-gray-600 hover:text-blue-500',
                label: '用户',
                buttons: [
                  {
                    type: 'button',
                    label: '个人设置',
                    icon: 'fa fa-cog',
                  },
                  {
                    type: 'button',
                    label: '切换主题',
                    icon: 'fa fa-palette',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    type: 'button',
                    label: '退出登录',
                    icon: 'fa fa-sign-out',
                    level: 'danger',
                  },
                ],
              },
            ],
          },
        ],
      },
      asideBefore: {
        type: 'nav',
        stacked: true,
        className: 'enhanced-sidebar',
        itemClassName: 'nav-item-enhanced',
        links: [
          {
            label: '工作台',
            icon: 'fa fa-tachometer-alt',
            url: '/dashboard',
            className: 'nav-dashboard',
            badge: {
              text: 'NEW',
              level: 'info',
            },
          },
          {
            label: '项目管理',
            icon: 'fa fa-folder-open',
            className: 'nav-section-header',
            children: [
              {
                label: '项目列表',
                url: '/projects',
                icon: 'fa fa-list-ul',
                className: 'nav-sub-item',
              },
              {
                label: '新建项目',
                url: '/projects/new',
                icon: 'fa fa-plus-circle',
                className: 'nav-sub-item',
              },
            ],
          },
          {
            label: 'DDD设计',
            icon: 'fa fa-sitemap',
            className: 'nav-section-header nav-ddd',
            children: [
              {
                label: '领域建模',
                url: '/domains',
                icon: 'fa fa-cubes',
                className: 'nav-sub-item',
              },
              {
                label: '聚合设计',
                url: '/aggregates',
                icon: 'fa fa-cube',
                className: 'nav-sub-item',
              },
              {
                label: '实体管理',
                url: '/entities',
                icon: 'fa fa-table',
                className: 'nav-sub-item',
              },
            ],
          },
          {
            label: '界面设计',
            icon: 'fa fa-paint-brush',
            className: 'nav-section-header nav-ui',
            children: [
              {
                label: '页面生成器',
                url: '/screen-generator',
                icon: 'fa fa-magic',
                className: 'nav-sub-item',
              },
              {
                label: '组件库',
                url: '/components',
                icon: 'fa fa-th-large',
                className: 'nav-sub-item',
              },
              {
                label: '组件演示',
                url: '/components-demo',
                icon: 'fa fa-flask',
                className: 'nav-sub-item',
                badge: {
                  text: 'HOT',
                  level: 'danger',
                },
              },
              {
                label: '动态表单演示',
                url: '/dynamic-forms-demo',
                icon: 'fa fa-wpforms',
                className: 'nav-sub-item',
                badge: {
                  text: 'NEW',
                  level: 'info',
                },
              },
            ],
          },
          {
            label: '数据管理',
            icon: 'fa fa-database',
            className: 'nav-section-header nav-data',
            children: [
              {
                label: '数据导入',
                url: '/data-import',
                icon: 'fa fa-upload',
                className: 'nav-sub-item',
              },
              {
                label: '数据导出',
                url: '/data-export',
                icon: 'fa fa-download',
                className: 'nav-sub-item',
              },
              {
                label: '备份管理',
                url: '/backup',
                icon: 'fa fa-shield',
                className: 'nav-sub-item',
              },
            ],
          },
          {
            label: '系统管理',
            icon: 'fa fa-cog',
            className: 'nav-section-header nav-system',
            children: [
              {
                label: '系统信息',
                url: '/system/info',
                icon: 'fa fa-info-circle',
                className: 'nav-sub-item',
              },
              {
                label: 'API文档',
                url: '/system/api-docs',
                icon: 'fa fa-book',
                className: 'nav-sub-item',
              },
            ],
          },
        ],
      },
      pages: [
        {
          url: '/dashboard',
          schema: {
            type: 'page',
            title: '工作台',
            body: '$dashboard',
          },
        },
        {
          url: '/projects',
          schema: {
            type: 'page',
            title: '项目管理',
            body: '$projects',
          },
        },
        {
          url: '/domains',
          schema: {
            type: 'page',
            title: '领域管理',
            body: '$domains',
          },
        },
        {
          url: '/aggregates',
          schema: {
            type: 'page',
            title: '聚合管理',
            body: '$aggregates',
          },
        },
        {
          url: '/entities',
          schema: {
            type: 'page',
            title: '实体管理',
            body: '$entities',
          },
        },
        {
          url: '/components-demo',
          schema: {
            type: 'page',
            title: 'AMIS高级组件演示',
            body: '$componentsDemo',
          },
        },
        {
          url: '/dynamic-forms-demo',
          schema: {
            type: 'service',
            api: '/amis/dynamic-forms-demo',
            body: '$data',
          },
        },
      ],
      definitions: {
        dashboard: await this.generateDashboardPageBody(),
        projects: (await this.generateProjectListPage()).body,
        domains: (await this.generateDomainListPage()).body,
        aggregates: (await this.generateAggregateListPage()).body,
        entities: (await this.generateEntityListPage()).body,
        componentsDemo: await this.generateComponentsDemoPageBody(),
      },
    };
  }

  /**
   * Generate custom CSS styles for enhanced UI
   */
  private generateCustomStyles() {
    return {
      type: 'html',
      html: `
        <style>
          /* Header Styles */
          .app-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .header-brand {
            font-weight: 700;
            font-size: 1.25rem;
            color: white !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          
          .header-brand:hover {
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          
          .header-search {
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.1);
            color: white;
            border-radius: 20px;
            padding: 8px 16px;
            transition: all 0.3s ease;
          }
          
          .header-search:focus {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.4);
            box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
          }
          
          .header-search::placeholder {
            color: rgba(255,255,255,0.7);
          }
          
          .header-nav-item {
            color: rgba(255,255,255,0.9);
            transition: all 0.3s ease;
            border-radius: 8px;
            padding: 8px 12px;
            position: relative;
          }
          
          .header-nav-item:hover {
            background: rgba(255,255,255,0.15);
            color: white;
            transform: translateY(-1px);
          }
          
          .header-badge {
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            position: absolute;
            top: -2px;
            right: -2px;
            background: #ff4757;
            color: white;
          }
          
          /* Sidebar Styles */
          .app-sidebar {
            background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
            border-right: 1px solid #cbd5e0;
            box-shadow: 2px 0 15px rgba(0,0,0,0.08);
          }
          
          .nav-section-header {
            font-weight: 600;
            color: #2d3748;
            margin: 20px 0 12px 0;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 8px 16px;
            position: relative;
          }
          
          .nav-ddd {
            border-left: 4px solid #667eea;
            background: rgba(102, 126, 234, 0.05);
          }
          
          .nav-ui {
            border-left: 4px solid #48bb78;
            background: rgba(72, 187, 120, 0.05);
          }
          
          .nav-data {
            border-left: 4px solid #ed8936;
            background: rgba(237, 137, 54, 0.05);
          }
          
          .nav-system {
            border-left: 4px solid #9f7aea;
            background: rgba(159, 122, 234, 0.05);
          }
          
          .nav-sub-item {
            color: #4a5568;
            padding: 12px 20px;
            margin: 2px 12px;
            border-radius: 10px;
            transition: all 0.3s ease;
            font-size: 0.875rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .nav-sub-item:hover {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            color: #234e52;
            transform: translateX(6px);
            box-shadow: 0 4px 12px rgba(56, 178, 172, 0.15);
          }
          
          .nav-sub-item.is-active {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            color: #234e52;
            border-left: 4px solid #38b2ac;
            font-weight: 600;
          }
          
          .nav-sub-item i {
            margin-right: 12px;
            width: 18px;
            text-align: center;
            transition: transform 0.3s ease;
          }
          
          .nav-sub-item:hover i {
            transform: scale(1.15) rotate(5deg);
          }
          
          .nav-sub-item .badge {
            font-size: 0.65rem;
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          /* Content Area */
          .app-content {
            background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
            min-height: calc(100vh - 70px);
            padding: 32px;
            position: relative;
          }
          
          .app-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
            background-size: 200% 100%;
            animation: gradient 3s ease infinite;
          }
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .app-header .header-search {
              display: none;
            }
            
            .app-sidebar {
              width: 100%;
              position: fixed;
              z-index: 1000;
              transform: translateX(-100%);
              transition: transform 0.3s ease;
            }
            
            .app-sidebar.show {
              transform: translateX(0);
            }
            
            .app-content {
              padding: 20px 16px;
            }
            
            .nav-sub-item {
              padding: 10px 16px;
              margin: 2px 8px;
            }
          }
          
          /* Loading and Animation Enhancements */
          .nav-sub-item {
            background-clip: padding-box;
          }
          
          .nav-sub-item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3), transparent 70%);
            transform: translateX(-100%);
            transition: transform 0.6s;
          }
          
          .nav-sub-item:hover::after {
            transform: translateX(100%);
          }
          
          /* Badge Animation */
          .header-badge {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          /* Custom Scrollbar */
          .app-sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          .app-sidebar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          .app-sidebar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          
          .app-sidebar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        </style>
      `,
    };
  }

  /**
   * 生成带面包屑导航的页面包装器
   */
  async generatePageWithBreadcrumb(
    title: string,
    body: any,
    breadcrumbs?: Array<{ label: string; url?: string }>
  ): Promise<any> {
    const defaultBreadcrumbs = [
      { label: '首页', url: '/dashboard' },
      { label: title },
    ];

    return {
      type: 'page',
      title: title,
      body: [
        {
          type: 'breadcrumb',
          items: breadcrumbs || defaultBreadcrumbs,
          className: 'mb-4',
        },
        {
          type: 'container',
          body: body,
        },
      ],
    };
  }

  /**
   * 生成增强的数据统计仪表板
   */
  async generateDashboardPageBody(): Promise<any> {
    return [
      // 顶部统计卡片
      {
        type: 'grid',
        className: 'mb-4',
        columns: [
          {
            md: 3,
            body: [
              {
                type: 'card',
                className: 'statistics-card text-center',
                header: {
                  title: '📊 项目总数',
                  className: 'text-primary',
                },
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/projects',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-number text-3xl font-bold text-blue-600">${total || 0}</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-label text-gray-500">个项目</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-trend text-sm ${growth >= 0 ? "text-green-500" : "text-red-500"}">${growth >= 0 ? "↗" : "↘"} ${Math.abs(growth)}%</div>',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 3,
            body: [
              {
                type: 'card',
                className: 'statistics-card text-center',
                header: {
                  title: '🏗️ 领域总数',
                  className: 'text-success',
                },
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/domains',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-number text-3xl font-bold text-green-600">${total || 0}</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-label text-gray-500">个领域</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-trend text-sm ${growth >= 0 ? "text-green-500" : "text-red-500"}">${growth >= 0 ? "↗" : "↘"} ${Math.abs(growth)}%</div>',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 3,
            body: [
              {
                type: 'card',
                className: 'statistics-card text-center',
                header: {
                  title: '🧩 聚合总数',
                  className: 'text-warning',
                },
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/aggregates',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-number text-3xl font-bold text-orange-600">${total || 0}</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-label text-gray-500">个聚合</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-trend text-sm ${growth >= 0 ? "text-green-500" : "text-red-500"}">${growth >= 0 ? "↗" : "↘"} ${Math.abs(growth)}%</div>',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 3,
            body: [
              {
                type: 'card',
                className: 'statistics-card text-center',
                header: {
                  title: '📋 实体总数',
                  className: 'text-info',
                },
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/entities',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-number text-3xl font-bold text-purple-600">${total || 0}</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-label text-gray-500">个实体</div>',
                      },
                      {
                        type: 'tpl',
                        tpl: '<div class="statistics-trend text-sm ${growth >= 0 ? "text-green-500" : "text-red-500"}">${growth >= 0 ? "↗" : "↘"} ${Math.abs(growth)}%</div>',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // 图表区域
      {
        type: 'grid',
        className: 'mb-4',
        columns: [
          {
            md: 8,
            body: [
              {
                type: 'panel',
                title: '📈 项目活动趋势',
                className: 'chart-panel',
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/project-activity-trend',
                    body: [
                      {
                        type: 'chart',
                        config: {
                          type: 'line',
                          data: {
                            labels: '${dates}',
                            datasets: [
                              {
                                label: '新建项目',
                                data: '${projectCounts}',
                                borderColor: 'rgb(54, 162, 235)',
                                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                                tension: 0.4,
                                fill: true,
                              },
                              {
                                label: '新建领域',
                                data: '${domainCounts}',
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                                tension: 0.4,
                                fill: true,
                              },
                              {
                                label: '新建实体',
                                data: '${entityCounts}',
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                                tension: 0.4,
                                fill: true,
                              },
                            ],
                          },
                          options: {
                            responsive: true,
                            plugins: {
                              title: {
                                display: true,
                                text: '最近30天活动趋势',
                              },
                              legend: {
                                position: 'top',
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: '数量',
                                },
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: '日期',
                                },
                              },
                            },
                          },
                        },
                        height: 350,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 4,
            body: [
              {
                type: 'panel',
                title: '🥧 项目状态分布',
                className: 'chart-panel',
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/project-status-distribution',
                    body: [
                      {
                        type: 'chart',
                        config: {
                          type: 'doughnut',
                          data: {
                            labels: '${labels}',
                            datasets: [
                              {
                                data: '${values}',
                                backgroundColor: [
                                  '#10B981', // 活跃 - 绿色
                                  '#F59E0B', // 停用 - 黄色
                                  '#EF4444', // 归档 - 红色
                                ],
                                borderWidth: 2,
                                borderColor: '#ffffff',
                              },
                            ],
                          },
                          options: {
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                          },
                        },
                        height: 350,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // 热力图和复杂度分析
      {
        type: 'grid',
        className: 'mb-4',
        columns: [
          {
            md: 6,
            body: [
              {
                type: 'panel',
                title: '🔥 领域活跃度热力图',
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/domain-heatmap',
                    body: [
                      {
                        type: 'chart',
                        config: {
                          type: 'scatter',
                          data: {
                            datasets: [
                              {
                                label: '领域活跃度',
                                data: '${heatmapData}',
                                backgroundColor: function(context) {
                                  const value = context.parsed.y;
                                  const alpha = Math.min(value / 100, 1);
                                  return `rgba(255, 99, 132, ${alpha})`;
                                },
                                pointRadius: 8,
                              },
                            ],
                          },
                          options: {
                            responsive: true,
                            plugins: {
                              tooltip: {
                                callbacks: {
                                  title: function(context) {
                                    return context[0].raw.domainName;
                                  },
                                  label: function(context) {
                                    return `活跃度: ${context.parsed.y}%`;
                                  },
                                },
                              },
                            },
                            scales: {
                              x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                  display: true,
                                  text: '实体数量',
                                },
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: '活跃度 (%)',
                                },
                              },
                            },
                          },
                        },
                        height: 300,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 6,
            body: [
              {
                type: 'panel',
                title: '📊 DDD复杂度分析',
                body: [
                  {
                    type: 'service',
                    api: '/api/statistics/complexity-analysis',
                    body: [
                      {
                        type: 'chart',
                        config: {
                          type: 'radar',
                          data: {
                            labels: ['领域数量', '聚合复杂度', '实体关联度', '业务覆盖度', '技术债务'],
                            datasets: [
                              {
                                label: '当前项目',
                                data: '${currentScores}',
                                borderColor: 'rgb(54, 162, 235)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                pointBackgroundColor: 'rgb(54, 162, 235)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(54, 162, 235)',
                              },
                              {
                                label: '行业平均',
                                data: '${industryAverage}',
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                pointBackgroundColor: 'rgb(255, 99, 132)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(255, 99, 132)',
                              },
                            ],
                          },
                          options: {
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                            },
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          },
                        },
                        height: 300,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // 快速操作和最近活动
      {
        type: 'grid',
        columns: [
          {
            md: 8,
            body: [
              {
                type: 'panel',
                title: '🚀 快速操作',
                body: [
                  {
                    type: 'grid',
                    columns: [
                      {
                        md: 3,
                        body: [
                          {
                            type: 'action',
                            label: '创建项目',
                            level: 'primary',
                            size: 'lg',
                            icon: 'fa fa-plus',
                            actionType: 'dialog',
                            className: 'w-full mb-2',
                            dialog: {
                              title: '快速创建项目',
                              size: 'lg',
                              body: {
                                type: 'form',
                                api: 'post:/api/projects',
                                body: [
                                  {
                                    type: 'input-text',
                                    name: 'name',
                                    label: '项目名称',
                                    required: true,
                                    placeholder: '请输入项目名称',
                                  },
                                  {
                                    type: 'textarea',
                                    name: 'description',
                                    label: '项目描述',
                                    placeholder: '请输入项目描述',
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      {
                        md: 3,
                        body: [
                          {
                            type: 'action',
                            label: '领域建模',
                            level: 'info',
                            size: 'lg',
                            icon: 'fa fa-sitemap',
                            actionType: 'url',
                            url: '/domains',
                            className: 'w-full mb-2',
                          },
                        ],
                      },
                      {
                        md: 3,
                        body: [
                          {
                            type: 'action',
                            label: '组件演示',
                            level: 'success',
                            size: 'lg',
                            icon: 'fa fa-flask',
                            actionType: 'url',
                            url: '/components-demo',
                            className: 'w-full mb-2',
                          },
                        ],
                      },
                      {
                        md: 3,
                        body: [
                          {
                            type: 'action',
                            label: '动态表单',
                            level: 'warning',
                            size: 'lg',
                            icon: 'fa fa-wpforms',
                            actionType: 'url',
                            url: '/dynamic-forms-demo',
                            className: 'w-full mb-2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'panel',
                title: '📋 最近创建的项目',
                body: [
                  {
                    type: 'service',
                    api: '/api/projects?limit=5&sortBy=createdAt&order=desc',
                    body: [
                      {
                        type: 'list',
                        source: '$data',
                        listItem: {
                          body: [
                            {
                              type: 'flex',
                              items: [
                                {
                                  type: 'container',
                                  className: 'flex-1',
                                  body: [
                                    {
                                      type: 'tpl',
                                      tpl: '<h4 class="text-md font-semibold">${name}</h4>',
                                    },
                                    {
                                      type: 'tpl',
                                      tpl: '<p class="text-gray-600 text-sm">${description}</p>',
                                    },
                                    {
                                      type: 'tpl',
                                      tpl: '<span class="text-xs text-gray-400">创建于: ${createdAt}</span>',
                                    },
                                  ],
                                },
                                {
                                  type: 'container',
                                  body: [
                                    {
                                      type: 'status',
                                      source: '${status}',
                                      map: {
                                        ACTIVE: { status: 'success', text: '活跃' },
                                        INACTIVE: { status: 'default', text: '停用' },
                                        ARCHIVED: { status: 'warning', text: '归档' },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            md: 4,
            body: [
              {
                type: 'panel',
                title: '📈 系统信息',
                className: 'mb-4',
                body: [
                  {
                    type: 'service',
                    api: '/api/info',
                    body: [
                      {
                        type: 'property',
                        items: [
                          { label: '系统名称', content: '${name}' },
                          { label: '系统版本', content: '${version}' },
                          { label: '运行环境', content: '${environment}' },
                          { label: '启动时间', content: '${startTime}' },
                          { label: '内存使用', content: '${memoryUsage}' },
                          { label: 'CPU使用率', content: '${cpuUsage}' },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'panel',
                title: '🏆 今日成就',
                body: [
                  {
                    type: 'list',
                    source: [
                      {
                        icon: '🎯',
                        title: '完成第一个项目',
                        description: '恭喜您创建了第一个DDD项目！',
                        time: '刚刚',
                      },
                      {
                        icon: '🚀',
                        title: '系统优化',
                        description: '页面加载速度提升了30%',
                        time: '10分钟前',
                      },
                      {
                        icon: '🛠️',
                        title: '功能增强',
                        description: '新增动态表单生成功能',
                        time: '1小时前',
                      },
                    ],
                    listItem: {
                      body: [
                        {
                          type: 'flex',
                          items: [
                            {
                              type: 'tpl',
                              tpl: '<div class="text-2xl mr-3">${icon}</div>',
                            },
                            {
                              type: 'container',
                              className: 'flex-1',
                              body: [
                                {
                                  type: 'tpl',
                                  tpl: '<h5 class="text-sm font-semibold">${title}</h5>',
                                },
                                {
                                  type: 'tpl',
                                  tpl: '<p class="text-xs text-gray-600">${description}</p>',
                                },
                                {
                                  type: 'tpl',
                                  tpl: '<span class="text-xs text-gray-400">${time}</span>',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  /**
   * 生成DDD平台主页的AMIS配置 (保持向后兼容)
   */
  async generateDashboardPage(): Promise<any> {
    return {
      type: 'page',
      title: 'DDD元数据驱动开发平台',
      body: await this.generateDashboardPageBody(),
    };
  }

  /**
   * 根据实体元数据生成AMIS表单配置
   */
  async generateFormFromEntity(entityId: number): Promise<any> {
    try {
      const entity = await this.entityService.getEntityById(entityId);
      if (!entity) {
        throw new Error('实体不存在');
      }

      // 基础表单字段
      const formFields = [
        {
          type: 'input-text',
          name: 'name',
          label: '名称',
          required: true,
          placeholder: `请输入${entity.name}名称`,
        },
        {
          type: 'textarea',
          name: 'description',
          label: '描述',
          placeholder: `请输入${entity.name}描述`,
        },
      ];

      // 如果实体有属性定义，则动态生成字段
      if (entity.properties && Array.isArray(entity.properties)) {
        for (const property of entity.properties) {
          const field = this.generateFormFieldFromProperty(property);
          if (field) {
            formFields.push(field);
          }
        }
      }

      return {
        type: 'form',
        title: `${entity.name}表单`,
        api: {
          method: 'post',
          url: `/api/entities/${entityId}/data`,
        },
        body: formFields,
        actions: [
          {
            type: 'button',
            actionType: 'cancel',
            label: '取消',
          },
          {
            type: 'button',
            actionType: 'submit',
            level: 'primary',
            label: '提交',
          },
        ],
      };
    } catch (error) {
      throw new Error(`生成表单失败: ${error.message}`);
    }
  }

  /**
   * 根据属性定义生成表单字段
   */
  private generateFormFieldFromProperty(property: any): any {
    if (!property.name || !property.type) {
      return null;
    }

    const baseField = {
      name: property.name,
      label: property.label || property.name,
      required: property.required || false,
      placeholder:
        property.placeholder || `请输入${property.label || property.name}`,
    };

    // 根据类型映射到AMIS组件
    switch (property.type.toLowerCase()) {
      case 'string':
      case 'text':
        return {
          ...baseField,
          type: property.maxLength > 100 ? 'textarea' : 'input-text',
          maxLength: property.maxLength,
        };

      case 'number':
      case 'integer':
        return {
          ...baseField,
          type: 'input-number',
          min: property.min,
          max: property.max,
          step: property.step || 1,
        };

      case 'boolean':
        return {
          ...baseField,
          type: 'switch',
          value: property.defaultValue || false,
        };

      case 'date':
        return {
          ...baseField,
          type: 'input-date',
          format: 'YYYY-MM-DD',
        };

      case 'datetime':
        return {
          ...baseField,
          type: 'input-datetime',
          format: 'YYYY-MM-DD HH:mm:ss',
        };

      case 'email':
        return {
          ...baseField,
          type: 'input-email',
        };

      case 'phone':
        return {
          ...baseField,
          type: 'input-text',
          validations: {
            isPhone: true,
          },
        };

      case 'url':
        return {
          ...baseField,
          type: 'input-url',
        };

      case 'enum':
      case 'select':
        return {
          ...baseField,
          type: 'select',
          options: property.options || [],
        };

      case 'file':
        return {
          ...baseField,
          type: 'input-file',
          accept: property.accept,
          maxSize: property.maxSize || '10MB',
        };

      case 'image':
        return {
          ...baseField,
          type: 'input-image',
          accept: '.jpg,.jpeg,.png,.gif',
          maxSize: property.maxSize || '5MB',
        };

      case 'richtext':
        return {
          ...baseField,
          type: 'editor',
          height: 300,
        };

      case 'json':
        return {
          ...baseField,
          type: 'json-editor',
          height: 200,
        };

      default:
        return {
          ...baseField,
          type: 'input-text',
        };
    }
  }

  /**
   * 根据聚合元数据生成AMIS列表配置
   */
  async generateListFromAggregate(aggregateId: number): Promise<any> {
    try {
      const aggregate = await this.aggregateService.getAggregateById(
        aggregateId
      );
      if (!aggregate) {
        throw new Error('聚合不存在');
      }

      const columns = await this.generateColumnsForAggregate(aggregateId);
      const headerToolbar = this.generateHeaderToolbar(aggregateId);
      const operationColumn = this.generateOperationColumn();

      return {
        type: 'crud',
        title: `${aggregate.name}管理`,
        api: {
          method: 'get',
          url: `/api/entities?aggregateId=${aggregateId}`,
        },
        headerToolbar,
        footerToolbar: ['statistics', 'pagination'],
        columns: [...columns, operationColumn],
      };
    } catch (error) {
      throw new Error(`生成列表失败: ${error.message}`);
    }
  }

  /**
   * 为聚合生成列配置
   */
  private async generateColumnsForAggregate(
    aggregateId: number
  ): Promise<any[]> {
    // 基础列配置
    const columns = [
      { name: 'id', label: 'ID', type: 'text', width: 80 },
      { name: 'name', label: '名称', type: 'text', width: 150 },
      { name: 'type', label: '类型', type: 'text', width: 100 },
      { name: 'description', label: '描述', type: 'text' },
      {
        name: 'createdAt',
        label: '创建时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        width: 160,
      },
    ];

    // 获取聚合下的实体列表
    const entities = await this.entityService.getEntities(aggregateId);

    // 如果有实体，根据实体属性动态添加列
    if (entities && entities.length > 0) {
      for (const entity of entities) {
        if (entity.properties && Array.isArray(entity.properties)) {
          for (const property of entity.properties) {
            const column = this.generateListColumnFromProperty(property);
            if (column && !columns.find(col => col.name === column.name)) {
              columns.push(column);
            }
          }
        }
      }
    }

    return columns;
  }

  /**
   * 生成列表头部工具栏
   */
  private generateHeaderToolbar(aggregateId: number): any[] {
    return [
      'filter-toggler',
      'bulk-actions',
      {
        type: 'button',
        label: '新增',
        actionType: 'dialog',
        level: 'primary',
        dialog: {
          title: '新增记录',
          body: {
            type: 'form',
            api: {
              method: 'post',
              url: `/api/entities/${aggregateId}/data`,
            },
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '名称',
                required: true,
              },
              {
                type: 'textarea',
                name: 'description',
                label: '描述',
              },
            ],
          },
        },
      },
    ];
  }

  /**
   * 生成操作列配置
   */
  private generateOperationColumn(): any {
    return {
      type: 'operation',
      label: '操作',
      width: 150,
      buttons: [
        {
          type: 'button',
          label: '编辑',
          level: 'link',
          actionType: 'dialog',
          dialog: {
            title: '编辑记录',
            body: {
              type: 'form',
              initApi: '/api/entities/${id}',
              api: {
                method: 'put',
                url: '/api/entities/${id}',
              },
              body: [
                {
                  type: 'input-text',
                  name: 'name',
                  label: '名称',
                  required: true,
                },
                {
                  type: 'textarea',
                  name: 'description',
                  label: '描述',
                },
              ],
            },
          },
        },
        {
          type: 'button',
          label: '删除',
          level: 'link',
          className: 'text-danger',
          actionType: 'ajax',
          confirmText: '确定要删除这条记录吗？',
          api: {
            method: 'delete',
            url: '/api/entities/${id}',
          },
        },
      ],
    };
  }

  /**
   * 根据属性定义生成列表列配置
   */
  private generateListColumnFromProperty(property: any): any {
    if (!property.name || !property.type) {
      return null;
    }

    const baseColumn = {
      name: property.name,
      label: property.label || property.name,
      width: property.width || 120,
    };

    const columnTypeMap = {
      number: { type: 'number' },
      integer: { type: 'number' },
      boolean: {
        type: 'status',
        map: {
          true: { status: 'success', text: '是' },
          false: { status: 'default', text: '否' },
        },
      },
      date: { type: 'date', format: 'YYYY-MM-DD' },
      datetime: { type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss' },
      image: { type: 'image', width: 100 },
      file: {
        type: 'link',
        href: '${' + property.name + '}',
        body: '下载',
      },
    };

    // 处理特殊类型
    if (
      property.type.toLowerCase() === 'enum' ||
      property.type.toLowerCase() === 'select'
    ) {
      return {
        ...baseColumn,
        type: 'mapping',
        map:
          property.options?.reduce((acc, opt) => {
            acc[opt.value] = opt.label;
            return acc;
          }, {}) || {},
      };
    }

    // 使用映射表或默认为text类型
    const columnConfig = columnTypeMap[property.type.toLowerCase()] || {
      type: 'text',
    };
    return { ...baseColumn, ...columnConfig };
  }

  /**
   * 生成组件演示页面主体内容
   */
  async generateComponentsDemoPageBody(): Promise<any> {
    return [
      {
        type: 'alert',
        level: 'info',
        body: '这里展示了各种AMIS高级组件的使用示例，可以用于构建复杂的业务表单和界面。',
        className: 'mb-4',
      },
      {
        type: 'tabs',
        tabs: [
          {
            title: '表单组件',
            tab: [
              {
                type: 'panel',
                title: '日期时间选择器',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'input-date',
                        name: 'date',
                        label: '日期选择',
                        format: 'YYYY-MM-DD',
                      },
                      {
                        type: 'input-datetime',
                        name: 'datetime',
                        label: '日期时间选择',
                        format: 'YYYY-MM-DD HH:mm:ss',
                      },
                      {
                        type: 'input-time',
                        name: 'time',
                        label: '时间选择',
                        format: 'HH:mm:ss',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'panel',
                title: '文件上传',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'input-file',
                        name: 'file',
                        label: '文件上传',
                        accept: '.jpg,.png,.pdf',
                        maxSize: '10MB',
                      },
                      {
                        type: 'input-image',
                        name: 'image',
                        label: '图片上传',
                        accept: '.jpg,.png,.gif',
                        maxSize: '5MB',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: '选择器组件',
            tab: [
              {
                type: 'panel',
                title: '树形选择器',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'tree-select',
                        name: 'tree',
                        label: '树形选择',
                        options: [
                          {
                            label: '系统管理',
                            value: 'system',
                            children: [
                              { label: '用户管理', value: 'user' },
                              { label: '角色管理', value: 'role' },
                            ],
                          },
                          {
                            label: '内容管理',
                            value: 'content',
                            children: [
                              { label: '文章管理', value: 'article' },
                              { label: '分类管理', value: 'category' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'panel',
                title: '标签输入',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'input-tag',
                        name: 'tags',
                        label: '标签输入',
                        placeholder: '输入标签后按回车',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: '高级组件',
            tab: [
              {
                type: 'panel',
                title: '富文本编辑器',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'editor',
                        name: 'content',
                        label: '富文本内容',
                        height: 300,
                      },
                    ],
                  },
                ],
              },
              {
                type: 'panel',
                title: '评分和开关',
                body: [
                  {
                    type: 'form',
                    body: [
                      {
                        type: 'input-rating',
                        name: 'rating',
                        label: '评分',
                        count: 5,
                      },
                      {
                        type: 'switch',
                        name: 'enabled',
                        label: '启用状态',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }
}
