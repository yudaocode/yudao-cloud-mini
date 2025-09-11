/**
 * DDD模型到AMIS界面自动转换器
 * 实现DDD模型与AMIS界面的完全自动化同步，避免重复定义
 */

import { watch } from 'chokidar';
import * as fs from 'fs/promises';
import * as path from 'path';

// 类型定义
interface DDDEntity {
  entityId: string;
  name: string;
  attributes: DDDAttribute[];
  businessRules?: string[];
  validationRules?: string[];
}

interface DDDAttribute {
  attributeId: string;
  name: string;
  type: DDDDataType;
  constraints: DDDConstraints;
  businessMeaning?: string;
  ubiquitousLanguageTermId?: string;
}

interface DDDDataType {
  baseType: string;
  maxLength?: number;
  pattern?: string;
  allowedValues?: string[];
}

interface DDDConstraints {
  isRequired: boolean;
  isUnique: boolean;
  maxValue?: number;
  minValue?: number;
}

interface AmisColumn {
  name: string;
  label: string;
  type: string;
  sortable?: boolean;
  searchable?: boolean;
  [key: string]: any;
}

interface AmisFormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  validations?: any;
  [key: string]: any;
}

/**
 * DDD到AMIS自动转换器
 */
export class DDDToAmisAutoConverter {
  
  private config: any;
  private typeMapping: Map<string, any>;
  private watchers: any[] = [];
  
  constructor(configPath: string) {
    this.loadConfiguration(configPath);
    this.initializeTypeMapping();
  }

  /**
   * 启动自动同步监听
   */
  async startAutoSync(): Promise<void> {
    if (!this.config.syncConfiguration.enabled) {
      console.log('自动同步已禁用');
      return;
    }

    console.log('启动DDD-AMIS自动同步监听...');
    
    // 监听聚合文件变化
    const aggregateWatcher = watch('./schemas/tactical-design/aggregate/*.json', {
      ignoreInitial: true
    });
    
    aggregateWatcher.on('change', async (filePath) => {
      await this.handleAggregateChange(filePath, 'MODIFY');
    });
    
    aggregateWatcher.on('add', async (filePath) => {
      await this.handleAggregateChange(filePath, 'ADD');
    });

    // 监听实体文件变化
    const entityWatcher = watch('./schemas/tactical-design/entity/*.json', {
      ignoreInitial: true
    });
    
    entityWatcher.on('change', async (filePath) => {
      await this.handleEntityChange(filePath, 'MODIFY');
    });

    this.watchers.push(aggregateWatcher, entityWatcher);
  }

  /**
   * 停止自动同步
   */
  async stopAutoSync(): Promise<void> {
    for (const watcher of this.watchers) {
      await watcher.close();
    }
    this.watchers = [];
    console.log('已停止DDD-AMIS自动同步');
  }

  /**
   * 手动转换指定聚合
   */
  async convertAggregate(aggregateId: string): Promise<any[]> {
    console.log(`开始转换聚合: ${aggregateId}`);
    
    try {
      // 1. 加载聚合元数据
      const aggregateMetadata = await this.loadAggregateMetadata(aggregateId);
      
      // 2. 生成屏幕配置
      const screens = await this.generateScreensFromAggregate(aggregateMetadata);
      
      // 3. 保存生成的配置
      await this.saveGeneratedScreens(aggregateId, screens);
      
      console.log(`✅ 成功转换聚合 ${aggregateId}，生成 ${screens.length} 个屏幕`);
      return screens;
      
    } catch (error) {
      console.error(`❌ 转换聚合 ${aggregateId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 实体到表格列的转换
   */
  entityToTableColumns(entity: DDDEntity): AmisColumn[] {
    console.log(`🔄 转换实体 ${entity.name} 为表格列...`);
    
    return entity.attributes
      .filter(attr => this.shouldGenerateListColumn(attr))
      .map(attr => this.attributeToColumn(attr))
      .sort((a, b) => this.getColumnPriority(a) - this.getColumnPriority(b));
  }

  /**
   * 实体到表单字段的转换
   */
  entityToFormFields(entity: DDDEntity): AmisFormField[] {
    console.log(`🔄 转换实体 ${entity.name} 为表单字段...`);
    
    return entity.attributes
      .filter(attr => this.shouldGenerateFormField(attr))
      .map(attr => this.attributeToFormField(attr));
  }

  /**
   * 属性到列的转换
   */
  private attributeToColumn(attribute: DDDAttribute): AmisColumn {
    const typeMapping = this.typeMapping.get(attribute.type.baseType);
    
    const column: AmisColumn = {
      name: attribute.name,
      label: this.getDisplayLabel(attribute),
      type: typeMapping?.listColumnType || 'text',
      sortable: this.isSortable(attribute),
      searchable: this.isSearchable(attribute)
    };

    // 应用条件映射
    this.applyConditionalMapping(column, attribute, 'list');
    
    // 应用特殊类型处理
    this.applySpecialTypeHandling(column, attribute);
    
    return column;
  }

  /**
   * 属性到表单字段的转换
   */
  private attributeToFormField(attribute: DDDAttribute): AmisFormField {
    const typeMapping = this.typeMapping.get(attribute.type.baseType);
    
    const field: AmisFormField = {
      name: attribute.name,
      label: this.getDisplayLabel(attribute),
      type: typeMapping?.formFieldType || 'input-text',
      required: attribute.constraints.isRequired
    };

    // 添加验证规则
    field.validations = this.buildValidationRules(attribute);
    
    // 应用条件映射
    this.applyConditionalMapping(field, attribute, 'form');
    
    // 应用业务规则
    this.applyBusinessRules(field, attribute);
    
    return field;
  }

  /**
   * 构建验证规则
   */
  private buildValidationRules(attribute: DDDAttribute): any {
    const validations: any = {};
    
    // 必填验证
    if (attribute.constraints.isRequired) {
      validations.required = true;
    }
    
    // 长度验证
    if (attribute.type.maxLength) {
      validations.maxLength = attribute.type.maxLength;
    }
    
    // 唯一性验证
    if (attribute.constraints.isUnique) {
      validations.remote = `/api/validation/unique/${attribute.name}`;
    }
    
    // 数值范围验证
    if (attribute.constraints.minValue !== undefined) {
      validations.minimum = attribute.constraints.minValue;
    }
    
    if (attribute.constraints.maxValue !== undefined) {
      validations.maximum = attribute.constraints.maxValue;
    }
    
    // 格式验证
    if (attribute.type.pattern) {
      if (attribute.type.pattern === 'email') {
        validations.isEmail = true;
      } else {
        validations.matchRegexp = attribute.type.pattern;
      }
    }
    
    return validations;
  }

  /**
   * 应用条件映射
   */
  private applyConditionalMapping(target: any, attribute: DDDAttribute, context: string): void {
    const typeMapping = this.typeMapping.get(attribute.type.baseType);
    const conditionalMappings = typeMapping?.conditionalMapping || [];
    
    for (const mapping of conditionalMappings) {
      if (this.evaluateCondition(mapping.condition, attribute, context)) {
        target.type = mapping.amisType;
        if (mapping.props) {
          Object.assign(target, mapping.props);
        }
        break; // 使用第一个匹配的条件
      }
    }
  }

  /**
   * 应用特殊类型处理
   */
  private applySpecialTypeHandling(target: any, attribute: DDDAttribute): void {
    // 枚举类型处理
    if (attribute.type.baseType === 'ENUM' && attribute.type.allowedValues) {
      target.type = 'mapping';
      target.map = this.buildEnumMapping(attribute.type.allowedValues);
    }
    
    // 邮箱类型处理
    if (attribute.type.pattern === 'email') {
      target.type = 'link';
      target.href = `mailto:\${${attribute.name}}`;
    }
    
    // URL类型处理
    if (attribute.type.baseType === 'URL') {
      target.type = 'link';
      target.href = `\${${attribute.name}}`;
      target.blank = true;
    }
  }

  /**
   * 应用业务规则
   */
  private applyBusinessRules(field: AmisFormField, attribute: DDDAttribute): void {
    if (!attribute.businessRules) return;
    
    for (const ruleId of attribute.businessRules) {
      const ruleMapping = this.config.typeMapping.businessRuleMapping[ruleId];
      if (ruleMapping) {
        switch (ruleMapping.actionType) {
          case 'SHOW_HIDE':
            field.visibleOn = ruleMapping.amisExpression;
            break;
          case 'ENABLE_DISABLE':
            field.disabledOn = `!(${ruleMapping.amisExpression})`;
            break;
          case 'SET_VALUE':
            field.value = ruleMapping.amisExpression;
            break;
        }
      }
    }
  }

  /**
   * 生成屏幕配置从聚合
   */
  private async generateScreensFromAggregate(aggregateMetadata: any): Promise<any[]> {
    const screens = [];
    const entity = aggregateMetadata.aggregateRoot;
    
    // 生成列表屏幕
    screens.push(await this.generateListScreen(entity, aggregateMetadata));
    
    // 生成创建表单屏幕
    screens.push(await this.generateCreateScreen(entity, aggregateMetadata));
    
    // 生成编辑表单屏幕
    screens.push(await this.generateEditScreen(entity, aggregateMetadata));
    
    // 生成详情屏幕
    screens.push(await this.generateDetailScreen(entity, aggregateMetadata));
    
    return screens;
  }

  /**
   * 生成列表屏幕
   */
  private async generateListScreen(entity: DDDEntity, aggregateMetadata: any): Promise<any> {
    const template = this.config.templateMapping.screenTemplates.CRUD_LIST;
    
    return {
      screenId: `${entity.name.toLowerCase()}-list`,
      screenType: 'LIST',
      amisSchema: {
        type: 'page',
        title: `${this.getDisplayLabel(entity)}管理`,
        body: {
          type: 'crud',
          api: this.buildListApi(aggregateMetadata),
          columns: this.entityToTableColumns(entity),
          headerToolbar: [
            {
              type: 'button',
              label: `新增${this.getDisplayLabel(entity)}`,
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: `新增${this.getDisplayLabel(entity)}`,
                body: {
                  type: 'form',
                  api: this.buildCreateApi(aggregateMetadata),
                  body: this.entityToFormFields(entity)
                }
              }
            }
          ]
        }
      },
      dddEnhancements: {
        entityBindings: [{
          entityType: 'AGGREGATE_ROOT',
          entityId: entity.entityId,
          bindingType: 'DATA_SOURCE'
        }]
      }
    };
  }

  /**
   * 生成创建表单屏幕
   */
  private async generateCreateScreen(entity: DDDEntity, aggregateMetadata: any): Promise<any> {
    return {
      screenId: `${entity.name.toLowerCase()}-create`,
      screenType: 'FORM',
      amisSchema: {
        type: 'form',
        title: `新增${this.getDisplayLabel(entity)}`,
        api: this.buildCreateApi(aggregateMetadata),
        body: this.entityToFormFields(entity)
      }
    };
  }

  /**
   * 生成编辑表单屏幕
   */
  private async generateEditScreen(entity: DDDEntity, aggregateMetadata: any): Promise<any> {
    return {
      screenId: `${entity.name.toLowerCase()}-edit`,
      screenType: 'FORM',
      amisSchema: {
        type: 'form',
        title: `编辑${this.getDisplayLabel(entity)}`,
        api: this.buildUpdateApi(aggregateMetadata),
        initApi: this.buildDetailApi(aggregateMetadata),
        body: this.entityToFormFields(entity)
      }
    };
  }

  /**
   * 生成详情屏幕
   */
  private async generateDetailScreen(entity: DDDEntity, aggregateMetadata: any): Promise<any> {
    const detailFields = entity.attributes.map(attr => ({
      type: 'static',
      name: attr.name,
      label: this.getDisplayLabel(attr)
    }));
    
    return {
      screenId: `${entity.name.toLowerCase()}-detail`,
      screenType: 'DETAIL',
      amisSchema: {
        type: 'page',
        title: `${this.getDisplayLabel(entity)}详情`,
        body: {
          type: 'service',
          api: this.buildDetailApi(aggregateMetadata),
          body: {
            type: 'panel',
            title: '详细信息',
            body: detailFields
          }
        }
      }
    };
  }

  /**
   * 处理聚合变更
   */
  private async handleAggregateChange(filePath: string, changeType: string): Promise<void> {
    const aggregateId = this.extractAggregateIdFromPath(filePath);
    console.log(`📝 检测到聚合变更: ${aggregateId} (${changeType})`);
    
    try {
      if (this.config.syncConfiguration.conflictResolution === 'PRESERVE_CUSTOM') {
        await this.backupExistingScreens(aggregateId);
      }
      
      await this.convertAggregate(aggregateId);
      
    } catch (error) {
      console.error(`处理聚合变更失败: ${aggregateId}`, error);
    }
  }

  /**
   * 处理实体变更
   */
  private async handleEntityChange(filePath: string, changeType: string): Promise<void> {
    const entityId = this.extractEntityIdFromPath(filePath);
    console.log(`📝 检测到实体变更: ${entityId} (${changeType})`);
    
    // 查找使用此实体的所有聚合
    const affectedAggregates = await this.findAggregatesUsingEntity(entityId);
    
    for (const aggregateId of affectedAggregates) {
      await this.handleAggregateChange(`./schemas/tactical-design/aggregate/${aggregateId}.json`, 'MODIFY');
    }
  }

  // 工具方法
  private async loadConfiguration(configPath: string): Promise<void> {
    const configContent = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configContent);
  }

  private initializeTypeMapping(): void {
    this.typeMapping = new Map();
    const mappings = this.config.typeMapping.dataTypeMapping;
    
    for (const [type, mapping] of Object.entries(mappings)) {
      this.typeMapping.set(type, mapping);
    }
  }

  private async loadAggregateMetadata(aggregateId: string): Promise<any> {
    const aggregatePath = `./schemas/tactical-design/aggregate/${aggregateId}.json`;
    const content = await fs.readFile(aggregatePath, 'utf-8');
    return JSON.parse(content);
  }

  private getDisplayLabel(item: any): string {
    if (item.ubiquitousLanguageTermId) {
      // TODO: 从统一语言术语库获取显示名
      return item.name;
    }
    
    if (item.businessMeaning) {
      return item.businessMeaning;
    }
    
    return this.humanizeString(item.name);
  }

  private humanizeString(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

  private shouldGenerateListColumn(attribute: DDDAttribute): boolean {
    // 检查生成规则
    for (const rule of this.config.generationRules.attributeToField) {
      if (this.matchesPattern(attribute.name, rule.attributePattern)) {
        return rule.fieldGeneration.listColumn;
      }
    }
    
    // 默认规则：ID字段和密码字段不显示在列表中
    if (attribute.name.endsWith('Id') || attribute.name.includes('password')) {
      return false;
    }
    
    return true;
  }

  private shouldGenerateFormField(attribute: DDDAttribute): boolean {
    // 检查生成规则
    for (const rule of this.config.generationRules.attributeToField) {
      if (this.matchesPattern(attribute.name, rule.attributePattern)) {
        return rule.fieldGeneration.formField;
      }
    }
    
    // 默认规则：自动生成的ID字段不在表单中显示
    if (attribute.name === 'id' || attribute.name.endsWith('Id')) {
      return false;
    }
    
    return true;
  }

  private isSortable(attribute: DDDAttribute): boolean {
    // 基于数据类型判断是否可排序
    const sortableTypes = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME'];
    return sortableTypes.includes(attribute.type.baseType);
  }

  private isSearchable(attribute: DDDAttribute): boolean {
    // 基于业务含义和数据类型判断是否可搜索
    if (attribute.businessMeaning?.includes('姓名') || attribute.businessMeaning?.includes('名称')) {
      return true;
    }
    
    const searchableTypes = ['STRING', 'EMAIL'];
    return searchableTypes.includes(attribute.type.baseType);
  }

  private buildEnumMapping(allowedValues: string[]): any {
    const mapping: any = {};
    for (const value of allowedValues) {
      mapping[value] = this.humanizeString(value);
    }
    return mapping;
  }

  private evaluateCondition(condition: string, attribute: DDDAttribute, context: string): boolean {
    try {
      // 简单的条件评估（实际项目中应该使用更安全的表达式引擎）
      const code = condition
        .replace(/maxLength/g, attribute.type.maxLength?.toString() || '0')
        .replace(/businessMeaning/g, `"${attribute.businessMeaning || ''}"`)
        .replace(/name/g, `"${attribute.name}"`)
        .replace(/pattern/g, `"${attribute.type.pattern || ''}"`)
        .replace(/formContext/g, `"${context}"`);
      
      return eval(code);
    } catch {
      return false;
    }
  }

  private getColumnPriority(column: AmisColumn): number {
    // 根据字段重要性排序
    if (column.name === 'name' || column.name.includes('Name')) return 10;
    if (column.name === 'status' || column.name.includes('Status')) return 20;
    if (column.name.includes('Time') || column.name.includes('Date')) return 30;
    return 100;
  }

  private buildListApi(aggregateMetadata: any): string {
    const entityName = aggregateMetadata.aggregateRoot.name.toLowerCase();
    return `/api/${entityName}`;
  }

  private buildCreateApi(aggregateMetadata: any): string {
    const entityName = aggregateMetadata.aggregateRoot.name.toLowerCase();
    return `/api/${entityName}`;
  }

  private buildUpdateApi(aggregateMetadata: any): string {
    const entityName = aggregateMetadata.aggregateRoot.name.toLowerCase();
    return `/api/${entityName}/\${id}`;
  }

  private buildDetailApi(aggregateMetadata: any): string {
    const entityName = aggregateMetadata.aggregateRoot.name.toLowerCase();
    return `/api/${entityName}/\${id}`;
  }

  private extractAggregateIdFromPath(filePath: string): string {
    return path.basename(filePath, '.json');
  }

  private extractEntityIdFromPath(filePath: string): string {
    return path.basename(filePath, '.json');
  }

  private async findAggregatesUsingEntity(entityId: string): Promise<string[]> {
    // TODO: 实现查找使用指定实体的聚合
    return [];
  }

  private async backupExistingScreens(aggregateId: string): Promise<void> {
    if (!this.config.syncConfiguration.backupStrategy.enabled) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.config.syncConfiguration.backupStrategy.location, aggregateId);
    
    // TODO: 实现备份逻辑
    console.log(`📦 备份现有屏幕配置到: ${backupDir}`);
  }

  private async saveGeneratedScreens(aggregateId: string, screens: any[]): Promise<void> {
    const outputDir = path.join(this.config.outputConfiguration.baseDirectory, aggregateId);
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const screen of screens) {
      const fileName = this.config.outputConfiguration.fileNaming.screenFiles
        .replace('${entityName}', aggregateId)
        .replace('${screenType}', screen.screenType.toLowerCase());
      
      const filePath = path.join(outputDir, fileName);
      const content = JSON.stringify(screen, null, this.config.outputConfiguration.formatOptions.indentation);
      
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`💾 已保存屏幕配置: ${filePath}`);
    }
  }

  private matchesPattern(text: string, pattern: string): boolean {
    try {
      const regex = new RegExp(pattern);
      return regex.test(text);
    } catch {
      return false;
    }
  }
}

// 使用示例
export async function main() {
  const converter = new DDDToAmisAutoConverter('./examples/ddd-amis-sync-config.json');
  
  // 启动自动同步
  await converter.startAutoSync();
  
  // 手动转换特定聚合
  const screens = await converter.convertAggregate('agg_order');
  console.log(`✅ 成功生成 ${screens.length} 个屏幕配置`);
  
  // 程序退出时停止监听
  process.on('SIGINT', async () => {
    console.log('正在停止自动同步...');
    await converter.stopAutoSync();
    process.exit(0);
  });
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
  main().catch(console.error);
}
