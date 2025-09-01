# 代码生成引擎设计文档

## 1. 概述

本文档描述了基于元数据的代码生成引擎设计，支持从DDD和COLA元数据自动生成后端代码、前端代码和数据库脚本。

## 2. 整体架构

### 2.1 架构组件

```
┌─────────────────────────────────────────────────────────────┐
│                    代码生成引擎                              │
├─────────────────────────────────────────────────────────────┤
│                    模板引擎                                 │
├─────────────────────────────────────────────────────────────┤
│                    元数据解析器                             │
├─────────────────────────────────────────────────────────────┤
│                    代码生成器                               │
├─────────────────────────────────────────────────────────────┤
│                    代码后处理器                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心功能

- **后端代码生成**: Controller、Service、Repository、Entity等
- **前端代码生成**: Vue组件、表单、表格、图表等
- **数据库脚本生成**: 建表语句、索引、约束等
- **配置文件生成**: 应用配置、依赖配置等

## 3. 后端代码生成

### 3.1 Controller生成

```java
@Component
public class ControllerGenerator {
    
    /**
     * 生成Controller类
     */
    public String generateController(AggregateMetadata aggregate) {
        // 解析聚合元数据
        // 生成类定义
        // 生成字段和方法
        // 生成注解
        // 返回生成的代码
    }
    
    /**
     * 生成CRUD方法
     */
    private String generateCrudMethods(AggregateMetadata aggregate) {
        // 生成创建方法
        // 生成查询方法
        // 生成更新方法
        // 生成删除方法
        // 生成分页查询方法
    }
    
    /**
     * 生成业务方法
     */
    private String generateBusinessMethods(AggregateMetadata aggregate) {
        // 获取领域服务
        // 生成对应的Controller方法
        // 生成参数验证
        // 生成返回值处理
    }
}
```

### 3.2 Service生成

```java
@Component
public class ServiceGenerator {
    
    /**
     * 生成Service接口
     */
    public String generateServiceInterface(AggregateMetadata aggregate) {
        // 生成接口定义
        // 生成方法签名
        // 生成注解
    }
    
    /**
     * 生成Service实现
     */
    public String generateServiceImplementation(AggregateMetadata aggregate) {
        // 生成类定义
        // 生成依赖注入
        // 生成方法实现
        // 生成事务管理
    }
    
    /**
     * 生成领域服务方法
     */
    private String generateDomainServiceMethods(AggregateMetadata aggregate) {
        // 获取领域服务元数据
        // 生成方法实现
        // 生成业务逻辑
        // 生成事件发布
    }
}
```

### 3.3 Repository生成

```java
@Component
public class RepositoryGenerator {
    
    /**
     * 生成Repository接口
     */
    public String generateRepositoryInterface(AggregateMetadata aggregate) {
        // 生成接口定义
        // 生成基础CRUD方法
        // 生成自定义查询方法
        // 生成分页和排序方法
    }
    
    /**
     * 生成Repository实现
     */
    public String generateRepositoryImplementation(AggregateMetadata aggregate) {
        // 生成类定义
        // 生成MyBatis映射
        // 生成查询方法实现
        // 生成缓存配置
    }
    
    /**
     * 生成查询方法
     */
    private String generateQueryMethods(AggregateMetadata aggregate) {
        // 分析实体属性
        // 生成常用查询方法
        // 生成复杂查询方法
        // 生成统计查询方法
    }
}
```

### 3.4 Entity生成

```java
@Component
public class EntityGenerator {
    
    /**
     * 生成Entity类
     */
    public String generateEntity(EntityMetadata entity) {
        // 生成类定义
        // 生成字段
        // 生成注解
        // 生成getter/setter
        // 生成业务方法
    }
    
    /**
     * 生成值对象
     */
    public String generateValueObject(ValueObjectMetadata valueObject) {
        // 生成不可变类
        // 生成equals和hashCode
        // 生成验证逻辑
        // 生成转换方法
    }
    
    /**
     * 生成聚合根
     */
    public String generateAggregateRoot(AggregateMetadata aggregate) {
        // 生成聚合根类
        // 生成聚合边界
        // 生成业务规则
        // 生成事件发布
    }
}
```

## 4. 前端代码生成

### 4.1 Vue组件生成

```typescript
class VueComponentGenerator {
    
    /**
     * 生成Vue组件
     */
    generateComponent(componentMetadata: ComponentMetadata): string {
        // 生成组件模板
        // 生成组件脚本
        // 生成组件样式
        // 返回完整组件代码
    }
    
    /**
     * 生成表单组件
     */
    generateFormComponent(formMetadata: FormMetadata): string {
        // 解析表单元数据
        // 生成表单字段
        // 生成验证规则
        // 生成提交逻辑
    }
    
    /**
     * 生成表格组件
     */
    generateTableComponent(tableMetadata: TableMetadata): string {
        // 解析表格元数据
        // 生成表格列
        // 生成分页组件
        // 生成操作按钮
    }
    
    /**
     * 生成图表组件
     */
    generateChartComponent(chartMetadata: ChartMetadata): string {
        // 解析图表元数据
        // 选择图表库
        // 生成图表配置
        // 生成数据绑定
    }
}
```

### 4.2 页面生成

```typescript
class PageGenerator {
    
    /**
     * 生成列表页面
     */
    generateListPage(pageMetadata: PageMetadata): string {
        // 生成页面布局
        // 生成搜索表单
        // 生成数据表格
        // 生成操作按钮
        // 生成分页组件
    }
    
    /**
     * 生成详情页面
     */
    generateDetailPage(pageMetadata: PageMetadata): string {
        // 生成页面布局
        // 生成信息展示
        // 生成操作按钮
        // 生成相关数据
    }
    
    /**
     * 生成编辑页面
     */
    generateEditPage(pageMetadata: PageMetadata): string {
        // 生成页面布局
        // 生成编辑表单
        // 生成验证规则
        // 生成提交逻辑
    }
}
```

### 4.3 路由生成

```typescript
class RouterGenerator {
    
    /**
     * 生成路由配置
     */
    generateRouter(moduleMetadata: ModuleMetadata): string {
        // 生成路由定义
        // 生成路由守卫
        // 生成懒加载配置
        // 返回路由配置
    }
    
    /**
     * 生成菜单配置
     */
    generateMenu(moduleMetadata: ModuleMetadata): string {
        // 生成菜单结构
        // 生成权限控制
        // 生成图标配置
        // 返回菜单配置
    }
}
```

## 5. 数据库脚本生成

### 5.1 表结构生成

```java
@Component
public class DatabaseScriptGenerator {
    
    /**
     * 生成建表语句
     */
    public String generateCreateTable(EntityMetadata entity) {
        // 解析实体元数据
        // 生成字段定义
        // 生成主键约束
        // 生成索引
        // 生成注释
    }
    
    /**
     * 生成索引语句
     */
    public String generateIndexes(EntityMetadata entity) {
        // 分析查询需求
        // 生成单列索引
        // 生成复合索引
        // 生成唯一索引
    }
    
    /**
     * 生成外键约束
     */
    public String generateForeignKeys(AggregateMetadata aggregate) {
        // 分析实体关系
        // 生成外键约束
        // 生成级联规则
        // 生成索引
    }
}
```

### 5.2 数据迁移脚本

```java
@Component
public class MigrationScriptGenerator {
    
    /**
     * 生成升级脚本
     */
    public String generateUpgradeScript(VersionMetadata fromVersion, VersionMetadata toVersion) {
        // 分析版本差异
        // 生成字段变更
        // 生成表变更
        // 生成数据迁移
    }
    
    /**
     * 生成回滚脚本
     */
    public String generateRollbackScript(VersionMetadata fromVersion, VersionMetadata toVersion) {
        // 生成反向操作
        // 生成数据恢复
        // 生成结构恢复
    }
}
```

## 6. 模板引擎

### 6.1 模板定义

```java
@Component
public class TemplateEngine {
    
    /**
     * 渲染模板
     */
    public String renderTemplate(String templateName, Map<String, Object> context) {
        // 加载模板
        // 解析变量
        // 执行逻辑
        // 返回结果
    }
    
    /**
     * 注册模板
     */
    public void registerTemplate(String name, String template) {
        // 验证模板语法
        // 注册模板
        // 缓存模板
    }
}
```

### 6.2 模板示例

#### Controller模板

```freemarker
package ${packageName}.controller;

import ${packageName}.service.${entityName}Service;
import ${packageName}.dal.dataobject.${entityName}DO;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/${entityName?lower_case}")
public class ${entityName}Controller {
    
    @Resource
    private ${entityName}Service ${entityName?uncap_first}Service;
    
    @PostMapping
    public ${entityName}DO create(@RequestBody ${entityName}DO ${entityName?uncap_first}) {
        return ${entityName?uncap_first}Service.create${entityName}(${entityName?uncap_first});
    }
    
    @GetMapping("/{id}")
    public ${entityName}DO get(@PathVariable Long id) {
        return ${entityName?uncap_first}Service.get${entityName}(id);
    }
    
    @PutMapping("/{id}")
    public ${entityName}DO update(@PathVariable Long id, @RequestBody ${entityName}DO ${entityName?uncap_first}) {
        ${entityName?uncap_first}.setId(id);
        return ${entityName?uncap_first}Service.update${entityName}(${entityName?uncap_first});
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ${entityName?uncap_first}Service.delete${entityName}(id);
    }
    
    @GetMapping
    public List<${entityName}DO> list(@RequestParam(required = false) String name) {
        return ${entityName?uncap_first}Service.list${entityName}s(name);
    }
}
```

#### Vue组件模板

```vue
<template>
  <div class="${componentName}">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <#list fields as field>
      <el-form-item label="${field.label}" prop="${field.name}">
        <#if field.type == "string">
        <el-input v-model="form.${field.name}" placeholder="请输入${field.label}"></el-input>
        <#elseif field.type == "number">
        <el-input-number v-model="form.${field.name}" placeholder="请输入${field.label}"></el-input-number>
        <#elseif field.type == "date">
        <el-date-picker v-model="form.${field.name}" type="date" placeholder="选择日期"></el-date-picker>
        <#elseif field.type == "select">
        <el-select v-model="form.${field.name}" placeholder="请选择${field.label}">
          <el-option v-for="item in ${field.name}Options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </#if>
      </el-form-item>
      </#list>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      form: {
        <#list fields as field>
        ${field.name}: ${field.defaultValue},
        </#list>
      },
      rules: {
        <#list fields as field>
        <#if field.required>
        ${field.name}: [
          { required: true, message: '请输入${field.label}', trigger: 'blur' }
        ],
        </#if>
        </#list>
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 提交表单逻辑
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
}
</script>
```

## 7. 代码后处理

### 7.1 代码格式化

```java
@Component
public class CodeFormatter {
    
    /**
     * 格式化Java代码
     */
    public String formatJavaCode(String code) {
        // 使用Google Java Format
        // 格式化代码
        // 返回格式化后的代码
    }
    
    /**
     * 格式化TypeScript代码
     */
    public String formatTypeScriptCode(String code) {
        // 使用Prettier
        // 格式化代码
        // 返回格式化后的代码
    }
}
```

### 7.2 代码验证

```java
@Component
public class CodeValidator {
    
    /**
     * 验证Java代码
     */
    public ValidationResult validateJavaCode(String code) {
        // 编译检查
        // 语法检查
        // 返回验证结果
    }
    
    /**
     * 验证TypeScript代码
     */
    public ValidationResult validateTypeScriptCode(String code) {
        // 类型检查
        // 语法检查
        // 返回验证结果
    }
}
```

## 8. 配置管理

### 8.1 生成配置

```yaml
codeGenerator:
  backend:
    packageName: "cn.iocoder.yudao.module"
    templatePath: "templates/backend"
    outputPath: "generated/backend"
    formatters:
      - "java"
      - "xml"
    validators:
      - "java"
      - "xml"
  
  frontend:
    templatePath: "templates/frontend"
    outputPath: "generated/frontend"
    formatters:
      - "typescript"
      - "vue"
      - "css"
    validators:
      - "typescript"
      - "vue"
  
  database:
    templatePath: "templates/database"
    outputPath: "generated/database"
    dialect: "mysql"
    formatters:
      - "sql"
```

### 8.2 模板配置

```yaml
templates:
  backend:
    controller:
      template: "controller.ftl"
      output: "controller/{EntityName}Controller.java"
    service:
      template: "service.ftl"
      output: "service/{EntityName}Service.java"
    repository:
      template: "repository.ftl"
      output: "repository/{EntityName}Repository.java"
    entity:
      template: "entity.ftl"
      output: "entity/{EntityName}.java"
  
  frontend:
    component:
      template: "component.ftl"
      output: "components/{ComponentName}.vue"
    page:
      template: "page.ftl"
      output: "pages/{PageName}.vue"
    router:
      template: "router.ftl"
      output: "router/{ModuleName}.ts"
```

## 9. 扩展机制

### 9.1 自定义模板

```java
@Component
public class CustomTemplateProvider {
    
    /**
     * 注册自定义模板
     */
    public void registerCustomTemplate(String name, String template) {
        // 注册模板
        // 验证语法
        // 缓存模板
    }
    
    /**
     * 获取自定义模板
     */
    public String getCustomTemplate(String name) {
        // 查找模板
        // 返回模板内容
    }
}
```

### 9.2 自定义生成器

```java
public interface CustomGenerator {
    
    /**
     * 生成代码
     */
    String generate(GenerationContext context);
    
    /**
     * 获取支持的类型
     */
    Set<String> getSupportedTypes();
}

@Component
public class CustomCodeGenerator {
    
    private Map<String, CustomGenerator> generators = new HashMap<>();
    
    /**
     * 注册自定义生成器
     */
    public void registerGenerator(String type, CustomGenerator generator) {
        generators.put(type, generator);
    }
    
    /**
     * 执行自定义生成
     */
    public String generateCustomCode(String type, GenerationContext context) {
        CustomGenerator generator = generators.get(type);
        if (generator != null) {
            return generator.generate(context);
        }
        throw new UnsupportedOperationException("Unsupported generator type: " + type);
    }
}
```

## 10. 性能优化

### 10.1 模板缓存

- **模板预编译**: 预编译模板，提高渲染性能
- **结果缓存**: 缓存生成结果，避免重复生成
- **增量生成**: 只生成变更的部分

### 10.2 并行生成

- **多线程生成**: 并行生成不同类型的代码
- **任务队列**: 使用任务队列管理生成任务
- **异步生成**: 支持异步代码生成

### 10.3 资源管理

- **内存优化**: 优化内存使用，避免内存泄漏
- **文件管理**: 优化文件I/O操作
- **网络优化**: 优化网络传输性能
