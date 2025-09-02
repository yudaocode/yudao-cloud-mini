import React, { useState, useEffect, useRef } from 'react';
import { MiniEditor } from 'amis-editor-core';
import { createAmisFetcher } from '../services/mockApiService';
import 'amis/lib/themes/antd.css';
import 'amis-editor-core/lib/style.css';

interface AmisEditorProps {
  value?: any;
  onChange?: (value: any) => void;
  onSave?: (value: any) => void;
}

export const AmisEditor: React.FC<AmisEditorProps> = ({ value, onChange, onSave }) => {
  const [schema, setSchema] = useState(value || {
    type: 'page',
    title: '新页面',
    body: []
  });
  
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<any>(null);

  const handleChange = (newValue: any) => {
    setSchema(newValue);
    onChange?.(newValue);
  };

  const handleSave = () => {
    onSave?.(schema);
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    console.log('amis-editor mounted successfully');
  };

  const handleEditorChange = (value: any) => {
    console.log('Editor change:', value);
    setSchema(value);
    onChange?.(value);
  };

  // 编辑器配置 - 使用正确的Editor属性
  const editorConfig = {
    theme: 'antd',
    value: schema,
    onChange: handleEditorChange,
    onEditorMount: handleEditorMount,
    // 简化配置
    showCustomRenderersPanel: false,
    noDialog: true,
    // 提供基本的amis环境
    amisEnv: {
      updateLocation: () => {},
      isCancel: () => false,
      notify: () => {},
      confirm: () => Promise.resolve(true),
      alert: () => {},
      copy: () => {},
      getTheme: () => 'antd',
      getLanguage: () => 'zh-CN',
      fetcher: createAmisFetcher()
    }
  };

  return (
    <div className="amis-editor-container">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <h3>amis 可视化编辑器</h3>
        </div>
        <div className="toolbar-right">
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={!isEditorReady}
          >
            {isEditorReady ? '保存配置' : '编辑器加载中...'}
          </button>
        </div>
      </div>
      
      <div className="editor-main">
        {!isEditorReady && (
          <div className="editor-loading">
            <div className="loading-spinner"></div>
            <p>正在加载amis编辑器...</p>
          </div>
        )}
        
        <div className="editor-content" style={{ display: isEditorReady ? 'block' : 'none' }}>
          <MiniEditor {...editorConfig} />
        </div>
      </div>
      
      {!isEditorReady && (
        <div className="editor-fallback">
          <p>如果编辑器加载失败，请检查控制台错误信息</p>
          <details>
            <summary>查看当前配置</summary>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};
