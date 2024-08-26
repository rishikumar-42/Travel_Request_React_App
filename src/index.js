import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TravelRequestForm from './components/TravelRequestForm';
// import Header from './components/Header';
import Footer from './components/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Header /> */}
    <TravelRequestForm />
    <Footer />
  </React.StrictMode>
);

reportWebVitals();
