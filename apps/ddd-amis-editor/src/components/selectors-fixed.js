// 组件选择器基础类
class ComponentSelectorBase {
    constructor() {
        this.modalId = 'component-selector-modal';
    }

    // 共享的遍历子组件方法
    traverseChildren(schema, callback) {
        if (schema.body) {
            if (Array.isArray(schema.body)) {
                schema.body.forEach(item => callback(item));
            } else {
                callback(schema.body);
            }
        }
        
        if (schema.columns && Array.isArray(schema.columns)) {
            schema.columns.forEach(item => callback(item));
        }
        
        if (schema.tabs && Array.isArray(schema.tabs)) {
            schema.tabs.forEach(tab => {
                if (tab.body) {
                    callback(tab.body);
                }
            });
        }
    }

    // 通用的模态框显示方法
    showModal(title, content, callback) {
        try {
            const modalHtml = `
                <div class="modal" id="${this.modalId}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${title}</h3>
                            <span class="close" onclick="window.componentSelector.closeModal()">&times;</span>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="window.componentSelector.closeModal()">取消</button>
                            <button class="btn btn-primary" onclick="window.componentSelector.confirmSelection()">确认</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            this.currentCallback = callback;
            
        } catch (error) {
            console.error('显示模态框失败:', error);
            DDDEditorUtils.showStatus('模态框显示失败', 'error');
        }
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.remove();
        }
        this.currentCallback = null;
    }

    // 确认选择
    confirmSelection() {
        if (this.currentCallback && this.selectedItem) {
            this.currentCallback(this.selectedItem);
        }
        this.closeModal();
    }
}

// 实体选择器类
class EntitySelector extends ComponentSelectorBase {
    constructor() {
        super();
        this.modalId = 'entity-selector-modal';
    }

    // 显示实体选择器
    show(callback) {
        try {
            const entities = this.getAvailableEntities();
            
            if (entities.length === 0) {
                DDDEditorUtils.showStatus('当前没有可选择的实体组件', 'warning');
                return;
            }

            this.renderModal(entities, callback);
            
        } catch (error) {
            console.error('显示实体选择器失败:', error);
            DDDEditorUtils.showStatus('实体选择器加载失败', 'error');
        }
    }

    // 获取可用实体列表
    getAvailableEntities() {
        if (!window.dddEditor || !window.dddEditor.currentSchema) {
            return [];
        }

        const schema = window.dddEditor.currentSchema;
        const entities = [];

        // 递归查找实体组件
        const traverseSchema = (item) => {
            if (item.type === 'card' && item.header && item.header.title) {
                const title = item.header.title;
                if (title.includes('实体') || title.includes('Entity')) {
                    entities.push(this.parseEntityFromComponent(item));
                }
            }
        };

        if (schema && schema.body) {
            this.traverseChildren(schema, traverseSchema);
        }
        
        return entities.filter(entity => entity !== null);
    }

    // 从组件中解析实体信息
    parseEntityFromComponent(component) {
        try {
            const headerTitle = component.header?.title || '';
            const name = headerTitle.replace(/📦|🎯|📋/g, '').trim();
            
            let attributes = [];
            let description = '领域实体';
            
            // 尝试从组件内容中提取信息
            if (component.body && Array.isArray(component.body)) {
                component.body.forEach(item => {
                    if (item.name === 'attributes') {
                        attributes = item.value || [];
                    }
                    if (item.name === 'description') {
                        description = item.value || description;
                    }
                });
            }
            
            return {
                name,
                description,
                attributes,
                component
            };
            
        } catch (error) {
            console.error('解析实体组件失败:', error);
            return null;
        }
    }

    // 渲染选择器模态框
    renderModal(entities, callback) {
        const modalSchema = {
            type: 'dialog',
            title: '📦 选择实体',
            size: 'md',
            body: [
                {
                    type: 'alert',
                    level: 'info',
                    body: '请选择要关联的实体组件'
                },
                {
                    type: 'select',
                    name: 'selectedEntity',
                    label: '可用实体',
                    placeholder: '请选择实体',
                    options: entities.map(entity => ({
                        label: `${entity.name} - ${entity.description}`,
                        value: entity.name,
                        entity: entity
                    })),
                    required: true
                },
                {
                    type: 'static',
                    name: 'entityPreview',
                    label: '实体详情',
                    tpl: '请先选择实体',
                    visibleOn: '!selectedEntity'
                }
            ],
            actions: [
                {
                    type: 'button',
                    label: '取消',
                    actionType: 'cancel'
                },
                {
                    type: 'button',
                    label: '确认选择',
                    level: 'primary',
                    actionType: 'confirm'
                }
            ]
        };

        DDDEditorUtils.showAMISModal(modalSchema, (result) => {
            if (result && result.selectedEntity) {
                const selectedEntity = entities.find(e => e.name === result.selectedEntity);
                if (selectedEntity && callback) {
                    callback(selectedEntity);
                }
            }
        });
    }
}

// 服务选择器类
class ServiceSelector extends ComponentSelectorBase {
    constructor() {
        super();
        this.modalId = 'service-selector-modal';
    }

    // 显示服务选择器
    show(callback) {
        try {
            const services = this.getAvailableServices();
            
            if (services.length === 0) {
                DDDEditorUtils.showStatus('当前没有可选择的服务组件', 'warning');
                return;
            }

            this.renderModal(services, callback);
            
        } catch (error) {
            console.error('显示服务选择器失败:', error);
            DDDEditorUtils.showStatus('服务选择器加载失败', 'error');
        }
    }

    // 获取可用服务列表
    getAvailableServices() {
        if (!window.dddEditor || !window.dddEditor.currentSchema) {
            return [];
        }

        const schema = window.dddEditor.currentSchema;
        const services = [];

        // 递归查找服务组件
        const traverseSchema = (item) => {
            if (item.type === 'card' && item.header && item.header.title) {
                const title = item.header.title;
                if (title.includes('服务') || title.includes('Service')) {
                    services.push(this.parseServiceFromComponent(item));
                }
            }
        };

        if (schema && schema.body) {
            this.traverseChildren(schema, traverseSchema);
        }
        
        return services.filter(service => service !== null);
    }

    // 从组件中解析服务信息
    parseServiceFromComponent(component) {
        try {
            const headerTitle = component.header?.title || '';
            const name = headerTitle.replace(/🔧|⚙️|📋/g, '').trim();
            
            let methods = [];
            let description = '领域服务';
            
            // 尝试从组件内容中提取信息
            if (component.body && Array.isArray(component.body)) {
                component.body.forEach(item => {
                    if (item.name === 'methods') {
                        methods = item.value || [];
                    }
                    if (item.name === 'description') {
                        description = item.value || description;
                    }
                });
            }
            
            return {
                name,
                description,
                methods,
                component
            };
            
        } catch (error) {
            console.error('解析服务组件失败:', error);
            return null;
        }
    }

    // 渲染选择器模态框
    renderModal(services, callback) {
        const modalSchema = {
            type: 'dialog',
            title: '🔧 选择服务',
            size: 'md',
            body: [
                {
                    type: 'alert',
                    level: 'info',
                    body: '请选择要关联的服务组件'
                },
                {
                    type: 'select',
                    name: 'selectedService',
                    label: '可用服务',
                    placeholder: '请选择服务',
                    options: services.map(service => ({
                        label: `${service.name} - ${service.description}`,
                        value: service.name,
                        service: service
                    })),
                    required: true
                },
                {
                    type: 'static',
                    name: 'servicePreview',
                    label: '服务详情',
                    tpl: '请先选择服务',
                    visibleOn: '!selectedService'
                }
            ],
            actions: [
                {
                    type: 'button',
                    label: '取消',
                    actionType: 'cancel'
                },
                {
                    type: 'button',
                    label: '确认选择',
                    level: 'primary',
                    actionType: 'confirm'
                }
            ]
        };

        DDDEditorUtils.showAMISModal(modalSchema, (result) => {
            if (result && result.selectedService) {
                const selectedService = services.find(s => s.name === result.selectedService);
                if (selectedService && callback) {
                    callback(selectedService);
                }
            }
        });
    }
}

// 创建全局实例
window.ComponentSelectorBase = ComponentSelectorBase;
window.EntitySelector = EntitySelector;
window.ServiceSelector = ServiceSelector;
window.entitySelector = new EntitySelector();
window.serviceSelector = new ServiceSelector();
