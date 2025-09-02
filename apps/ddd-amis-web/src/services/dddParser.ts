import axios from 'axios';
import { AmisScreenDefinition, AmisScreen, AmisModelBinding } from '../types/ddd';

export class DDDParser {
  private static instance: DDDParser;
  private screenDefinition: AmisScreenDefinition | null = null;

  private constructor() {}

  public static getInstance(): DDDParser {
    if (!DDDParser.instance) {
      DDDParser.instance = new DDDParser();
    }
    return DDDParser.instance;
  }

  /**
   * 加载屏幕定义文件
   */
  public async loadScreenDefinition(filePath: string): Promise<AmisScreenDefinition> {
    try {
      const response = await axios.get(filePath);
      this.screenDefinition = response.data;
      return response.data;
    } catch (error) {
      console.error('加载屏幕定义失败:', error);
      throw new Error('无法加载屏幕定义文件');
    }
  }

  /**
   * 获取所有屏幕
   */
  public getScreens(): AmisScreen[] {
    if (!this.screenDefinition) {
      throw new Error('屏幕定义未加载');
    }
    return this.screenDefinition.screens;
  }

  /**
   * 根据ID获取屏幕
   */
  public getScreenById(screenId: string): AmisScreen | undefined {
    if (!this.screenDefinition) {
      throw new Error('屏幕定义未加载');
    }
    return this.screenDefinition.screens.find(screen => screen.id === screenId);
  }

  /**
   * 根据类型获取屏幕
   */
  public getScreensByType(type: string): AmisScreen[] {
    if (!this.screenDefinition) {
      throw new Error('屏幕定义未加载');
    }
    return this.screenDefinition.screens.filter(screen => screen.type === type);
  }

  /**
   * 获取屏幕的模型绑定
   */
  public getScreenModelBindings(screenId: string): AmisModelBinding[] {
    const screen = this.getScreenById(screenId);
    if (!screen) {
      return [];
    }
    return screen.modelBindings;
  }

  /**
   * 根据绑定类型获取模型绑定
   */
  public getModelBindingsByType(screenId: string, bindingType: string): AmisModelBinding[] {
    const bindings = this.getScreenModelBindings(screenId);
    return bindings.filter(binding => binding.bindingType === bindingType);
  }

  /**
   * 生成amis CRUD配置
   */
  public generateAmisCRUD(screenId: string): any {
    const screen = this.getScreenById(screenId);
    if (!screen) {
      throw new Error(`屏幕 ${screenId} 不存在`);
    }

    // 获取表格列绑定
    const tableBindings = this.getModelBindingsByType(screenId, 'TABLE_COLUMNS');
    const formBindings = this.getModelBindingsByType(screenId, 'FORM_FIELDS');

    // 生成列配置
            const columns = this.generateColumns(tableBindings, screen);
    
    // 生成表单字段
    const formFields = this.generateFormFields(formBindings);

    return {
      type: 'page',
      title: screen.name,
      body: [
        {
          type: 'crud',
          api: `/api/${screen.route.replace('/', '')}`,
          columns: columns,
          headerToolbar: [
            {
              type: 'button',
              label: '新增',
              level: 'primary',
              actionType: 'dialog',
              dialog: {
                title: `新增${screen.name}`,
                body: {
                  type: 'form',
                  api: `post:/api/${screen.route.replace('/', '')}`,
                  body: formFields
                }
              }
            },
            {
              type: 'button',
              label: '导出Excel',
              level: 'default',
              actionType: 'download',
              api: `/api/${screen.route.replace('/', '')}/export/excel`
            },
            {
              type: 'button',
              label: '导出PDF',
              level: 'default',
              actionType: 'download',
              api: `/api/${screen.route.replace('/', '')}/export/pdf`
            },
            {
              type: 'button',
              label: '批量删除',
              level: 'danger',
              actionType: 'ajax',
              api: `delete:/api/${screen.route.replace('/', '')}/batch`,
              confirmText: '确定要删除选中的记录吗？'
            }
          ],
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: `delete:/api/${screen.route.replace('/', '')}/batch`,
              confirmText: '确定要删除选中的记录吗？'
            }
          ],
          filter: {
            title: '高级搜索',
            mode: 'inline',
            body: [
              {
                type: 'grid',
                columns: [
                  {
                    body: [
                      {
                        type: 'input-text',
                        name: 'keyword',
                        placeholder: '请输入关键词',
                        label: '关键词'
                      }
                    ]
                  },
                  {
                    body: [
                      {
                        type: 'input-date-range',
                        name: 'dateRange',
                        label: '创建时间',
                        placeholder: '请选择时间范围'
                      }
                    ]
                  },
                  {
                    body: [
                      {
                        type: 'select',
                        name: 'status',
                        label: '状态',
                        placeholder: '请选择状态',
                        options: [
                          { label: '待支付', value: 'pending' },
                          { label: '已确认', value: 'confirmed' },
                          { label: '已发货', value: 'shipped' },
                          { label: '已完成', value: 'completed' }
                        ]
                      }
                    ]
                  },
                  {
                    body: [
                      {
                        type: 'input-number',
                        name: 'minAmount',
                        label: '最小金额',
                        placeholder: '最小金额'
                      }
                    ]
                  },
                  {
                    body: [
                      {
                        type: 'input-number',
                        name: 'maxAmount',
                        label: '最大金额',
                        placeholder: '最大金额'
                      }
                    ]
                  },
                  {
                    body: [
                      {
                        type: 'button',
                        label: '搜索',
                        level: 'primary',
                        actionType: 'submit'
                      },
                      {
                        type: 'button',
                        label: '重置',
                        level: 'default',
                        actionType: 'reset'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          perPage: 10,
          pageField: 'page',
          perPageField: 'perPage'
        }
      ]
    };
  }

  /**
   * 生成表格列配置
   */
  private generateColumns(bindings: AmisModelBinding[], screen: AmisScreen): any[] {
    const columns: any[] = [];
    const processedNames = new Set(); // 用于去重
    
    bindings.forEach(binding => {
      // 兼容新的properties结构
      if (binding.properties && Array.isArray(binding.properties)) {
        binding.properties.forEach(prop => {
          // 检查是否已经处理过这个字段名
          if (processedNames.has(prop.name)) {
            return; // 跳过重复的字段
          }
          processedNames.add(prop.name);
          
          const column: any = {
            name: prop.name,
            label: prop.label,
            type: this.getDefaultColumnType(prop.name) // 强制使用amis兼容的类型
          };
          
          // 处理枚举类型 - 转换为amis的mapping类型
          if (prop.type === 'enum' && prop.options) {
            column.type = 'mapping';
            column.map = prop.options.reduce((acc: any, opt: any) => {
              acc[opt.value] = opt.label;
              return acc;
            }, {});
          }
          
          columns.push(column);
        });
      }
      // 兼容旧的mappingRules结构
      else if (binding.mappingRules && Array.isArray(binding.mappingRules)) {
        binding.mappingRules.forEach(rule => {
          // 检查是否已经处理过这个字段名
          if (processedNames.has(rule.targetField)) {
            return; // 跳过重复的字段
          }
          processedNames.add(rule.targetField);
          
          const column: any = {
            name: rule.targetField,
            label: rule.targetField,
            ...rule.amisProps
          };
          
          if (!column.type) {
            column.type = this.getDefaultColumnType(rule.sourceField);
          }
          
          columns.push(column);
        });
      }
    });

    // 添加操作列
    columns.push({
      type: 'operation',
      label: '操作',
      buttons: [
        {
          type: 'button',
          label: '编辑',
          level: 'link',
          actionType: 'dialog',
          dialog: {
            title: '编辑',
            body: {
              type: 'form',
              api: `put:/api/${screen.route.replace('/', '')}/$id`,
              body: this.generateFormFields(bindings)
            }
          }
        },
        {
          type: 'button',
          label: '删除',
          level: 'link',
          className: 'text-danger',
          actionType: 'ajax',
          api: `delete:/api/${screen.route.replace('/', '')}/$id`,
          confirmText: '确定要删除这条记录吗？'
        }
      ]
    });
    
    return columns;
  }

  /**
   * 生成表单字段配置
   */
  private generateFormFields(bindings: AmisModelBinding[]): any[] {
    const fields: any[] = [];
    
    bindings.forEach(binding => {
      // 兼容新的properties结构
      if (binding.properties && Array.isArray(binding.properties)) {
        binding.properties.forEach(prop => {
          const field: any = {
            name: prop.name,
            label: prop.label,
            type: this.getDefaultFieldType(prop.name), // 强制使用amis兼容的类型
            required: prop.required !== false
          };
          
          // 处理枚举类型 - 转换为amis的select类型
          if (prop.type === 'enum' && prop.options) {
            field.type = 'select';
            field.options = prop.options;
          }
          
          fields.push(field);
        });
      }
      // 兼容旧的mappingRules结构
      else if (binding.mappingRules && Array.isArray(binding.mappingRules)) {
        binding.mappingRules.forEach(rule => {
          const field: any = {
            name: rule.targetField,
            label: rule.targetField,
            required: true,
            ...rule.amisProps
          };
          
          if (!field.type) {
            field.type = this.getDefaultFieldType(rule.sourceField);
          }
          
          if (rule.validation) {
            field.validations = [rule.validation];
          }
          
          fields.push(field);
        });
      }
    });

    return fields;
  }

  /**
   * 获取默认的列类型 - 确保amis兼容
   */
  private getDefaultColumnType(fieldName: string): string {
    if (fieldName.includes('id') || fieldName.includes('Id')) return 'text';
    if (fieldName.includes('time') || fieldName.includes('Time')) return 'datetime';
    if (fieldName.includes('amount') || fieldName.includes('Amount')) return 'number';
    if (fieldName.includes('status') || fieldName.includes('Status')) return 'mapping';
    if (fieldName.includes('type') || fieldName.includes('Type')) return 'mapping';
    if (fieldName.includes('name') || fieldName.includes('Name')) return 'text';
    if (fieldName.includes('no') || fieldName.includes('No')) return 'text';
    if (fieldName.includes('description') || fieldName.includes('Description')) return 'text';
    return 'text';
  }

  /**
   * 获取默认的字段类型 - 确保amis兼容
   */
  private getDefaultFieldType(fieldName: string): string {
    if (fieldName.includes('id') || fieldName.includes('Id')) return 'input-text';
    if (fieldName.includes('time') || fieldName.includes('Time')) return 'input-datetime';
    if (fieldName.includes('amount') || fieldName.includes('Amount')) return 'input-number';
    if (fieldName.includes('status') || fieldName.includes('Status')) return 'select';
    if (fieldName.includes('description') || fieldName.includes('Description')) return 'textarea';
    if (fieldName.includes('name') || fieldName.includes('Name')) return 'input-text';
    if (fieldName.includes('no') || fieldName.includes('No')) return 'input-text';
    return 'input-text';
  }

  /**
   * 获取模型映射配置
   */
  public getModelMappings(): any[] {
    if (!this.screenDefinition || !this.screenDefinition.modelMappings) {
      return [];
    }
    return this.screenDefinition.modelMappings;
  }

  /**
   * 验证屏幕定义
   */
  public validateScreenDefinition(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.screenDefinition) {
      errors.push('屏幕定义未加载');
      return { valid: false, errors };
    }

    if (!this.screenDefinition.screens || this.screenDefinition.screens.length === 0) {
      errors.push('没有定义任何屏幕');
    }

    if (!this.screenDefinition.modelMappings || this.screenDefinition.modelMappings.length === 0) {
      errors.push('没有定义模型映射');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
