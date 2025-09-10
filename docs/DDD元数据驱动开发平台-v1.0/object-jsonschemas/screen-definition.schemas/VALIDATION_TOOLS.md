# 🔍 屏幕定义Schema验证工具

本文档提供了用于验证和测试屏幕定义Schema的工具和方法。

## 📋 验证清单

### 1. 基础结构验证
- [ ] Schema文件格式正确(JSON格式)
- [ ] 包含必需的顶级属性: `id`, `name`, `type`, `category`
- [ ] `type`值在允许的枚举范围内
- [ ] `category`值在允许的枚举范围内

### 2. 字段定义验证
- [ ] 所有字段都有唯一的`id`和`name`
- [ ] 字段`type`在支持的类型范围内
- [ ] 必填字段设置了`validation.required: true`
- [ ] 数据类型与字段类型匹配

### 3. 布局配置验证
- [ ] `formLayout.columns`值合理(1-12)
- [ ] 字段`span`值不超过总列数
- [ ] 响应式配置的断点值递增
- [ ] 布局规则优先级设置合理

### 4. 验证规则检查
- [ ] 正则表达式语法正确
- [ ] 数值范围合理(`min` <= `max`)
- [ ] 字符串长度合理(`minLength` <= `maxLength`)
- [ ] 自定义验证器存在

## 🛠️ 验证工具脚本

### Node.js验证脚本
```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

// 初始化AJV验证器
const ajv = new Ajv({ strict: false });
addFormats(ajv);

// 加载Schema文件
const screenSchema = JSON.parse(fs.readFileSync('./screen.schema.json', 'utf8'));
const fieldSchema = JSON.parse(fs.readFileSync('./field-definition.schema.json', 'utf8'));
const layoutSchema = JSON.parse(fs.readFileSync('./form-layout.schema.json', 'utf8'));

// 添加Schema到验证器
ajv.addSchema(screenSchema, 'screen');
ajv.addSchema(fieldSchema, 'field');
ajv.addSchema(layoutSchema, 'layout');

/**
 * 验证屏幕定义
 * @param {Object} screenDefinition - 屏幕定义对象
 * @returns {Object} 验证结果
 */
function validateScreenDefinition(screenDefinition) {
  const validate = ajv.getSchema('screen');
  const valid = validate(screenDefinition);
  
  return {
    valid,
    errors: validate.errors || [],
    warnings: getWarnings(screenDefinition)
  };
}

/**
 * 获取警告信息
 * @param {Object} screenDefinition - 屏幕定义对象
 * @returns {Array} 警告列表
 */
function getWarnings(screenDefinition) {
  const warnings = [];
  
  // 检查字段命名规范
  if (screenDefinition.fields) {
    screenDefinition.fields.forEach(field => {
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) {
        warnings.push({
          type: 'naming',
          field: field.name,
          message: '字段名应使用驼峰命名法'
        });
      }
    });
  }
  
  // 检查布局合理性
  if (screenDefinition.formLayout) {
    const layout = screenDefinition.formLayout;
    if (layout.columns > 4) {
      warnings.push({
        type: 'layout',
        message: '建议列数不超过4列以保证用户体验'
      });
    }
  }
  
  // 检查必填字段
  if (screenDefinition.fields) {
    const requiredFields = screenDefinition.fields.filter(f => 
      f.validation && f.validation.required
    );
    if (requiredFields.length === 0) {
      warnings.push({
        type: 'validation',
        message: '建议至少有一个必填字段'
      });
    }
  }
  
  return warnings;
}

/**
 * 批量验证屏幕定义文件
 * @param {string} directoryPath - 目录路径
 */
function validateDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const results = [];
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(`${directoryPath}/${file}`, 'utf8'));
        const result = validateScreenDefinition(content);
        results.push({
          file,
          ...result
        });
      } catch (error) {
        results.push({
          file,
          valid: false,
          errors: [{ message: `JSON解析错误: ${error.message}` }],
          warnings: []
        });
      }
    }
  });
  
  return results;
}

// 导出验证函数
module.exports = {
  validateScreenDefinition,
  validateDirectory,
  getWarnings
};

// 如果直接运行此脚本
if (require.main === module) {
  const screenDef = require('./examples/user-edit-form.json');
  const result = validateScreenDefinition(screenDef);
  
  console.log('验证结果:', result.valid ? '通过' : '失败');
  if (result.errors.length > 0) {
    console.log('错误:', result.errors);
  }
  if (result.warnings.length > 0) {
    console.log('警告:', result.warnings);
  }
}
```

### Python验证脚本
```python
import json
import jsonschema
from pathlib import Path
import re

class ScreenDefinitionValidator:
    def __init__(self, schema_dir):
        self.schema_dir = Path(schema_dir)
        self.schemas = self._load_schemas()
    
    def _load_schemas(self):
        """加载所有Schema文件"""
        schemas = {}
        schema_files = {
            'screen': 'screen.schema.json',
            'field': 'field-definition.schema.json',
            'layout': 'form-layout.schema.json'
        }
        
        for name, filename in schema_files.items():
            with open(self.schema_dir / filename, 'r', encoding='utf-8') as f:
                schemas[name] = json.load(f)
        
        return schemas
    
    def validate(self, screen_definition):
        """验证屏幕定义"""
        try:
            jsonschema.validate(screen_definition, self.schemas['screen'])
            return {
                'valid': True,
                'errors': [],
                'warnings': self._get_warnings(screen_definition)
            }
        except jsonschema.ValidationError as e:
            return {
                'valid': False,
                'errors': [{'message': str(e), 'path': list(e.path)}],
                'warnings': []
            }
    
    def _get_warnings(self, screen_definition):
        """获取警告信息"""
        warnings = []
        
        # 检查字段命名
        if 'fields' in screen_definition:
            for field in screen_definition['fields']:
                if not re.match(r'^[a-zA-Z][a-zA-Z0-9_]*$', field.get('name', '')):
                    warnings.append({
                        'type': 'naming',
                        'field': field.get('name'),
                        'message': '字段名应使用驼峰命名法'
                    })
        
        # 检查布局配置
        if 'formLayout' in screen_definition:
            layout = screen_definition['formLayout']
            if layout.get('columns', 0) > 4:
                warnings.append({
                    'type': 'layout',
                    'message': '建议列数不超过4列'
                })
        
        return warnings
    
    def validate_file(self, file_path):
        """验证单个文件"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = json.load(f)
            return self.validate(content)
        except Exception as e:
            return {
                'valid': False,
                'errors': [{'message': f'文件读取错误: {str(e)}'}],
                'warnings': []
            }
    
    def validate_directory(self, directory_path):
        """批量验证目录下的文件"""
        directory = Path(directory_path)
        results = []
        
        for json_file in directory.glob('*.json'):
            result = self.validate_file(json_file)
            result['file'] = json_file.name
            results.append(result)
        
        return results

# 使用示例
if __name__ == '__main__':
    validator = ScreenDefinitionValidator('./schemas')
    
    # 验证单个文件
    result = validator.validate_file('./examples/user-edit-form.json')
    print(f"验证结果: {'通过' if result['valid'] else '失败'}")
    
    if result['errors']:
        print("错误:", result['errors'])
    if result['warnings']:
        print("警告:", result['warnings'])
```

## 🧪 测试用例

### 基础验证测试
```json
{
  "name": "基础结构测试",
  "tests": [
    {
      "description": "缺少必需字段",
      "input": {
        "name": "测试屏幕"
      },
      "expected": {
        "valid": false,
        "errorCount": 3
      }
    },
    {
      "description": "无效的屏幕类型",
      "input": {
        "id": "test",
        "name": "测试",
        "type": "INVALID_TYPE",
        "category": "BUSINESS"
      },
      "expected": {
        "valid": false,
        "errorCount": 1
      }
    }
  ]
}
```

### 字段验证测试
```json
{
  "name": "字段验证测试", 
  "tests": [
    {
      "description": "重复的字段ID",
      "input": {
        "id": "test",
        "name": "测试",
        "type": "EDIT_PAGE",
        "category": "BUSINESS",
        "fields": [
          {
            "id": "field1",
            "name": "name1",
            "type": "TEXT"
          },
          {
            "id": "field1",
            "name": "name2", 
            "type": "TEXT"
          }
        ]
      },
      "expected": {
        "valid": false,
        "warningCount": 1
      }
    }
  ]
}
```

## 📊 验证报告模板

### HTML报告模板
```html
<!DOCTYPE html>
<html>
<head>
    <title>屏幕定义验证报告</title>
    <style>
        .pass { color: green; }
        .fail { color: red; }
        .warning { color: orange; }
        .summary { background: #f5f5f5; padding: 10px; margin: 10px 0; }
        .error-detail { background: #ffeaea; padding: 5px; margin: 5px 0; }
        .warning-detail { background: #fff3cd; padding: 5px; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>屏幕定义验证报告</h1>
    
    <div class="summary">
        <h2>验证摘要</h2>
        <p>总文件数: {{totalFiles}}</p>
        <p class="pass">通过: {{passCount}}</p>
        <p class="fail">失败: {{failCount}}</p>
        <p class="warning">警告: {{warningCount}}</p>
    </div>
    
    <div class="details">
        <h2>详细结果</h2>
        {{#each files}}
        <div class="file-result">
            <h3>{{file}} <span class="{{status}}">{{statusText}}</span></h3>
            
            {{#if errors}}
            <div class="errors">
                <h4>错误:</h4>
                {{#each errors}}
                <div class="error-detail">{{message}}</div>
                {{/each}}
            </div>
            {{/if}}
            
            {{#if warnings}}
            <div class="warnings">
                <h4>警告:</h4>
                {{#each warnings}}
                <div class="warning-detail">{{message}}</div>
                {{/each}}
            </div>
            {{/if}}
        </div>
        {{/each}}
    </div>
</body>
</html>
```

## 🚀 持续集成配置

### GitHub Actions
```yaml
name: Schema Validation

on:
  push:
    paths:
      - 'schemas/**/*.json'
      - 'examples/**/*.json'
  pull_request:
    paths:
      - 'schemas/**/*.json'
      - 'examples/**/*.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        npm install ajv ajv-formats
    
    - name: Validate schemas
      run: |
        node validate-schemas.js
    
    - name: Generate report
      run: |
        node generate-report.js > validation-report.html
    
    - name: Upload report
      uses: actions/upload-artifact@v2
      with:
        name: validation-report
        path: validation-report.html
```

## 💡 最佳实践

### 1. 验证频率
- **开发阶段**: 每次保存后自动验证
- **提交前**: 完整验证所有相关文件
- **CI/CD**: 自动化验证所有Schema文件

### 2. 错误处理
- **致命错误**: 阻止部署，必须修复
- **警告**: 记录日志，建议修复
- **提示**: 代码风格建议

### 3. 性能优化
- 缓存编译后的Schema
- 批量验证时并行处理
- 只验证变更的文件

### 4. 团队协作
- 统一的验证规则配置
- 清晰的错误信息
- 详细的修复建议

这套验证工具帮助确保屏幕定义的质量和一致性，减少运行时错误，提高开发效率。
