import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/header'
import Home from './pages/home.js'
import About from './pages/about.js'
import Features from './pages/features'

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
    <BrowserRouter>
      <Routes>
       
           <Route path = "/" element = {<Home/>}></Route>
           <Route path = "About" element = {<About/>}></Route>
           <Route path = "Features" element = {<Features/>}></Route>

           
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
