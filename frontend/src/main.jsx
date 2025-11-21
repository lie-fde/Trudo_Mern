import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import ErrorBoundary from './components/reusable/Errorboundary.jsx'
import ErrorFallback from './components/reusable/ErrorFallback.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
    <BrowserRouter>
    <ErrorBoundary fallback={<ErrorFallback/>}>
    <App />
    </ErrorBoundary>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
