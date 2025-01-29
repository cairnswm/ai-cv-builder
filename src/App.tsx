import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './Main'

import './index.css'

const App = () => (
  <Main />
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)