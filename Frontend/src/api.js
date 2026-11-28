import '../config.js'

// Keep the existing separate-host configuration available in the Vite build.
export const apiBase = (window.PORTFOLIO_API_URL || '/api').replace(/\/+$/, '')
