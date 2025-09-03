import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your marketplace homepage component
import MarketplaceHomepage from './NonAuth/Home';
import LoginPage from './NonAuth/login';
import SignUpPage from './NonAuth/signup';
import UserDashboard from './Utilisateur/Home';
import ConnectedUserHomepage from './Utilisateur/Home';
import UserProfilePage from './Utilisateur/Profile';
import AdminDashboard from './Admin/Home';
import EditProfilePage from './NonAuth/EditProfilePage';
import CheckoutPage from './NonAuth/CheckoutPage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route - displays your marketplace homepage */}
          <Route path="/" element={<MarketplaceHomepage />} />
           <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/User/home" element={<ConnectedUserHomepage />} />
          <Route path="/User/Profile" element={<UserProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/Admin/Home" element={<AdminDashboard />} />
          <Route path="/Utilisateur/Home" element={<UserDashboard />} />
            <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;