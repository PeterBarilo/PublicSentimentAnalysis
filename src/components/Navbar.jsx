import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../assets/assets';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Debate Insights</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/topics">Hot Topics</Link>
        </li>
        <li>
          <Link to="/archive">Archive</Link>
        </li>
        {/* <li>
          <Link to="/about">About</Link>
        </li> */}
        <hr />
        <li>
          <img className='search-icon' src={assets.search} alt="" />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar 
