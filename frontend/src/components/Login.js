import React, { Component } from "react";
import "./Login.css";

class Login extends Component {
  state = {
    name: "",
    password: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login details:", this.state);
    // 🔗 Later we’ll call your backend login API here
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

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
