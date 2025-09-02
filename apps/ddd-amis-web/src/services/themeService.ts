// 主题服务
export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isDark: boolean;
  colors: ThemeColors;
  cssVariables: { [key: string]: string };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export class ThemeService {
  private themes: Theme[] = [];
  private currentTheme: Theme | null = null;
  private readonly THEME_STORAGE_KEY = 'selected-theme';

  constructor() {
    this.initializeThemes();
    this.loadSavedTheme();
  }

  // 初始化主题
  private initializeThemes(): void {
    this.themes = [
      {
        id: 'light',
        name: 'light',
        displayName: '浅色主题',
        description: '明亮的浅色主题，适合白天使用',
        isDark: false,
        colors: {
          primary: '#1890ff',
          secondary: '#6c757d',
          success: '#52c41a',
          warning: '#faad14',
          danger: '#ff4d4f',
          info: '#13c2c2',
          background: '#ffffff',
          surface: '#fafafa',
          text: '#262626',
          textSecondary: '#8c8c8c',
          border: '#d9d9d9',
          shadow: 'rgba(0, 0, 0, 0.1)'
        },
        cssVariables: {
          '--primary-color': '#1890ff',
          '--secondary-color': '#6c757d',
          '--success-color': '#52c41a',
          '--warning-color': '#faad14',
          '--danger-color': '#ff4d4f',
          '--info-color': '#13c2c2',
          '--background-color': '#ffffff',
          '--surface-color': '#fafafa',
          '--text-color': '#262626',
          '--text-secondary-color': '#8c8c8c',
          '--border-color': '#d9d9d9',
          '--shadow-color': 'rgba(0, 0, 0, 0.1)',
          '--card-background': '#ffffff',
          '--input-background': '#ffffff',
          '--table-header-background': '#fafafa',
          '--table-row-hover-background': '#f5f5f5'
        }
      },
      {
        id: 'dark',
        name: 'dark',
        displayName: '深色主题',
        description: '舒适的深色主题，适合夜间使用',
        isDark: true,
        colors: {
          primary: '#177ddc',
          secondary: '#8c8c8c',
          success: '#49aa19',
          warning: '#d89614',
          danger: '#d32029',
          info: '#08979c',
          background: '#141414',
          surface: '#1f1f1f',
          text: '#ffffff',
          textSecondary: '#a6a6a6',
          border: '#434343',
          shadow: 'rgba(0, 0, 0, 0.3)'
        },
        cssVariables: {
          '--primary-color': '#177ddc',
          '--secondary-color': '#8c8c8c',
          '--success-color': '#49aa19',
          '--warning-color': '#d89614',
          '--danger-color': '#d32029',
          '--info-color': '#08979c',
          '--background-color': '#141414',
          '--surface-color': '#1f1f1f',
          '--text-color': '#ffffff',
          '--text-secondary-color': '#a6a6a6',
          '--border-color': '#434343',
          '--shadow-color': 'rgba(0, 0, 0, 0.3)',
          '--card-background': '#1f1f1f',
          '--input-background': '#262626',
          '--table-header-background': '#262626',
          '--table-row-hover-background': '#2a2a2a'
        }
      },
      {
        id: 'blue',
        name: 'blue',
        displayName: '科技蓝主题',
        description: '专业的科技蓝色主题',
        isDark: false,
        colors: {
          primary: '#0f172a',
          secondary: '#475569',
          success: '#15803d',
          warning: '#b45309',
          danger: '#7f1d1d',
          info: '#0c4a6e',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#0f172a',
          textSecondary: '#475569',
          border: '#e2e8f0',
          shadow: 'rgba(15, 23, 42, 0.1)'
        },
        cssVariables: {
          '--primary-color': '#0f172a',
          '--secondary-color': '#475569',
          '--success-color': '#15803d',
          '--warning-color': '#b45309',
          '--danger-color': '#7f1d1d',
          '--info-color': '#0c4a6e',
          '--background-color': '#f8fafc',
          '--surface-color': '#ffffff',
          '--text-color': '#0f172a',
          '--text-secondary-color': '#475569',
          '--border-color': '#e2e8f0',
          '--shadow-color': 'rgba(15, 23, 42, 0.1)',
          '--card-background': '#ffffff',
          '--input-background': '#ffffff',
          '--table-header-background': '#f1f5f9',
          '--table-row-hover-background': '#f8fafc'
        }
      }
    ];
  }

  // 获取所有主题
  getAllThemes(): Theme[] {
    return [...this.themes];
  }

  // 获取当前主题
  getCurrentTheme(): Theme | null {
    return this.currentTheme;
  }

  // 设置主题
  setTheme(themeId: string): boolean {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return false;

    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    return true;
  }

  // 应用主题
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // 应用CSS变量
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 设置主题类名
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme.name}`);

    // 设置body背景色
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;

    // 触发主题变更事件
    this.dispatchThemeChangeEvent(theme);
  }

  // 触发主题变更事件
  private dispatchThemeChangeEvent(theme: Theme): void {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    window.dispatchEvent(event);
  }

  // 保存主题到本地存储
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme.id);
    } catch (error) {
      console.warn('无法保存主题到本地存储:', error);
    }
  }

  // 从本地存储加载主题
  private loadSavedTheme(): void {
    try {
      const savedThemeId = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (savedThemeId) {
        this.setTheme(savedThemeId);
      } else {
        // 默认使用浅色主题
        this.setTheme('light');
      }
    } catch (error) {
      console.warn('无法从本地存储加载主题:', error);
      this.setTheme('light');
    }
  }

  // 切换明暗主题
  toggleDarkMode(): void {
    if (this.currentTheme?.isDark) {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  // 获取系统主题偏好
  getSystemThemePreference(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // 自动跟随系统主题
  enableSystemThemeFollow(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const themeId = e.matches ? 'dark' : 'light';
      this.setTheme(themeId);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // 初始设置
    const systemTheme = this.getSystemThemePreference();
    this.setTheme(systemTheme);
  }

  // 创建自定义主题
  createCustomTheme(
    name: string,
    displayName: string,
    description: string,
    colors: Partial<ThemeColors>
  ): Theme {
    const defaultColors: ThemeColors = {
      primary: '#1890ff',
      secondary: '#6c757d',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#13c2c2',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#262626',
      textSecondary: '#8c8c8c',
      border: '#d9d9d9',
      shadow: 'rgba(0, 0, 0, 0.1)'
    };

    const mergedColors = { ...defaultColors, ...colors };
    const isDark = this.isDarkTheme(mergedColors);

    const theme: Theme = {
      id: `custom-${Date.now()}`,
      name: name,
      displayName,
      description,
      isDark,
      colors: mergedColors,
      cssVariables: this.generateCSSVariables(mergedColors)
    };

    this.themes.push(theme);
    return theme;
  }

  // 判断是否为深色主题
  private isDarkTheme(colors: ThemeColors): boolean {
    // 简单的亮度计算
    const backgroundBrightness = this.calculateBrightness(colors.background);
    const textBrightness = this.calculateBrightness(colors.text);
    
    return backgroundBrightness < 128 && textBrightness > 128;
  }

  // 计算颜色亮度
  private calculateBrightness(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  // 生成CSS变量
  private generateCSSVariables(colors: ThemeColors): { [key: string]: string } {
    return {
      '--primary-color': colors.primary,
      '--secondary-color': colors.secondary,
      '--success-color': colors.success,
      '--warning-color': colors.warning,
      '--danger-color': colors.danger,
      '--info-color': colors.info,
      '--background-color': colors.background,
      '--surface-color': colors.surface,
      '--text-color': colors.text,
      '--text-secondary-color': colors.textSecondary,
      '--border-color': colors.border,
      '--shadow-color': colors.shadow,
      '--card-background': colors.surface,
      '--input-background': colors.surface,
      '--table-header-background': colors.surface,
      '--table-row-hover-background': this.adjustBrightness(colors.surface, -0.05)
    };
  }

  // 调整颜色亮度
  private adjustBrightness(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.max(0, Math.min(255, Math.round(r * (1 + factor))));
    const newG = Math.max(0, Math.min(255, Math.round(g * (1 + factor))));
    const newB = Math.max(0, Math.min(255, Math.round(b * (1 + factor))));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  // 获取主题预览样式
  getThemePreviewStyle(theme: Theme): string {
    return `
      .theme-preview-${theme.id} {
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        padding: 16px;
        border-radius: 8px;
        margin: 8px;
        width: 200px;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      
      .theme-preview-${theme.id} .theme-name {
        font-weight: bold;
        color: ${theme.colors.primary};
      }
      
      .theme-preview-${theme.id} .theme-colors {
        display: flex;
        gap: 4px;
      }
      
      .theme-preview-${theme.id} .color-swatch {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid ${theme.colors.border};
      }
    `;
  }

  // 导出主题配置
  exportTheme(themeId: string, format: 'json' | 'css'): string {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) throw new Error(`主题 ${themeId} 不存在`);

    switch (format) {
      case 'json':
        return JSON.stringify(theme, null, 2);
      case 'css':
        return this.generateThemeCSS(theme);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 生成主题CSS
  private generateThemeCSS(theme: Theme): string {
    let css = `/* ${theme.displayName} 主题 */\n`;
    css += `.theme-${theme.name} {\n`;
    
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
    
    css += '}\n';
    return css;
  }
}

export const themeService = new ThemeService();
