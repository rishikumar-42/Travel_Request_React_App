import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/Header.css";

function Header() {
    const { isAuthenticated } = useAuth(); // Get the authentication status
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsDropdownOpen(false); // Close dropdown after navigation
    };

    return (
        <header className="header-travelform">
            <h1>Amphenol</h1>
            {isAuthenticated && (
                <div>
                    <span className="view-span">
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
