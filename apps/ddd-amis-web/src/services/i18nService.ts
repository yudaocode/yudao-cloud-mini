// 国际化服务
export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  defaultLocale: string;
  fallbackLocale: string;
  supportedLocales: string[];
  loadPath: string;
  debug: boolean;
}

export class I18nService {
  private currentLocale: string = 'zh-CN';
  private fallbackLocale: string = 'en-US';
  private translations: Map<string, Translation> = new Map();
  private config: I18nConfig;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config?: Partial<I18nConfig>) {
    this.config = {
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en-US',
      supportedLocales: ['zh-CN', 'en-US', 'ja-JP'],
      loadPath: '/locales',
      debug: false,
      ...config
    };

    this.currentLocale = this.config.defaultLocale;
    this.fallbackLocale = this.config.fallbackLocale;
    
    this.initializeTranslations();
  }

  // 初始化翻译数据
  private async initializeTranslations(): Promise<void> {
    // 预加载默认语言和回退语言
    await this.loadLocale(this.currentLocale);
    if (this.currentLocale !== this.fallbackLocale) {
      await this.loadLocale(this.fallbackLocale);
    }
  }

  // 获取支持的语言列表
  getSupportedLocales(): Locale[] {
    return [
      {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        flag: '🇨🇳'
      },
      {
        code: 'en-US',
        name: 'English (US)',
        nativeName: 'English',
        flag: '🇺🇸'
      },
      {
        code: 'ja-JP',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵'
      }
    ];
  }

  // 获取当前语言
  getCurrentLocale(): string {
    return this.currentLocale;
  }

  // 设置语言
  async setLocale(locale: string): Promise<boolean> {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`不支持的语言: ${locale}`);
      return false;
    }

    if (this.currentLocale === locale) {
      return true;
    }

    // 加载新语言
    const success = await this.loadLocale(locale);
    if (success) {
      this.currentLocale = locale;
      this.saveLocalePreference(locale);
      this.notifyLocaleChange(locale);
      return true;
    }

    return false;
  }

  // 加载语言包
  private async loadLocale(locale: string): Promise<boolean> {
    if (this.translations.has(locale)) {
      return true;
    }

    try {
      const response = await fetch(`${this.config.loadPath}/${locale}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const translation = await response.json();
      this.translations.set(locale, translation);
      
      if (this.config.debug) {
        console.log(`已加载语言包: ${locale}`, translation);
      }

      return true;
    } catch (error) {
      console.error(`加载语言包失败 ${locale}:`, error);
      return false;
    }
  }

  // 翻译文本
  t(key: string, params?: Record<string, any>): string {
    const translation = this.getTranslation(key);
    
    if (!translation) {
      if (this.config.debug) {
        console.warn(`翻译键未找到: ${key}`);
      }
      return key;
    }

    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  // 获取翻译文本
  private getTranslation(key: string): string | null {
    // 尝试当前语言
    let translation = this.getNestedTranslation(this.translations.get(this.currentLocale), key);
    
    // 如果当前语言没有，尝试回退语言
    if (!translation && this.currentLocale !== this.fallbackLocale) {
      translation = this.getNestedTranslation(this.translations.get(this.fallbackLocale), key);
    }

    return translation;
  }

  // 获取嵌套翻译
  private getNestedTranslation(obj: Translation | undefined, key: string): string | null {
    if (!obj) return null;

    const keys = key.split('.');
    let current: any = obj;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  // 插值替换
  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  // 保存语言偏好
  private saveLocalePreference(locale: string): void {
    try {
      localStorage.setItem('preferred-locale', locale);
    } catch (error) {
      console.warn('无法保存语言偏好到本地存储:', error);
    }
  }

  // 加载语言偏好
  loadLocalePreference(): string | null {
    try {
      return localStorage.getItem('preferred-locale');
    } catch (error) {
      console.warn('无法从本地存储加载语言偏好:', error);
      return null;
    }
  }

  // 获取系统语言偏好
  getSystemLocale(): string {
    const systemLocale = navigator.language || navigator.languages?.[0] || 'en-US';
    
    // 尝试匹配支持的语言
    for (const supported of this.config.supportedLocales) {
      if (systemLocale.startsWith(supported) || systemLocale.startsWith(supported.split('-')[0])) {
        return supported;
      }
    }

    return this.config.defaultLocale;
  }

  // 自动检测并设置语言
  async autoDetectLocale(): Promise<void> {
    // 1. 尝试加载保存的偏好
    const savedLocale = this.loadLocalePreference();
    if (savedLocale && this.config.supportedLocales.includes(savedLocale)) {
      await this.setLocale(savedLocale);
      return;
    }

    // 2. 尝试系统语言
    const systemLocale = this.getSystemLocale();
    if (systemLocale !== this.currentLocale) {
      await this.setLocale(systemLocale);
      return;
    }

    // 3. 使用默认语言
    if (this.currentLocale !== this.config.defaultLocale) {
      await this.setLocale(this.config.defaultLocale);
    }
  }

  // 添加语言变更监听器
  onLocaleChange(callback: (locale: string) => void): () => void {
    if (!this.eventListeners.has('localeChange')) {
      this.eventListeners.set('localeChange', []);
    }

    const listeners = this.eventListeners.get('localeChange')!;
    listeners.push(callback);

    // 返回取消监听的函数
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // 通知语言变更
  private notifyLocaleChange(locale: string): void {
    const listeners = this.eventListeners.get('localeChange') || [];
    listeners.forEach(callback => {
      try {
        callback(locale);
      } catch (error) {
        console.error('语言变更监听器执行错误:', error);
      }
    });
  }

  // 获取日期格式化器
  getDateFormatter(options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.currentLocale, options);
  }

  // 获取数字格式化器
  getNumberFormatter(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
    return new Intl.NumberFormat(this.currentLocale, options);
  }

  // 获取货币格式化器
  getCurrencyFormatter(currency: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency,
      ...options
    });
  }

  // 获取相对时间格式化器
  getRelativeTimeFormatter(): Intl.RelativeTimeFormat {
    return new Intl.RelativeTimeFormat(this.currentLocale);
  }

  // 格式化相对时间
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    const formatter = this.getRelativeTimeFormatter();
    return formatter.format(value, unit);
  }

  // 获取复数规则
  getPluralRules(): Intl.PluralRules {
    return new Intl.PluralRules(this.currentLocale);
  }

  // 获取复数形式
  getPluralForm(value: number): string {
    const rules = this.getPluralRules();
    return rules.select(value);
  }

  // 批量翻译
  batchTranslate(keys: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    
    keys.forEach(key => {
      result[key] = this.t(key);
    });

    return result;
  }

  // 检查翻译键是否存在
  hasTranslation(key: string): boolean {
    return this.getTranslation(key) !== null;
  }

  // 获取所有翻译键
  getAllTranslationKeys(): string[] {
    const keys: string[] = [];
    
    this.translations.forEach((translation, locale) => {
      this.extractKeys(translation, '', keys);
    });

    return [...new Set(keys)];
  }

  // 提取翻译键
  private extractKeys(obj: Translation, prefix: string, keys: string[]): void {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        keys.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        this.extractKeys(value, fullKey, keys);
      }
    });
  }

  // 导出翻译数据
  exportTranslations(locale: string, format: 'json' | 'csv'): string {
    const translation = this.translations.get(locale);
    if (!translation) {
      throw new Error(`语言包 ${locale} 不存在`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(translation, null, 2);
      case 'csv':
        return this.convertToCSV(translation);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 转换为CSV格式
  private convertToCSV(translation: Translation): string {
    const rows: string[] = ['Key,Translation'];
    
    this.extractKeyValuePairs(translation, '', rows);
    
    return rows.join('\n');
  }

  // 提取键值对
  private extractKeyValuePairs(obj: Translation, prefix: string, rows: string[]): void {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        rows.push(`"${fullKey}","${value.replace(/"/g, '""')}"`);
      } else if (typeof value === 'object' && value !== null) {
        this.extractKeyValuePairs(value, fullKey, rows);
      }
    });
  }

  // 获取翻译统计信息
  getTranslationStats(): Record<string, { total: number; translated: number; missing: number }> {
    const stats: Record<string, { total: number; translated: number; missing: number }> = {};
    
    this.translations.forEach((translation, locale) => {
      const keys = this.getAllTranslationKeys();
      const translated = keys.filter(key => this.hasTranslation(key));
      
      stats[locale] = {
        total: keys.length,
        translated: translated.length,
        missing: keys.length - translated.length
      };
    });

    return stats;
  }

  // 清理未使用的翻译键
  cleanupUnusedKeys(): string[] {
    const allKeys = this.getAllTranslationKeys();
    const usedKeys = new Set<string>();
    
    // 这里应该扫描代码中实际使用的翻译键
    // 目前返回空数组，表示没有未使用的键
    return [];
  }
}

export const i18nService = new I18nService();
