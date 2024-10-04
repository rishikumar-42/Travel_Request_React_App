// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Dashboard from './components/Dashboard';
// import MyList from './components/MyList';
// import LoginPage from './components/LoginPage';
// import TravelRequestForm from './components/TravelRequestForm';
// import EditTravelRequestForm from './components/EditTravelRequestForm';
// import { SnackbarProvider } from 'notistack';
// import { AuthProvider } from './contexts/AuthContext';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//    <AuthProvider>
//   <SnackbarProvider maxSnack={3}>
//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/mylist" element={<MyList />} />
//         <Route path="/EditTravelRequestForm" element={<EditTravelRequestForm />} />
//         <Route path="/TravelRequestForm" element={<TravelRequestForm />} />
//       </Routes>
//       <Footer />
//     </Router>
//   </SnackbarProvider>
//   </AuthProvider>
// );

// reportWebVitals();

 import {render, unmountComponentAtNode} from 'react-dom';
 import App from './App';
 import React from 'react';
 class WebComponent extends HTMLElement {
   connectedCallback() {
     render(<React.StrictMode>
         <App />
       </React.StrictMode>, this);
   }

   disconnectedCallback() {
     unmountComponentAtNode(this);
   }
 }

 const ELEMENT_NAME = 'travel-request-react-app';

 if (customElements.get(ELEMENT_NAME)) {
   // eslint-disable-next-line no-console
   console.log(`Skipping registration for <${ELEMENT_NAME}> (already registered)`);
 } else {
   customElements.define(ELEMENT_NAME, WebComponent);
 }
