import { AmisScreenDefinition, AmisScreen, AmisModelBinding } from '../types/ddd';

export class DDDParser {
  private screenDefinition: AmisScreenDefinition | null = null;

  // 加载屏幕定义文件
  async loadScreenDefinition(filePath: string): Promise<AmisScreenDefinition> {
    try {
      // 这里可以从本地文件或API加载
      const response = await fetch(filePath);
      const definition = await response.json();
      this.screenDefinition = definition;
      return definition;
    } catch (error) {
      console.error('加载屏幕定义失败:', error);
      throw error;
    }
  }

  // 根据屏幕ID获取amis配置
  getAmisConfig(screenId: string): any {
    if (!this.screenDefinition) {
      throw new Error('屏幕定义未加载');
    }

    const screen = this.screenDefinition.screens.find(s => s.id === screenId);
    if (!screen) {
      throw new Error(`屏幕 ${screenId} 不存在`);
    }

    return screen.amisPage;
  }

  // 获取所有可用屏幕
  getAvailableScreens(): AmisScreen[] {
    if (!this.screenDefinition) {
      return [];
    }
    return this.screenDefinition.screens;
  }

  // 根据模型绑定生成amis组件配置
  generateAmisComponent(binding: AmisModelBinding): any {
    const { modelType, bindingType, mappingRules } = binding;

    switch (bindingType) {
      case 'TABLE_COLUMNS':
        return this.generateTableColumns(mappingRules);
      case 'FORM_FIELDS':
        return this.generateFormFields(mappingRules);
      case 'VALIDATION':
        return this.generateValidationRules(mappingRules);
      default:
        return {};
    }
  }

  // 生成表格列配置
  private generateTableColumns(mappingRules: any[]): any[] {
    return mappingRules.map(rule => ({
      name: rule.targetField,
      label: rule.sourceField,
      ...rule.amisProps
    }));
  }

  // 生成表单字段配置
  private generateFormFields(mappingRules: any[]): any[] {
    return mappingRules.map(rule => ({
      type: rule.amisProps.type || 'input-text',
      name: rule.targetField,
      label: rule.sourceField,
      required: rule.validation?.required || false,
      ...rule.amisProps
    }));
  }

  // 生成验证规则
  private generateValidationRules(mappingRules: any[]): any[] {
    return mappingRules
      .filter(rule => rule.validation)
      .map(rule => rule.validation);
  }

  // 获取模型映射配置
  getModelMappings(): any[] {
    if (!this.screenDefinition) {
      return [];
    }
    return this.screenDefinition.modelMappings;
  }

  // 获取amis全局配置
  getAmisGlobalConfig(): any {
    if (!this.screenDefinition) {
      return {};
    }
    return this.screenDefinition.amisConfig;
  }

  // 检查是否已加载屏幕定义
  isLoaded(): boolean {
    return this.screenDefinition !== null;
  }
}
