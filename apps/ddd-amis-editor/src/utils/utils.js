// 核心工具函数
class DDDEditorUtils {
    // 显示状态消息
    static showStatus(message, type = 'info', duration = 3000) {
        const statusEl = document.getElementById('status');
        if (!statusEl) return;
        
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        statusEl.style.display = 'block';
        
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, duration);
    }

    // 显示加载状态
    static showLoading(show = true) {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
    }

    // 深度克隆对象
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    // 生成唯一ID
    static generateId() {
        return 'comp_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // 格式化JSON
    static formatJSON(obj, indent = 2) {
        try {
            return JSON.stringify(obj, null, indent);
        } catch (error) {
            console.error('JSON格式化失败:', error);
            return '';
        }
    }

    // 解析JSON
    static parseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            console.error('JSON解析失败:', error);
            return null;
        }
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 获取元素的绝对位置
    static getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }

    // 检查是否为移动设备
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // 下载文件
    static downloadFile(content, filename, contentType = 'application/json') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 读取文件
    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }

    // 验证Schema
    static validateSchema(schema) {
        const errors = [];
        const warnings = [];

        if (!schema) {
            errors.push('Schema不能为空');
            return { valid: false, errors, warnings };
        }

        if (!schema.type) {
            errors.push('Schema必须包含type字段');
        }

        // 递归验证子组件
        const validateComponent = (component, path = '') => {
            if (!component.type) {
                errors.push(`组件 ${path} 缺少type字段`);
            }

            if (component.body) {
                if (Array.isArray(component.body)) {
                    component.body.forEach((child, index) => {
                        validateComponent(child, `${path}.body[${index}]`);
                    });
                } else {
                    validateComponent(component.body, `${path}.body`);
                }
            }

            if (component.columns && Array.isArray(component.columns)) {
                component.columns.forEach((child, index) => {
                    validateComponent(child, `${path}.columns[${index}]`);
                });
            }
        };

        validateComponent(schema);

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    // 搜索Schema中的组件
    static searchInSchema(schema, searchText) {
        const results = [];
        const search = searchText.toLowerCase();

        const searchComponent = (component, path = '') => {
            const componentText = JSON.stringify(component).toLowerCase();
            
            if (componentText.includes(search)) {
                results.push({
                    component,
                    path,
                    matches: this.findMatches(component, search)
                });
            }

            if (component.body) {
                if (Array.isArray(component.body)) {
                    component.body.forEach((child, index) => {
                        searchComponent(child, `${path}.body[${index}]`);
                    });
                } else {
                    searchComponent(component.body, `${path}.body`);
                }
            }

            if (component.columns && Array.isArray(component.columns)) {
                component.columns.forEach((child, index) => {
                    searchComponent(child, `${path}.columns[${index}]`);
                });
            }
        };

        searchComponent(schema);
        return results;
    }

    // 查找匹配的字段
    static findMatches(obj, search) {
        const matches = [];
        
        const findInObject = (object, prefix = '') => {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const value = object[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    
                    if (typeof value === 'string' && value.toLowerCase().includes(search)) {
                        matches.push({
                            key: fullKey,
                            value: value,
                            type: 'string'
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        findInObject(value, fullKey);
                    }
                }
            }
        };

        findInObject(obj);
        return matches;
    }

    // 获取组件统计信息
    static getSchemaStats(schema) {
        const stats = {
            totalComponents: 0,
            componentTypes: {},
            maxDepth: 0,
            hasValidation: false,
            hasAPI: false
        };

        const analyzeComponent = (component, depth = 0) => {
            stats.totalComponents++;
            stats.maxDepth = Math.max(stats.maxDepth, depth);

            const type = component.type || 'unknown';
            stats.componentTypes[type] = (stats.componentTypes[type] || 0) + 1;

            if (component.required || component.validations) {
                stats.hasValidation = true;
            }

            if (component.api || component.source) {
                stats.hasAPI = true;
            }

            if (component.body) {
                if (Array.isArray(component.body)) {
                    component.body.forEach(child => analyzeComponent(child, depth + 1));
                } else {
                    analyzeComponent(component.body, depth + 1);
                }
            }

            if (component.columns && Array.isArray(component.columns)) {
                component.columns.forEach(child => analyzeComponent(child, depth + 1));
            }
        };

        analyzeComponent(schema);
        return stats;
    }

    // 本地存储管理
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('存储失败:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('读取存储失败:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('删除存储失败:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('清空存储失败:', error);
                return false;
            }
        }
    };
}

// 导出工具类
window.DDDEditorUtils = DDDEditorUtils;
