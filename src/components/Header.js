import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../assets/css/Header.css";

function Header() {
    const { isAuthenticated } = useAuth(); // Get the authentication status
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsDropdownOpen(false); // Close dropdown after navigation
    };

    const isHome = window.location.pathname === '/home';

    return (
        <header className="header-travelform">
            <h3>Amphenol</h3>
            {!isHome && (
            <h5 className='travel-request-header'>Travel Request</h5>
            )}
            {!isHome && (
                <div>
                    <span className="view-span">
                        <Link to="/home" className="view-Create">
                            Home
                        </Link>
                        <Link to="/TravelRequestForm" className="view-Create">
                            Create Travel Request
                        </Link>
                        <span className="view-View" onClick={toggleDropdown}>
                            View Travel Request
                        </span>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu-header">
                                <li onClick={() => handleNavigation('/MyList')}>
                                    <Link to="/MyList">View My Travel Request</Link>
                                </li>
                                <li onClick={() => handleNavigation('/Dashboard')}>
                                    <Link to="/Dashboard">Waiting for My Approval</Link>
                                </li>
                            </ul>
                        )}
                    </span>
                </div>
            )}
        </header>
    );
}

export default Header;
