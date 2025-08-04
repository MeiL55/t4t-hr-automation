// Navbar.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => router.push('/')}>
            <img src="/T4T Logo.png" alt="Teens 4 Teens Logo" className="navbar-logo-image" />
            <h1 className="navbar-logo-text">
                Teens <span className="highlight">4</span> Teens
            </h1>
        </div>
        {/* Dropdown for mobile */}
        <div className="navbar-dropdown">
          <button className="dropdown-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            Menu {isMenuOpen ? '▲' : '▼'}
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { router.push('/'); setIsMenuOpen(false); }}>Home</button>
              <button onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>Apply Now</button>
              <button onClick={() => { router.push('/login?role=employer'); setIsMenuOpen(false); }}>Employer Login</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;