import { DDDPlatformService } from '../dddPlatformService';

describe('DDDPlatformService', () => {
  let service: DDDPlatformService;

  beforeEach(() => {
    service = DDDPlatformService.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = DDDPlatformService.getInstance();
      const instance2 = DDDPlatformService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getModuleSchema', () => {
    it('should generate ubiquitous language schema', async () => {
      const schema = await service.getModuleSchema('ubiquitous-language');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('📚 统一语言管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('tabs');
    });

    it('should generate strategic design schema', async () => {
      const schema = await service.getModuleSchema('strategic-design');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('🏗️ 战略设计管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('grid');
    });

    it('should generate tactical design schema', async () => {
      const schema = await service.getModuleSchema('tactical-design');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('⚙️ 战术设计管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('tabs');
    });

    it('should generate implementation mapping schema', async () => {
      const schema = await service.getModuleSchema('implementation-mapping');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('🔗 实现映射管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('crud');
    });

    it('should generate DTO management schema', async () => {
      const schema = await service.getModuleSchema('data-transfer-objects');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('📄 DTO管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('crud');
    });

    it('should generate amis-screen schema', async () => {
      const schema = await service.getModuleSchema('amis-screen');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('🖥️ amis-screen管理');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('grid');
    });

    it('should generate code generation schema', async () => {
      const schema = await service.getModuleSchema('code-generation');
      expect(schema).toBeDefined();
      expect(schema.type).toBe('page');
      expect(schema.title).toBe('💻 代码生成');
      expect(schema.body).toBeDefined();
      expect(schema.body[0].type).toBe('grid');
    });

    it('should throw error for unknown module', async () => {
      await expect(service.getModuleSchema('unknown-module')).rejects.toThrow('未知模块: unknown-module');
    });
  });

  describe('generateAmisConfig', () => {
    it('should generate CRUD config', () => {
      const config = service.generateAmisConfig('crud', {
        api: '/api/test',
        title: 'Test CRUD',
        columns: [{ name: 'id', label: 'ID' }]
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('crud');
      expect(config.api).toBe('/api/test');
      expect(config.title).toBe('Test CRUD');
      expect(config.columns).toHaveLength(1);
      expect(config.headerToolbar).toBeDefined();
      expect(config.filter).toBeDefined();
    });

    it('should generate form config', () => {
      const config = service.generateAmisConfig('form', {
        api: '/api/test',
        title: 'Test Form',
        body: [{ type: 'input-text', name: 'name' }]
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('form');
      expect(config.api).toBe('/api/test');
      expect(config.title).toBe('Test Form');
      expect(config.body).toHaveLength(1);
      expect(config.actions).toBeDefined();
    });

    it('should generate detail config', () => {
      const config = service.generateAmisConfig('detail', {
        api: '/api/test',
        title: 'Test Detail',
        body: [{ type: 'text', content: 'Test content' }]
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('page');
      expect(config.title).toBe('Test Detail');
      expect(config.body).toHaveLength(1);
      expect(config.body[0].type).toBe('service');
    });

    it('should generate chart config', () => {
      const config = service.generateAmisConfig('chart', {
        api: '/api/test',
        title: 'Test Chart',
        chartType: 'line',
        height: 400
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('chart');
      expect(config.api).toBe('/api/test');
      expect(config.title).toBe('Test Chart');
      expect(config.chartType).toBe('line');
      expect(config.height).toBe(400);
    });

    it('should generate tabs config', () => {
      const config = service.generateAmisConfig('tabs', {
        tabs: [
          { title: 'Tab 1', body: { type: 'text', content: 'Content 1' } },
          { title: 'Tab 2', body: { type: 'text', content: 'Content 2' } }
        ]
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('tabs');
      expect(config.tabs).toHaveLength(2);
      expect(config.tabs[0].title).toBe('Tab 1');
      expect(config.tabs[1].title).toBe('Tab 2');
    });

    it('should generate grid config', () => {
      const config = service.generateAmisConfig('grid', {
        columns: [
          { body: { type: 'text', content: 'Column 1' } },
          { body: { type: 'text', content: 'Column 2' } }
        ],
        gap: '2rem'
      });

      expect(config).toBeDefined();
      expect(config.type).toBe('grid');
      expect(config.columns).toHaveLength(2);
      expect(config.gap).toBe('2rem');
    });

    it('should throw error for unknown template', () => {
      expect(() => service.generateAmisConfig('unknown', {})).toThrow('未知模板: unknown');
    });
  });

  describe('validateAmisConfig', () => {
    it('should validate empty config', () => {
      const result = service.validateAmisConfig(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('配置不能为空');
    });

    it('should validate config without type', () => {
      const result = service.validateAmisConfig({ title: 'Test' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('缺少type字段');
    });

    it('should validate CRUD config without api', () => {
      const result = service.validateAmisConfig({ type: 'crud', title: 'Test' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CRUD组件缺少api字段');
    });

    it('should validate form config without api', () => {
      const result = service.validateAmisConfig({ type: 'form', title: 'Test' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Form组件缺少api字段');
    });

    it('should validate config with invalid body', () => {
      const result = service.validateAmisConfig({ type: 'page', body: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('body字段必须是数组');
    });

    it('should validate valid config', () => {
      const result = service.validateAmisConfig({
        type: 'page',
        title: 'Test',
        body: []
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid CRUD config', () => {
      const result = service.validateAmisConfig({
        type: 'crud',
        api: '/api/test',
        title: 'Test',
        body: []
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate valid form config', () => {
      const result = service.validateAmisConfig({
        type: 'form',
        api: '/api/test',
        title: 'Test',
        body: []
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
