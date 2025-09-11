import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Screen, ScreenTemplate } from '../entity/screen.entity';
import { DDDService } from './ddd.service';

export interface GenerateScreenDTO {
  aggregateId: string;
  screenType: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD';
  templateId?: string;
  customization?: Record<string, any>;
}

export interface CreateScreenDTO {
  projectId: string;
  name: string;
  description?: string;
  type: 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD';
  sourceAggregateId?: string;
  amisSchema: Record<string, any>;
}

/**
 * AMIS屏幕生成服务
 * 基于DDD模型自动生成AMIS界面配置
 */
@Provide()
export class ScreenGenerationService {
  @InjectEntityModel(Screen)
  screenRepository: Repository<Screen>;

  @InjectEntityModel(ScreenTemplate)
  screenTemplateRepository: Repository<ScreenTemplate>;

  @Inject()
  dddService: DDDService;

  /**
   * 基于聚合生成屏幕配置
   */
  async generateScreen(projectId: string, generateScreenDTO: GenerateScreenDTO): Promise<Record<string, any>> {
    const { aggregateId, screenType, templateId, customization } = generateScreenDTO;

    // 获取聚合信息
    const aggregate = await this.dddService.getAggregateById(aggregateId);
    if (!aggregate) {
      throw new Error('聚合不存在');
    }

    // 获取模板
    let template: ScreenTemplate | null = null;
    if (templateId) {
      template = await this.screenTemplateRepository.findOne({
        where: { id: templateId, type: screenType }
      });
    } else {
      // 使用默认模板
      template = await this.getDefaultTemplate(screenType);
    }

    if (!template) {
      throw new Error('未找到合适的模板');
    }

    // 根据屏幕类型生成配置
    let amisSchema: Record<string, any>;
    switch (screenType) {
      case 'LIST':
        amisSchema = await this.generateListScreen(aggregate, template, customization);
        break;
      case 'FORM':
        amisSchema = await this.generateFormScreen(aggregate, template, customization);
        break;
      case 'DETAIL':
        amisSchema = await this.generateDetailScreen(aggregate, template, customization);
        break;
      case 'DASHBOARD':
        amisSchema = await this.generateDashboardScreen(aggregate, template, customization);
        break;
      default:
        throw new Error('不支持的屏幕类型');
    }

    return amisSchema;
  }

  /**
   * 生成列表屏幕
   */
  private async generateListScreen(
    aggregate: any, 
    template: ScreenTemplate, 
    customization?: Record<string, any>
  ): Promise<Record<string, any>> {
    const rootEntity = aggregate.rootEntity;
    if (!rootEntity || !rootEntity.attributes) {
      throw new Error('聚合根实体或属性不存在');
    }

    // 生成表格列
    const columns = rootEntity.attributes
      .filter((attr: any) => this.shouldIncludeInList(attr))
      .map((attr: any) => this.attributeToColumn(attr));

    // 基础列表配置
    const baseSchema = {
      type: 'page',
      title: `${aggregate.name}管理`,
      body: {
        type: 'crud',
        api: `/api/${aggregate.name.toLowerCase()}`,
        columns: columns,
        headerToolbar: [
          {
            type: 'button',
            label: `新增${aggregate.name}`,
            level: 'primary',
            actionType: 'dialog',
            dialog: {
              title: `新增${aggregate.name}`,
              body: {
                type: 'form',
                api: `post:/api/${aggregate.name.toLowerCase()}`,
                body: this.generateFormFields(rootEntity.attributes)
              }
            }
          },
          'reload'
        ],
        footerToolbar: ['switch-per-page', 'pagination']
      }
    };

    // 应用模板和自定义配置
    return this.applyTemplateAndCustomization(baseSchema, template, customization);
  }

  /**
   * 生成表单屏幕
   */
  private async generateFormScreen(
    aggregate: any, 
    template: ScreenTemplate, 
    customization?: Record<string, any>
  ): Promise<Record<string, any>> {
    const rootEntity = aggregate.rootEntity;
    if (!rootEntity || !rootEntity.attributes) {
      throw new Error('聚合根实体或属性不存在');
    }

    const baseSchema = {
      type: 'form',
      title: `${aggregate.name}表单`,
      api: `post:/api/${aggregate.name.toLowerCase()}`,
      body: this.generateFormFields(rootEntity.attributes)
    };

    return this.applyTemplateAndCustomization(baseSchema, template, customization);
  }

  /**
   * 生成详情屏幕
   */
  private async generateDetailScreen(
    aggregate: any, 
    template: ScreenTemplate, 
    customization?: Record<string, any>
  ): Promise<Record<string, any>> {
    const rootEntity = aggregate.rootEntity;
    if (!rootEntity || !rootEntity.attributes) {
      throw new Error('聚合根实体或属性不存在');
    }

    const detailFields = rootEntity.attributes.map((attr: any) => ({
      type: 'static',
      name: attr.name,
      label: this.getFieldLabel(attr)
    }));

    const baseSchema = {
      type: 'page',
      title: `${aggregate.name}详情`,
      body: {
        type: 'service',
        api: `/api/${aggregate.name.toLowerCase()}/\${id}`,
        body: {
          type: 'panel',
          title: '详细信息',
          body: detailFields
        }
      }
    };

    return this.applyTemplateAndCustomization(baseSchema, template, customization);
  }

  /**
   * 生成仪表板屏幕
   */
  private async generateDashboardScreen(
    aggregate: any, 
    template: ScreenTemplate, 
    customization?: Record<string, any>
  ): Promise<Record<string, any>> {
    const baseSchema = {
      type: 'page',
      title: `${aggregate.name}仪表板`,
      body: [
        {
          type: 'grid',
          columns: [
            {
              type: 'panel',
              title: '统计信息',
              body: {
                type: 'chart',
                api: `/api/${aggregate.name.toLowerCase()}/stats`,
                config: {
                  type: 'line',
                  data: [],
                  xField: 'date',
                  yField: 'value'
                }
              }
            }
          ]
        }
      ]
    };

    return this.applyTemplateAndCustomization(baseSchema, template, customization);
  }

  /**
   * 生成表单字段
   */
  private generateFormFields(attributes: any[]): any[] {
    return attributes
      .filter(attr => this.shouldIncludeInForm(attr))
      .map(attr => this.attributeToFormField(attr));
  }

  /**
   * 属性转换为表格列
   */
  private attributeToColumn(attribute: any): Record<string, any> {
    const column: Record<string, any> = {
      name: attribute.name,
      label: this.getFieldLabel(attribute),
      type: this.getColumnType(attribute.dataType),
      sortable: this.isSortable(attribute)
    };

    // 根据数据类型添加特殊配置
    switch (attribute.dataType) {
      case 'BOOLEAN':
        column.type = 'switch';
        break;
      case 'DATE':
        column.type = 'date';
        column.format = 'YYYY-MM-DD';
        break;
      case 'DATETIME':
        column.type = 'datetime';
        column.format = 'YYYY-MM-DD HH:mm';
        break;
      case 'DECIMAL':
        column.prefix = '¥';
        break;
    }

    return column;
  }

  /**
   * 属性转换为表单字段
   */
  private attributeToFormField(attribute: any): Record<string, any> {
    const field: Record<string, any> = {
      name: attribute.name,
      label: this.getFieldLabel(attribute),
      type: this.getFormFieldType(attribute.dataType),
      required: attribute.constraints?.isRequired || false
    };

    // 添加验证规则
    const validations: Record<string, any> = {};
    
    if (attribute.constraints?.maxLength) {
      validations.maxLength = attribute.constraints.maxLength;
    }

    if (attribute.constraints?.pattern) {
      if (attribute.constraints.pattern === 'email') {
        validations.isEmail = true;
      } else {
        validations.matchRegexp = attribute.constraints.pattern;
      }
    }

    if (Object.keys(validations).length > 0) {
      field.validations = validations;
    }

    // 根据数据类型添加特殊配置
    switch (attribute.dataType) {
      case 'DECIMAL':
        field.precision = 2;
        field.prefix = '¥';
        break;
      case 'INTEGER':
        field.min = attribute.constraints?.minValue;
        field.max = attribute.constraints?.maxValue;
        break;
      case 'STRING':
        if (attribute.constraints?.maxLength > 200) {
          field.type = 'textarea';
          field.maxRows = 5;
        }
        break;
    }

    return field;
  }

  /**
   * 获取字段标签
   */
  private getFieldLabel(attribute: any): string {
    if (attribute.description) {
      return attribute.description;
    }
    
    // 简单的驼峰命名转换
    return attribute.name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  }

  /**
   * 获取列类型
   */
  private getColumnType(dataType: string): string {
    const typeMapping: Record<string, string> = {
      'STRING': 'text',
      'INTEGER': 'text',
      'DECIMAL': 'text',
      'BOOLEAN': 'switch',
      'DATE': 'date',
      'DATETIME': 'datetime'
    };

    return typeMapping[dataType] || 'text';
  }

  /**
   * 获取表单字段类型
   */
  private getFormFieldType(dataType: string): string {
    const typeMapping: Record<string, string> = {
      'STRING': 'input-text',
      'INTEGER': 'input-number',
      'DECIMAL': 'input-number',
      'BOOLEAN': 'switch',
      'DATE': 'input-date',
      'DATETIME': 'input-datetime'
    };

    return typeMapping[dataType] || 'input-text';
  }

  /**
   * 判断是否应该包含在列表中
   */
  private shouldIncludeInList(attribute: any): boolean {
    // 排除密码字段和过长的文本字段
    if (attribute.name.toLowerCase().includes('password')) {
      return false;
    }
    
    if (attribute.dataType === 'STRING' && attribute.constraints?.maxLength > 500) {
      return false;
    }

    return true;
  }

  /**
   * 判断是否应该包含在表单中
   */
  private shouldIncludeInForm(attribute: any): boolean {
    // 排除自动生成的ID字段
    if (attribute.name === 'id' || attribute.name.endsWith('Id')) {
      return false;
    }

    return true;
  }

  /**
   * 判断是否可排序
   */
  private isSortable(attribute: any): boolean {
    const sortableTypes = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME'];
    return sortableTypes.includes(attribute.dataType);
  }

  /**
   * 应用模板和自定义配置
   */
  private applyTemplateAndCustomization(
    baseSchema: Record<string, any>,
    template: ScreenTemplate,
    customization?: Record<string, any>
  ): Record<string, any> {
    // 合并模板配置
    const mergedSchema = this.deepMerge(baseSchema, template.templateContent);

    // 应用自定义配置
    if (customization) {
      return this.deepMerge(mergedSchema, customization);
    }

    return mergedSchema;
  }

  /**
   * 深度合并对象
   */
  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null) {
      return source;
    }

    if (typeof source !== 'object' || source === null) {
      return target;
    }

    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * 获取默认模板
   */
  private async getDefaultTemplate(screenType: string): Promise<ScreenTemplate | null> {
    return await this.screenTemplateRepository.findOne({
      where: { type: screenType as any, isSystem: true }
    });
  }

  /**
   * 保存生成的屏幕配置
   */
  async saveScreen(createScreenDTO: CreateScreenDTO): Promise<Screen> {
    const screen = new Screen();
    screen.id = `screen_${uuidv4().replace(/-/g, '')}`;
    screen.projectId = createScreenDTO.projectId;
    screen.name = createScreenDTO.name;
    screen.description = createScreenDTO.description;
    screen.type = createScreenDTO.type;
    screen.sourceAggregateId = createScreenDTO.sourceAggregateId;
    screen.amisSchema = createScreenDTO.amisSchema;
    screen.metadata = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'AUTO_GENERATED'
    };

    return await this.screenRepository.save(screen);
  }

  /**
   * 获取屏幕列表
   */
  async getScreens(projectId: string): Promise<Screen[]> {
    return await this.screenRepository.find({
      where: { projectId },
      order: { updatedAt: 'DESC' }
    });
  }

  /**
   * 获取屏幕详情
   */
  async getScreenById(screenId: string): Promise<Screen | null> {
    return await this.screenRepository.findOne({
      where: { id: screenId }
    });
  }

  /**
   * 更新屏幕配置
   */
  async updateScreen(screenId: string, updates: Partial<CreateScreenDTO>): Promise<Screen | null> {
    const screen = await this.screenRepository.findOne({
      where: { id: screenId }
    });

    if (!screen) {
      return null;
    }

    if (updates.name) screen.name = updates.name;
    if (updates.description !== undefined) screen.description = updates.description;
    if (updates.amisSchema) screen.amisSchema = updates.amisSchema;

    return await this.screenRepository.save(screen);
  }

  /**
   * 删除屏幕
   */
  async deleteScreen(screenId: string): Promise<boolean> {
    const result = await this.screenRepository.delete(screenId);
    return result.affected ? result.affected > 0 : false;
  }
}
