import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <footer>
      <nav>
        <div className="nav-links-container">
          <ul className="nav-links">
            <li className='socials'><a href="https://www.facebook.com"><FontAwesomeIcon icon={faFacebook} /></a></li>
            <li className='socials'><a href="https://www.instagram.com"><FontAwesomeIcon icon={faInstagram} /></a></li>
            <li className='socials'><a href="mailto:contact@example.com"><FontAwesomeIcon icon={faEnvelope} /></a></li>
          </ul>
        </div>
      </nav>
      <p>Copyright &copy; 2023 BlogHUB. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
