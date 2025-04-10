import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import './index.css'

// Make React available globally
window.React = React;

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
) 