import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <h1>HorizonWritings</h1>
      <div className="links">
        <div className="hamburgerIcon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            to={isLoggedIn ? '/create' : { pathname: '/login', state: { redirect: '/create' } }}
            onClick={toggleMenu}
          >
            Add Blog
          </Link>
          {!isLoggedIn && (
            <Link to="/login" onClick={toggleMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
