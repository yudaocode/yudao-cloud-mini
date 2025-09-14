// 实体选择器组件
class EntitySelector {
    constructor() {
        this.currentCallback = null;
        this.currentFieldName = null;
        this.availableEntities = [];
    }

    // 显示实体选择器
    show(callback, fieldName) {
        const entities = this.getAllEntities();
        
        if (entities.length === 0) {
            DDDEditorUtils.showStatus('当前页面没有找到任何实体组件，请先添加实体组件', 'warning');
            return;
        }
        
        this.currentCallback = callback;
        this.currentFieldName = fieldName;
        this.availableEntities = entities;
        
        this.renderModal(entities);
    }

    // 获取所有实体
    getAllEntities() {
        const entities = [];
        
        const traverseSchema = (schema) => {
            if (schema && typeof schema === 'object') {
                // 检查是否是实体组件
                if (this.isEntityComponent(schema)) {
                    const entityInfo = this.extractEntityInfo(schema);
                    if (entityInfo) {
                        entities.push(entityInfo);
                    }
                }
                
                // 递归遍历
                this.traverseChildren(schema, traverseSchema);
            }
        };
        
        if (window.DDDEditor && window.DDDEditor.getCurrentSchema) {
            traverseSchema(window.DDDEditor.getCurrentSchema());
        }
        
        return entities;
    }

    // 检查是否是实体组件
    isEntityComponent(schema) {
        return schema.type === 'card' && 
               schema.header && 
               schema.header.title && 
               (schema.header.title.includes('实体') || 
                schema.header.title.includes('Entity') ||
                schema.header.title.includes('聚合根') ||
                schema.header.title.includes('Aggregate'));
    }

    // 提取实体信息
    extractEntityInfo(schema) {
        const formBody = schema.body && schema.body.body;
        if (formBody && Array.isArray(formBody)) {
            const nameField = formBody.find(field => 
                field.name === 'name' || 
                field.name === 'aggregateName' ||
                field.name === 'entityName'
            );
            
            const typeField = formBody.find(field => 
                field.name === 'type' || 
                field.name === 'entityType'
            );
            
            if (nameField) {
                return {
                    name: nameField.value || nameField.placeholder || '未命名实体',
                    type: typeField ? typeField.value : 'entity',
                    schema: schema,
                    title: schema.header.title
                };
            }
        }
        
        return null;
    }

    // 遍历子组件
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
    }

    // 渲染模态框
    renderModal(entities) {
        const entitiesHtml = entities.map((entity, index) => `
            <div class="list-item entity-item" onclick="window.entitySelector.selectEntity(${index})">
                <div class="list-item-title">${entity.name}</div>
                <div class="list-item-description">
                    类型: ${this.getEntityTypeLabel(entity.type)} | 
                    组件: ${entity.title}
                </div>
            </div>
        `).join('');
        
        const modalHtml = `
            <div class="entity-selector-modal modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">🎯 选择关联实体</h3>
                        <button class="modal-close" onclick="window.entitySelector.close()">&times;</button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <input type="text" class="search-input" placeholder="搜索实体..." 
                               onkeyup="window.entitySelector.filterEntities(this.value)">
                    </div>
                    <div id="entitiesContainer">
                        ${entitiesHtml}
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 获取实体类型标签
    getEntityTypeLabel(type) {
        const typeMap = {
            'aggregate_root': '聚合根',
            'entity': '实体',
            'value_object': '值对象'
        };
        return typeMap[type] || '实体';
    }

    // 选择实体
    selectEntity(index) {
        const entity = this.availableEntities[index];
        
        if (this.currentCallback) {
            this.currentCallback(entity);
        } else if (this.currentFieldName) {
            // 后备方案：直接设置字段值
            const input = document.querySelector(`[name="${this.currentFieldName}"]`);
            if (input) {
                if (input.tagName === 'TEXTAREA' && this.currentFieldName === 'childEntities') {
                    // 对于子实体列表，追加而不是替换
                    const current = input.value || '';
                    const newValue = current ? current + '\n' + entity.name : entity.name;
                    input.value = newValue;
                } else {
                    input.value = entity.name;
                }
                
                // 触发change事件
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        
        this.close();
    }

    // 过滤实体
    filterEntities(keyword) {
        const entities = document.querySelectorAll('.entity-item');
        const searchText = keyword.toLowerCase();
        
        entities.forEach(entity => {
            const title = entity.querySelector('.list-item-title').textContent.toLowerCase();
            const description = entity.querySelector('.list-item-description').textContent.toLowerCase();
            
            if (title.includes(searchText) || description.includes(searchText)) {
                entity.style.display = 'block';
            } else {
                entity.style.display = 'none';
            }
        });
    }

    // 关闭选择器
    close() {
        const modal = document.querySelector('.entity-selector-modal');
        if (modal) {
            modal.remove();
        }
        
        this.currentCallback = null;
        this.currentFieldName = null;
        this.availableEntities = [];
    }
}

// 服务选择器组件
class ServiceSelector {
    constructor() {
        this.currentCallback = null;
        this.currentFieldName = null;
        this.availableServices = [];
    }

    // 显示服务选择器
    show(callback, fieldName) {
        const services = this.getAllServices();
        
        if (services.length === 0) {
            DDDEditorUtils.showStatus('当前页面没有找到任何服务组件，请先添加服务组件', 'warning');
            return;
        }
        
        this.currentCallback = callback;
        this.currentFieldName = fieldName;
        this.availableServices = services;
        
        this.renderModal(services);
    }

    // 获取所有服务
    getAllServices() {
        const services = [];
        
        const traverseSchema = (schema) => {
            if (schema && typeof schema === 'object') {
                // 检查是否是服务组件
                if (this.isServiceComponent(schema)) {
                    const serviceInfo = this.extractServiceInfo(schema);
                    if (serviceInfo) {
                        services.push(serviceInfo);
                    }
                }
                
                // 递归遍历
                this.traverseChildren(schema, traverseSchema);
            }
        };
        
        if (window.DDDEditor && window.DDDEditor.getCurrentSchema) {
            traverseSchema(window.DDDEditor.getCurrentSchema());
        }
        
        return services;
    }

    // 检查是否是服务组件
    isServiceComponent(schema) {
        return schema.type === 'card' && 
               schema.header && 
               schema.header.title && 
               (schema.header.title.includes('服务') || 
                schema.header.title.includes('Service'));
    }

    // 提取服务信息
    extractServiceInfo(schema) {
        const formBody = schema.body && schema.body.body;
        if (formBody && Array.isArray(formBody)) {
            const nameField = formBody.find(field => 
                field.name === 'serviceName'
            );
            
            const typeField = formBody.find(field => 
                field.name === 'serviceType'
            );
            
            if (nameField) {
                return {
                    name: nameField.value || nameField.placeholder || '未命名服务',
                    type: typeField ? typeField.value : 'domain_service',
                    schema: schema,
                    title: schema.header.title
                };
            }
        }
        
        return null;
    }

    // 遍历子组件
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
    }

    // 渲染模态框
    renderModal(services) {
        const servicesHtml = services.map((service, index) => `
            <div class="list-item service-item" onclick="window.serviceSelector.selectService(${index})">
                <div class="list-item-title">${service.name}</div>
                <div class="list-item-description">
                    类型: ${this.getServiceTypeLabel(service.type)} | 
                    组件: ${service.title}
                </div>
            </div>
        `).join('');
        
        const modalHtml = `
            <div class="service-selector-modal modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">⚙️ 选择关联服务</h3>
                        <button class="modal-close" onclick="window.serviceSelector.close()">&times;</button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <input type="text" class="search-input" placeholder="搜索服务..." 
                               onkeyup="window.serviceSelector.filterServices(this.value)">
                    </div>
                    <div id="servicesContainer">
                        ${servicesHtml}
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 获取服务类型标签
    getServiceTypeLabel(type) {
        const typeMap = {
            'application_service': '应用服务',
            'domain_service': '领域服务',
            'infrastructure_service': '基础设施服务'
        };
        return typeMap[type] || '领域服务';
    }

    // 选择服务
    selectService(index) {
        const service = this.availableServices[index];
        
        if (this.currentCallback) {
            this.currentCallback(service);
        } else if (this.currentFieldName) {
            const input = document.querySelector(`[name="${this.currentFieldName}"]`);
            if (input) {
                input.value = service.name;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        
        this.close();
    }

    // 过滤服务
    filterServices(keyword) {
        const services = document.querySelectorAll('.service-item');
        const searchText = keyword.toLowerCase();
        
        services.forEach(service => {
            const title = service.querySelector('.list-item-title').textContent.toLowerCase();
            const description = service.querySelector('.list-item-description').textContent.toLowerCase();
            
            if (title.includes(searchText) || description.includes(searchText)) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        });
    }

    // 关闭选择器
    close() {
        const modal = document.querySelector('.service-selector-modal');
        if (modal) {
            modal.remove();
        }
        
        this.currentCallback = null;
        this.currentFieldName = null;
        this.availableServices = [];
    }
}

// 创建全局实例
window.entitySelector = new EntitySelector();
window.serviceSelector = new ServiceSelector();

// 简化的选择器调用函数
function selectEntityForField(fieldName) {
    window.entitySelector.show(null, fieldName);
}

function selectEntityForRepository() {
    selectEntityForField('entityType');
}

function selectEntityForService() {
    selectEntityForField('dependentEntities');
}

function selectEntityForAggregateRoot() {
    selectEntityForField('rootEntity');
}

function addEntityToAggregate() {
    selectEntityForField('childEntities');
}

function selectServiceForField(fieldName) {
    window.serviceSelector.show(null, fieldName);
}
