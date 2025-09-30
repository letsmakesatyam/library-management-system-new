import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { FaBookOpen, FaBars, FaTimes } from 'react-icons/fa';
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  handleLogout = () => {
    this.props.handleLogout();
    this.props.history.push("/login");
  };

  isActive = (path) => {
    return this.props.location.pathname === path;
  };

  render() {
    const { isLoggedIn } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <nav className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <FaBookOpen className="brand-icon" />
            <span className="brand-name">Librarium</span>
          </Link>
        </div>

        <div className="menu-icon" onClick={this.toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={`nav-link ${this.isActive('/') ? 'active-link' : ''}`} 
              onClick={this.toggleMenu}>Home</Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`nav-link ${this.isActive('/about') ? 'active-link' : ''}`} 
              onClick={this.toggleMenu}>About</Link>
          </li>

          {isLoggedIn ? (
            <li>
              <button
                onClick={this.handleLogout}
                className="nav-link logout-btn"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={`nav-link ${this.isActive('/login') ? 'active-link' : ''}`} 
                  onClick={this.toggleMenu}>Login</Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={`nav-link ${this.isActive('/register') ? 'active-link' : ''}`} 
                  onClick={this.toggleMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  }
}

export default withRouter(Navbar);