import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../assets/css/Header.css";
import { Menubar } from 'primereact/menubar';
import Logo from './Logo/logo';

function Header() {
    const { isAuthenticated } = useAuth(); // Get the authentication status
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            label: 'Home',
            command: () => navigate('/')
        },
        {
            label: 'Create Travel Request',
            command: () => navigate('/TravelRequestForm')
        },
        {
            label: 'View Travel Request',
            items: [
                {
                    label: 'View My Travel Request',
                    command: () => navigate('/MyList'),
                    className: 'view-my-travel-request',
                },
                {
                    label: 'Waiting for My Approval',
                    command: () => navigate('/Dashboard'),
                    className: 'waiting-approval',
                }
            ]
        }
    ];

    const isHome = location.pathname === '/travel-request';

    const itemTemplate = (item) => {
        return (
            <div className={item.className} onClick={item.command}>
                {item.label}
            </div>
        );
    };

    return (
        <header className="header-travelform">
            <Logo />
            {!isHome && (
                <h5 className='travel-request-header'>Travel Request</h5>
            )}
            {!isHome && (
                <Menubar model={items} className="small-menubar" itemTemplate={itemTemplate} />
            )}
        </header>
    );
}

export default Header;
