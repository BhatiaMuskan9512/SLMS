import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- Redux Integration ---
import { Provider } from 'react-redux'
import store from './redux/store.js'

/**
 * The Entry Point:
 * Here we link our React logic to the 'root' div in index.html.
 * We also inject the Redux store globally so all components can access state.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)