// DDD组件模板定义
class DDDComponentTemplates {
    // 获取所有DDD组件模板
    static getTemplates() {
        return {
            // DDD核心组件
            'entity': this.createEntityTemplate(),
            'aggregate': this.createAggregateTemplate(),
            'service': this.createServiceTemplate(),
            'repository': this.createRepositoryTemplate(),
            'valueObject': this.createValueObjectTemplate(),
            'domainEvent': this.createDomainEventTemplate(),
            
            // 界面组件
            'form': this.createFormTemplate(),
            'crud': this.createCrudTemplate(),
            'table': this.createTableTemplate(),
            'chart': this.createChartTemplate(),
            
            // 输入组件
            'input-text': this.createInputTextTemplate(),
            'textarea': this.createTextareaTemplate(),
            'select': this.createSelectTemplate(),
            'button': this.createButtonTemplate(),
            
            // 布局组件
            'tpl': this.createTemplateTemplate(),
            'divider': this.createDividerTemplate(),
            'card': this.createCardTemplate(),
            'grid': this.createGridTemplate()
        };
    }

    // 实体模板
    static createEntityTemplate() {
        return {
            type: 'card',
            header: { title: '实体 - Entity', subTitle: 'DDD核心业务对象' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'name', label: '实体名称', required: true },
                    { type: 'textarea', name: 'description', label: '实体描述', rows: 3 },
                    { type: 'select', name: 'type', label: '实体类型', options: [
                        { label: '聚合根', value: 'aggregate_root' },
                        { label: '实体', value: 'entity' },
                        { label: '值对象', value: 'value_object' }
                    ]},
                    { type: 'textarea', name: 'attributes', label: '属性定义', rows: 4, placeholder: 'id: Long\nname: String\nemail: Email\nstatus: UserStatus' },
                    { type: 'textarea', name: 'methods', label: '方法定义', rows: 3, placeholder: 'activate()\ndeactivate()\nchangeEmail(email)' }
                ]
            }
        };
    }

    // 聚合根模板
    static createAggregateTemplate() {
        return {
            type: 'card',
            header: { title: '聚合根 - Aggregate Root', subTitle: 'DDD聚合边界定义' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'aggregateName', label: '聚合名称', required: true },
                    { type: 'textarea', name: 'description', label: '聚合描述', rows: 3 },
                    { 
                        type: 'group',
                        label: '聚合根实体',
                        body: [
                            { 
                                type: 'input-text', 
                                name: 'rootEntity', 
                                placeholder: '点击选择按钮选择聚合根实体',
                                required: true,
                                readOnly: true
                            },
                            { 
                                type: 'button', 
                                label: '选择聚合根', 
                                level: 'primary',
                                size: 'sm',
                                actionType: 'url',
                                url: 'javascript:selectEntityForAggregateRoot()'
                            }
                        ]
                    },
                    { 
                        type: 'group',
                        label: '包含实体',
                        body: [
                            { 
                                type: 'textarea', 
                                name: 'childEntities', 
                                placeholder: '聚合内的子实体列表（一行一个）',
                                rows: 3
                            },
                            { 
                                type: 'button', 
                                label: '添加实体', 
                                level: 'info',
                                size: 'sm',
                                actionType: 'url',
                                url: 'javascript:addEntityToAggregate()'
                            }
                        ]
                    },
                    { type: 'textarea', name: 'businessRules', label: '业务规则', rows: 3, placeholder: '描述聚合的业务不变量和规则' },
                    { type: 'textarea', name: 'domainEvents', label: '领域事件', rows: 3, placeholder: '聚合产生的领域事件列表' }
                ]
            }
        };
    }

    // 领域服务模板
    static createServiceTemplate() {
        return {
            type: 'card',
            header: { title: '领域服务 - Domain Service', subTitle: 'DDD业务逻辑服务' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'serviceName', label: '服务名称', required: true },
                    { type: 'textarea', name: 'description', label: '服务描述', rows: 3 },
                    { type: 'select', name: 'serviceType', label: '服务类型', options: [
                        { label: '应用服务', value: 'application_service' },
                        { label: '领域服务', value: 'domain_service' },
                        { label: '基础设施服务', value: 'infrastructure_service' }
                    ]},
                    { 
                        type: 'group',
                        label: '依赖实体',
                        body: [
                            { 
                                type: 'input-text', 
                                name: 'dependentEntities', 
                                placeholder: '点击选择按钮选择依赖的实体',
                                readOnly: true
                            },
                            { 
                                type: 'button', 
                                label: '选择实体', 
                                level: 'primary',
                                size: 'sm',
                                actionType: 'url',
                                url: 'javascript:selectEntityForService()'
                            }
                        ]
                    },
                    { type: 'textarea', name: 'methods', label: '服务方法', rows: 4, placeholder: 'processOrder(order)\ncalculateDiscount(customer)\nvalidateBusinessRule()' }
                ]
            }
        };
    }

    // 仓储模板
    static createRepositoryTemplate() {
        return {
            type: 'card',
            header: { title: '仓储 - Repository', subTitle: 'DDD数据访问抽象' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'repositoryName', label: '仓储名称', required: true },
                    { 
                        type: 'group',
                        label: '关联实体',
                        body: [
                            { 
                                type: 'input-text', 
                                name: 'entityType', 
                                placeholder: '点击选择实体按钮选择关联的实体',
                                required: true,
                                readOnly: true
                            },
                            { 
                                type: 'button', 
                                label: '选择实体', 
                                level: 'primary',
                                size: 'sm',
                                actionType: 'url',
                                url: 'javascript:selectEntityForRepository()'
                            }
                        ]
                    },
                    { type: 'textarea', name: 'methods', label: '仓储方法', rows: 4, placeholder: 'findById(id)\nsave(entity)\ndelete(entity)\nfindByCondition(criteria)' },
                    { type: 'textarea', name: 'queries', label: '查询方法', rows: 3, placeholder: 'findActiveUsers()\nfindByEmail(email)\nfindByDateRange(start, end)' }
                ]
            }
        };
    }

    // 值对象模板
    static createValueObjectTemplate() {
        return {
            type: 'card',
            header: { title: '值对象 - Value Object', subTitle: 'DDD不可变值对象' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'name', label: '值对象名称', required: true },
                    { type: 'textarea', name: 'description', label: '描述', rows: 2 },
                    { type: 'textarea', name: 'attributes', label: '属性定义', rows: 3, placeholder: 'street: String\ncity: String\nzipCode: String' },
                    { type: 'textarea', name: 'validations', label: '验证规则', rows: 3, placeholder: '邮编格式验证\n地址长度限制\n必填字段检查' },
                    { type: 'textarea', name: 'methods', label: '方法定义', rows: 2, placeholder: 'equals(other)\nhashCode()\ntoString()' }
                ]
            }
        };
    }

    // 领域事件模板
    static createDomainEventTemplate() {
        return {
            type: 'card',
            header: { title: '领域事件 - Domain Event', subTitle: 'DDD领域事件定义' },
            body: {
                type: 'form',
                mode: 'horizontal',
                body: [
                    { type: 'input-text', name: 'eventName', label: '事件名称', required: true },
                    { type: 'textarea', name: 'description', label: '事件描述', rows: 2 },
                    { type: 'input-text', name: 'aggregateId', label: '聚合标识', required: true },
                    { type: 'textarea', name: 'eventData', label: '事件数据', rows: 3, placeholder: 'userId: String\nemail: String\ntimestamp: DateTime' },
                    { type: 'select', name: 'eventType', label: '事件类型', options: [
                        { label: '创建事件', value: 'created' },
                        { label: '更新事件', value: 'updated' },
                        { label: '删除事件', value: 'deleted' },
                        { label: '业务事件', value: 'business' }
                    ]},
                    { type: 'textarea', name: 'handlers', label: '事件处理器', rows: 2, placeholder: 'SendWelcomeEmailHandler\nUpdateUserStatisticsHandler' }
                ]
            }
        };
    }

    // 表单模板
    static createFormTemplate() {
        return {
            type: 'form',
            title: '新建表单',
            mode: 'horizontal',
            body: [
                { type: 'input-text', name: 'name', label: '名称', required: true },
                { type: 'textarea', name: 'description', label: '描述', rows: 3 }
            ],
            actions: [
                { type: 'submit', label: '提交', level: 'primary' },
                { type: 'reset', label: '重置' }
            ]
        };
    }

    // CRUD模板
    static createCrudTemplate() {
        return {
            type: 'crud',
            api: '/api/sample',
            syncLocation: false,
            title: 'CRUD数据管理',
            headerToolbar: [
                { type: 'button', label: '新增', actionType: 'dialog', level: 'primary' }
            ],
            columns: [
                { name: 'id', label: 'ID', sortable: true },
                { name: 'name', label: '名称', searchable: true },
                { name: 'status', label: '状态', type: 'status' },
                { name: 'createTime', label: '创建时间', type: 'datetime' },
                { type: 'operation', label: '操作', buttons: [
                    { label: '编辑', level: 'link' },
                    { label: '删除', level: 'link' }
                ]}
            ]
        };
    }

    // 表格模板
    static createTableTemplate() {
        return {
            type: 'table',
            title: '数据表格',
            data: {
                items: []
            },
            columns: [
                { name: 'id', label: 'ID' },
                { name: 'name', label: '名称' },
                { name: 'status', label: '状态' }
            ]
        };
    }

    // 图表模板
    static createChartTemplate() {
        return {
            type: 'chart',
            title: '数据图表',
            config: {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    datasets: [{
                        label: '数据趋势',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }
            }
        };
    }

    // 文本输入模板
    static createInputTextTemplate() {
        return {
            type: 'input-text',
            name: 'textField',
            label: '文本输入',
            placeholder: '请输入文本'
        };
    }

    // 文本域模板
    static createTextareaTemplate() {
        return {
            type: 'textarea',
            name: 'textareaField',
            label: '多行文本',
            rows: 3,
            placeholder: '请输入多行文本'
        };
    }

    // 选择器模板
    static createSelectTemplate() {
        return {
            type: 'select',
            name: 'selectField',
            label: '选择器',
            options: [
                { label: '选项1', value: 'option1' },
                { label: '选项2', value: 'option2' },
                { label: '选项3', value: 'option3' }
            ]
        };
    }

    // 按钮模板
    static createButtonTemplate() {
        return {
            type: 'button',
            label: '按钮',
            level: 'primary'
        };
    }

    // 模板组件
    static createTemplateTemplate() {
        return {
            type: 'tpl',
            tpl: '<div>这是一个模板组件</div>'
        };
    }

    // 分割线模板
    static createDividerTemplate() {
        return {
            type: 'divider',
            title: '分割线'
        };
    }

    // 卡片模板
    static createCardTemplate() {
        return {
            type: 'card',
            header: {
                title: '卡片标题',
                subTitle: '子标题'
            },
            body: {
                type: 'tpl',
                tpl: '<p>卡片内容</p>'
            }
        };
    }

    // 网格模板
    static createGridTemplate() {
        return {
            type: 'grid',
            columns: [
                {
                    md: 6,
                    body: {
                        type: 'tpl',
                        tpl: '<div style="background: #f5f5f5; padding: 20px; text-align: center;">左侧内容</div>'
                    }
                },
                {
                    md: 6,
                    body: {
                        type: 'tpl',
                        tpl: '<div style="background: #e6f7ff; padding: 20px; text-align: center;">右侧内容</div>'
                    }
                }
            ]
        };
    }

    // 根据类型创建组件模板
    static createTemplate(type) {
        const templates = this.getTemplates();
        const template = templates[type];
        
        if (!template) {
            console.warn(`未找到类型为 ${type} 的组件模板`);
            return this.createCardTemplate(); // 返回默认模板
        }

        return DDDEditorUtils.deepClone(template);
    }

    // 获取组件分类
    static getComponentCategories() {
        return {
            'DDD核心': [
                { type: 'entity', label: '实体', icon: '🏗️' },
                { type: 'aggregate', label: '聚合根', icon: '🎯' },
                { type: 'service', label: '领域服务', icon: '⚙️' },
                { type: 'repository', label: '仓储', icon: '🗃️' },
                { type: 'valueObject', label: '值对象', icon: '💎' },
                { type: 'domainEvent', label: '领域事件', icon: '📨' }
            ],
            '界面组件': [
                { type: 'form', label: '表单', icon: '📝' },
                { type: 'crud', label: 'CRUD', icon: '📊' },
                { type: 'table', label: '表格', icon: '📋' },
                { type: 'chart', label: '图表', icon: '📈' }
            ],
            '输入组件': [
                { type: 'input-text', label: '文本框', icon: '✏️' },
                { type: 'textarea', label: '文本域', icon: '📝' },
                { type: 'select', label: '选择器', icon: '📋' },
                { type: 'button', label: '按钮', icon: '🔘' }
            ],
            '布局组件': [
                { type: 'card', label: '卡片', icon: '🃏' },
                { type: 'grid', label: '网格', icon: '⚏' },
                { type: 'tpl', label: '模板', icon: '📄' },
                { type: 'divider', label: '分割线', icon: '➖' }
            ]
        };
    }
}

// 导出组件模板类
window.DDDComponentTemplates = DDDComponentTemplates;
