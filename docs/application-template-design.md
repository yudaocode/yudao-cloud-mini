# 应用开发模板设计文档

## 1. 概述

本文档描述了基于项目模板的应用开发设计，参考[Steedos Templates](https://github.com/steedos/steedos-templates)的设计理念，实现通过元数据模型定义新应用，并通过项目模板快速实现整体功能。

## 2. 设计理念

### 2.1 核心原则

- **元数据驱动**: 新应用完全通过元数据模型定义
- **模板化开发**: 基于成熟的项目模板快速构建
- **平台化实现**: 利用平台能力，避免重复开发
- **配置化部署**: 通过配置实现应用的快速部署和定制

### 2.2 参考架构

基于Steedos Templates的设计理念，采用以下架构：

```
┌─────────────────────────────────────────────────────────────┐
│                    应用定义层                               │
├─────────────────────────────────────────────────────────────┤
│                    项目模板层                               │
├─────────────────────────────────────────────────────────────┤
│                    平台能力层                               │
├─────────────────────────────────────────────────────────────┤
│                    基础设施层                               │
└─────────────────────────────────────────────────────────────┘
```

## 3. 应用定义模型

### 3.1 应用元数据模型

```java
@Entity
@Table(name = "metadata_application")
public class ApplicationMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true)
    private String code;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "version")
    private String version;
    
    @Column(name = "template_id")
    private String templateId; // 关联的项目模板ID
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; // DRAFT, ACTIVE, INACTIVE, DEPRECATED
    
    // 应用配置
    @Column(name = "config", columnDefinition = "JSON")
    private Map<String, Object> config;
    
    // 应用特性
    @Column(name = "features", columnDefinition = "JSON")
    private List<String> features;
    
    // 依赖关系
    @Column(name = "dependencies", columnDefinition = "JSON")
    private List<String> dependencies;
    
    // 权限配置
    @Column(name = "permissions", columnDefinition = "JSON")
    private List<String> permissions;
    
    @Column(name = "tenant_id")
    private String tenantId;
    
    @Column(name = "locale")
    private String locale;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
```

### 3.2 应用模块模型

```java
@Entity
@Table(name = "metadata_application_module")
public class ApplicationModuleMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "application_id", nullable = false)
    private String applicationId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "code", nullable = false)
    private String code;
    
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private ModuleType type; // BUSINESS, SYSTEM, INTEGRATION
    
    @Column(name = "description")
    private String description;
    
    // 模块配置
    @Column(name = "config", columnDefinition = "JSON")
    private Map<String, Object> config;
    
    // 模块依赖
    @Column(name = "dependencies", columnDefinition = "JSON")
    private List<String> dependencies;
    
    @Column(name = "tenant_id")
    private String tenantId;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
```

### 3.3 应用页面模型

```java
@Entity
@Table(name = "metadata_application_page")
public class ApplicationPageMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "application_id", nullable = false)
    private String applicationId;
    
    @Column(name = "module_id")
    private String moduleId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "code", nullable = false)
    private String code;
    
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private PageType type; // LIST, DETAIL, FORM, DASHBOARD
    
    @Column(name = "description")
    private String description;
    
    // 页面布局
    @Column(name = "layout", columnDefinition = "JSON")
    private Map<String, Object> layout;
    
    // 页面组件
    @Column(name = "components", columnDefinition = "JSON")
    private List<String> components;
    
    // 页面权限
    @Column(name = "permissions", columnDefinition = "JSON")
    private List<String> permissions;
    
    @Column(name = "tenant_id")
    private String tenantId;
    
    @Column(name = "locale")
    private String locale;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}
```

## 4. 项目模板系统

### 4.1 模板定义模型

```java
@Entity
@Table(name = "metadata_project_template")
public class ProjectTemplateMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true)
    private String code;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "version")
    private String version;
    
    @Column(name = "category")
    private String category; // CRM, ERP, PROJECT_MANAGEMENT, etc.
    
    @Column(name = "tags", columnDefinition = "JSON")
    private List<String> tags;
    
    // 模板配置
    @Column(name = "config", columnDefinition = "JSON")
    private Map<String, Object> config;
    
    // 模板文件
    @Column(name = "files", columnDefinition = "JSON")
    private List<TemplateFile> files;
    
    // 模板依赖
    @Column(name = "dependencies", columnDefinition = "JSON")
    private List<String> dependencies;
    
    // 模板参数
    @Column(name = "parameters", columnDefinition = "JSON")
    private List<TemplateParameter> parameters;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
}

@Entity
@Table(name = "metadata_template_file")
public class TemplateFile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "template_id")
    private String templateId;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_type")
    private String fileType; // JAVA, VUE, SQL, YAML, etc.
    
    @Column(name = "content")
    @Lob
    private String content;
    
    @Column(name = "is_template")
    private Boolean isTemplate; // 是否为模板文件
    
    @Column(name = "variables", columnDefinition = "JSON")
    private List<String> variables; // 模板变量
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
}

@Entity
@Table(name = "metadata_template_parameter")
public class TemplateParameter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "template_id")
    private String templateId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "code", nullable = false)
    private String code;
    
    @Column(name = "type")
    private String type; // STRING, NUMBER, BOOLEAN, SELECT, etc.
    
    @Column(name = "default_value")
    private String defaultValue;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "required")
    private Boolean required;
    
    @Column(name = "options", columnDefinition = "JSON")
    private List<String> options; // 选择类型的选项
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
}
```

### 4.2 模板引擎

#### 4.2.1 模板渲染引擎

```java
@Component
public class ProjectTemplateEngine {
    
    @Autowired
    private ProjectTemplateRepository templateRepository;
    
    @Autowired
    private ApplicationMetadataRepository applicationRepository;
    
    /**
     * 基于模板创建应用
     */
    public ApplicationCreationResult createApplicationFromTemplate(String templateCode, 
                                                                 String applicationName,
                                                                 String tenantId,
                                                                 Map<String, Object> parameters) {
        // 获取项目模板
        ProjectTemplateMetadata template = templateRepository.findByCode(templateCode);
        if (template == null) {
            throw new TemplateNotFoundException("Template not found: " + templateCode);
        }
        
        // 验证参数
        validateTemplateParameters(template, parameters);
        
        // 创建应用元数据
        ApplicationMetadata application = createApplicationMetadata(template, applicationName, tenantId, parameters);
        
        // 渲染模板文件
        List<RenderedFile> renderedFiles = renderTemplateFiles(template, application, parameters);
        
        // 生成应用代码
        ApplicationCode applicationCode = generateApplicationCode(renderedFiles, application);
        
        // 部署应用
        deployApplication(applicationCode, application);
        
        return new ApplicationCreationResult(application, applicationCode);
    }
    
    /**
     * 渲染模板文件
     */
    private List<RenderedFile> renderTemplateFiles(ProjectTemplateMetadata template, 
                                                  ApplicationMetadata application,
                                                  Map<String, Object> parameters) {
        List<RenderedFile> renderedFiles = new ArrayList<>();
        
        for (TemplateFile file : template.getFiles()) {
            if (file.getIsTemplate()) {
                // 渲染模板文件
                String renderedContent = renderTemplateContent(file.getContent(), application, parameters);
                
                RenderedFile renderedFile = new RenderedFile();
                renderedFile.setFilePath(file.getFilePath());
                renderedFile.setFileType(file.getFileType());
                renderedFile.setContent(renderedContent);
                
                renderedFiles.add(renderedFile);
            } else {
                // 直接复制非模板文件
                RenderedFile renderedFile = new RenderedFile();
                renderedFile.setFilePath(file.getFilePath());
                renderedFile.setFileType(file.getFileType());
                renderedFile.setContent(file.getContent());
                
                renderedFiles.add(renderedFile);
            }
        }
        
        return renderedFiles;
    }
    
    /**
     * 渲染模板内容
     */
    private String renderTemplateContent(String templateContent, 
                                       ApplicationMetadata application,
                                       Map<String, Object> parameters) {
        // 使用FreeMarker渲染模板
        Configuration config = new Configuration(Configuration.VERSION_2_3_31);
        config.setTemplateLoader(new StringTemplateLoader());
        
        try {
            Template template = new Template("template", templateContent, config);
            
            // 准备模板数据
            Map<String, Object> dataModel = new HashMap<>();
            dataModel.put("application", application);
            dataModel.put("parameters", parameters);
            dataModel.put("utils", new TemplateUtils());
            
            // 渲染模板
            StringWriter writer = new StringWriter();
            template.process(dataModel, writer);
            
            return writer.toString();
            
        } catch (Exception e) {
            throw new TemplateRenderingException("Failed to render template", e);
        }
    }
}
```

#### 4.2.2 应用代码生成器

```java
@Component
public class ApplicationCodeGenerator {
    
    /**
     * 生成应用代码
     */
    public ApplicationCode generateApplicationCode(List<RenderedFile> renderedFiles, 
                                                 ApplicationMetadata application) {
        ApplicationCode appCode = new ApplicationCode();
        appCode.setApplicationId(application.getId());
        appCode.setApplicationName(application.getName());
        
        // 按文件类型组织代码
        Map<String, List<RenderedFile>> filesByType = renderedFiles.stream()
            .collect(Collectors.groupingBy(RenderedFile::getFileType));
        
        // 生成Java后端代码
        if (filesByType.containsKey("JAVA")) {
            appCode.setBackendCode(generateBackendCode(filesByType.get("JAVA"), application));
        }
        
        // 生成Vue前端代码
        if (filesByType.containsKey("VUE")) {
            appCode.setFrontendCode(generateFrontendCode(filesByType.get("VUE"), application));
        }
        
        // 生成SQL脚本
        if (filesByType.containsKey("SQL")) {
            appCode.setDatabaseScripts(generateDatabaseScripts(filesByType.get("SQL"), application));
        }
        
        // 生成配置文件
        if (filesByType.containsKey("YAML") || filesByType.containsKey("PROPERTIES")) {
            appCode.setConfigFiles(generateConfigFiles(filesByType, application));
        }
        
        return appCode;
    }
    
    /**
     * 生成后端代码
     */
    private BackendCode generateBackendCode(List<RenderedFile> javaFiles, ApplicationMetadata application) {
        BackendCode backendCode = new BackendCode();
        backendCode.setPackageName("cn.iocoder.yudao.module." + application.getCode().toLowerCase());
        
        // 组织Java文件
        for (RenderedFile file : javaFiles) {
            String fileName = getFileName(file.getFilePath());
            String fileContent = file.getContent();
            
            // 根据文件路径确定文件类型
            if (file.getFilePath().contains("controller")) {
                backendCode.addController(fileName, fileContent);
            } else if (file.getFilePath().contains("service")) {
                backendCode.addService(fileName, fileContent);
            } else if (file.getFilePath().contains("entity")) {
                backendCode.addEntity(fileName, fileContent);
            } else if (file.getFilePath().contains("repository")) {
                backendCode.addRepository(fileName, fileContent);
            }
        }
        
        return backendCode;
    }
    
    /**
     * 生成前端代码
     */
    private FrontendCode generateFrontendCode(List<RenderedFile> vueFiles, ApplicationMetadata application) {
        FrontendCode frontendCode = new FrontendCode();
        frontendCode.setApplicationName(application.getName());
        frontendCode.setApplicationCode(application.getCode());
        
        // 组织Vue文件
        for (RenderedFile file : vueFiles) {
            String fileName = getFileName(file.getFilePath());
            String fileContent = file.getContent();
            
            if (file.getFilePath().contains("pages")) {
                frontendCode.addPage(fileName, fileContent);
            } else if (file.getFilePath().contains("components")) {
                frontendCode.addComponent(fileName, fileContent);
            } else if (file.getFilePath().contains("router")) {
                frontendCode.addRouter(fileName, fileContent);
            }
        }
        
        return frontendCode;
    }
}
```

## 5. 应用部署系统

### 5.1 应用部署器

```java
@Component
public class ApplicationDeployer {
    
    @Autowired
    private ApplicationCodeGenerator codeGenerator;
    
    @Autowired
    private FileSystemService fileSystemService;
    
    @Autowired
    private DatabaseMigrationService migrationService;
    
    /**
     * 部署应用
     */
    public DeploymentResult deployApplication(ApplicationCode applicationCode, 
                                            ApplicationMetadata application) {
        try {
            // 1. 创建应用目录
            String appDir = createApplicationDirectory(application);
            
            // 2. 生成应用文件
            generateApplicationFiles(applicationCode, appDir);
            
            // 3. 执行数据库迁移
            executeDatabaseMigrations(applicationCode.getDatabaseScripts(), application);
            
            // 4. 编译和部署后端代码
            deployBackendCode(applicationCode.getBackendCode(), appDir);
            
            // 5. 部署前端代码
            deployFrontendCode(applicationCode.getFrontendCode(), appDir);
            
            // 6. 更新应用状态
            updateApplicationStatus(application, ApplicationStatus.ACTIVE);
            
            return DeploymentResult.success(application.getId(), appDir);
            
        } catch (Exception e) {
            // 回滚部署
            rollbackDeployment(application);
            throw new ApplicationDeploymentException("Failed to deploy application", e);
        }
    }
    
    /**
     * 创建应用目录
     */
    private String createApplicationDirectory(ApplicationMetadata application) {
        String baseDir = System.getProperty("user.dir") + "/generated-apps";
        String appDir = baseDir + "/" + application.getCode() + "-" + application.getVersion();
        
        fileSystemService.createDirectory(appDir);
        fileSystemService.createDirectory(appDir + "/backend");
        fileSystemService.createDirectory(appDir + "/frontend");
        fileSystemService.createDirectory(appDir + "/database");
        fileSystemService.createDirectory(appDir + "/config");
        
        return appDir;
    }
    
    /**
     * 执行数据库迁移
     */
    private void executeDatabaseMigrations(List<String> databaseScripts, ApplicationMetadata application) {
        for (String script : databaseScripts) {
            migrationService.executeScript(script, application.getTenantId());
        }
    }
    
    /**
     * 部署后端代码
     */
    private void deployBackendCode(BackendCode backendCode, String appDir) {
        String backendDir = appDir + "/backend";
        
        // 创建包结构
        String packagePath = backendDir + "/src/main/java/" + 
            backendCode.getPackageName().replace(".", "/");
        fileSystemService.createDirectory(packagePath);
        
        // 生成Java文件
        for (Map.Entry<String, String> entry : backendCode.getControllers().entrySet()) {
            String filePath = packagePath + "/controller/" + entry.getKey();
            fileSystemService.writeFile(filePath, entry.getValue());
        }
        
        // 生成其他文件...
    }
}
```

## 6. 模板管理

### 6.1 模板仓库

```java
@Service
public class TemplateRepositoryService {
    
    @Autowired
    private ProjectTemplateRepository templateRepository;
    
    /**
     * 从Git仓库导入模板
     */
    public void importTemplateFromGit(String gitUrl, String branch, String templateCode) {
        // 克隆Git仓库
        String localPath = cloneGitRepository(gitUrl, branch);
        
        try {
            // 读取模板配置
            ProjectTemplateMetadata template = readTemplateConfig(localPath, templateCode);
            
            // 读取模板文件
            List<TemplateFile> files = readTemplateFiles(localPath, template);
            template.setFiles(files);
            
            // 保存到本地数据库
            templateRepository.save(template);
            
        } finally {
            // 清理临时文件
            fileSystemService.deleteDirectory(localPath);
        }
    }
    
    /**
     * 导出模板到Git仓库
     */
    public void exportTemplateToGit(String templateCode, String gitUrl, String branch) {
        ProjectTemplateMetadata template = templateRepository.findByCode(templateCode);
        if (template == null) {
            throw new TemplateNotFoundException("Template not found: " + templateCode);
        }
        
        // 创建临时目录
        String tempDir = createTempDirectory();
        
        try {
            // 生成模板文件
            generateTemplateFiles(template, tempDir);
            
            // 推送到Git仓库
            pushToGitRepository(tempDir, gitUrl, branch);
            
        } finally {
            // 清理临时文件
            fileSystemService.deleteDirectory(tempDir);
        }
    }
    
    /**
     * 模板版本管理
     */
    public void createTemplateVersion(String templateCode, String newVersion, String description) {
        ProjectTemplateMetadata template = templateRepository.findByCode(templateCode);
        if (template == null) {
            throw new TemplateNotFoundException("Template not found: " + templateCode);
        }
        
        // 创建新版本
        ProjectTemplateMetadata newVersionTemplate = template.clone();
        newVersionTemplate.setVersion(newVersion);
        newVersionTemplate.setDescription(description);
        newVersionTemplate.setCreatedTime(LocalDateTime.now());
        
        templateRepository.save(newVersionTemplate);
    }
}
```

## 7. 应用生命周期管理

### 7.1 应用生命周期服务

```java
@Service
public class ApplicationLifecycleService {
    
    @Autowired
    private ApplicationMetadataRepository applicationRepository;
    
    @Autowired
    private ApplicationDeployer applicationDeployer;
    
    /**
     * 启动应用
     */
    public void startApplication(String applicationId) {
        ApplicationMetadata application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ApplicationNotFoundException("Application not found: " + applicationId));
        
        // 检查应用状态
        if (application.getStatus() != ApplicationStatus.ACTIVE) {
            throw new InvalidApplicationStateException("Application is not in ACTIVE state");
        }
        
        // 启动应用服务
        startApplicationServices(application);
        
        // 更新应用状态
        application.setStatus(ApplicationStatus.RUNNING);
        applicationRepository.save(application);
    }
    
    /**
     * 停止应用
     */
    public void stopApplication(String applicationId) {
        ApplicationMetadata application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ApplicationNotFoundException("Application not found: " + applicationId));
        
        // 停止应用服务
        stopApplicationServices(application);
        
        // 更新应用状态
        application.setStatus(ApplicationStatus.STOPPED);
        applicationRepository.save(application);
    }
    
    /**
     * 更新应用
     */
    public void updateApplication(String applicationId, String newVersion) {
        ApplicationMetadata application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ApplicationNotFoundException("Application not found: " + applicationId));
        
        // 备份当前版本
        backupApplication(application);
        
        // 部署新版本
        ApplicationCode newCode = generateNewVersionCode(application, newVersion);
        applicationDeployer.deployApplication(newCode, application);
        
        // 更新应用版本
        application.setVersion(newVersion);
        applicationRepository.save(application);
    }
    
    /**
     * 卸载应用
     */
    public void uninstallApplication(String applicationId) {
        ApplicationMetadata application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ApplicationNotFoundException("Application not found: " + applicationId));
        
        // 停止应用
        stopApplication(applicationId);
        
        // 清理应用文件
        cleanupApplicationFiles(application);
        
        // 清理数据库
        cleanupApplicationDatabase(application);
        
        // 删除应用元数据
        applicationRepository.delete(application);
    }
}
```

## 8. 配置管理

### 8.1 应用配置

```yaml
# application-template.yml
application:
  templates:
    crm:
      name: "CRM客户关系管理"
      code: "crm"
      version: "1.0.0"
      category: "BUSINESS"
      description: "完整的客户关系管理解决方案"
      dependencies:
        - "user-management"
        - "file-management"
      parameters:
        - name: "company_name"
          code: "company_name"
          type: "STRING"
          required: true
          description: "公司名称"
        - name: "industry"
          code: "industry"
          type: "SELECT"
          options: ["制造业", "服务业", "金融业", "其他"]
          required: false
          description: "所属行业"
    
    project-management:
      name: "项目管理系统"
      code: "project-management"
      version: "1.0.0"
      category: "BUSINESS"
      description: "项目全生命周期管理"
      dependencies:
        - "user-management"
        - "workflow-engine"
      parameters:
        - name: "project_types"
          code: "project_types"
          type: "MULTI_SELECT"
          options: ["研发项目", "实施项目", "维护项目"]
          required: true
          description: "支持的项目类型"
```

### 8.2 部署配置

```yaml
# deployment-config.yml
deployment:
  backend:
    framework: "spring-boot"
    java-version: "8"
    build-tool: "maven"
    packaging: "jar"
    
  frontend:
    framework: "vue3"
    build-tool: "vite"
    ui-library: "element-plus"
    
  database:
    engine: "mysql"
    version: "8.0"
    migration-tool: "flyway"
    
  infrastructure:
    container: "docker"
    orchestration: "docker-compose"
    monitoring: "prometheus"
```

## 9. 监控和运维

### 9.1 应用监控

- **性能监控**: 监控应用响应时间、吞吐量
- **资源监控**: 监控CPU、内存、磁盘使用情况
- **业务监控**: 监控业务指标和异常情况
- **日志监控**: 集中化日志收集和分析

### 9.2 应用运维

- **自动扩缩容**: 根据负载自动调整应用实例数量
- **健康检查**: 定期检查应用健康状态
- **故障恢复**: 自动故障检测和恢复
- **备份恢复**: 定期备份和快速恢复

## 10. 最佳实践

### 10.1 模板设计原则

- **模块化设计**: 将复杂应用拆分为独立模块
- **配置化**: 通过配置实现功能定制
- **标准化**: 遵循行业标准和最佳实践
- **可扩展性**: 设计时考虑未来的扩展需求

### 10.2 应用开发流程

1. **需求分析**: 明确应用功能和业务需求
2. **模板选择**: 选择合适的项目模板
3. **参数配置**: 配置模板参数和业务规则
4. **代码生成**: 基于模板生成应用代码
5. **测试验证**: 验证应用功能和性能
6. **部署上线**: 部署到生产环境
7. **运维监控**: 持续监控和优化

### 10.3 版本管理策略

- **语义化版本**: 使用语义化版本号管理版本
- **向后兼容**: 新版本保持向后兼容性
- **灰度发布**: 支持灰度发布和回滚
- **变更管理**: 记录和管理版本变更
