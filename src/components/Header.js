import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import "../assets/css/Header.css";

function Header() {
    const { isAuthenticated } = useAuth(); // Get the authentication status
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="header-travelform">
            <h1>Amphenol</h1>
            {isAuthenticated && (
                <div>
                    <span className="view-span">
                        <a href="/TravelRequestForm" className="view-Create">
                            Create Travel Request
                        </a>
                        <span className="view-View" onClick={toggleDropdown}>
                            View Travel Request
                        </span>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu-header">
                                <li><a href="MyList">View My Travel Request</a></li>
                                <li><a href="Dashboard">Waiting for My Approval</a></li>
                            </ul>
                        )}
                    </span>
                </div>
            )}
        </header>
    );
}

export default Header;
