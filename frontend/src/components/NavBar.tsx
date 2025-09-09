// Navbar.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import axios from 'axios';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {}, {
        withCredentials: true
      })
      router.push('/login')
      setIsMenuOpen(false)
    } catch (err) {
      console.error('Logout failed', err)
      router.push('/login')
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Left Side */}
        <div className="navbar-logo" onClick={() => router.push('/')}>
          <img src="/T4T Logo.png" alt="Teens 4 Teens Logo" className="navbar-logo-image" />
          <h1 className="navbar-logo-text">
            Teens <span className="highlight">4</span> Teens
          </h1>
        </div>

        {/* Mobile Dropdown - Right Side */}
        <div className="navbar-dropdown">
          <button className="dropdown-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            Menu {isMenuOpen ? '▲' : '▼'}
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { router.push('/'); setIsMenuOpen(false); }}>Home</button>
              <button onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>Apply Now</button>
              <button onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>Employer Login</button>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;