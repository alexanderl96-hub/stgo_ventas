// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// // import { HashRouter } from "react-router-dom";

// import { BrowserRouter } from "react-router-dom"; // 👈 ADD THIS

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode>
//     <BrowserRouter> {/* 👈 WRAP HERE */}
//       <App />
//     </BrowserRouter>
//   // </React.StrictMode>
// );

// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);

reportWebVitals();