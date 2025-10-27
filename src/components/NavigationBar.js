// src/components/NavigationBar.js
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import logo from './assets/logo.png';
import { useTickets } from '../TicketsContext';
import React from 'react';

function NavigationBar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useTickets();
  //console.log("🧭 NavigationBar currentUser:", currentUser);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://csci441-group-project.onrender.com/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.warn('Backend logout may have failed:', response.statusText);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/');
    }
  };

  // ✅ Correct: read name directly from currentUser.name
  const displayName = currentUser?.name || currentUser?.email || '';

  return (
    <div className="Wrapper">
      <header className="left">
        <h1>
          <Link to="/home" className="logoName">
            QuickTix
          </Link>
        </h1>
        <Link to="/home">
          <img src={logo} alt="QuickTix Logo" className="logo" />
        </Link>
      </header>

      <nav className="right">
        <ul>
          <li>
            <Link to="/create-new-ticket">Create New Ticket</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>

          {/* 👇 Show user's full name */}
          {displayName && (
            <li className="userName">
              Hello,&nbsp;<strong>{displayName}</strong>
            </li>
          )}

          <li>
            <a href="/" onClick={handleLogout} className="navLink">
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavigationBar;
