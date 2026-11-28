import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import '@fontsource/anton/latin-400.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import App from './App.jsx'
import './styles/index.css'
import './portrait.css'

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
)
