// DDD平台主编辑器
class DDDEditor {
    constructor() {
        this.currentSchema = {
            type: 'page',
            title: 'DDD设计平台',
            body: []
        };
        this.isInitialized = false;
        this.amis = null;
        this.selectedComponent = null;
        this.componentBindings = new Map();
    }

    // 初始化编辑器
    async init() {
        try {
            DDDEditorUtils.showLoading(true);
            
            // 检查AMIS是否加载
            if (typeof amis === 'undefined') {
                throw new Error('AMIS框架未正确加载');
            }
            
            this.amis = amis;
            
            // 初始化组件
            this.initializeToolbar();
            this.initializeCanvas();
            this.initializeEvents();
            this.showWelcomePage();
            
            this.isInitialized = true;
            DDDEditorUtils.showStatus('DDD平台编辑器初始化成功！', 'success');
            
        } catch (error) {
            console.error('初始化失败:', error);
            DDDEditorUtils.showStatus('初始化失败: ' + error.message, 'error');
        } finally {
            DDDEditorUtils.showLoading(false);
        }
    }

    // 初始化工具栏
    initializeToolbar() {
        const toolbar = document.querySelector('.component-toolbar-main');
        if (!toolbar) return;
        
        const categories = DDDComponentTemplates.getComponentCategories();
        
        let toolbarHTML = '';
        Object.keys(categories).forEach(categoryName => {
            const isCollapsed = categoryName !== 'DDD核心'; // 默认只展开DDD核心
            
            toolbarHTML += `
                <div class="toolbar-section">
                    <div class="toolbar-header ${isCollapsed ? 'collapsed' : ''}" 
                         onclick="this.classList.toggle('collapsed'); this.nextElementSibling.classList.toggle('collapsed')">
                        ${categoryName}
                    </div>
                    <div class="toolbar-content ${isCollapsed ? 'collapsed' : ''}">
            `;
            
            categories[categoryName].forEach(comp => {
                toolbarHTML += `
                    <button class="component-btn" 
                            onclick="window.dddEditor.addComponent('${comp.type}')" 
                            title="添加${comp.label}">
                        ${comp.icon} ${comp.label}
                    </button>
                `;
            });
            
            toolbarHTML += '</div></div>';
        });
        
        toolbar.innerHTML = toolbarHTML;
    }

    // 初始化画布
    initializeCanvas() {
        this.renderCanvas();
    }

    // 初始化事件
    initializeEvents() {
        // 绑定全局快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveSchema();
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newSchema();
                        break;
                }
            }
        });

        // 绑定窗口大小变化
        window.addEventListener('resize', DDDEditorUtils.throttle(() => {
            this.handleResize();
        }, 250));
    }

    // 显示欢迎页面
    showWelcomePage() {
        this.currentSchema = {
            type: 'page',
            title: '🎯 DDD元数据驱动开发平台',
            body: [
                {
                    type: 'grid',
                    columns: [
                        {
                            md: 8,
                            body: {
                                type: 'card',
                                header: {
                                    title: '👋 欢迎使用DDD设计平台',
                                    subTitle: '基于领域驱动设计(DDD)的可视化建模工具'
                                },
                                body: [
                                    {
                                        type: 'tpl',
                                        tpl: `
                                            <div style="line-height: 1.8; color: #666;">
                                                <h4 style="color: #1890ff; margin-top: 0;">🚀 平台特性</h4>
                                                <ul style="margin: 16px 0; padding-left: 20px;">
                                                    <li><strong>可视化建模</strong>：拖拽式设计DDD模型组件</li>
                                                    <li><strong>智能关联</strong>：实体、服务、仓储之间的智能引用</li>
                                                    <li><strong>代码生成</strong>：自动生成多语言DDD代码框架</li>
                                                    <li><strong>模板库</strong>：丰富的DDD最佳实践模板</li>
                                                    <li><strong>实时预览</strong>：所见即所得的设计体验</li>
                                                </ul>
                                                
                                                <h4 style="color: #52c41a; margin: 24px 0 8px 0;">🎯 快速开始</h4>
                                                <p>从左侧工具栏拖拽组件到画布，开始您的DDD设计之旅！</p>
                                            </div>
                                        `
                                    }
                                ]
                            }
                        },
                        {
                            md: 4,
                            body: {
                                type: 'card',
                                header: { title: '⚡ 快速操作' },
                                body: [
                                    {
                                        type: 'button-group',
                                        buttons: [
                                            {
                                                type: 'button',
                                                label: '📝 新建项目',
                                                level: 'primary',
                                                size: 'sm',
                                                actionType: 'url',
                                                url: 'javascript:window.dddEditor.newSchema()'
                                            },
                                            {
                                                type: 'button',
                                                label: '📂 导入Schema',
                                                level: 'info',
                                                size: 'sm',
                                                actionType: 'url',
                                                url: 'javascript:window.dddEditor.importSchema()'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'divider',
                                        title: '模板快速开始'
                                    },
                                    {
                                        type: 'button-group',
                                        buttons: [
                                            {
                                                type: 'button',
                                                label: '🏗️ 用户聚合',
                                                size: 'xs',
                                                actionType: 'url',
                                                url: 'javascript:window.dddEditor.loadTemplate("user_aggregate")'
                                            },
                                            {
                                                type: 'button',
                                                label: '📋 订单处理',
                                                size: 'xs',
                                                actionType: 'url',
                                                url: 'javascript:window.dddEditor.loadTemplate("order_processing")'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        };
        
        this.renderCanvas();
    }

    // 渲染画布
    renderCanvas() {
        const canvas = document.getElementById('canvas');
        if (!canvas || !this.amis) return;

        try {
            // 清空画布
            canvas.innerHTML = '';
            
            // 渲染AMIS组件
            const amisScoped = this.amis.embed(canvas, this.currentSchema, {
                theme: 'antd'
            });
            
            // 存储AMIS实例
            this.amisInstance = amisScoped;
            
        } catch (error) {
            console.error('渲染失败:', error);
            canvas.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #999;">
                    <h3>渲染失败</h3>
                    <p>${error.message}</p>
                    <button onclick="window.dddEditor.renderCanvas()" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px;">重新渲染</button>
                </div>
            `;
        }
    }

    // 添加组件
    addComponent(type) {
        try {
            const newComponent = DDDComponentTemplates.createTemplate(type);
            
            if (!this.currentSchema.body) {
                this.currentSchema.body = [];
            }
            
            this.currentSchema.body.push(newComponent);
            this.renderCanvas();
            DDDEditorUtils.showStatus(`已添加${type}组件`, 'success');
            
            // 保存到历史记录
            this.saveToHistory();
            
        } catch (error) {
            console.error('添加组件失败:', error);
            DDDEditorUtils.showStatus('添加组件失败: ' + error.message, 'error');
        }
    }

    // 新建Schema
    newSchema() {
        if (confirm('确定要新建项目吗？当前未保存的更改将丢失。')) {
            this.currentSchema = {
                type: 'page',
                title: 'DDD设计项目',
                body: []
            };
            this.renderCanvas();
            DDDEditorUtils.showStatus('已创建新项目', 'success');
        }
    }

    // 保存Schema
    saveSchema() {
        try {
            const schemaData = {
                schema: this.currentSchema,
                metadata: {
                    version: '1.0.0',
                    createTime: new Date().toISOString(),
                    bindings: Array.from(this.componentBindings.entries())
                }
            };
            
            const filename = `ddd-schema-${new Date().getTime()}.json`;
            const content = DDDEditorUtils.formatJSON(schemaData);
            
            DDDEditorUtils.downloadFile(content, filename);
            DDDEditorUtils.showStatus('Schema已保存', 'success');
            
        } catch (error) {
            console.error('保存失败:', error);
            DDDEditorUtils.showStatus('保存失败: ' + error.message, 'error');
        }
    }

    // 导入Schema
    importSchema() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                if (!file) return;
                
                const content = await DDDEditorUtils.readFile(file);
                const importedData = DDDEditorUtils.parseJSON(content);
                
                if (!importedData) {
                    throw new Error('无效的JSON文件');
                }
                
                // 判断是否是导出的完整格式
                if (importedData.schema && importedData.metadata) {
                    this.currentSchema = importedData.schema;
                    // 恢复组件绑定
                    if (importedData.metadata.bindings) {
                        this.componentBindings = new Map(importedData.metadata.bindings);
                    }
                } else {
                    this.currentSchema = importedData;
                }
                
                this.renderCanvas();
                DDDEditorUtils.showStatus('Schema导入成功！', 'success');
                
            } catch (error) {
                console.error('导入失败:', error);
                DDDEditorUtils.showStatus('导入失败: ' + error.message, 'error');
            }
        };
        
        input.click();
    }

    // 加载模板
    loadTemplate(templateType) {
        // 这里可以根据模板类型加载不同的预设模板
        const templates = {
            'user_aggregate': this.createUserAggregateTemplate(),
            'order_processing': this.createOrderProcessingTemplate()
        };
        
        const template = templates[templateType];
        if (template) {
            this.currentSchema = template;
            this.renderCanvas();
            DDDEditorUtils.showStatus('模板加载成功', 'success');
        }
    }

    // 创建用户聚合模板
    createUserAggregateTemplate() {
        return {
            type: 'page',
            title: 'DDD用户聚合示例',
            body: [
                DDDComponentTemplates.createTemplate('entity'),
                DDDComponentTemplates.createTemplate('repository'),
                DDDComponentTemplates.createTemplate('service')
            ]
        };
    }

    // 创建订单处理模板
    createOrderProcessingTemplate() {
        return {
            type: 'page',
            title: 'DDD订单处理示例',
            body: [
                DDDComponentTemplates.createTemplate('aggregate'),
                DDDComponentTemplates.createTemplate('service'),
                DDDComponentTemplates.createTemplate('domainEvent')
            ]
        };
    }

    // 预览代码
    previewCode() {
        // 实现代码预览功能
        console.log('代码预览功能待实现');
    }

    // 验证Schema
    validateSchema() {
        const result = DDDEditorUtils.validateSchema(this.currentSchema);
        
        if (result.valid) {
            DDDEditorUtils.showStatus('Schema验证通过！', 'success');
        } else {
            DDDEditorUtils.showStatus(`验证失败：${result.errors.join(', ')}`, 'error');
        }
        
        return result;
    }

    // 获取当前Schema
    getCurrentSchema() {
        return this.currentSchema;
    }

    // 设置当前Schema
    setCurrentSchema(schema) {
        this.currentSchema = schema;
        this.renderCanvas();
    }

    // 处理窗口大小变化
    handleResize() {
        if (DDDEditorUtils.isMobile()) {
            document.querySelector('.sidebar').style.width = '60px';
        } else {
            document.querySelector('.sidebar').style.width = '300px';
        }
        
        // 重新渲染画布以适应新尺寸
        this.renderCanvas();
    }

    // 保存到历史记录
    saveToHistory() {
        // 实现撤销/重做功能的历史记录
        // 这里可以实现历史记录管理
    }

    // 撤销操作
    undo() {
        // 实现撤销功能
        console.log('撤销功能待实现');
    }

    // 重做操作
    redo() {
        // 实现重做功能
        console.log('重做功能待实现');
    }
}

// 创建全局编辑器实例
window.DDDEditor = DDDEditor;
window.dddEditor = new DDDEditor();
