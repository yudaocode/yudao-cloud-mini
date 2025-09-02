/**
 * DDD模板服务
 * 提供常用的DDD模式模板
 */

export interface DDDTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: any;
  tags: string[];
}

export class DDDTemplateService {
  private static instance: DDDTemplateService;
  private templates: Map<string, DDDTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): DDDTemplateService {
    if (!DDDTemplateService.instance) {
      DDDTemplateService.instance = new DDDTemplateService();
    }
    return DDDTemplateService.instance;
  }

  /**
   * 初始化模板
   */
  private initializeTemplates(): void {
    // 统一语言模板
    this.addTemplate({
      id: 'ubiquitous-language-basic',
      name: '基础统一语言',
      description: '包含术语、定义、业务规则的基础统一语言模板',
      category: 'ubiquitous-language',
      tags: ['术语', '定义', '业务规则'],
      template: {
        terms: [
          {
            term: '订单(Order)',
            definition: '客户购买商品时创建的业务实体',
            businessRules: ['订单必须关联客户', '订单金额必须大于0'],
            examples: ['客户张三创建了一个订单']
          },
          {
            term: '客户(Customer)',
            definition: '购买商品或服务的个人或组织',
            businessRules: ['客户必须有联系方式', '客户名称不能为空'],
            examples: ['张三是一个客户']
          }
        ],
        mappings: [
          {
            sourceTerm: '订单',
            targetTerm: 'Order',
            relationship: 'synonym',
            description: '订单的中英文映射'
          }
        ],
        rules: [
          {
            ruleName: '订单金额验证',
            ruleType: 'validation',
            expression: 'order.amount > 0',
            description: '订单金额必须大于0'
          }
        ]
      }
    });

    // 战略设计模板
    this.addTemplate({
      id: 'strategic-design-ecommerce',
      name: '电商战略设计',
      description: '电商系统的限界上下文和战略模式设计',
      category: 'strategic-design',
      tags: ['电商', '限界上下文', '战略模式'],
      template: {
        contexts: [
          {
            name: '订单管理',
            description: '处理订单相关业务逻辑',
            isCoreDomain: true,
            ubiquitousLanguage: ['Order', 'Customer', 'Product'],
            strategicPattern: 'shared-kernel'
          },
          {
            name: '客户管理',
            description: '管理客户信息和关系',
            isCoreDomain: false,
            ubiquitousLanguage: ['Customer', 'Address', 'Contact'],
            strategicPattern: 'customer-supplier'
          },
          {
            name: '商品管理',
            description: '管理商品目录和库存',
            isCoreDomain: false,
            ubiquitousLanguage: ['Product', 'Category', 'Inventory'],
            strategicPattern: 'conformist'
          }
        ],
        mappings: [
          {
            sourceContext: '订单管理',
            targetContext: '客户管理',
            pattern: 'customer-supplier',
            description: '订单管理依赖客户管理提供客户信息'
          }
        ]
      }
    });

    // 战术设计模板
    this.addTemplate({
      id: 'tactical-design-order',
      name: '订单聚合设计',
      description: '订单聚合的完整战术设计',
      category: 'tactical-design',
      tags: ['聚合', '实体', '值对象'],
      template: {
        aggregates: [
          {
            name: 'Order',
            aggregateRoot: 'Order',
            entities: ['OrderItem', 'OrderStatus'],
            valueObjects: ['Money', 'Address', 'OrderNumber'],
            invariants: ['订单金额必须大于0', '订单必须有关联客户']
          }
        ],
        entities: [
          {
            name: 'Order',
            aggregate: 'Order',
            properties: ['id', 'orderNumber', 'customerId', 'totalAmount', 'status'],
            methods: ['addItem', 'removeItem', 'calculateTotal', 'changeStatus'],
            identity: 'orderNumber'
          },
          {
            name: 'OrderItem',
            aggregate: 'Order',
            properties: ['id', 'productId', 'quantity', 'unitPrice'],
            methods: ['calculateSubtotal'],
            identity: 'id'
          }
        ],
        valueObjects: [
          {
            name: 'Money',
            type: 'value',
            immutable: true,
            properties: ['amount', 'currency']
          },
          {
            name: 'Address',
            type: 'value',
            immutable: true,
            properties: ['street', 'city', 'state', 'zipCode', 'country']
          }
        ]
      }
    });

    // 实现映射模板
    this.addTemplate({
      id: 'implementation-mapping-spring',
      name: 'Spring Boot实现映射',
      description: 'Spring Boot + JPA的实现映射配置',
      category: 'implementation-mapping',
      tags: ['Spring Boot', 'JPA', 'MySQL'],
      template: {
        technologyStack: {
          framework: 'Spring Boot',
          version: '2.7.0',
          database: 'MySQL',
          orm: 'JPA/Hibernate',
          cache: 'Redis',
          messageQueue: 'RabbitMQ'
        },
        frameworkMapping: {
          aggregate: 'Entity',
          repository: 'Repository',
          service: 'Service',
          controller: 'Controller',
          valueObject: 'Embeddable'
        },
        databaseDesign: {
          namingStrategy: 'snake_case',
          tablePrefix: '',
          auditFields: ['created_at', 'updated_at', 'created_by', 'updated_by']
        },
        apiDesign: {
          basePath: '/api/v1',
          responseFormat: 'JSON',
          pagination: 'page-based',
          versioning: 'URL-based'
        }
      }
    });

    // DTO模板
    this.addTemplate({
      id: 'dto-order-complete',
      name: '订单完整DTO',
      description: '订单相关的完整DTO设计',
      category: 'data-transfer-objects',
      tags: ['DTO', '订单', '验证'],
      template: {
        dtos: [
          {
            name: 'OrderDTO',
            purpose: '订单数据传输',
            fields: [
              { name: 'id', type: 'Long', required: true },
              { name: 'orderNumber', type: 'String', required: true },
              { name: 'customerName', type: 'String', required: true },
              { name: 'totalAmount', type: 'BigDecimal', required: true },
              { name: 'status', type: 'OrderStatus', required: true },
              { name: 'createdAt', type: 'LocalDateTime', required: true }
            ],
            validationRules: [
              { field: 'orderNumber', rule: '@NotBlank', message: '订单号不能为空' },
              { field: 'totalAmount', rule: '@DecimalMin("0.01")', message: '订单金额必须大于0' }
            ],
            mappingRules: [
              { source: 'Order.orderNumber', target: 'orderNumber' },
              { source: 'Order.customer.name', target: 'customerName' },
              { source: 'Order.totalAmount', target: 'totalAmount' }
            ]
          }
        ]
      }
    });

    // amis-screen模板
    this.addTemplate({
      id: 'amis-screen-crud-basic',
      name: '基础CRUD Screen',
      description: '基础的CRUD界面模板',
      category: 'amis-screen',
      tags: ['CRUD', '列表', '表单'],
      template: {
        screen: {
          name: 'BasicCRUD',
          type: 'CRUD',
          route: '/basic-crud',
          dataSource: '/api/basic-crud',
          theme: 'cxd'
        },
        columns: [
          { name: 'id', label: 'ID', type: 'text' },
          { name: 'name', label: '名称', type: 'text' },
          { name: 'description', label: '描述', type: 'text' },
          { name: 'status', label: '状态', type: 'mapping', map: { 'active': '激活', 'inactive': '未激活' } },
          {
            type: 'operation',
            label: '操作',
            buttons: [
              { type: 'button', label: '编辑', actionType: 'dialog' },
              { type: 'button', label: '删除', actionType: 'ajax', confirmText: '确定删除？' }
            ]
          }
        ],
        form: [
          { type: 'input-text', name: 'name', label: '名称', required: true },
          { type: 'textarea', name: 'description', label: '描述' },
          { type: 'select', name: 'status', label: '状态', options: ['active', 'inactive'] }
        ]
      }
    });

    // 代码生成模板
    this.addTemplate({
      id: 'code-generation-full-stack',
      name: '全栈代码生成',
      description: '生成完整的前后端代码',
      category: 'code-generation',
      tags: ['代码生成', '全栈', 'Spring Boot', 'React'],
      template: {
        frontend: {
          framework: 'React',
          language: 'TypeScript',
          ui: 'Ant Design',
          stateManagement: 'Redux Toolkit',
          routing: 'React Router'
        },
        backend: {
          framework: 'Spring Boot',
          language: 'Java',
          database: 'MySQL',
          orm: 'JPA',
          security: 'Spring Security'
        },
        generatedFiles: [
          'Entity.java',
          'Repository.java',
          'Service.java',
          'Controller.java',
          'DTO.java',
          'ReactComponent.tsx',
          'ReduxSlice.ts',
          'API.ts'
        ]
      }
    });
  }

  /**
   * 添加模板
   */
  private addTemplate(template: DDDTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * 获取所有模板
   */
  public getAllTemplates(): DDDTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 根据分类获取模板
   */
  public getTemplatesByCategory(category: string): DDDTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  /**
   * 根据标签获取模板
   */
  public getTemplatesByTag(tag: string): DDDTemplate[] {
    return this.getAllTemplates().filter(template => template.tags.includes(tag));
  }

  /**
   * 获取模板
   */
  public getTemplate(id: string): DDDTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * 搜索模板
   */
  public searchTemplates(query: string): DDDTemplate[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTemplates().filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * 创建自定义模板
   */
  public createCustomTemplate(template: Omit<DDDTemplate, 'id'>): DDDTemplate {
    const id = `custom-${Date.now()}`;
    const customTemplate: DDDTemplate = {
      ...template,
      id
    };
    this.addTemplate(customTemplate);
    return customTemplate;
  }

  /**
   * 更新模板
   */
  public updateTemplate(id: string, updates: Partial<DDDTemplate>): boolean {
    const template = this.templates.get(id);
    if (!template) {
      return false;
    }
    
    const updatedTemplate = { ...template, ...updates };
    this.templates.set(id, updatedTemplate);
    return true;
  }

  /**
   * 删除模板
   */
  public deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  /**
   * 导出模板
   */
  public exportTemplate(id: string): string {
    const template = this.getTemplate(id);
    if (!template) {
      throw new Error(`模板不存在: ${id}`);
    }
    return JSON.stringify(template, null, 2);
  }

  /**
   * 导入模板
   */
  public importTemplate(templateJson: string): DDDTemplate {
    try {
      const template = JSON.parse(templateJson) as DDDTemplate;
      if (!template.id || !template.name) {
        throw new Error('模板格式无效');
      }
      this.addTemplate(template);
      return template;
    } catch (error) {
      throw new Error(`导入模板失败: ${error}`);
    }
  }

  /**
   * 获取模板统计信息
   */
  public getTemplateStats(): {
    total: number;
    byCategory: Record<string, number>;
    byTag: Record<string, number>;
  } {
    const templates = this.getAllTemplates();
    const byCategory: Record<string, number> = {};
    const byTag: Record<string, number> = {};

    templates.forEach(template => {
      // 按分类统计
      byCategory[template.category] = (byCategory[template.category] || 0) + 1;
      
      // 按标签统计
      template.tags.forEach(tag => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });
    });

    return {
      total: templates.length,
      byCategory,
      byTag
    };
  }
}
