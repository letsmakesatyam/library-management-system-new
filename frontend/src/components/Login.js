import React, { Component } from "react";
import "./Login.css";

const API_BASE_URL = process.env.REACT_APP_API_URL; 

class Login extends Component {
  state = {
    name: "",
    password: "",
    error: "",
    success: "",
    isLoading: false,
    shake: false
  };

  handleChange = (event) => {
    this.setState({ 
      [event.target.name]: event.target.value,
      error: "" // Clear error when user starts typing
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ 
      error: "", 
      success: "", 
      isLoading: true,
      shake: false 
    });
    
    if (!API_BASE_URL) {
        this.setState({ 
          error: "Configuration Error: API URL is missing. Did you restart the frontend server?",
          isLoading: false,
          shake: true
        });
        console.error("API_BASE_URL is undefined. Cannot connect to backend.");
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.name,
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.setState({ 
          error: data.error || "Login failed", 
          isLoading: false,
          shake: true 
        });
        return;
      }

      localStorage.setItem("token", data.token);
      this.props.handleLogin();

      this.setState({ 
        success: "Login successful! Redirecting...",
        isLoading: false 
      });

      // Add a small delay to show success message
      setTimeout(() => {
        this.props.history.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error("Network or connectivity error:", err);
      this.setState({ 
        error: "Could not connect to the server. Check your Codespaces URL and port forwarding.",
        isLoading: false,
        shake: true
      });
    }
  };

  render() {
    const { name, password, error, success, isLoading, shake } = this.state;
    
    return (
      <div className="login-page-container">
        <div className={`login-card ${shake ? 'shake' : ''}`}>
          <h2 className="login-heading">Librarium Login</h2>
          <p className="login-subtitle">Welcome back to your digital library</p>
          
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="form-group floating">
              <input
                className="form-input"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                placeholder=" "
                required
              />
              <label className="form-label">Username</label>
            </div>

            <div className="form-group floating">
              <input
                className="form-input"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder=" "
                required
              />
              <label className="form-label">Password</label>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '' : 'Login'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Additional decorative elements */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem', 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Secure access to Librarium
          </div>
        </div>
      </div>
    );
  }
}

export default Login;