#!/usr/bin/env node

/**
 * DDD元数据驱动开发平台 - Schema验证工具
 * 用于验证所有DDD Schema文件的完整性和一致性
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class DDDSchemaValidator {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);
    
    this.schemas = {};
    this.validationResults = [];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 加载所有Schema文件
   */
  loadSchemas() {
    const schemaDir = path.join(__dirname);
    const schemaFiles = [
      'ubiquitous-language.schema.json',
      'strategic-design.schema.json',
      'tactical-design.schema.json',
      'implementation-mapping.schema.json',
      'data-transfer-objects.schema.json',
      'amis-screen-definition.schema.json',
      'screen-definition.schema.json',
      'root.schema.json'
    ];

    console.log('📁 加载Schema文件...');
    
    schemaFiles.forEach(file => {
      const filePath = path.join(schemaDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const schemaName = path.basename(file, '.schema.json');
          this.schemas[schemaName] = schema;
          console.log(`✅ 已加载: ${file}`);
        } catch (error) {
          console.error(`❌ 加载失败: ${file}`, error.message);
          this.errors.push(`Schema加载失败: ${file} - ${error.message}`);
        }
      } else {
        console.error(`❌ 文件不存在: ${file}`);
        this.errors.push(`Schema文件不存在: ${file}`);
      }
    });
  }

  /**
   * 验证Schema语法
   */
  validateSchemaSyntax() {
    console.log('\n🔍 验证Schema语法...');
    
    Object.entries(this.schemas).forEach(([name, schema]) => {
      try {
        this.ajv.compile(schema);
        console.log(`✅ ${name}: Schema语法正确`);
      } catch (error) {
        console.error(`❌ ${name}: Schema语法错误`, error.message);
        this.errors.push(`Schema语法错误: ${name} - ${error.message}`);
      }
    });
  }

  /**
   * 验证Schema版本一致性
   */
  validateVersionConsistency() {
    console.log('\n📋 验证Schema版本一致性...');
    
    const versions = new Set();
    Object.entries(this.schemas).forEach(([name, schema]) => {
      if (schema.version) {
        versions.add(schema.version);
        console.log(`📌 ${name}: ${schema.version}`);
      }
    });

    if (versions.size > 1) {
      const warning = `发现多个Schema版本: ${Array.from(versions).join(', ')}`;
      console.warn(`⚠️  ${warning}`);
      this.warnings.push(warning);
    } else {
      console.log(`✅ 所有Schema版本一致: ${Array.from(versions)[0]}`);
    }
  }

  /**
   * 验证Schema引用完整性
   */
  validateReferences() {
    console.log('\n🔗 验证Schema引用完整性...');
    
    Object.entries(this.schemas).forEach(([name, schema]) => {
      this.checkReferences(schema, name);
    });
  }

  /**
   * 递归检查引用
   */
  checkReferences(obj, schemaName, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === '$ref' && typeof value === 'string') {
          this.validateReference(value, schemaName, currentPath);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            this.checkReferences(item, schemaName, `${currentPath}[${index}]`);
          });
        } else if (typeof value === 'object') {
          this.checkReferences(value, schemaName, currentPath);
        }
      });
    }
  }

  /**
   * 验证单个引用
   */
  validateReference(ref, schemaName, path) {
    if (ref.startsWith('#/')) {
      // 内部引用
      const schema = this.schemas[schemaName];
      if (schema) {
        const refPath = ref.substring(2).split('/');
        let target = schema;
        
        for (const part of refPath) {
          if (target && target[part] !== undefined) {
            target = target[part];
          } else {
            const error = `引用不存在: ${schemaName}${path} -> ${ref}`;
            console.error(`❌ ${error}`);
            this.errors.push(error);
            return;
          }
        }
      }
    } else if (ref.startsWith('./')) {
      // 外部文件引用
      const refFile = ref.substring(2);
      const refName = path.basename(refFile, '.schema.json');
      
      if (!this.schemas[refName]) {
        const error = `外部引用不存在: ${schemaName}${path} -> ${ref}`;
        console.error(`❌ ${error}`);
        this.errors.push(error);
      }
    }
  }

  /**
   * 验证ID命名规范
   */
  validateIdPatterns() {
    console.log('\n🏷️ 验证ID命名规范...');
    
    const idPatterns = {
      'domain_': '领域',
      'bc_': '限界上下文',
      'term_': '业务术语',
      'attr_': '业务属性',
      'rule_': '业务规则',
      'rel_': '术语关系',
      'agg_': '聚合',
      'entity_': '实体',
      'vo_': '值对象',
      'dto_': '数据传输对象',
      'mapping_': '映射关系',
      'screen_': '屏幕',
      'comp_': '组件',
      'field_': '字段',
      'action_': '操作',
      'event_': '事件',
      'validation_': '验证',
      'permission_': '权限',
      'theme_': '主题',
      'layout_': '布局'
    };

    Object.entries(this.schemas).forEach(([name, schema]) => {
      this.checkIdPatterns(schema, name, idPatterns);
    });
  }

  /**
   * 检查ID模式
   */
  checkIdPatterns(obj, schemaName, patterns, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'pattern' && typeof value === 'string') {
          this.validateIdPattern(value, schemaName, currentPath, patterns);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            this.checkIdPatterns(item, schemaName, patterns, `${currentPath}[${index}]`);
          });
        } else if (typeof value === 'object') {
          this.checkIdPatterns(value, schemaName, patterns, currentPath);
        }
      });
    }
  }

  /**
   * 验证ID模式
   */
  validateIdPattern(pattern, schemaName, path, expectedPatterns) {
    const patternName = pattern.replace(/[^a-zA-Z_]/g, '');
    if (expectedPatterns[patternName]) {
      console.log(`✅ ${schemaName}${path}: ${expectedPatterns[patternName]}模式正确`);
    } else {
      const warning = `未知的ID模式: ${schemaName}${path} -> ${pattern}`;
      console.warn(`⚠️  ${warning}`);
      this.warnings.push(warning);
    }
  }

  /**
   * 验证枚举值一致性
   */
  validateEnumConsistency() {
    console.log('\n📊 验证枚举值一致性...');
    
    const enumValues = {};
    
    Object.entries(this.schemas).forEach(([name, schema]) => {
      this.collectEnumValues(schema, name, enumValues);
    });

    // 检查相同名称的枚举是否一致
    Object.entries(enumValues).forEach(([enumName, values]) => {
      const uniqueValues = new Set(values.map(v => JSON.stringify(v)));
      if (uniqueValues.size > 1) {
        const warning = `枚举值不一致: ${enumName} - ${Array.from(uniqueValues).join(' vs ')}`;
        console.warn(`⚠️  ${warning}`);
        this.warnings.push(warning);
      } else {
        console.log(`✅ ${enumName}: 枚举值一致`);
      }
    });
  }

  /**
   * 收集枚举值
   */
  collectEnumValues(obj, schemaName, enumValues, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'enum' && Array.isArray(value)) {
          const enumName = currentPath.split('.').pop();
          if (!enumValues[enumName]) {
            enumValues[enumName] = [];
          }
          enumValues[enumName].push(value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            this.collectEnumValues(item, schemaName, enumValues, `${currentPath}[${index}]`);
          });
        } else if (typeof value === 'object') {
          this.collectEnumValues(value, schemaName, enumValues, currentPath);
        }
      });
    }
  }

  /**
   * 生成验证报告
   */
  generateReport() {
    console.log('\n📋 生成验证报告...');
    
    const report = {
      timestamp: new Date().toISOString(),
      totalSchemas: Object.keys(this.schemas).length,
      errors: this.errors.length,
      warnings: this.warnings.length,
      schemas: Object.keys(this.schemas),
      details: {
        errors: this.errors,
        warnings: this.warnings
      }
    };

    const reportFile = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`📄 验证报告已生成: ${reportFile}`);
    
    // 控制台输出摘要
    console.log('\n📊 验证摘要:');
    console.log(`📁 Schema文件数量: ${report.totalSchemas}`);
    console.log(`❌ 错误数量: ${report.errors}`);
    console.log(`⚠️ 警告数量: ${report.warnings}`);
    
    if (report.errors > 0) {
      console.log('\n❌ 错误详情:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (report.warnings > 0) {
      console.log('\n⚠️ 警告详情:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    if (report.errors === 0 && report.warnings === 0) {
      console.log('\n🎉 所有Schema验证通过！');
    } else if (report.errors === 0) {
      console.log('\n✅ Schema验证通过（有警告）');
    } else {
      console.log('\n❌ Schema验证失败');
    }
    
    return report;
  }

  /**
   * 运行完整验证
   */
  async run() {
    console.log('🚀 开始DDD Schema验证...\n');
    
    try {
      this.loadSchemas();
      this.validateSchemaSyntax();
      this.validateVersionConsistency();
      this.validateReferences();
      this.validateIdPatterns();
      this.validateEnumConsistency();
      
      const report = this.generateReport();
      return report;
    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error.message);
      this.errors.push(`验证过程错误: ${error.message}`);
      return this.generateReport();
    }
  }
}

/**
 * 验证项目元数据Schema
 */
async function validateProjectMetadata(projectMetadata) {
  try {
    const schema = await loadSchema('./project-metadata.schema.json');
    const result = await validate(schema, projectMetadata);
    
    if (result.valid) {
      console.log('✅ 项目元数据验证通过');
      return { valid: true, errors: [] };
    } else {
      console.log('❌ 项目元数据验证失败:');
      result.errors.forEach(error => {
        console.log(`  - ${error.instancePath}: ${error.message}`);
      });
      return { valid: false, errors: result.errors };
    }
  } catch (error) {
    console.error('❌ 项目元数据验证出错:', error.message);
    return { valid: false, errors: [{ message: error.message }] };
  }
}

/**
 * 验证所有Schema文件
 */
async function validateAllSchemas() {
  console.log('🔍 开始验证所有Schema文件...\n');
  
  const schemas = [
    { name: '项目元数据', file: './project-metadata.schema.json', example: './samples/project-metadata-example.json' },
    { name: '统一语言', file: './ubiquitous-language.schema.json', example: './samples/ubiquitous-language-example.json' },
    { name: '战略设计', file: './strategic-design.schema.json', example: './samples/strategic-design-example.json' },
    { name: '战术设计', file: './tactical-design.schema.json', example: './samples/tactical-design-example.json' },
    { name: '数据传输对象', file: './data-transfer-objects.schema.json', example: './samples/data-transfer-objects-example.json' },
    { name: '实现映射', file: './implementation-mapping.schema.json', example: './samples/implementation-mapping-example.json' },
    { name: '屏幕定义', file: './screen-definition.schema.json', example: './samples/screen-definition-example.json' },
    { name: 'amis屏幕定义', file: './amis-screen-definition.schema.json', example: './samples/amis-screen-definition-example.json' },
    { name: '根Schema', file: './root.schema.json', example: './samples/root-example.json' }
  ];
  
  let totalValid = 0;
  let totalInvalid = 0;
  
  for (const schema of schemas) {
    try {
      console.log(`📋 验证 ${schema.name} Schema...`);
      
      // 验证Schema文件本身
      const schemaContent = await fs.readFile(schema.file, 'utf8');
      const schemaObj = JSON.parse(schemaContent);
      
      if (schemaObj.$schema) {
        console.log(`  ✅ ${schema.name} Schema 格式正确`);
        totalValid++;
      } else {
        console.log(`  ❌ ${schema.name} Schema 缺少 $schema 字段`);
        totalInvalid++;
      }
      
      // 验证示例文件（如果存在）
      try {
        const exampleContent = await fs.readFile(schema.example, 'utf8');
        const exampleObj = JSON.parse(exampleContent);
        
        // 根据Schema类型选择验证方法
        let validationResult;
        switch (schema.name) {
          case '项目元数据':
            validationResult = await validateProjectMetadata(exampleObj);
            break;
          case '统一语言':
            validationResult = await validateUbiquitousLanguage(exampleObj);
            break;
          case '战略设计':
            validationResult = await validateStrategicDesign(exampleObj);
            break;
          case '战术设计':
            validationResult = await validateTacticalDesign(exampleObj);
            break;
          case '数据传输对象':
            validationResult = await validateDataTransferObjects(exampleObj);
            break;
          case '实现映射':
            validationResult = await validateImplementationMapping(exampleObj);
            break;
          case '屏幕定义':
            validationResult = await validateScreenDefinition(exampleObj);
            break;
          case 'amis屏幕定义':
            validationResult = await validateAmisScreenDefinition(exampleObj);
            break;
          case '根Schema':
            validationResult = await validateRootSchema(exampleObj);
            break;
          default:
            validationResult = { valid: true, errors: [] };
        }
        
        if (validationResult.valid) {
          console.log(`  ✅ ${schema.name} 示例验证通过`);
          totalValid++;
        } else {
          console.log(`  ❌ ${schema.name} 示例验证失败`);
          totalInvalid++;
        }
      } catch (error) {
        console.log(`  ⚠️  ${schema.name} 示例文件不存在或读取失败: ${error.message}`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${schema.name} Schema 验证失败: ${error.message}`);
      totalInvalid++;
    }
    
    console.log('');
  }
  
  console.log('📊 验证结果汇总:');
  console.log(`  ✅ 验证通过: ${totalValid}`);
  console.log(`  ❌ 验证失败: ${totalInvalid}`);
  console.log(`  📈 成功率: ${((totalValid / (totalValid + totalInvalid)) * 100).toFixed(1)}%`);
  
  return { totalValid, totalInvalid };
}

// 如果直接运行此脚本
if (require.main === module) {
  const validator = new DDDSchemaValidator();
  validator.run().then(report => {
    process.exit(report.errors > 0 ? 1 : 0);
  }).catch(error => {
    console.error('❌ 验证失败:', error.message);
    process.exit(1);
  });
}

module.exports = DDDSchemaValidator;
