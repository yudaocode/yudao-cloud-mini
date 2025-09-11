import { Provide, Singleton } from '@midwayjs/decorator';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import { DDDEntity } from '../entity/entity.entity';
import { Project } from '../entity/project.entity';

export interface CodeGenerationTemplate {
  name: string;
  type: 'backend' | 'frontend' | 'fullstack';
  language: string;
  framework: string;
  description: string;
  templatePath: string;
}

@Provide()
@Singleton()
export class CodeGenerationService {
  private readonly entityManager: EntityManager;

  constructor(private readonly dataSource: DataSource) {
    this.entityManager = dataSource.manager;
  }

  /**
   * 生成代码
   */
  async generateCode(
    projectId: string,
    entityIds: string[],
    templateType: string,
    outputPath: string
  ): Promise<string> {
    try {
      // 获取项目信息
      const project = await this.entityManager.findOne(Project, {
        where: { id: projectId },
        relations: ['domains', 'domains.boundedContexts', 'domains.boundedContexts.aggregates', 'domains.boundedContexts.aggregates.entities'],
      });

      if (!project) {
        throw new Error(`Project not found: ${projectId}`);
      }

      // 获取实体信息
      const entities = await this.entityManager.find(DDDEntity, {
        where: entityIds.map(id => ({ id })),
        relations: ['attributes', 'aggregate'],
      });

      if (entities.length === 0) {
        throw new Error('No entities found');
      }

      // 根据模板类型生成代码
      let generatedCode = '';
      switch (templateType) {
        case 'spring-boot':
          generatedCode = await this.generateSpringBootCode(project, entities, outputPath);
          break;
        case 'node-express':
          generatedCode = await this.generateNodeExpressCode(project, entities, outputPath);
          break;
        case 'react-crud':
          generatedCode = await this.generateReactCrudCode(project, entities, outputPath);
          break;
        case 'vue-admin':
          generatedCode = await this.generateVueAdminCode(project, entities, outputPath);
          break;
        default:
          throw new Error(`Unsupported template type: ${templateType}`);
      }

      console.log(`Code generation completed for project ${projectId}`);
      return generatedCode;

    } catch (error) {
      console.error('Code generation failed:', error);
      throw error;
    }
  }

  /**
   * 生成Spring Boot代码
   */
  private async generateSpringBootCode(project: Project, entities: DDDEntity[], outputPath: string): Promise<string> {
    const projectName = this.toCamelCase(project.name);
    const packageName = `com.${projectName.toLowerCase()}.ddd`;
    
    let code = `// Spring Boot Project: ${project.name}\n`;
    code += `// Package: ${packageName}\n\n`;

    for (const entity of entities) {
      // 生成实体类
      code += this.generateJavaEntity(entity, packageName);
      
      // 生成Repository接口
      code += this.generateJpaRepository(entity, packageName);
      
      // 生成Service类
      code += this.generateSpringService(entity, packageName);
      
      // 生成Controller类
      code += this.generateSpringController(entity, packageName);
    }

    // 写入文件
    await this.writeCodeToFile(outputPath, 'spring-boot', code);
    return code;
  }

  /**
   * 生成Node.js Express代码
   */
  private async generateNodeExpressCode(project: Project, entities: DDDEntity[], outputPath: string): Promise<string> {
    let code = `// Node.js Express Project: ${project.name}\n\n`;

    for (const entity of entities) {
      // 生成Model
      code += this.generateSequelizeModel(entity);
      
      // 生成Service
      code += this.generateNodeService(entity);
      
      // 生成Controller
      code += this.generateExpressController(entity);
      
      // 生成Routes
      code += this.generateExpressRoutes(entity);
    }

    await this.writeCodeToFile(outputPath, 'node-express', code);
    return code;
  }

  /**
   * 生成React CRUD代码
   */
  private async generateReactCrudCode(project: Project, entities: DDDEntity[], outputPath: string): Promise<string> {
    let code = `// React CRUD Project: ${project.name}\n\n`;

    for (const entity of entities) {
      // 生成组件
      code += this.generateReactListComponent(entity);
      code += this.generateReactFormComponent(entity);
      code += this.generateReactDetailComponent(entity);
      
      // 生成API Service
      code += this.generateReactApiService(entity);
    }

    await this.writeCodeToFile(outputPath, 'react-crud', code);
    return code;
  }

  /**
   * 生成Vue Admin代码
   */
  private async generateVueAdminCode(project: Project, entities: DDDEntity[], outputPath: string): Promise<string> {
    let code = `// Vue Admin Project: ${project.name}\n\n`;

    for (const entity of entities) {
      // 生成Vue组件
      code += this.generateVueListComponent(entity);
      code += this.generateVueFormComponent(entity);
      
      // 生成API
      code += this.generateVueApiService(entity);
    }

    await this.writeCodeToFile(outputPath, 'vue-admin', code);
    return code;
  }

  /**
   * 生成Java实体类
   */
  private generateJavaEntity(entity: DDDEntity, packageName: string): string {
    const className = this.toPascalCase(entity.name);
    let code = `package ${packageName}.entity;\n\n`;
    code += `import javax.persistence.*;\n`;
    code += `import java.time.LocalDateTime;\n\n`;
    code += `@Entity\n`;
    code += `@Table(name = "${this.toSnakeCase(entity.name)}")\n`;
    code += `public class ${className} {\n\n`;
    
    // ID字段
    code += `    @Id\n`;
    code += `    @GeneratedValue(strategy = GenerationType.IDENTITY)\n`;
    code += `    private Long id;\n\n`;
    
    // 属性字段
    entity.attributes.forEach(attr => {
      const javaType = this.mapToJavaType(attr.dataType);
      code += `    @Column(name = "${this.toSnakeCase(attr.name)}")\n`;
      code += `    private ${javaType} ${this.toCamelCase(attr.name)};\n\n`;
    });
    
    // 时间戳字段
    code += `    @Column(name = "created_at")\n`;
    code += `    private LocalDateTime createdAt;\n\n`;
    code += `    @Column(name = "updated_at")\n`;
    code += `    private LocalDateTime updatedAt;\n\n`;
    
    // Getter和Setter方法
    code += `    // Getters and Setters\n`;
    code += `    // ... (省略getter/setter代码)\n`;
    code += `}\n\n`;
    
    return code;
  }

  /**
   * 生成JPA Repository
   */
  private generateJpaRepository(entity: DDDEntity, packageName: string): string {
    const className = this.toPascalCase(entity.name);
    let code = `package ${packageName}.repository;\n\n`;
    code += `import org.springframework.data.jpa.repository.JpaRepository;\n`;
    code += `import ${packageName}.entity.${className};\n\n`;
    code += `public interface ${className}Repository extends JpaRepository<${className}, Long> {\n`;
    code += `    // 自定义查询方法\n`;
    code += `}\n\n`;
    return code;
  }

  /**
   * 生成Spring Service
   */
  private generateSpringService(entity: DDDEntity, packageName: string): string {
    const className = this.toPascalCase(entity.name);
    let code = `package ${packageName}.service;\n\n`;
    code += `import org.springframework.beans.factory.annotation.Autowired;\n`;
    code += `import org.springframework.stereotype.Service;\n`;
    code += `import ${packageName}.entity.${className};\n`;
    code += `import ${packageName}.repository.${className}Repository;\n\n`;
    code += `@Service\n`;
    code += `public class ${className}Service {\n\n`;
    code += `    @Autowired\n`;
    code += `    private ${className}Repository repository;\n\n`;
    code += `    // CRUD方法\n`;
    code += `    // ... (省略具体实现)\n`;
    code += `}\n\n`;
    return code;
  }

  /**
   * 生成Spring Controller
   */
  private generateSpringController(entity: DDDEntity, packageName: string): string {
    const className = this.toPascalCase(entity.name);
    let code = `package ${packageName}.controller;\n\n`;
    code += `import org.springframework.beans.factory.annotation.Autowired;\n`;
    code += `import org.springframework.web.bind.annotation.*;\n`;
    code += `import ${packageName}.service.${className}Service;\n\n`;
    code += `@RestController\n`;
    code += `@RequestMapping("/api/${this.toKebabCase(entity.name)}")\n`;
    code += `public class ${className}Controller {\n\n`;
    code += `    @Autowired\n`;
    code += `    private ${className}Service service;\n\n`;
    code += `    // REST API方法\n`;
    code += `    // ... (省略具体实现)\n`;
    code += `}\n\n`;
    return code;
  }

  // 其他生成方法的简化实现
  private generateSequelizeModel(entity: DDDEntity): string {
    return `// Sequelize Model for ${entity.name}\n\n`;
  }

  private generateNodeService(entity: DDDEntity): string {
    return `// Node.js Service for ${entity.name}\n\n`;
  }

  private generateExpressController(entity: DDDEntity): string {
    return `// Express Controller for ${entity.name}\n\n`;
  }

  private generateExpressRoutes(entity: DDDEntity): string {
    return `// Express Routes for ${entity.name}\n\n`;
  }

  private generateReactListComponent(entity: DDDEntity): string {
    return `// React List Component for ${entity.name}\n\n`;
  }

  private generateReactFormComponent(entity: DDDEntity): string {
    return `// React Form Component for ${entity.name}\n\n`;
  }

  private generateReactDetailComponent(entity: DDDEntity): string {
    return `// React Detail Component for ${entity.name}\n\n`;
  }

  private generateReactApiService(entity: DDDEntity): string {
    return `// React API Service for ${entity.name}\n\n`;
  }

  private generateVueListComponent(entity: DDDEntity): string {
    return `// Vue List Component for ${entity.name}\n\n`;
  }

  private generateVueFormComponent(entity: DDDEntity): string {
    return `// Vue Form Component for ${entity.name}\n\n`;
  }

  private generateVueApiService(entity: DDDEntity): string {
    return `// Vue API Service for ${entity.name}\n\n`;
  }

  /**
   * 写入代码到文件
   */
  private async writeCodeToFile(outputPath: string, templateType: string, code: string): Promise<void> {
    const fileName = `generated-${templateType}-${Date.now()}.txt`;
    const filePath = path.join(outputPath, fileName);
    
    // 确保目录存在
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // 写入文件
    await fs.writeFile(filePath, code, 'utf-8');
    console.log(`Code written to: ${filePath}`);
  }

  // 工具方法
  private toCamelCase(str: string): string {
    return str.replace(/-(.)/g, (_, char) => char.toUpperCase());
  }

  private toPascalCase(str: string): string {
    const camelCase = this.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  }

  private toKebabCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
  }

  private mapToJavaType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'string': 'String',
      'number': 'Integer',
      'decimal': 'BigDecimal',
      'boolean': 'Boolean',
      'date': 'LocalDate',
      'datetime': 'LocalDateTime',
      'text': 'String',
    };
    return typeMap[type] || 'String';
  }
}
