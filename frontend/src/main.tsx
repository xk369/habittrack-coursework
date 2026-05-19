import React from 'react';
import ReactDOM from 'react-dom/client';
import 'dayjs/locale/ru';

import { App } from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
