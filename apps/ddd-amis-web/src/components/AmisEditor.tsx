import React, { useState, useEffect } from 'react';
import { AmisScreenDefinition, AmisScreen } from '../types/ddd';

interface AmisEditorProps {
  screenDefinition?: AmisScreenDefinition;
  onSave?: (config: any) => void;
  onPreview?: (config: any) => void;
}

export const AmisEditor: React.FC<AmisEditorProps> = ({
  screenDefinition,
  onSave,
  onPreview
}) => {
  const [schema, setSchema] = useState<any>({});
  const [selectedScreen, setSelectedScreen] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (screenDefinition && screenDefinition.screens.length > 0) {
      setSelectedScreen(screenDefinition.screens[0].id);
      const screen = screenDefinition.screens[0];
      setSchema(screen.amisPage);
    }
  }, [screenDefinition]);

  const handleScreenChange = (screenId: string) => {
    if (!screenDefinition) return;
    
    const screen = screenDefinition.screens.find(s => s.id === screenId);
    if (screen) {
      setSelectedScreen(screenId);
      setSchema(screen.amisPage);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(schema);
      alert('配置已保存（控制台查看）');
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(schema);
      setIsPreviewMode(true);
    }
  };

  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  if (!screenDefinition) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>请先加载屏幕定义文件</p>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <div>
        <div style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
          <button onClick={handleBackToEdit} style={{ marginRight: 10 }}>
            返回编辑
          </button>
          <span>预览模式</span>
        </div>
        <div style={{ padding: 20 }}>
          <pre>{JSON.stringify(schema, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        padding: 10, 
        borderBottom: '1px solid #ddd', 
        display: 'flex', 
        alignItems: 'center',
        gap: 10
      }}>
        <select 
          value={selectedScreen} 
          onChange={(e) => handleScreenChange(e.target.value)}
          style={{ padding: 5 }}
          aria-label="选择屏幕"
        >
          {screenDefinition.screens.map(screen => (
            <option key={screen.id} value={screen.id}>
              {screen.name}
            </option>
          ))}
        </select>
        
        <button onClick={handlePreview} style={{ padding: '5px 10px' }}>
          预览
        </button>
        
        <button onClick={handleSave} style={{ padding: '5px 10px' }}>
          保存
        </button>
      </div>

      {/* 编辑器主体 - 简化为JSON编辑器 */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <h3>amis配置编辑器</h3>
        <p>当前屏幕: {selectedScreen}</p>
        <div style={{ marginTop: 20 }}>
          <label htmlFor="json-editor">配置JSON:</label>
          <textarea
            id="json-editor"
            value={JSON.stringify(schema, null, 2)}
            onChange={(e) => {
              try {
                const newSchema = JSON.parse(e.target.value);
                setSchema(newSchema);
              } catch (error) {
                // 忽略JSON解析错误
              }
            }}
            style={{
              width: '100%',
              height: '400px',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px'
            }}
            placeholder="请输入有效的JSON配置..."
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <small style={{ color: '#666' }}>
            提示: 直接编辑JSON配置，系统会自动验证格式
          </small>
        </div>
      </div>
    </div>
  );
};
