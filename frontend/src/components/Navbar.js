import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
  state = {
    isLoggedIn: false,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ isLoggedIn: false });
    this.props.history.push("/login");
  };

  render() {
    return (
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>

        {this.state.isLoggedIn ? (
          <>
            <button onClick={this.handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
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
