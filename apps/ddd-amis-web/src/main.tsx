import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 在开发环境下，可以选择性地禁用StrictMode来减少amis相关的警告
// 在生产环境下，这些警告不会出现
const isDevelopment = process.env.NODE_ENV === 'development';

ReactDOM.render(
  isDevelopment ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
  document.getElementById('root')
);
