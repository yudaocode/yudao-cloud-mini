import { DDDParser } from './dddParser';
import { 
  ubiquitousLanguageService, 
  strategicDesignService, 
  tacticalDesignService, 
  dtoService, 
  implementationMappingService, 
  screenDefinitionService, 
  amisScreenDefinitionService, 
  analysisService 
} from './dddApiService';

export interface DDDModuleSchema {
  type: string;
  title: string;
  body: any[];
}

export interface AmisConfigGenerator {
  generateCRUD: (config: any) => any;
  generateForm: (config: any) => any;
  generateDetail: (config: any) => any;
  generateChart: (config: any) => any;
  generateTabs: (config: any) => any;
  generateGrid: (config: any) => any;
}

export class DDDPlatformService {
  private static instance: DDDPlatformService;
  private dddParser: DDDParser;
  private configGenerator: AmisConfigGenerator;

  private constructor() {
    this.dddParser = DDDParser.getInstance();
    this.configGenerator = this.createConfigGenerator();
  }

  public static getInstance(): DDDPlatformService {
    if (!DDDPlatformService.instance) {
      DDDPlatformService.instance = new DDDPlatformService();
    }
    return DDDPlatformService.instance;
  }

  /**
   * 创建配置生成器
   */
  private createConfigGenerator(): AmisConfigGenerator {
    return {
      generateCRUD: (config: any) => {
        const { api, columns, title, headerToolbar, bulkActions, filter, perPage } = config;
        return {
          type: 'crud',
          api,
          title,
          columns: columns || [],
          headerToolbar: headerToolbar || [
            { type: 'button', label: '新增', actionType: 'dialog' },
            { type: 'button', label: '刷新', actionType: 'reload' }
          ],
          bulkActions: bulkActions || [],
          filter: filter || {
            title: '搜索',
            mode: 'inline',
            body: [
              {
                type: 'input-text',
                name: 'keyword',
                placeholder: '请输入关键词',
                addOn: { type: 'submit', label: '搜索' }
              }
            ]
          },
          perPage: perPage || 10,
          pageField: 'page',
          perPageField: 'perPage'
        };
      },

      generateForm: (config: any) => {
        const { api, body, title, actions } = config;
        return {
          type: 'form',
          api,
          title,
          body: body || [],
          actions: actions || [
            { type: 'submit', label: '保存' },
            { type: 'reset', label: '重置' }
          ]
        };
      },

      generateDetail: (config: any) => {
        const { api, body, title } = config;
        return {
          type: 'page',
          title,
          body: [
            {
              type: 'service',
              api,
              body: body || []
            }
          ]
        };
      },

      generateChart: (config: any) => {
        const { api, chartType, title, height } = config;
        return {
          type: 'chart',
          api,
          title,
          chartType: chartType || 'line',
          height: height || 300
        };
      },

      generateTabs: (config: any) => {
        const { tabs } = config;
        return {
          type: 'tabs',
          tabs: tabs || []
        };
      },

      generateGrid: (config: any) => {
        const { columns, gap } = config;
        return {
          type: 'grid',
          columns: columns || [],
          gap: gap || '1rem'
        };
      }
    };
  }

  /**
   * 获取模块的amis配置
   */
  public async getModuleSchema(moduleId: string): Promise<any> {
    try {
      // 根据模块ID生成对应的amis配置
      switch (moduleId) {
        case 'ubiquitous-language':
          return this.generateUbiquitousLanguageSchema();
        case 'strategic-design':
          return this.generateStrategicDesignSchema();
        case 'tactical-design':
          return this.generateTacticalDesignSchema();
        case 'implementation-mapping':
          return this.generateImplementationMappingSchema();
        case 'data-transfer-objects':
          return this.generateDTOManagementSchema();
        case 'amis-screen':
          return this.generateAmisScreenSchema();
        case 'code-generation':
          return this.generateCodeGenerationSchema();
        default:
          throw new Error(`未知模块: ${moduleId}`);
      }
    } catch (error) {
      console.error(`获取模块配置失败: ${error}`);
      throw error;
    }
  }

  /**
   * 智能生成amis配置
   */
  public generateAmisConfig(template: string, data: any): any {
    try {
      switch (template) {
        case 'crud':
          return this.configGenerator.generateCRUD(data);
        case 'form':
          return this.configGenerator.generateForm(data);
        case 'detail':
          return this.configGenerator.generateDetail(data);
        case 'chart':
          return this.configGenerator.generateChart(data);
        case 'tabs':
          return this.configGenerator.generateTabs(data);
        case 'grid':
          return this.configGenerator.generateGrid(data);
        default:
          throw new Error(`未知模板: ${template}`);
      }
    } catch (error) {
      console.error(`生成amis配置失败: ${error}`);
      throw error;
    }
  }

  /**
   * 验证amis配置
   */
  public validateAmisConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config) {
      errors.push('配置不能为空');
      return { isValid: false, errors };
    }

    if (!config.type) {
      errors.push('缺少type字段');
    }

    if (config.type === 'crud' && !config.api) {
      errors.push('CRUD组件缺少api字段');
    }

    if (config.type === 'form' && !config.api) {
      errors.push('Form组件缺少api字段');
    }

    if (config.body && !Array.isArray(config.body)) {
      errors.push('body字段必须是数组');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成统一语言管理配置
   */
  private generateUbiquitousLanguageSchema(): any {
    return {
      type: 'page',
      title: '📚 统一语言管理',
      body: [
        {
          type: 'tabs',
          tabs: [
            {
              title: '术语库',
              body: this.configGenerator.generateCRUD({
                api: '/api/ubiquitous-language/terms',
                title: '术语库管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'term', label: '术语', type: 'text' },
                  { name: 'definition', label: '定义', type: 'text' },
                  { name: 'businessRules', label: '业务规则', type: 'text' },
                  { name: 'examples', label: '示例', type: 'text' },
                  { name: 'version', label: '版本', type: 'text' },
                  {
                    type: 'operation',
                    label: '操作',
                    buttons: [
                      { type: 'button', label: '编辑', actionType: 'dialog' },
                      { type: 'button', label: '删除', actionType: 'ajax', confirmText: '确定删除？' }
                    ]
                  }
                ],
                headerToolbar: [
                  { type: 'button', label: '新增术语', actionType: 'dialog' },
                  { type: 'button', label: '批量导入', actionType: 'dialog' },
                  { type: 'button', label: '导出术语库', actionType: 'download' }
                ]
              })
            },
            {
              title: '概念映射',
              body: this.configGenerator.generateCRUD({
                api: '/api/ubiquitous-language/mappings',
                title: '概念映射管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'sourceTerm', label: '源术语', type: 'text' },
                  { name: 'targetTerm', label: '目标术语', type: 'text' },
                  { 
                    name: 'relationship', 
                    label: '关系类型', 
                    type: 'mapping', 
                    map: { 
                      'synonym': '同义词', 
                      'antonym': '反义词', 
                      'hierarchy': '层级关系' 
                    } 
                  },
                  { name: 'description', label: '描述', type: 'text' }
                ]
              })
            },
            {
              title: '业务规则',
              body: this.configGenerator.generateCRUD({
                api: '/api/ubiquitous-language/rules',
                title: '业务规则管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'ruleName', label: '规则名称', type: 'text' },
                  { 
                    name: 'ruleType', 
                    label: '规则类型', 
                    type: 'mapping', 
                    map: { 
                      'validation': '验证规则', 
                      'business': '业务规则', 
                      'constraint': '约束规则' 
                    } 
                  },
                  { name: 'expression', label: '规则表达式', type: 'text' },
                  { name: 'description', label: '描述', type: 'text' }
                ]
              })
            }
          ]
        }
      ]
    };
  }

  /**
   * 生成战略设计管理配置
   */
  private generateStrategicDesignSchema(): any {
    return {
      type: 'page',
      title: '🏗️ 战略设计管理',
      body: [
        this.configGenerator.generateGrid({
          columns: [
            {
              body: this.configGenerator.generateCRUD({
                api: '/api/strategic-design/contexts',
                title: '限界上下文管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '上下文名称', type: 'text' },
                  { name: 'description', label: '描述', type: 'text' },
                  { 
                    name: 'isCoreDomain', 
                    label: '核心域', 
                    type: 'mapping', 
                    map: { true: '是', false: '否' } 
                  },
                  { name: 'ubiquitousLanguage', label: '通用语言', type: 'text' },
                  { 
                    name: 'strategicPattern', 
                    label: '战略模式', 
                    type: 'mapping', 
                    map: { 
                      'shared-kernel': '共享内核', 
                      'customer-supplier': '客户-供应商', 
                      'conformist': '跟随者', 
                      'ant corruption-layer': '防腐层', 
                      'open-host-service': '开放主机服务', 
                      'published-language': '发布语言', 
                      'separate-ways': '各行其道', 
                      'big-ball-of-mud': '大泥球' 
                    } 
                  }
                ],
                headerToolbar: [
                  { type: 'button', label: '新增上下文', actionType: 'dialog' },
                  { type: 'button', label: '上下文映射', actionType: 'dialog' },
                  { type: 'button', label: '架构视图', actionType: 'dialog' }
                ]
              })
            },
            {
              body: this.configGenerator.generateChart({
                title: '上下文关系图',
                api: '/api/strategic-design/context-relationships',
                chartType: 'graph',
                height: 400
              })
            }
          ]
        })
      ]
    };
  }

  /**
   * 生成战术设计管理配置
   */
  private generateTacticalDesignSchema(): any {
    return {
      type: 'page',
      title: '⚙️ 战术设计管理',
      body: [
        this.configGenerator.generateTabs({
          tabs: [
            {
              title: '聚合管理',
              body: this.configGenerator.generateCRUD({
                api: '/api/tactical-design/aggregates',
                title: '聚合管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '聚合名称', type: 'text' },
                  { name: 'aggregateRoot', label: '聚合根', type: 'text' },
                  { name: 'entities', label: '实体', type: 'text' },
                  { name: 'valueObjects', label: '值对象', type: 'text' },
                  { name: 'invariants', label: '不变量', type: 'text' }
                ],
                headerToolbar: [
                  { type: 'button', label: '新增聚合', actionType: 'dialog' },
                  { type: 'button', label: '聚合设计器', actionType: 'dialog' }
                ]
              })
            },
            {
              title: '实体管理',
              body: this.configGenerator.generateCRUD({
                api: '/api/tactical-design/entities',
                title: '实体管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '实体名称', type: 'text' },
                  { name: 'aggregate', label: '所属聚合', type: 'text' },
                  { name: 'properties', label: '属性', type: 'text' },
                  { name: 'methods', label: '方法', type: 'text' },
                  { name: 'identity', label: '标识', type: 'text' }
                ]
              })
            },
            {
              title: '值对象管理',
              body: this.configGenerator.generateCRUD({
                api: '/api/tactical-design/value-objects',
                title: '值对象管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '值对象名称', type: 'text' },
                  { name: 'type', label: '类型', type: 'text' },
                  { 
                    name: 'immutable', 
                    label: '不可变', 
                    type: 'mapping', 
                    map: { true: '是', false: '否' } 
                  },
                  { name: 'properties', label: '属性', type: 'text' }
                ]
              })
            },
            {
              title: '领域服务',
              body: this.configGenerator.generateCRUD({
                api: '/api/tactical-design/domain-services',
                title: '领域服务管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '服务名称', type: 'text' },
                  { name: 'purpose', label: '用途', type: 'text' },
                  { name: 'parameters', label: '参数', type: 'text' },
                  { name: 'returnType', label: '返回类型', type: 'text' }
                ]
              })
            },
            {
              title: '仓储管理',
              body: this.configGenerator.generateCRUD({
                api: '/api/tactical-design/repositories',
                title: '仓储管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: '仓储名称', type: 'text' },
                  { name: 'aggregate', label: '聚合', type: 'text' },
                  { name: 'methods', label: '方法', type: 'text' },
                  { name: 'implementation', label: '实现', type: 'text' }
                ]
              })
            }
          ]
        })
      ]
    };
  }

  /**
   * 生成实现映射管理配置
   */
  private generateImplementationMappingSchema(): any {
    return {
      type: 'page',
      title: '🔗 实现映射管理',
      body: [
        this.configGenerator.generateCRUD({
          api: '/api/implementation-mapping/configs',
          title: '实现映射配置',
          columns: [
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'technologyStack', label: '技术栈', type: 'text' },
            { name: 'frameworkMapping', label: '框架映射', type: 'text' },
            { name: 'databaseDesign', label: '数据库设计', type: 'text' },
            { name: 'apiDesign', label: 'API设计', type: 'text' },
            { name: 'deploymentConfig', label: '部署配置', type: 'text' }
          ],
          headerToolbar: [
            { type: 'button', label: '新增映射', actionType: 'dialog' },
            { type: 'button', label: '技术栈选择', actionType: 'dialog' },
            { type: 'button', label: '部署配置', actionType: 'dialog' }
          ]
        })
      ]
    };
  }

  /**
   * 生成DTO管理配置
   */
  private generateDTOManagementSchema(): any {
    return {
      type: 'page',
      title: '📄 DTO管理',
      body: [
        this.configGenerator.generateCRUD({
          api: '/api/data-transfer-objects/dtos',
          title: 'DTO管理',
          columns: [
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'name', label: 'DTO名称', type: 'text' },
            { name: 'purpose', label: '用途', type: 'text' },
            { name: 'fields', label: '字段', type: 'text' },
            { name: 'validationRules', label: '验证规则', type: 'text' },
            { name: 'mappingRules', label: '映射规则', type: 'text' }
          ],
          headerToolbar: [
            { type: 'button', label: '新增DTO', actionType: 'dialog' },
            { type: 'button', label: '映射规则', actionType: 'dialog' },
            { type: 'button', label: 'API文档', actionType: 'dialog' },
            { type: 'button', label: '测试用例', actionType: 'dialog' }
          ]
        })
      ]
    };
  }

  /**
   * 生成amis-screen管理配置
   */
  private generateAmisScreenSchema(): any {
    return {
      type: 'page',
      title: '🖥️ amis-screen管理',
      body: [
        this.configGenerator.generateGrid({
          columns: [
            {
              body: this.configGenerator.generateCRUD({
                api: '/api/amis-screen/screens',
                title: 'Screen管理',
                columns: [
                  { name: 'id', label: 'ID', type: 'text' },
                  { name: 'name', label: 'Screen名称', type: 'text' },
                  { 
                    name: 'type', 
                    label: '类型', 
                    type: 'mapping', 
                    map: { 'CRUD': '列表', 'FORM': '表单', 'DETAIL': '详情' } 
                  },
                  { name: 'route', label: '路由', type: 'text' },
                  { name: 'dataSource', label: '数据源', type: 'text' },
                  { 
                    name: 'theme', 
                    label: '主题', 
                    type: 'mapping', 
                    map: { 'cxd': 'cxd', 'ang': 'ang', 'antd': 'antd' } 
                  }
                ],
                headerToolbar: [
                  { type: 'button', label: '新增Screen', actionType: 'dialog' },
                  { type: 'button', label: '组件映射', actionType: 'dialog' },
                  { type: 'button', label: '预览测试', actionType: 'dialog' },
                  { type: 'button', label: '代码生成', actionType: 'dialog' }
                ]
              })
            },
            {
              body: {
                type: 'card',
                header: { title: 'Screen预览' },
                body: {
                  type: 'iframe',
                  src: '/preview',
                  height: 400
                }
              }
            }
          ]
        })
      ]
    };
  }

  /**
   * 生成代码生成配置
   */
  private generateCodeGenerationSchema(): any {
    return {
      type: 'page',
      title: '💻 代码生成',
      body: [
        this.configGenerator.generateGrid({
          columns: [
            {
              body: {
                type: 'card',
                header: { title: '前端代码生成' },
                body: [
                  { type: 'button', label: '生成React组件', actionType: 'ajax', api: '/api/code-generation/react' },
                  { type: 'button', label: '生成amis配置', actionType: 'ajax', api: '/api/code-generation/amis' },
                  { type: 'button', label: '生成TypeScript类型', actionType: 'ajax', api: '/api/code-generation/typescript' }
                ]
              }
            },
            {
              body: {
                type: 'card',
                header: { title: '后端代码生成' },
                body: [
                  { type: 'button', label: '生成Controller', actionType: 'ajax', api: '/api/code-generation/controller' },
                  { type: 'button', label: '生成Service', actionType: 'ajax', api: '/api/code-generation/service' },
                  { type: 'button', label: '生成Repository', actionType: 'ajax', api: '/api/code-generation/repository' },
                  { type: 'button', label: '生成Entity', actionType: 'ajax', api: '/api/code-generation/entity' }
                ]
              }
            }
          ]
        }),
        {
          type: 'card',
          header: { title: '生成历史' },
          body: this.configGenerator.generateCRUD({
            api: '/api/code-generation/history',
            columns: [
              { name: 'id', label: 'ID', type: 'text' },
              { name: 'generationType', label: '生成类型', type: 'text' },
              { name: 'targetModule', label: '目标模块', type: 'text' },
              { name: 'generatedAt', label: '生成时间', type: 'datetime' },
              { 
                name: 'status', 
                label: '状态', 
                type: 'mapping', 
                map: { 'success': '成功', 'failed': '失败' } 
              }
            ]
          })
        }
      ]
    };
  }

  // ==================== 新增API服务集成 ====================

  /**
   * 获取统一语言数据
   */
  async getUbiquitousLanguage(domainId: string) {
    try {
      const response = await ubiquitousLanguageService.getUbiquitousLanguage(domainId);
      return response;
    } catch (error) {
      console.error('获取统一语言数据失败:', error);
      throw error;
    }
  }

  /**
   * 更新统一语言数据
   */
  async updateUbiquitousLanguage(domainId: string, data: any) {
    try {
      const response = await ubiquitousLanguageService.updateUbiquitousLanguage(domainId, data);
      return response;
    } catch (error) {
      console.error('更新统一语言数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取业务术语列表
   */
  async getTerms(domainId: string, params?: any) {
    try {
      const response = await ubiquitousLanguageService.getTerms(domainId, params);
      return response;
    } catch (error) {
      console.error('获取业务术语列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建业务术语
   */
  async createTerm(domainId: string, term: any) {
    try {
      const response = await ubiquitousLanguageService.createTerm(domainId, term);
      return response;
    } catch (error) {
      console.error('创建业务术语失败:', error);
      throw error;
    }
  }

  /**
   * 更新业务术语
   */
  async updateTerm(domainId: string, termId: string, term: any) {
    try {
      const response = await ubiquitousLanguageService.updateTerm(domainId, termId, term);
      return response;
    } catch (error) {
      console.error('更新业务术语失败:', error);
      throw error;
    }
  }

  /**
   * 删除业务术语
   */
  async deleteTerm(domainId: string, termId: string) {
    try {
      const response = await ubiquitousLanguageService.deleteTerm(domainId, termId);
      return response;
    } catch (error) {
      console.error('删除业务术语失败:', error);
      throw error;
    }
  }

  /**
   * 获取业务属性列表
   */
  async getAttributes(domainId: string, params?: any) {
    try {
      const response = await ubiquitousLanguageService.getAttributes(domainId, params);
      return response;
    } catch (error) {
      console.error('获取业务属性列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建业务属性
   */
  async createAttribute(domainId: string, attribute: any) {
    try {
      const response = await ubiquitousLanguageService.createAttribute(domainId, attribute);
      return response;
    } catch (error) {
      console.error('创建业务属性失败:', error);
      throw error;
    }
  }

  /**
   * 获取战略设计数据
   */
  async getStrategicDesign(domainId: string) {
    try {
      const response = await strategicDesignService.getStrategicDesign(domainId);
      return response;
    } catch (error) {
      console.error('获取战略设计数据失败:', error);
      throw error;
    }
  }

  /**
   * 更新战略设计数据
   */
  async updateStrategicDesign(domainId: string, data: any) {
    try {
      const response = await strategicDesignService.updateStrategicDesign(domainId, data);
      return response;
    } catch (error) {
      console.error('更新战略设计数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取限界上下文列表
   */
  async getBoundedContexts(domainId: string, params?: any) {
    try {
      const response = await strategicDesignService.getBoundedContexts(domainId, params);
      return response;
    } catch (error) {
      console.error('获取限界上下文列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建限界上下文
   */
  async createBoundedContext(domainId: string, context: any) {
    try {
      const response = await strategicDesignService.createBoundedContext(domainId, context);
      return response;
    } catch (error) {
      console.error('创建限界上下文失败:', error);
      throw error;
    }
  }

  /**
   * 获取使用状态摘要
   */
  async getUsageSummary(params?: any) {
    try {
      const response = await analysisService.getUsageSummary(params);
      return response;
    } catch (error) {
      console.error('获取使用状态摘要失败:', error);
      throw error;
    }
  }

  /**
   * 获取未使用元素
   */
  async getUnusedElements(params?: any) {
    try {
      const response = await analysisService.getUnusedElements(params);
      return response;
    } catch (error) {
      console.error('获取未使用元素失败:', error);
      throw error;
    }
  }

  /**
   * 获取孤立引用
   */
  async getOrphanedReferences(params?: any) {
    try {
      const response = await analysisService.getOrphanedReferences(params);
      return response;
    } catch (error) {
      console.error('获取孤立引用失败:', error);
      throw error;
    }
  }

  /**
   * 获取设计建议
   */
  async getRecommendations(params?: any) {
    try {
      const response = await analysisService.getRecommendations(params);
      return response;
    } catch (error) {
      console.error('获取设计建议失败:', error);
      throw error;
    }
  }

  /**
   * 分析引用关系
   */
  async analyzeReferences(params?: any) {
    try {
      const response = await analysisService.analyzeReferences(params);
      return response;
    } catch (error) {
      console.error('分析引用关系失败:', error);
      throw error;
    }
  }
}
