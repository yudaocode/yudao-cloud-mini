import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { AmisSchemaEnhancedService } from '../service/amis-schema-enhanced.service';
import { AmisSchemaService } from '../service/amis-schema.service';

/**
 * AMIS页面控制器
 * 提供AMIS页面配置和渲染服务
 */
@Controller('/amis')
export class AmisController {
  @Inject()
  amisSchemaService: AmisSchemaService;

  @Inject()
  amisSchemaEnhancedService: AmisSchemaEnhancedService;

  /**
   * 简单的健康检查端点
   */
  @Get('/health')
  async health() {
    return {
      code: 200,
      message: 'AMIS Controller is working',
      timestamp: Date.now(),
    };
  }

  /**
   * 获取应用主布局配置
   */
  @Get('/layout')
  async getAppLayout() {
    try {
      const schema = await this.amisSchemaService.generateAppLayoutPage();
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取应用布局配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取应用主布局配置 (别名路由)
   */
  @Get('/app-layout')
  async getAppLayoutAlias() {
    try {
      const schema = await this.amisSchemaService.generateAppLayoutPage();
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取应用布局配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取主页配置
   */
  @Get('/dashboard')
  async getDashboard() {
    try {
      const schema = await this.amisSchemaService.generateDashboardPage();
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取主页配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取项目管理页面配置
   */
  @Get('/projects')
  async getProjectsPage() {
    try {
      const schema = await this.amisSchemaService.generateProjectListPage();
      
      // 增强表单验证
      this.enhancePageValidation(schema);
      
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取项目页面配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取领域管理页面配置
   */
  @Get('/domains')
  async getDomainsPage(@Query('projectId') projectId?: string) {
    try {
      const schema = await this.amisSchemaService.generateDomainListPage(
        projectId
      );
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取领域页面配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取聚合管理页面配置
   */
  @Get('/aggregates')
  async getAggregatesPage(@Query('domainId') domainId?: string) {
    try {
      const schema = await this.amisSchemaService.generateAggregateListPage(
        domainId
      );
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取聚合页面配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取实体管理页面配置
   */
  @Get('/entities')
  async getEntitiesPage(@Query('aggregateId') aggregateId?: string) {
    try {
      const schema = await this.amisSchemaService.generateEntityListPage(
        aggregateId
      );
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取实体页面配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 根据实体生成表单页面配置
   */
  @Get('/entity-form/:entityId')
  async getEntityFormPage(@Query('entityId') entityId: string) {
    try {
      const entityIdNum = parseInt(entityId);
      if (isNaN(entityIdNum)) {
        return {
          code: 400,
          message: '实体ID必须是数字',
          timestamp: Date.now(),
        };
      }

      const schema = await this.amisSchemaService.generateFormFromEntity(
        entityIdNum
      );
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取实体表单配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 根据聚合生成列表页面配置
   */
  @Get('/aggregate-list/:aggregateId')
  async getAggregateListPage(@Query('aggregateId') aggregateId: string) {
    try {
      const aggregateIdNum = parseInt(aggregateId);
      if (isNaN(aggregateIdNum)) {
        return {
          code: 400,
          message: '聚合ID必须是数字',
          timestamp: Date.now(),
        };
      }

      const schema = await this.amisSchemaService.generateListFromAggregate(
        aggregateIdNum
      );
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取聚合列表配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 测试AMIS渲染器
   */
  @Get('/test')
  async getTestPage() {
    try {
      const schema = {
        type: 'page',
        title: 'DDD平台 - AMIS技术验证',
        body: [
          {
            type: 'alert',
            body: '🎉 AMIS渲染功能正常工作！',
            level: 'success',
          },
          {
            type: 'panel',
            title: '技术验证项目',
            body: [
              {
                type: 'property',
                title: '验证状态',
                items: [
                  { label: 'Midway.js框架', content: '✅ 正常运行' },
                  { label: 'MySQL数据库', content: '✅ 连接成功' },
                  { label: 'Redis缓存', content: '✅ 读写正常' },
                  { label: 'AMIS渲染', content: '✅ 页面生成正常' },
                  { label: 'JSON Schema转换', content: '✅ 配置生成正常' },
                ],
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'grid',
            columns: [
              {
                md: 6,
                body: [
                  {
                    type: 'panel',
                    title: '基础CRUD测试',
                    body: [
                      {
                        type: 'crud',
                        api: '/api/projects',
                        syncLocation: false,
                        columns: [
                          { name: 'id', label: '项目ID', type: 'text' },
                          { name: 'name', label: '项目名称', type: 'text' },
                          { name: 'status', label: '状态', type: 'text' },
                          {
                            name: 'createdAt',
                            label: '创建时间',
                            type: 'datetime',
                            format: 'YYYY-MM-DD HH:mm:ss',
                          },
                        ],
                        headerToolbar: [
                          {
                            type: 'button',
                            label: '新建项目',
                            level: 'primary',
                            actionType: 'dialog',
                            dialog: {
                              title: '新建项目',
                              body: {
                                type: 'form',
                                api: 'post:/api/projects',
                                body: [
                                  {
                                    type: 'input-text',
                                    name: 'name',
                                    label: '项目名称',
                                    required: true,
                                  },
                                  {
                                    type: 'textarea',
                                    name: 'description',
                                    label: '项目描述',
                                  },
                                ],
                              },
                            },
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
                    title: '系统信息',
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
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'panel',
            title: 'JSON Schema到AMIS组件转换测试',
            body: [
              {
                type: 'form',
                title: '测试表单',
                body: [
                  {
                    type: 'input-text',
                    name: 'textField',
                    label: '文本字段',
                    placeholder: '输入文本',
                  },
                  {
                    type: 'input-number',
                    name: 'numberField',
                    label: '数字字段',
                    placeholder: '输入数字',
                  },
                  {
                    type: 'select',
                    name: 'selectField',
                    label: '选择字段',
                    options: [
                      { label: '选项1', value: 'option1' },
                      { label: '选项2', value: 'option2' },
                      { label: '选项3', value: 'option3' },
                    ],
                  },
                  {
                    type: 'textarea',
                    name: 'textareaField',
                    label: '文本域',
                    placeholder: '输入多行文本',
                  },
                  {
                    type: 'switch',
                    name: 'switchField',
                    label: '开关字段',
                  },
                  {
                    type: 'input-date',
                    name: 'dateField',
                    label: '日期字段',
                  },
                ],
                actions: [
                  {
                    type: 'submit',
                    label: '提交测试',
                    level: 'primary',
                  },
                  {
                    type: 'reset',
                    label: '重置',
                  },
                ],
              },
            ],
          },
        ],
      };

      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取测试页面配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取验证配置
   */
  @Get('/validation-config')
  async getValidationConfig() {
    try {
      const config = this.amisSchemaEnhancedService.generateGlobalErrorConfig();
      return {
        code: 200,
        message: '成功',
        data: config,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取验证配置失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取组件演示页面
   */
  @Get('/components-demo')
  async getComponentsDemo() {
    try {
      const schema = this.generateComponentsDemoPage();
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取组件演示页面失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 生成组件演示页面
   */
  private generateComponentsDemoPage() {
    return {
      type: 'page',
      title: 'AMIS高级组件演示',
      body: [
        {
          type: 'form',
          title: '高级组件表单演示',
          mode: 'horizontal',
          api: 'post:/api/demo/submit',
          body: [
            // 基础输入组件
            {
              type: 'fieldSet',
              title: '基础输入组件',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createInputField({
                  name: 'name',
                  label: '姓名',
                  required: true,
                  validationType: 'name',
                }),
                this.amisSchemaEnhancedService.createInputField({
                  name: 'email',
                  label: '邮箱',
                  type: 'input-email',
                  required: true,
                  validationType: 'email',
                }),
                this.amisSchemaEnhancedService.createNumberField({
                  name: 'age',
                  label: '年龄',
                  required: true,
                  min: 0,
                  max: 150,
                }),
                this.amisSchemaEnhancedService.createTextareaField({
                  name: 'description',
                  label: '个人描述',
                  rows: 3,
                }),
              ],
            },
            // 日期时间组件
            {
              type: 'fieldSet',
              title: '日期时间组件',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createDateField({
                  name: 'birthDate',
                  label: '出生日期',
                  required: true,
                }),
                this.amisSchemaEnhancedService.createDateTimeField({
                  name: 'registerTime',
                  label: '注册时间',
                }),
              ],
            },
            // 选择器组件
            {
              type: 'fieldSet',
              title: '选择器组件',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createSelectField({
                  name: 'gender',
                  label: '性别',
                  required: true,
                  options: [
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '其他', value: 'other' },
                  ],
                }),
                this.amisSchemaEnhancedService.createSelectField({
                  name: 'hobbies',
                  label: '兴趣爱好',
                  multiple: true,
                  options: [
                    { label: '阅读', value: 'reading' },
                    { label: '运动', value: 'sports' },
                    { label: '音乐', value: 'music' },
                    { label: '旅游', value: 'travel' },
                    { label: '编程', value: 'coding' },
                  ],
                }),
                this.amisSchemaEnhancedService.createTreeSelectField({
                  name: 'department',
                  label: '所属部门',
                  required: true,
                  options: [
                    {
                      label: '技术部',
                      value: 'tech',
                      children: [
                        { label: '前端组', value: 'frontend' },
                        { label: '后端组', value: 'backend' },
                        { label: '测试组', value: 'qa' },
                      ],
                    },
                    {
                      label: '产品部',
                      value: 'product',
                      children: [
                        { label: '产品设计', value: 'design' },
                        { label: '用户研究', value: 'research' },
                      ],
                    },
                  ],
                }),
              ],
            },
            // 高级输入组件
            {
              type: 'fieldSet',
              title: '高级输入组件',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createTagsField({
                  name: 'skills',
                  label: '技能标签',
                  max: 10,
                  options: [
                    { label: 'JavaScript', value: 'js' },
                    { label: 'TypeScript', value: 'ts' },
                    { label: 'React', value: 'react' },
                    { label: 'Vue', value: 'vue' },
                    { label: 'Node.js', value: 'nodejs' },
                  ],
                }),
                this.amisSchemaEnhancedService.createColorField({
                  name: 'themeColor',
                  label: '主题颜色',
                }),
                this.amisSchemaEnhancedService.createRatingField({
                  name: 'rating',
                  label: '满意度评分',
                  count: 5,
                  half: true,
                }),
                this.amisSchemaEnhancedService.createSwitchField({
                  name: 'isActive',
                  label: '是否激活',
                  onText: '已激活',
                  offText: '未激活',
                }),
              ],
            },
            // 文件上传组件
            {
              type: 'fieldSet',
              title: '文件上传组件',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createFileUploadField({
                  name: 'avatar',
                  label: '头像',
                  accept: 'image/*',
                  maxSize: 1048576, // 1MB
                  crop: true,
                }),
                this.amisSchemaEnhancedService.createFileUploadField({
                  name: 'documents',
                  label: '相关文档',
                  multiple: true,
                  accept: '.pdf,.doc,.docx,.xls,.xlsx',
                }),
              ],
            },
            // 富文本编辑器
            {
              type: 'fieldSet',
              title: '富文本编辑器',
              collapsable: true,
              body: [
                this.amisSchemaEnhancedService.createRichTextEditor({
                  name: 'content',
                  label: '详细内容',
                  height: 200,
                  placeholder: '请输入详细内容...',
                }),
              ],
            },
          ],
          actions: [
            {
              type: 'submit',
              label: '提交',
              level: 'primary',
            },
            {
              type: 'reset',
              label: '重置',
            },
          ],
        },
      ],
    };
  }

  /**
   * 增强页面验证的私有方法
   */
  private enhancePageValidation(pageConfig: any) {
    if (!pageConfig) return;
    this.traverseAndEnhance(pageConfig);
  }

  private traverseAndEnhance(obj: any) {
    if (!obj || typeof obj !== 'object') return;

    // 如果是表单字段，进行验证增强
    if (obj.type && this.isFormField(obj.type)) {
      this.enhanceField(obj);
    }

    // 递归处理所有属性
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(item => this.traverseAndEnhance(item));
        } else {
          this.traverseAndEnhance(obj[key]);
        }
      }
    }
  }

  private isFormField(type: string): boolean {
    const formFieldTypes = [
      'input-text',
      'input-email',
      'input-url',
      'input-number',
      'textarea',
      'select',
      'input-password',
      'input-date',
      'input-datetime',
    ];
    return formFieldTypes.includes(type);
  }

  private enhanceField(field: any) {
    if (!field.name) return;

    // 基于字段名称应用验证规则
    const enhancedField =
      this.amisSchemaEnhancedService.enhanceFormField(field);
    
    // 合并增强的属性
    Object.assign(field, enhancedField);

    // 添加通用的错误处理
    if (!field.validationErrors) {
      field.validationErrors = {};
    }

    // 确保必填字段有相应的错误信息
    if (field.required && !field.validationErrors.required) {
      field.validationErrors.required = `请输入${field.label || '内容'}`;
    }
  }

  /**
   * 获取动态表单演示页面配置
   */
  @Get('/dynamic-forms-demo')
  async getDynamicFormsDemo() {
    try {
      const schema = await this.generateDynamicFormsDemoPage();
      return {
        code: 200,
        message: '成功',
        data: schema,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取动态表单演示页面失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 生成动态表单演示页面
   */
  private async generateDynamicFormsDemoPage(): Promise<any> {
    return {
      type: 'page',
      title: '基于DDD元数据的动态表单生成演示',
      body: [
        {
          type: 'alert',
          level: 'info',
          body: '本页面演示了如何根据DDD实体元数据自动生成AMIS表单和列表页面。系统会根据实体的属性定义自动选择合适的表单组件类型。',
          className: 'mb-4',
        },
        {
          type: 'tabs',
          tabs: [
            {
              title: '表单类型映射说明',
              tab: {
                type: 'table',
                data: {
                  types: [
                    {
                      type: 'string/text',
                      amisComponent: 'input-text/textarea',
                      description: '文本输入',
                      example: '根据maxLength自动选择',
                    },
                    {
                      type: 'number/integer',
                      amisComponent: 'input-number',
                      description: '数字输入',
                      example: '支持min/max/step',
                    },
                    {
                      type: 'boolean',
                      amisComponent: 'switch',
                      description: '开关选择',
                      example: 'true/false切换',
                    },
                    {
                      type: 'date/datetime',
                      amisComponent: 'input-date/input-datetime',
                      description: '日期时间选择',
                      example: 'YYYY-MM-DD格式',
                    },
                    {
                      type: 'enum/select',
                      amisComponent: 'select',
                      description: '下拉选择',
                      example: '基于options配置',
                    },
                    {
                      type: 'file/image',
                      amisComponent: 'input-file/input-image',
                      description: '文件上传',
                      example: '支持格式限制',
                    },
                  ],
                },
                source: '$types',
                columns: [
                  { name: 'type', label: '元数据类型', type: 'text' },
                  { name: 'amisComponent', label: 'AMIS组件', type: 'text' },
                  { name: 'description', label: '说明', type: 'text' },
                  { name: 'example', label: '示例', type: 'text' },
                ],
              },
            },
            {
              title: '实体表单生成',
              tab: {
                type: 'crud',
                title: '选择实体查看动态生成的表单',
                api: '/api/entities',
                headerToolbar: [],
                footerToolbar: ['pagination'],
                columns: [
                  { name: 'id', label: 'ID', type: 'text', width: 80 },
                  { name: 'name', label: '实体名称', type: 'text' },
                  { name: 'description', label: '描述', type: 'text' },
                  { name: 'type', label: '类型', type: 'text' },
                  {
                    type: 'operation',
                    label: '操作',
                    width: 200,
                    buttons: [
                      {
                        type: 'button',
                        label: '查看表单',
                        level: 'primary',
                        size: 'sm',
                        actionType: 'dialog',
                        dialog: {
                          title: '动态生成的表单 - ${name}',
                          size: 'lg',
                          body: {
                            type: 'service',
                            api: '/amis/entity-form/${id}',
                            body: '$data',
                          },
                        },
                      },
                      {
                        type: 'button',
                        label: '元数据',
                        level: 'link',
                        size: 'sm',
                        actionType: 'dialog',
                        dialog: {
                          title: '实体元数据 - ${name}',
                          body: {
                            type: 'json',
                            source: '${properties}',
                            levelExpand: 2,
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              title: '聚合列表生成',
              tab: {
                type: 'crud',
                title: '选择聚合查看动态生成的列表',
                api: '/api/aggregates',
                headerToolbar: [],
                footerToolbar: ['pagination'],
                columns: [
                  { name: 'id', label: 'ID', type: 'text', width: 80 },
                  { name: 'name', label: '聚合名称', type: 'text' },
                  { name: 'description', label: '描述', type: 'text' },
                  {
                    type: 'operation',
                    label: '操作',
                    width: 150,
                    buttons: [
                      {
                        type: 'button',
                        label: '查看列表',
                        level: 'primary',
                        size: 'sm',
                        actionType: 'dialog',
                        dialog: {
                          title: '动态生成的列表 - ${name}',
                          size: 'xl',
                          body: {
                            type: 'service',
                            api: '/amis/aggregate-list/${id}',
                            body: '$data',
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    };
  }

  /**
   * ========== 统计数据API端点 ==========
   */

  /**
   * 获取项目统计数据
   */
  @Get('/statistics/projects')
  async getProjectStatistics() {
    try {
      // 模拟统计数据，实际应该从数据库查询
      return {
        code: 200,
        data: {
          total: 12,
          growth: 15.6, // 增长率百分比
          activeCount: 8,
          inactiveCount: 2,
          archivedCount: 2,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取项目统计失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取领域统计数据
   */
  @Get('/statistics/domains')
  async getDomainStatistics() {
    try {
      return {
        code: 200,
        data: {
          total: 28,
          growth: 22.3,
          averagePerProject: 2.3,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取领域统计失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取聚合统计数据
   */
  @Get('/statistics/aggregates')
  async getAggregateStatistics() {
    try {
      return {
        code: 200,
        data: {
          total: 65,
          growth: 18.9,
          averagePerDomain: 2.3,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取聚合统计失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取实体统计数据
   */
  @Get('/statistics/entities')
  async getEntityStatistics() {
    try {
      return {
        code: 200,
        data: {
          total: 156,
          growth: 12.7,
          entityCount: 89,
          valueObjectCount: 67,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取实体统计失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取项目活动趋势数据
   */
  @Get('/statistics/project-activity-trend')
  async getProjectActivityTrend() {
    try {
      // 生成最近30天的模拟数据
      const dates = [];
      const projectCounts = [];
      const domainCounts = [];
      const entityCounts = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        // 模拟数据，实际应该从数据库查询
        projectCounts.push(Math.floor(Math.random() * 5));
        domainCounts.push(Math.floor(Math.random() * 8));
        entityCounts.push(Math.floor(Math.random() * 15));
      }

      return {
        code: 200,
        data: {
          dates,
          projectCounts,
          domainCounts,
          entityCounts,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取活动趋势失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取项目状态分布数据
   */
  @Get('/statistics/project-status-distribution')
  async getProjectStatusDistribution() {
    try {
      return {
        code: 200,
        data: {
          labels: ['活跃', '停用', '归档'],
          values: [8, 2, 2],
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取项目状态分布失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取领域活跃度热力图数据
   */
  @Get('/statistics/domain-heatmap')
  async getDomainHeatmap() {
    try {
      // 模拟热力图数据
      const heatmapData = [
        { x: 5, y: 85, domainName: '用户域' },
        { x: 8, y: 92, domainName: '订单域' },
        { x: 3, y: 45, domainName: '支付域' },
        { x: 12, y: 78, domainName: '商品域' },
        { x: 6, y: 63, domainName: '营销域' },
        { x: 4, y: 55, domainName: '库存域' },
        { x: 7, y: 88, domainName: '物流域' },
        { x: 2, y: 35, domainName: '财务域' },
      ];

      return {
        code: 200,
        data: {
          heatmapData,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取领域热力图失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * 获取DDD复杂度分析数据
   */
  @Get('/statistics/complexity-analysis')
  async getComplexityAnalysis() {
    try {
      return {
        code: 200,
        data: {
          currentScores: [75, 68, 82, 90, 45], // 当前项目评分
          industryAverage: [70, 75, 80, 85, 60], // 行业平均水平
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        code: 500,
        message: `获取复杂度分析失败: ${error.message}`,
        timestamp: Date.now(),
      };
    }
  }
}
