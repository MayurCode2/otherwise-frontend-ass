import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { ToastContainer } from 'react-toastify';
import "./toastStyles.css"



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
  <Provider store={store}>
<App />
</Provider>
<ToastContainer 
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
closeButton={false}
className=" w-5 h-5" // Add a custom class for the container
/>
</BrowserRouter>
</React.StrictMode>,
)
