import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
  handleLogout = () => {
    this.props.handleLogout(); // calls App.js logout
    this.props.history.push("/login");
  };

  render() {
    const { isLoggedIn } = this.props;

    return (
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>

        {isLoggedIn ? (
          <button
            onClick={this.handleLogout}
            className="nav-link logout-btn"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    );
  }
}

export default withRouter(Navbar);
