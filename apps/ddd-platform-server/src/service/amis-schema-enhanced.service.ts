import { Provide } from '@midwayjs/core';

@Provide()
export class AmisSchemaEnhancedService {
  
  // 通用验证规则配置
  private getValidationConfig() {
    return {
      name: {
        validations: {
          minLength: 2,
          maxLength: 50,
        },
        validationErrors: {
          minLength: '名称至少需要2个字符',
          maxLength: '名称不能超过50个字符',
          required: '请输入名称',
        },
      },
      description: {
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '描述不能超过500个字符',
        },
      },
      code: {
        validations: {
          minLength: 2,
          maxLength: 30,
          pattern: '^[a-zA-Z][a-zA-Z0-9_]*$',
        },
        validationErrors: {
          minLength: '代码至少需要2个字符',
          maxLength: '代码不能超过30个字符',
          pattern: '代码必须以字母开头，只能包含字母、数字和下划线',
          required: '请输入代码',
        },
      },
      email: {
        validations: {
          isEmail: true,
        },
        validationErrors: {
          isEmail: '请输入有效的邮箱地址',
          required: '请输入邮箱地址',
        },
      },
      url: {
        validations: {
          isUrl: true,
        },
        validationErrors: {
          isUrl: '请输入有效的URL地址',
        },
      },
      phone: {
        validations: {
          pattern: '^1[3-9]\\d{9}$',
        },
        validationErrors: {
          pattern: '请输入有效的手机号码',
          required: '请输入手机号码',
        },
      },
      number: {
        validations: {
          isNumeric: true,
        },
        validationErrors: {
          isNumeric: '请输入有效的数字',
          required: '请输入数字',
        },
      },
      date: {
        validationErrors: {
          required: '请选择日期',
        },
      },
      datetime: {
        validationErrors: {
          required: '请选择日期时间',
        },
      },
    };
  }

  // 增强表单字段
  enhanceFormField(field: any, fieldType?: string): any {
    const validationConfig = this.getValidationConfig();
    
    // 根据字段名称或类型应用验证规则
    const fieldName = field.name;
    if (validationConfig[fieldName]) {
      return {
        ...field,
        ...validationConfig[fieldName],
      };
    }
    
    if (fieldType && validationConfig[fieldType]) {
      return {
        ...field,
        ...validationConfig[fieldType],
      };
    }
    
    return field;
  }

  // 创建增强的输入字段
  createInputField(config: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    validationType?: string;
  }) {
    const baseField = {
      type: config.type || 'input-text',
      name: config.name,
      label: config.label,
      required: config.required || false,
      placeholder: config.placeholder || `请输入${config.label}`,
    };

    return this.enhanceFormField(baseField, config.validationType || config.name);
  }

  // 创建增强的文本域字段
  createTextareaField(config: {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    rows?: number;
  }) {
    const baseField = {
      type: 'textarea',
      name: config.name,
      label: config.label,
      required: config.required || false,
      placeholder: config.placeholder || `请输入${config.label}`,
      rows: config.rows || 4,
      showCounter: true,
    };

    return this.enhanceFormField(baseField, 'description');
  }

  // 创建增强的选择字段
  createSelectField(config: {
    name: string;
    label: string;
    required?: boolean;
    options: Array<{ label: string; value: any }>;
    multiple?: boolean;
  }) {
    return {
      type: 'select',
      name: config.name,
      label: config.label,
      required: config.required || false,
      multiple: config.multiple || false,
      options: config.options,
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建日期选择器字段
  createDateField(config: {
    name: string;
    label: string;
    required?: boolean;
    format?: string;
    placeholder?: string;
  }) {
    return {
      type: 'input-date',
      name: config.name,
      label: config.label,
      required: config.required || false,
      format: config.format || 'YYYY-MM-DD',
      placeholder: config.placeholder || `请选择${config.label}`,
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建日期时间选择器字段
  createDateTimeField(config: {
    name: string;
    label: string;
    required?: boolean;
    format?: string;
    placeholder?: string;
  }) {
    return {
      type: 'input-datetime',
      name: config.name,
      label: config.label,
      required: config.required || false,
      format: config.format || 'YYYY-MM-DD HH:mm:ss',
      placeholder: config.placeholder || `请选择${config.label}`,
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建数字输入字段
  createNumberField(config: {
    name: string;
    label: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    placeholder?: string;
  }) {
    const field = {
      type: 'input-number',
      name: config.name,
      label: config.label,
      required: config.required || false,
      placeholder: config.placeholder || `请输入${config.label}`,
      validationErrors: {
        required: `请输入${config.label}`,
      },
    } as any;

    if (config.min !== undefined) field.min = config.min;
    if (config.max !== undefined) field.max = config.max;
    if (config.step !== undefined) field.step = config.step;
    if (config.precision !== undefined) field.precision = config.precision;

    return this.enhanceFormField(field, 'number');
  }

  // 创建文件上传字段
  createFileUploadField(config: {
    name: string;
    label: string;
    required?: boolean;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    crop?: boolean;
  }) {
    return {
      type: 'input-file',
      name: config.name,
      label: config.label,
      required: config.required || false,
      accept: config.accept || '*',
      multiple: config.multiple || false,
      maxSize: config.maxSize || 2097152, // 2MB
      crop: config.crop || false,
      receiver: '/api/upload',
      validationErrors: {
        required: `请上传${config.label}`,
      },
    };
  }

  // 创建富文本编辑器字段
  createRichTextEditor(config: {
    name: string;
    label: string;
    required?: boolean;
    height?: number;
    placeholder?: string;
  }) {
    return {
      type: 'input-rich-text',
      name: config.name,
      label: config.label,
      required: config.required || false,
      height: config.height || 300,
      placeholder: config.placeholder || `请输入${config.label}`,
      options: {
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar: [
          'undo redo | formatselect | bold italic backcolor',
          'alignleft aligncenter alignright alignjustify',
          'bullist numlist outdent indent | removeformat | help',
        ].join(' | '),
      },
      validationErrors: {
        required: `请输入${config.label}`,
      },
    };
  }

  // 创建树形选择器字段
  createTreeSelectField(config: {
    name: string;
    label: string;
    required?: boolean;
    multiple?: boolean;
    cascade?: boolean;
    options?: any[];
    source?: string;
  }) {
    return {
      type: 'tree-select',
      name: config.name,
      label: config.label,
      required: config.required || false,
      multiple: config.multiple || false,
      cascade: config.cascade || true,
      options: config.options || [],
      source: config.source,
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建标签输入字段
  createTagsField(config: {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    max?: number;
    options?: Array<{ label: string; value: any }>;
  }) {
    return {
      type: 'input-tag',
      name: config.name,
      label: config.label,
      required: config.required || false,
      placeholder: config.placeholder || `请输入${config.label}`,
      max: config.max,
      options: config.options || [],
      validationErrors: {
        required: `请输入${config.label}`,
      },
    };
  }

  // 创建颜色选择器字段
  createColorField(config: {
    name: string;
    label: string;
    required?: boolean;
    format?: string;
    presetColors?: string[];
  }) {
    return {
      type: 'input-color',
      name: config.name,
      label: config.label,
      required: config.required || false,
      format: config.format || 'hex',
      presetColors: config.presetColors || [
        '#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14',
        '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb',
        '#722ed1', '#eb2f96'
      ],
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建评分字段
  createRatingField(config: {
    name: string;
    label: string;
    required?: boolean;
    count?: number;
    half?: boolean;
  }) {
    return {
      type: 'input-rating',
      name: config.name,
      label: config.label,
      required: config.required || false,
      count: config.count || 5,
      half: config.half || false,
      validationErrors: {
        required: `请选择${config.label}`,
      },
    };
  }

  // 创建开关字段
  createSwitchField(config: {
    name: string;
    label: string;
    onText?: string;
    offText?: string;
    onValue?: any;
    offValue?: any;
  }) {
    return {
      type: 'switch',
      name: config.name,
      label: config.label,
      onText: config.onText || '开启',
      offText: config.offText || '关闭',
      onValue: config.onValue !== undefined ? config.onValue : true,
      offValue: config.offValue !== undefined ? config.offValue : false,
    };
  }

  // 生成带错误处理的API配置
  generateApiWithErrorHandling(url: string, method: string = 'GET') {
    return {
      url,
      method,
      responseType: 'json',
      // 请求拦截器
      requestAdaptor: `
        api.config = api.config || {};
        api.config.withCredentials = true;
        return api;
      `,
      // 响应适配器
      adaptor: `
        if (payload.status !== 0) {
          // 处理业务错误
          return {
            status: payload.status || 1,
            msg: payload.message || payload.msg || '操作失败',
            data: payload.data
          };
        }
        
        // 成功响应
        return {
          status: 0,
          msg: payload.message || '操作成功',
          data: payload.data
        };
      `,
    };
  }

  // 生成全局错误提示配置
  generateGlobalErrorConfig() {
    return {
      // 全局错误处理
      errorMessage: {
        timeout: '请求超时，请稍后重试',
        network: '网络连接异常，请检查网络设置',
        server: '服务器错误，请联系管理员',
        permission: '权限不足，无法执行此操作',
      },
      // 表单验证错误样式
      validateErrorStyle: {
        color: '#f5222d',
        fontSize: '12px',
        marginTop: '4px',
      },
    };
  }
}
