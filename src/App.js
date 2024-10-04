import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MyList from './components/MyList';
import EditTravelRequestForm from './components/EditTravelRequestForm';
import TravelRequestForm from './components/TravelRequestForm';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/MyList" element={<MyList />} />
             <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/EditTravelRequestForm" element={<EditTravelRequestForm />} />
            <Route path="/TravelRequestForm" element={<TravelRequestForm />} />
          </Routes>
        <Footer />
      </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
