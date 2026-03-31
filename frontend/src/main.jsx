

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- Redux & Persistence Integration ---
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react' // 1. Ye import zaroori hai
import store, { persistor } from './redux/store.js' // 2. persistor ko bhi import karein

/**
 * Updated Entry Point:
 * We added PersistGate to ensure that the app waits for the 
 * persisted state to be retrieved before rendering.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 3. App ko PersistGate ke andar wrap karein */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)