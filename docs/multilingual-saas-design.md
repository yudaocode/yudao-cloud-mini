# 多语言与SaaS支持设计文档

## 1. 概述

本文档描述了元数据驱动开发解决方案中的多语言支持和SaaS多租户架构设计，确保系统能够支持国际化部署和多租户运营。

## 2. 多语言支持架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    多语言支持层                              │
├─────────────────────────────────────────────────────────────┤
│                    语言检测器                               │
├─────────────────────────────────────────────────────────────┤
│                    本地化管理器                             │
├─────────────────────────────────────────────────────────────┤
│                    文本解析器                               │
├─────────────────────────────────────────────────────────────┤
│                    变量替换器                               │
├─────────────────────────────────────────────────────────────┤
│                    多语言存储                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

#### 2.2.1 语言检测器

```java
@Component
public class LanguageDetector {
    
    /**
     * 检测用户语言偏好
     */
    public String detectUserLanguage(HttpServletRequest request) {
        // 从请求头获取Accept-Language
        String acceptLanguage = request.getHeader("Accept-Language");
        
        // 从Cookie获取语言设置
        String cookieLanguage = getLanguageFromCookie(request);
        
        // 从用户配置获取语言设置
        String userLanguage = getUserLanguagePreference(request);
        
        // 从租户配置获取默认语言
        String tenantLanguage = getTenantDefaultLanguage();
        
        // 优先级：用户配置 > Cookie > 请求头 > 租户默认
        return selectLanguage(userLanguage, cookieLanguage, acceptLanguage, tenantLanguage);
    }
    
    /**
     * 获取支持的语言列表
     */
    public List<LanguageInfo> getSupportedLanguages(String tenantId) {
        return languageRepository.findByTenantIdAndIsActiveTrue(tenantId);
    }
}
```

#### 2.2.2 本地化管理器

```java
@Component
public class LocalizationManager {
    
    @Autowired
    private LocalizedTextRepository textRepository;
    
    @Autowired
    private LocalizedTermRepository termRepository;
    
    /**
     * 获取本地化文本
     */
    public String getLocalizedText(String key, String locale, String tenantId, Object... variables) {
        // 查找本地化文本
        LocalizedText text = textRepository.findByKeyAndLocaleAndTenantId(key, locale, tenantId);
        
        if (text == null) {
            // 回退到默认语言
            text = textRepository.findByKeyAndLocaleAndTenantId(key, getDefaultLocale(tenantId), tenantId);
        }
        
        if (text == null) {
            // 回退到英文
            text = textRepository.findByKeyAndLocaleAndTenantId(key, "en", tenantId);
        }
        
        if (text == null) {
            return key; // 返回键名作为默认值
        }
        
        // 替换变量
        return replaceVariables(text.getText(), variables);
    }
    
    /**
     * 获取本地化术语
     */
    public String getLocalizedTerm(String termKey, String locale, String tenantId) {
        LocalizedTerm term = termRepository.findByTermKeyAndLocaleAndTenantId(termKey, locale, tenantId);
        
        if (term == null) {
            // 回退逻辑
            term = termRepository.findByTermKeyAndLocaleAndTenantId(termKey, getDefaultLocale(tenantId), tenantId);
        }
        
        return term != null ? term.getTerm() : termKey;
    }
    
    /**
     * 替换文本中的变量
     */
    private String replaceVariables(String text, Object... variables) {
        if (variables == null || variables.length == 0) {
            return text;
        }
        
        String result = text;
        for (int i = 0; i < variables.length; i++) {
            result = result.replace("{" + i + "}", String.valueOf(variables[i]));
        }
        
        return result;
    }
}
```

#### 2.2.3 多语言解释器

```java
@Component
public class MultilingualInterpreter {
    
    @Autowired
    private LocalizationManager localizationManager;
    
    /**
     * 解释多语言元数据
     */
    public <T> T interpretMultilingualMetadata(T metadata, String locale, String tenantId) {
        if (metadata == null) {
            return null;
        }
        
        // 使用反射获取所有字段
        Field[] fields = metadata.getClass().getDeclaredFields();
        
        for (Field field : fields) {
            field.setAccessible(true);
            
            // 检查是否有@Localized注解
            if (field.isAnnotationPresent(Localized.class)) {
                try {
                    String value = (String) field.get(metadata);
                    if (value != null && value.startsWith("i18n:")) {
                        String key = value.substring(5);
                        String localizedValue = localizationManager.getLocalizedText(key, locale, tenantId);
                        field.set(metadata, localizedValue);
                    }
                } catch (IllegalAccessException e) {
                    // 记录日志
                }
            }
        }
        
        return metadata;
    }
}
```

### 2.3 前端多语言支持

#### 2.3.1 多语言组件

```typescript
class MultilingualComponent {
    
    private currentLocale: string;
    private tenantId: string;
    private localizationCache: Map<string, string> = new Map();
    
    constructor(locale: string, tenantId: string) {
        this.currentLocale = locale;
        this.tenantId = tenantId;
    }
    
    /**
     * 获取本地化文本
     */
    async getText(key: string, variables?: any[]): Promise<string> {
        // 检查缓存
        const cacheKey = `${key}_${this.currentLocale}_${this.tenantId}`;
        if (this.localizationCache.has(cacheKey)) {
            return this.replaceVariables(this.localizationCache.get(cacheKey)!, variables);
        }
        
        // 从API获取
        const response = await fetch(`/api/localization/text?key=${key}&locale=${this.currentLocale}&tenantId=${this.tenantId}`);
        const text = await response.text();
        
        // 缓存结果
        this.localizationCache.set(cacheKey, text);
        
        return this.replaceVariables(text, variables);
    }
    
    /**
     * 替换变量
     */
    private replaceVariables(text: string, variables?: any[]): string {
        if (!variables || variables.length === 0) {
            return text;
        }
        
        let result = text;
        variables.forEach((value, index) => {
            result = result.replace(new RegExp(`\\{${index}\\}`, 'g'), String(value));
        });
        
        return result;
    }
    
    /**
     * 切换语言
     */
    async switchLanguage(locale: string): Promise<void> {
        this.currentLocale = locale;
        this.localizationCache.clear(); // 清空缓存
        
        // 通知其他组件语言已切换
        this.emit('languageChanged', locale);
    }
}
```

#### 2.3.2 多语言指令

```typescript
// Vue指令：v-i18n
Vue.directive('i18n', {
    bind(el: HTMLElement, binding: any) {
        const key = binding.value;
        const variables = binding.arg ? binding.arg.split(',') : [];
        
        // 获取多语言组件实例
        const i18n = el.__vue__?.$i18n || window.i18n;
        
        if (i18n) {
            i18n.getText(key, variables).then((text: string) => {
                el.textContent = text;
            });
        }
    },
    
    update(el: HTMLElement, binding: any) {
        // 更新文本内容
        this.bind(el, binding);
    }
});

// 使用示例
// <span v-i18n="'user.welcome'" v-i18n:args="[userName]">欢迎，{0}</span>
```

## 3. SaaS多租户架构

### 3.1 租户隔离策略

#### 3.1.1 数据库隔离策略

```java
@Component
public class TenantIsolationStrategy {
    
    /**
     * 获取租户特定的数据源
     */
    public DataSource getTenantDataSource(String tenantId) {
        TenantIsolationConfig config = getTenantIsolationConfig(tenantId);
        
        switch (config.getIsolationLevel()) {
            case SCHEMA:
                return getSchemaBasedDataSource(tenantId);
            case TABLE:
                return getTableBasedDataSource(tenantId);
            case ROW:
                return getRowBasedDataSource(tenantId);
            default:
                throw new UnsupportedOperationException("Unsupported isolation level: " + config.getIsolationLevel());
        }
    }
    
    /**
     * Schema级别隔离
     */
    private DataSource getSchemaBasedDataSource(String tenantId) {
        // 为每个租户创建独立的Schema
        String schemaName = "tenant_" + tenantId;
        
        // 动态创建Schema
        createSchemaIfNotExists(schemaName);
        
        // 返回配置了Schema的数据源
        return createDataSourceWithSchema(schemaName);
    }
    
    /**
     * 表级别隔离
     */
    private DataSource getTableBasedDataSource(String tenantId) {
        // 表名添加租户前缀
        String tablePrefix = "t" + tenantId + "_";
        
        // 返回配置了表前缀的数据源
        return createDataSourceWithTablePrefix(tablePrefix);
    }
    
    /**
     * 行级别隔离
     */
    private DataSource getRowBasedDataSource(String tenantId) {
        // 所有租户共享表结构，通过tenant_id字段隔离
        return createDataSourceWithTenantFilter(tenantId);
    }
}
```

#### 3.1.2 租户上下文管理

```java
@Component
public class TenantContextManager {
    
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    
    /**
     * 设置当前租户
     */
    public void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }
    
    /**
     * 获取当前租户
     */
    public String getCurrentTenant() {
        String tenantId = currentTenant.get();
        if (tenantId == null) {
            throw new TenantNotSetException("Tenant context not set");
        }
        return tenantId;
    }
    
    /**
     * 清除租户上下文
     */
    public void clearCurrentTenant() {
        currentTenant.remove();
    }
    
    /**
     * 在租户上下文中执行操作
     */
    public <T> T executeInTenantContext(String tenantId, Supplier<T> operation) {
        try {
            setCurrentTenant(tenantId);
            return operation.get();
        } finally {
            clearCurrentTenant();
        }
    }
}
```

### 3.2 租户配置管理

#### 3.2.1 租户配置服务

```java
@Service
public class TenantConfigurationService {
    
    @Autowired
    private TenantConfigRepository configRepository;
    
    /**
     * 获取租户配置
     */
    public <T> T getTenantConfig(String tenantId, String configKey, Class<T> configType, T defaultValue) {
        TenantConfig config = configRepository.findByTenantIdAndConfigKey(tenantId, configKey);
        
        if (config == null) {
            return defaultValue;
        }
        
        // 根据配置类型转换值
        return convertConfigValue(config.getConfigValue(), config.getConfigType(), configType);
    }
    
    /**
     * 设置租户配置
     */
    public void setTenantConfig(String tenantId, String configKey, Object configValue, String description) {
        TenantConfig config = configRepository.findByTenantIdAndConfigKey(tenantId, configKey);
        
        if (config == null) {
            config = new TenantConfig();
            config.setTenantId(tenantId);
            config.setConfigKey(configKey);
        }
        
        config.setConfigValue(configValue);
        config.setConfigType(determineConfigType(configValue));
        config.setDescription(description);
        config.setUpdatedTime(LocalDateTime.now());
        
        configRepository.save(config);
    }
    
    /**
     * 获取租户所有配置
     */
    public Map<String, Object> getAllTenantConfigs(String tenantId) {
        List<TenantConfig> configs = configRepository.findByTenantId(tenantId);
        
        Map<String, Object> result = new HashMap<>();
        for (TenantConfig config : configs) {
            result.put(config.getConfigKey(), config.getConfigValue());
        }
        
        return result;
    }
}
```

#### 3.2.2 租户资源配额管理

```java
@Service
public class TenantResourceQuotaService {
    
    @Autowired
    private TenantRepository tenantRepository;
    
    /**
     * 检查用户数量配额
     */
    public boolean checkUserQuota(String tenantId, int requestedUsers) {
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + tenantId));
        
        int currentUsers = getCurrentUserCount(tenantId);
        int maxUsers = tenant.getMaxUsers();
        
        return (currentUsers + requestedUsers) <= maxUsers;
    }
    
    /**
     * 检查存储配额
     */
    public boolean checkStorageQuota(String tenantId, long requestedBytes) {
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + tenantId));
        
        long currentStorage = getCurrentStorageUsage(tenantId);
        long maxStorage = tenant.getMaxStorage();
        
        return (currentStorage + requestedBytes) <= maxStorage;
    }
    
    /**
     * 检查功能特性权限
     */
    public boolean checkFeaturePermission(String tenantId, String feature) {
        Tenant tenant = tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + tenantId));
        
        return tenant.getFeatures().contains(feature);
    }
}
```

### 3.3 租户数据迁移

#### 3.3.1 租户数据迁移服务

```java
@Service
public class TenantDataMigrationService {
    
    @Autowired
    private TenantIsolationStrategy isolationStrategy;
    
    /**
     * 迁移租户数据
     */
    @Transactional
    public void migrateTenantData(String sourceTenantId, String targetTenantId, MigrationOptions options) {
        // 验证目标租户
        validateTargetTenant(targetTenantId);
        
        // 备份源租户数据
        backupTenantData(sourceTenantId);
        
        try {
            // 执行数据迁移
            if (options.isMigrateUsers()) {
                migrateUsers(sourceTenantId, targetTenantId);
            }
            
            if (options.isMigrateData()) {
                migrateBusinessData(sourceTenantId, targetTenantId);
            }
            
            if (options.isMigrateConfigs()) {
                migrateConfigurations(sourceTenantId, targetTenantId);
            }
            
            // 更新租户状态
            updateTenantStatus(sourceTenantId, "MIGRATED");
            updateTenantStatus(targetTenantId, "ACTIVE");
            
        } catch (Exception e) {
            // 回滚迁移
            rollbackMigration(sourceTenantId, targetTenantId);
            throw new MigrationException("Tenant migration failed", e);
        }
    }
    
    /**
     * 迁移用户数据
     */
    private void migrateUsers(String sourceTenantId, String targetTenantId) {
        // 迁移用户账户
        // 迁移用户权限
        // 迁移用户配置
    }
    
    /**
     * 迁移业务数据
     */
    private void migrateBusinessData(String sourceTenantId, String targetTenantId) {
        // 根据隔离策略选择迁移方法
        TenantIsolationConfig config = getTenantIsolationConfig(targetTenantId);
        
        switch (config.getIsolationLevel()) {
            case SCHEMA:
                migrateSchemaBasedData(sourceTenantId, targetTenantId);
                break;
            case TABLE:
                migrateTableBasedData(sourceTenantId, targetTenantId);
                break;
            case ROW:
                migrateRowBasedData(sourceTenantId, targetTenantId);
                break;
        }
    }
}
```

## 4. 统一消息管理系统

### 4.1 设计原则

基于"不重复造轮子"的原则，本系统采用成熟的消息组件（如Austin）作为底层消息发送引擎，专注于：

- **SaaS化对接**: 多租户配置管理和隔离
- **用户体验优化**: B端强制推送和C端订阅两种模式
- **元数据驱动**: 消息模板和规则通过元数据模型定义

### 4.2 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    消息管理适配层                            │
├─────────────────────────────────────────────────────────────┤
│                    消息服务防腐网关                          │
├─────────────────────────────────────────────────────────────┤
│                    成熟消息组件 (Austin/其他)                │
├─────────────────────────────────────────────────────────────┤
│                    多租户配置管理                           │
├─────────────────────────────────────────────────────────────┤
│                    用户体验优化                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 消息发送服务

#### 4.3.1 消息服务防腐网关

```java
@Service
public class MessageServiceGateway {
    
    @Autowired
    private MessageProviderFactory providerFactory;
    
    @Autowired
    private MessageTemplateRepository templateRepository;
    
    @Autowired
    private TenantMessageConfigService tenantConfigService;
    
    /**
     * B端强制推送消息
     */
    public MessageSendResult sendB2BMessage(String templateCode, String recipient, 
                                           String tenantId, Map<String, Object> variables) {
        // 获取租户消息配置
        TenantMessageConfig config = tenantConfigService.getTenantConfig(tenantId);
        
        // 获取消息模板
        MessageTemplate template = templateRepository.findByCodeAndTenantId(templateCode, tenantId);
        
        // 构建统一消息请求
        UnifiedMessageRequest request = buildUnifiedMessageRequest(template, recipient, variables, config);
        
        // 设置强制推送策略
        request.setForcePush(true);
        request.setPriority(Priority.HIGH);
        
        // 通过防腐网关发送消息
        return sendMessageThroughGateway(request);
    }
    
    /**
     * C端订阅推送消息
     */
    public MessageSendResult sendC2CMessage(String templateCode, String recipient, 
                                           String tenantId, Map<String, Object> variables) {
        // 检查用户订阅偏好
        UserSubscriptionPreference preference = getUserSubscriptionPreference(recipient, tenantId);
        
        if (!preference.isSubscribed(templateCode)) {
            return MessageSendResult.skipped(recipient, "User not subscribed to this message type");
        }
        
        // 获取租户消息配置
        TenantMessageConfig config = tenantConfigService.getTenantConfig(tenantId);
        
        // 获取消息模板
        MessageTemplate template = templateRepository.findByCodeAndTenantId(templateCode, tenantId);
        
        // 构建统一消息请求
        UnifiedMessageRequest request = buildUnifiedMessageRequest(template, recipient, variables, config);
        
        // 设置订阅推送策略
        request.setForcePush(false);
        request.setPriority(Priority.NORMAL);
        
        // 通过防腐网关发送消息
        return sendMessageThroughGateway(request);
    }
    
    /**
     * 构建统一消息请求
     */
    private UnifiedMessageRequest buildUnifiedMessageRequest(MessageTemplate template, String recipient,
                                                           Map<String, Object> variables, 
                                                           TenantMessageConfig config) {
        UnifiedMessageRequest request = new UnifiedMessageRequest();
        
        // 设置基本信息
        request.setRecipient(recipient);
        request.setTemplateId(template.getTemplateId());
        request.setVariables(variables);
        
        // 设置租户特定配置
        request.setChannel(config.getDefaultChannel());
        request.setProvider(config.getDefaultProvider());
        request.setSignature(config.getSignature());
        
        return request;
    }
    
    /**
     * 通过防腐网关发送消息
     */
    private MessageSendResult sendMessageThroughGateway(UnifiedMessageRequest request) {
        // 获取消息提供者
        MessageProvider provider = providerFactory.getProvider(request.getProvider(), request.getTenantId());
        
        // 通过防腐网关转换请求格式
        Object providerRequest = convertToProviderRequest(request, provider);
        
        // 发送消息
        return provider.sendMessage(providerRequest);
    }
    
    /**
     * 转换为提供者特定的请求格式
     */
    private Object convertToProviderRequest(UnifiedMessageRequest request, MessageProvider provider) {
        // 根据提供者类型进行转换
        switch (provider.getType()) {
            case AUSTIN:
                return convertToAustinRequest(request);
            case ALIYUN_SMS:
                return convertToAliyunSmsRequest(request);
            case TENCENT_SMS:
                return convertToTencentSmsRequest(request);
            case EMAIL_SMTP:
                return convertToEmailSmtpRequest(request);
            default:
                throw new UnsupportedProviderException("Unsupported provider type: " + provider.getType());
        }
    }
}
```

#### 4.3.2 消息提供者工厂

```java
@Component
public class MessageProviderFactory {
    
    private Map<String, MessageProvider> providers = new HashMap<>();
    
    /**
     * 注册消息提供者
     */
    public void registerProvider(String type, MessageProvider provider) {
        providers.put(type, provider);
    }
    
    /**
     * 获取消息提供者
     */
    public MessageProvider getProvider(String type, String tenantId) {
        MessageProvider provider = providers.get(type);
        
        if (provider == null) {
            throw new ProviderNotFoundException("Message provider not found for type: " + type);
        }
        
        // 配置租户特定的设置
        provider.configure(tenantId);
        
        return provider;
    }
}

/**
 * 消息提供者接口
 */
public interface MessageProvider {
    
    /**
     * 发送消息
     */
    MessageSendResult sendMessage(Object request);
    
    /**
     * 配置提供者
     */
    void configure(String tenantId);
    
    /**
     * 获取提供者类型
     */
    String getType();
}

/**
 * Austin消息提供者
 */
@Component
public class AustinMessageProvider implements MessageProvider {
    
    @Autowired
    private AustinClient austinClient;
    
    @Override
    public MessageSendResult sendMessage(Object request) {
        try {
            AustinMessageRequest austinRequest = (AustinMessageRequest) request;
            // 通过Austin发送消息
            return austinClient.sendMessage(austinRequest);
        } catch (Exception e) {
            return MessageSendResult.failed("Austin send failed: " + e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的Austin设置
        TenantConfig austinConfig = getTenantAustinConfig(tenantId);
        austinClient.configure(austinConfig);
    }
    
    @Override
    public String getType() {
        return "AUSTIN";
    }
}

/**
 * 阿里云短信提供者
 */
@Component
public class AliyunSmsProvider implements MessageProvider {
    
    @Autowired
    private AliyunSmsClient smsClient;
    
    @Override
    public MessageSendResult sendMessage(Object request) {
        try {
            AliyunSmsRequest smsRequest = (AliyunSmsRequest) request;
            // 通过阿里云发送短信
            return smsClient.sendSms(smsRequest);
        } catch (Exception e) {
            return MessageSendResult.failed("Aliyun SMS send failed: " + e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的阿里云设置
        TenantConfig aliyunConfig = getTenantAliyunConfig(tenantId);
        smsClient.configure(aliyunConfig);
    }
    
    @Override
    public String getType() {
        return "ALIYUN_SMS";
    }
}

/**
 * 腾讯云短信提供者
 */
@Component
public class TencentSmsProvider implements MessageProvider {
    
    @Autowired
    private TencentSmsClient smsClient;
    
    @Override
    public MessageSendResult sendMessage(Object request) {
        try {
            TencentSmsRequest smsRequest = (TencentSmsRequest) request;
            // 通过腾讯云发送短信
            return smsClient.sendSms(smsRequest);
        } catch (Exception e) {
            return MessageSendResult.failed("Tencent SMS send failed: " + e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的腾讯云设置
        TenantConfig tencentConfig = getTenantTencentConfig(tenantId);
        smsClient.configure(tencentConfig);
    }
    
    @Override
    public String getType() {
        return "TENCENT_SMS";
    }
}

/**
 * 邮件SMTP提供者
 */
@Component
public class EmailSmtpProvider implements MessageProvider {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Override
    public MessageSendResult sendMessage(Object request) {
        try {
            EmailSmtpRequest emailRequest = (EmailSmtpRequest) request;
            // 发送邮件
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailRequest.getRecipient());
            message.setSubject(emailRequest.getSubject());
            message.setText(emailRequest.getContent());
            
            mailSender.send(message);
            return MessageSendResult.success("Email sent successfully");
        } catch (Exception e) {
            return MessageSendResult.failed("Email send failed: " + e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的SMTP设置
        TenantConfig smtpConfig = getTenantSmtpConfig(tenantId);
        configureSmtp(smtpConfig);
    }
    
    @Override
    public String getType() {
        return "EMAIL_SMTP";
    }
}
```

#### 4.3.3 租户消息配置管理

```java
@Service
public class TenantMessageConfigService {
    
    @Autowired
    private TenantMessageConfigRepository configRepository;
    
    /**
     * 获取租户消息配置
     */
    public TenantMessageConfig getTenantConfig(String tenantId) {
        TenantMessageConfig config = configRepository.findByTenantId(tenantId);
        
        if (config == null) {
            // 创建默认配置
            config = createDefaultConfig(tenantId);
            configRepository.save(config);
        }
        
        return config;
    }
    
    /**
     * 更新租户消息配置
     */
    public void updateTenantConfig(String tenantId, TenantMessageConfig config) {
        TenantMessageConfig existing = configRepository.findByTenantId(tenantId);
        
        if (existing == null) {
            config.setTenantId(tenantId);
            config.setCreatedTime(LocalDateTime.now());
        } else {
            config.setId(existing.getId());
            config.setUpdatedTime(LocalDateTime.now());
        }
        
        configRepository.save(config);
    }
    
    /**
     * 创建默认配置
     */
    private TenantMessageConfig createDefaultConfig(String tenantId) {
        TenantMessageConfig config = new TenantMessageConfig();
        config.setTenantId(tenantId);
        config.setDefaultChannel(Channel.EMAIL);
        config.setDefaultProvider("EMAIL_SMTP"); // 默认使用邮件SMTP
        config.setSignature("Best regards, " + tenantId + " Team");
        config.setCreatedTime(LocalDateTime.now());
        config.setUpdatedTime(LocalDateTime.now());
        
        return config;
    }
}
```

#### 4.3.3 用户订阅偏好管理

```java
@Service
public class UserSubscriptionService {
    
    @Autowired
    private UserSubscriptionRepository subscriptionRepository;
    
    /**
     * 获取用户订阅偏好
     */
    public UserSubscriptionPreference getUserSubscriptionPreference(String userId, String tenantId) {
        UserSubscriptionPreference preference = subscriptionRepository
            .findByUserIdAndTenantId(userId, tenantId);
        
        if (preference == null) {
            // 创建默认订阅偏好
            preference = createDefaultPreference(userId, tenantId);
            subscriptionRepository.save(preference);
        }
        
        return preference;
    }
    
    /**
     * 更新用户订阅偏好
     */
    public void updateUserSubscription(String userId, String tenantId, 
                                     Map<String, Boolean> subscriptions) {
        UserSubscriptionPreference preference = getUserSubscriptionPreference(userId, tenantId);
        
        // 更新订阅设置
        for (Map.Entry<String, Boolean> entry : subscriptions.entrySet()) {
            preference.setSubscribed(entry.getKey(), entry.getValue());
        }
        
        preference.setUpdatedTime(LocalDateTime.now());
        subscriptionRepository.save(preference);
    }
    
    /**
     * 创建默认订阅偏好
     */
    private UserSubscriptionPreference createDefaultPreference(String userId, String tenantId) {
        UserSubscriptionPreference preference = new UserSubscriptionPreference();
        preference.setUserId(userId);
        preference.setTenantId(tenantId);
        
        // 设置默认订阅类型
        preference.setSubscribed("system_notification", true);
        preference.setSubscribed("marketing_message", false);
        preference.setSubscribed("order_update", true);
        
        preference.setCreatedTime(LocalDateTime.now());
        preference.setUpdatedTime(LocalDateTime.now());
        
        return preference;
    }
}
```

#### 4.1.2 消息提供者工厂

```java
@Component
public class MessageProviderFactory {
    
    private Map<String, MessageProvider> providers = new HashMap<>();
    
    /**
     * 注册消息提供者
     */
    public void registerProvider(String type, MessageProvider provider) {
        providers.put(type, provider);
    }
    
    /**
     * 获取消息提供者
     */
    public MessageProvider getProvider(String type, String tenantId) {
        MessageProvider provider = providers.get(type);
        
        if (provider == null) {
            throw new ProviderNotFoundException("Message provider not found for type: " + type);
        }
        
        // 配置租户特定的设置
        provider.configure(tenantId);
        
        return provider;
    }
}

// 邮件提供者
@Component
public class EmailMessageProvider implements MessageProvider {
    
    @Override
    public MessageSendResult sendMessage(String recipient, String subject, String content) {
        // 使用JavaMail或其他邮件库发送邮件
        try {
            // 发送邮件逻辑
            return MessageSendResult.success(recipient, "Message sent successfully");
        } catch (Exception e) {
            return MessageSendResult.failed(recipient, e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的邮件服务器设置
        TenantConfig smtpConfig = getTenantSmtpConfig(tenantId);
        configureSmtp(smtpConfig);
    }
}

// 短信提供者
@Component
public class SmsMessageProvider implements MessageProvider {
    
    @Override
    public MessageSendResult sendMessage(String recipient, String subject, String content) {
        // 使用短信服务商API发送短信
        try {
            // 发送短信逻辑
            return MessageSendResult.success(recipient, "SMS sent successfully");
        } catch (Exception e) {
            return MessageSendResult.failed(recipient, e.getMessage());
        }
    }
    
    @Override
    public void configure(String tenantId) {
        // 配置租户特定的短信服务商设置
        TenantConfig smsConfig = getTenantSmsConfig(tenantId);
        configureSmsProvider(smsConfig);
    }
}
```

### 4.2 消息模板管理

#### 4.2.1 消息模板服务

```java
@Service
public class MessageTemplateService {
    
    @Autowired
    private MessageTemplateRepository templateRepository;
    
    /**
     * 创建消息模板
     */
    public MessageTemplate createTemplate(MessageTemplate template) {
        // 验证模板语法
        validateTemplateSyntax(template);
        
        // 设置默认值
        if (template.getLocale() == null) {
            template.setLocale("en");
        }
        
        template.setCreatedTime(LocalDateTime.now());
        template.setUpdatedTime(LocalDateTime.now());
        
        return templateRepository.save(template);
    }
    
    /**
     * 更新消息模板
     */
    public MessageTemplate updateTemplate(String id, MessageTemplate template) {
        MessageTemplate existing = templateRepository.findById(id)
            .orElseThrow(() -> new TemplateNotFoundException("Template not found: " + id));
        
        // 更新字段
        existing.setName(template.getName());
        existing.setDescription(template.getDescription());
        existing.setSubject(template.getSubject());
        existing.setContent(template.getContent());
        existing.setVariables(template.getVariables());
        existing.setUpdatedTime(LocalDateTime.now());
        
        return templateRepository.save(existing);
    }
    
    /**
     * 验证模板语法
     */
    private void validateTemplateSyntax(MessageTemplate template) {
        // 检查变量语法
        List<String> variables = extractVariables(template.getContent());
        variables.addAll(extractVariables(template.getSubject()));
        
        // 验证变量是否在允许的变量列表中
        for (String variable : variables) {
            if (!template.getVariables().contains(variable)) {
                throw new InvalidTemplateException("Undefined variable: " + variable);
            }
        }
    }
    
    /**
     * 提取模板中的变量
     */
    private List<String> extractVariables(String text) {
        List<String> variables = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\{([^}]+)\\}");
        Matcher matcher = pattern.matcher(text);
        
        while (matcher.find()) {
            variables.add(matcher.group(1));
        }
        
        return variables;
    }
}
```

## 5. 统一校验规则系统

### 5.1 设计原则

**规则定义必须与元数据模型结合，不能另行定义一套**。本系统采用元数据驱动的规则定义方式：

- **规则定义**: 直接基于DDD元数据模型（实体、属性、关系等）
- **规则执行**: 支持前后端可配置和动态条件化执行
- **架构一致性**: 避免重复定义，保持元数据模型的完整性

### 5.2 基于元数据的规则定义

#### 5.2.1 元数据驱动的规则模型

```java
@Entity
@Table(name = "metadata_validation_rule")
public class MetadataValidationRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    // 规则绑定到元数据对象
    @Column(name = "target_metadata_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private MetadataType targetMetadataType; // ENTITY, PROPERTY, RELATIONSHIP
    
    @Column(name = "target_metadata_id", nullable = false)
    private String targetMetadataId; // 元数据对象的ID
    
    // 规则表达式基于元数据属性
    @Column(name = "expression", nullable = false)
    private String expression; // 基于元数据属性的表达式
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "severity")
    @Enumerated(EnumType.STRING)
    private Severity severity;
    
    @Column(name = "priority")
    private Integer priority;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
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

#### 5.2.2 元数据驱动的规则执行器

```java
@Component
public class MetadataDrivenValidationExecutor {
    
    @Autowired
    private MetadataValidationRuleRepository ruleRepository;
    
    @Autowired
    private MetadataManagementService metadataService;
    
    /**
     * 执行基于元数据的校验规则
     */
    public ValidationResult executeMetadataValidation(String metadataId, String trigger, 
                                                    String tenantId, Object data) {
        // 获取元数据对象
        BaseMetadata metadata = metadataService.getMetadata(metadataId);
        
        // 查找绑定到该元数据的校验规则
        List<MetadataValidationRule> rules = ruleRepository
            .findByTargetMetadataIdAndTriggerAndTenantId(metadataId, trigger, tenantId);
        
        ValidationResult result = new ValidationResult();
        
        for (MetadataValidationRule rule : rules) {
            if (rule.getIsActive()) {
                ValidationRuleResult ruleResult = executeMetadataRule(rule, metadata, data);
                result.addRuleResult(ruleResult);
            }
        }
        
        return result;
    }
    
    /**
     * 执行单个元数据规则
     */
    private ValidationRuleResult executeMetadataRule(MetadataValidationRule rule, 
                                                   BaseMetadata metadata, Object data) {
        try {
            // 解析基于元数据的规则表达式
            RuleExpression expression = parseMetadataRuleExpression(rule.getExpression(), metadata);
            
            // 执行规则判断
            boolean isValid = evaluateMetadataRule(expression, data, metadata);
            
            if (isValid) {
                return ValidationRuleResult.success(rule.getName());
            } else {
                // 获取本地化错误消息
                String localizedErrorMessage = getLocalizedErrorMessage(rule, metadata);
                return ValidationRuleResult.failure(rule.getName(), localizedErrorMessage);
            }
            
        } catch (Exception e) {
            return ValidationRuleResult.error(rule.getName(), "Rule execution error: " + e.getMessage());
        }
    }
    
    /**
     * 解析基于元数据的规则表达式
     */
    private RuleExpression parseMetadataRuleExpression(String expression, BaseMetadata metadata) {
        // 解析表达式中的元数据引用
        // 例如: "property('name').length() >= 3" 中的 'name' 引用元数据属性
        return MetadataExpressionParser.parse(expression, metadata);
    }
    
    /**
     * 评估基于元数据的规则
     */
    private boolean evaluateMetadataRule(RuleExpression expression, Object data, BaseMetadata metadata) {
        // 根据元数据类型执行相应的评估逻辑
        switch (metadata.getType()) {
            case ENTITY:
                return evaluateEntityRule(expression, data, (EntityMetadata) metadata);
            case PROPERTY:
                return evaluatePropertyRule(expression, data, (PropertyMetadata) metadata);
            case RELATIONSHIP:
                return evaluateRelationshipRule(expression, data, (RelationshipMetadata) metadata);
            default:
                throw new UnsupportedMetadataTypeException("Unsupported metadata type: " + metadata.getType());
        }
    }
}
```

#### 5.2.3 前后端可配置的规则执行

```java
@Component
public class ConfigurableValidationExecutor {
    
    @Autowired
    private MetadataDrivenValidationExecutor metadataExecutor;
    
    @Autowired
    private ValidationConfigurationService configService;
    
    /**
     * 前端可配置的校验规则执行
     */
    public ValidationResult executeFrontendValidation(String metadataId, String trigger, 
                                                    String tenantId, Object data, 
                                                    ValidationConfig config) {
        // 获取前端配置的校验规则
        List<FrontendValidationRule> frontendRules = config.getFrontendRules();
        
        ValidationResult result = new ValidationResult();
        
        // 执行前端配置的规则
        for (FrontendValidationRule rule : frontendRules) {
            ValidationRuleResult ruleResult = executeFrontendRule(rule, data);
            result.addRuleResult(ruleResult);
            
            // 根据配置决定是否继续执行
            if (config.isStopOnFirstError() && ruleResult.isError()) {
                break;
            }
        }
        
        // 执行后端元数据规则
        ValidationResult backendResult = metadataExecutor.executeMetadataValidation(
            metadataId, trigger, tenantId, data);
        result.merge(backendResult);
        
        return result;
    }
    
    /**
     * 动态条件化规则执行
     */
    public ValidationResult executeConditionalValidation(String metadataId, String trigger, 
                                                       String tenantId, Object data, 
                                                       ValidationContext context) {
        // 获取动态条件
        List<ValidationCondition> conditions = getDynamicConditions(metadataId, trigger, tenantId, context);
        
        ValidationResult result = new ValidationResult();
        
        for (ValidationCondition condition : conditions) {
            // 检查条件是否满足
            if (evaluateCondition(condition, context)) {
                // 执行条件满足时的规则
                ValidationResult conditionResult = metadataExecutor.executeMetadataValidation(
                    metadataId, trigger, tenantId, data);
                result.merge(conditionResult);
            }
        }
        
        return result;
    }
    
    /**
     * 评估动态条件
     */
    private boolean evaluateCondition(ValidationCondition condition, ValidationContext context) {
        // 支持多种条件类型
        switch (condition.getType()) {
            case USER_ROLE:
                return evaluateUserRoleCondition(condition, context);
            case TENANT_CONFIG:
                return evaluateTenantConfigCondition(condition, context);
            case BUSINESS_RULE:
                return evaluateBusinessRuleCondition(condition, context);
            case TIME_BASED:
                return evaluateTimeBasedCondition(condition, context);
            default:
                return false;
        }
    }
}
```

#### 5.1.2 校验规则构建器

```java
@Component
public class ValidationRuleBuilder {
    
    /**
     * 构建字段校验规则
     */
    public ValidationRule buildFieldValidationRule(String fieldName, String ruleType, 
                                                 Object ruleValue, String errorMessage) {
        ValidationRule rule = new ValidationRule();
        rule.setName(fieldName + "_" + ruleType);
        rule.setDescription("Field validation rule for " + fieldName);
        rule.setRuleType(RuleType.FIELD);
        rule.setExpression(buildFieldExpression(fieldName, ruleType, ruleValue));
        rule.setErrorMessage(errorMessage);
        rule.setSeverity(Severity.ERROR);
        rule.setPriority(100);
        rule.setIsActive(true);
        
        return rule;
    }
    
    /**
     * 构建实体校验规则
     */
    public ValidationRule buildEntityValidationRule(String ruleName, String expression, 
                                                  String errorMessage) {
        ValidationRule rule = new ValidationRule();
        rule.setName(ruleName);
        rule.setDescription("Entity validation rule: " + ruleName);
        rule.setRuleType(RuleType.ENTITY);
        rule.setExpression(expression);
        rule.setErrorMessage(errorMessage);
        rule.setSeverity(Severity.ERROR);
        rule.setPriority(200);
        rule.setIsActive(true);
        
        return rule;
    }
    
    /**
     * 构建业务校验规则
     */
    public ValidationRule buildBusinessValidationRule(String ruleName, String expression, 
                                                     String errorMessage) {
        ValidationRule rule = new ValidationRule();
        rule.setName(ruleName);
        rule.setDescription("Business validation rule: " + ruleName);
        rule.setRuleType(RuleType.BUSINESS);
        rule.setExpression(expression);
        rule.setErrorMessage(errorMessage);
        rule.setSeverity(Severity.ERROR);
        rule.setPriority(300);
        rule.setIsActive(true);
        
        return rule;
    }
    
    /**
     * 构建字段表达式
     */
    private String buildFieldExpression(String fieldName, String ruleType, Object ruleValue) {
        switch (ruleType) {
            case "required":
                return fieldName + " != null && " + fieldName + ".toString().trim().length() > 0";
            case "minLength":
                return fieldName + " != null && " + fieldName + ".toString().length() >= " + ruleValue;
            case "maxLength":
                return fieldName + " != null && " + fieldName + ".toString().length() <= " + ruleValue;
            case "pattern":
                return fieldName + " != null && " + fieldName + ".toString().matches(\"" + ruleValue + "\")";
            case "range":
                String[] range = ruleValue.toString().split(",");
                return fieldName + " >= " + range[0] + " && " + fieldName + " <= " + range[1];
            default:
                throw new UnsupportedRuleTypeException("Unsupported rule type: " + ruleType);
        }
    }
}
```

## 6. 配置管理

### 6.1 多语言配置

```yaml
# application-multilingual.yml
multilingual:
  default-locale: "zh-CN"
  supported-locales:
    - "zh-CN"
    - "en-US"
    - "ja-JP"
  fallback-locale: "en-US"
  cache:
    enabled: true
    ttl: 3600
  variables:
    supported-patterns:
      - "\\{([^}]+)\\}"
      - "\\$\\{([^}]+)\\}"
```

### 6.2 SaaS配置

```yaml
# application-saas.yml
saas:
  tenant-isolation:
    default-strategy: "ROW"
    supported-strategies:
      - "SCHEMA"
      - "TABLE"
      - "ROW"
  resource-quotas:
    default-max-users: 100
    default-max-storage: "10GB"
    default-max-api-calls: 10000
  features:
    - "user-management"
    - "data-export"
    - "advanced-reporting"
    - "api-access"
```

### 6.3 消息配置

```yaml
# application-message.yml
message:
  providers:
    email:
      default-provider: "smtp"
      smtp:
        host: "localhost"
        port: 587
        username: "${MAIL_USERNAME}"
        password: "${MAIL_PASSWORD}"
    sms:
      default-provider: "twilio"
      twilio:
        account-sid: "${TWILIO_ACCOUNT_SID}"
        auth-token: "${TWILIO_AUTH_TOKEN}"
        from-number: "${TWILIO_FROM_NUMBER}"
    push:
      default-provider: "firebase"
      firebase:
        server-key: "${FIREBASE_SERVER_KEY}"
  templates:
    cache:
      enabled: true
      ttl: 1800
  retry:
    max-attempts: 3
    backoff-delay: 1000
```

## 7. 性能优化

### 7.1 多语言缓存

- **本地化文本缓存**: 缓存解析后的本地化文本
- **术语缓存**: 缓存常用的术语定义
- **模板缓存**: 缓存消息模板和校验规则

### 7.2 租户隔离优化

- **连接池隔离**: 为不同租户维护独立的数据库连接池
- **缓存隔离**: 租户级别的缓存策略
- **查询优化**: 租户特定的查询优化

### 7.3 消息发送优化

- **异步发送**: 非关键消息异步发送
- **批量发送**: 批量处理消息发送
- **失败重试**: 智能重试机制

## 8. 监控和运维

### 8.1 多语言监控

- **语言使用统计**: 监控不同语言的使用情况
- **翻译覆盖率**: 监控翻译的完整程度
- **性能指标**: 监控多语言处理的性能

### 8.2 SaaS监控

- **租户资源使用**: 监控租户的资源消耗
- **隔离策略效果**: 监控不同隔离策略的性能
- **配额使用情况**: 监控配额的使用和告警

### 8.3 消息监控

- **发送成功率**: 监控消息发送的成功率
- **发送延迟**: 监控消息发送的延迟
- **提供者性能**: 监控不同消息提供者的性能
