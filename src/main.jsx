import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import {store} from './app/store';
import App from './App.jsx'
import "./i18n";
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
<Provider store={store}>
    <App />
</Provider>
)
