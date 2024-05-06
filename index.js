import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css'; // 引入全局样式表
import App from './router/index';
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter >
        <App/>
    </BrowserRouter >
);
