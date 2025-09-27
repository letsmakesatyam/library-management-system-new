import React, { Component } from "react";
import "./Login.css";

// Load the API URL from the .env file (must be created in the frontend root)
// and use the Codespaces URL: https://ubiquitous-spork-x5vgg5grvjx63q44-3000.app.github.dev
const API_BASE_URL = process.env.REACT_APP_API_URL; 

class Login extends Component {
  state = {
    name: "",
    password: "",
    error: "",
    success: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ error: "", success: "" });
    
    // Safety check for the URL (optional but helpful for debugging)
    if (!API_BASE_URL) {
        this.setState({ error: "Configuration Error: API URL is missing. Did you restart the frontend server?" });
        console.error("API_BASE_URL is undefined. Cannot connect to backend.");
        return;
    }

    try {
      // ⚠️ FIX: Using the environment variable for the Codespaces URL
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
        // Display the specific error message sent by the backend
        this.setState({ error: data.error || "Login failed" });
        return;
      }

      // Save JWT token in localStorage
      localStorage.setItem("token", data.token);

      // Update parent App state
      this.props.handleLogin();

      this.setState({ success: "Login successful!" });

      // Redirect to dashboard
      this.props.history.push('/dashboard'); 
    } catch (err) {
      console.error("Network or connectivity error:", err);
      // Generic error message if the fetch call completely failed (e.g., DNS issue, connection refused)
      this.setState({ error: "Could not connect to the server. Check your Codespaces URL and port forwarding." });
    }
  };

  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {this.state.error && <p className="error">{this.state.error}</p>}
        {this.state.success && <p className="success">{this.state.success}</p>}
      </div>
    );
  }
}

export default Login;