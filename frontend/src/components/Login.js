import React, { Component } from "react";
import "./Login.css";

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

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.name,
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.setState({ error: data.error || "Login failed" });
        return;
      }

      // Save JWT token in localStorage
      localStorage.setItem("token", data.token);

      this.setState({ success: "Login successful!" });

      // redirect to home page
      this.props.history.push("/");
    } catch (err) {
      console.error(err);
      this.setState({ error: "Something went wrong. Try again!" });
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

          <button type="submit" className="login-btn">Login</button>
        </form>

        {this.state.error && <p className="error">{this.state.error}</p>}
        {this.state.success && <p className="success">{this.state.success}</p>}
      </div>
    );
  }
}

export default Login;
