import React, { useState , useRef, useEffect} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../assets/css/Header.css";
import { Menubar } from 'primereact/menubar';
import Logo from './Logo/logo';

function Header() {
    const { isAuthenticated } = useAuth(); // Get the authentication status
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsDropdownOpen(false); // Close dropdown after navigation
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    const isHome = window.location.pathname === '/home';

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header-travelform">
            {/* <h3>Amphenol</h3> */}
            <Logo />
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
                            <ul className="dropdown-menu-header"  ref={dropdownRef}>
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
