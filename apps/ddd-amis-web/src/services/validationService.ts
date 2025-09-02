// 数据验证服务
export interface ValidationRule {
  id: string;
  name: string;
  field: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'range' | 'unique';
  message: string;
  params?: any;
  enabled: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  rule: string;
}

export class ValidationService {
  private rules: ValidationRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  // 初始化默认验证规则
  private initializeDefaultRules(): void {
    this.rules = [
      // 订单相关验证规则
      {
        id: '1',
        name: '订单编号必填',
        field: 'orderNo',
        type: 'required',
        message: '订单编号不能为空',
        enabled: true
      },
      {
        id: '2',
        name: '订单编号格式',
        field: 'orderNo',
        type: 'pattern',
        message: '订单编号格式不正确，应为字母数字组合',
        params: { pattern: '^[A-Z0-9]{8,16}$' },
        enabled: true
      },
      {
        id: '3',
        name: '客户姓名必填',
        field: 'customerName',
        type: 'required',
        message: '客户姓名不能为空',
        enabled: true
      },
      {
        id: '4',
        name: '客户姓名长度',
        field: 'customerName',
        type: 'minLength',
        message: '客户姓名长度不能少于2个字符',
        params: { minLength: 2 },
        enabled: true
      },
      {
        id: '5',
        name: '订单金额必填',
        field: 'totalAmount',
        type: 'required',
        message: '订单金额不能为空',
        enabled: true
      },
      {
        id: '6',
        name: '订单金额范围',
        field: 'totalAmount',
        type: 'range',
        message: '订单金额必须在0.01到999999.99之间',
        params: { min: 0.01, max: 999999.99 },
        enabled: true
      },
      {
        id: '7',
        name: '订单状态必填',
        field: 'status',
        type: 'required',
        message: '订单状态不能为空',
        enabled: true
      },
      {
        id: '8',
        name: '订单状态枚举',
        field: 'status',
        type: 'custom',
        message: '订单状态值不正确',
        params: { 
          validator: (value: any) => ['pending', 'confirmed', 'shipped', 'completed'].includes(value)
        },
        enabled: true
      }
    ];
  }

  // 验证单个字段
  validateField(field: string, value: any): ValidationError[] {
    const fieldRules = this.rules.filter(rule => rule.field === field && rule.enabled);
    const errors: ValidationError[] = [];

    fieldRules.forEach(rule => {
      if (!this.validateRule(rule, value)) {
        errors.push({
          field: rule.field,
          message: rule.message,
          rule: rule.name
        });
      }
    });

    return errors;
  }

  // 验证单个规则
  private validateRule(rule: ValidationRule, value: any): boolean {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(value);
      
      case 'minLength':
        return this.validateMinLength(value, rule.params?.minLength);
      
      case 'maxLength':
        return this.validateMaxLength(value, rule.params?.maxLength);
      
      case 'pattern':
        return this.validatePattern(value, rule.params?.pattern);
      
      case 'range':
        return this.validateRange(value, rule.params?.min, rule.params?.max);
      
      case 'custom':
        return this.validateCustom(value, rule.params?.validator);
      
      default:
        return true;
    }
  }

  // 验证必填
  private validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  // 验证最小长度
  private validateMinLength(value: any, minLength: number): boolean {
    if (!value || typeof value !== 'string') return false;
    return value.length >= minLength;
  }

  // 验证最大长度
  private validateMaxLength(value: any, maxLength: number): boolean {
    if (!value || typeof value !== 'string') return false;
    return value.length <= maxLength;
  }

  // 验证正则表达式
  private validatePattern(value: any, pattern: string): boolean {
    if (!value || typeof value !== 'string') return false;
    const regex = new RegExp(pattern);
    return regex.test(value);
  }

  // 验证数值范围
  private validateRange(value: any, min: number, max: number): boolean {
    if (value === null || value === undefined) return false;
    const numValue = Number(value);
    if (isNaN(numValue)) return false;
    return numValue >= min && numValue <= max;
  }

  // 验证自定义规则
  private validateCustom(value: any, validator: Function): boolean {
    if (typeof validator !== 'function') return true;
    try {
      return validator(value);
    } catch (error) {
      console.error('自定义验证器执行错误:', error);
      return false;
    }
  }

  // 验证整个对象
  validateObject(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fields = this.getUniqueFields();

    fields.forEach(field => {
      const fieldErrors = this.validateField(field, data[field]);
      errors.push(...fieldErrors);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 获取唯一字段列表
  private getUniqueFields(): string[] {
    const fields = this.rules
      .filter(rule => rule.enabled)
      .map(rule => rule.field);
    return [...new Set(fields)];
  }

  // 添加验证规则
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  // 更新验证规则
  updateRule(ruleId: string, updates: Partial<ValidationRule>): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      return true;
    }
    return false;
  }

  // 删除验证规则
  deleteRule(ruleId: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  // 启用/禁用验证规则
  toggleRule(ruleId: string, enabled: boolean): boolean {
    return this.updateRule(ruleId, { enabled });
  }

  // 获取所有验证规则
  getAllRules(): ValidationRule[] {
    return [...this.rules];
  }

  // 获取字段的验证规则
  getFieldRules(field: string): ValidationRule[] {
    return this.rules.filter(rule => rule.field === field);
  }

  // 批量验证
  validateBatch(dataList: any[]): ValidationResult[] {
    return dataList.map(data => this.validateObject(data));
  }

  // 获取验证统计信息
  getValidationStats(): {
    totalRules: number;
    enabledRules: number;
    disabledRules: number;
    fieldStats: { [key: string]: number };
  } {
    const totalRules = this.rules.length;
    const enabledRules = this.rules.filter(rule => rule.enabled).length;
    const disabledRules = totalRules - enabledRules;

    const fieldStats: { [key: string]: number } = {};
    this.rules.forEach(rule => {
      fieldStats[rule.field] = (fieldStats[rule.field] || 0) + 1;
    });

    return {
      totalRules,
      enabledRules,
      disabledRules,
      fieldStats
    };
  }

  // 导出验证规则
  exportRules(format: 'json' | 'yaml'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.rules, null, 2);
      case 'yaml':
        return this.convertToYAML(this.rules);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 转换为YAML格式
  private convertToYAML(obj: any): string {
    // 简单的YAML转换实现
    const yamlLines: string[] = [];
    
    obj.forEach((rule: any, index: number) => {
      yamlLines.push(`- id: ${rule.id}`);
      yamlLines.push(`  name: ${rule.name}`);
      yamlLines.push(`  field: ${rule.field}`);
      yamlLines.push(`  type: ${rule.type}`);
      yamlLines.push(`  message: ${rule.message}`);
      yamlLines.push(`  enabled: ${rule.enabled}`);
      if (rule.params) {
        yamlLines.push(`  params: ${JSON.stringify(rule.params)}`);
      }
      if (index < obj.length - 1) {
        yamlLines.push('');
      }
    });
    
    return yamlLines.join('\n');
  }
}

export const validationService = new ValidationService();
