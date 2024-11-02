import React from 'react'

import ReactDOM from 'react-dom/client'

import { HashRouter } from 'react-router-dom'
import App from './App'
import '@/assets/css/main.css'

import '@/plugins/monaco'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
