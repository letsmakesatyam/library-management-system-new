import React, { Component } from 'react';
import './Register.css';

class Register extends Component {
  state = {
    name: '',
    role: 'student',
    roll_no: '',
    password: '',
    adminSecret: '',
    message: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, role, roll_no, password, adminSecret } = this.state;

    // Prepare payload according to role
    const payload = { name, role, password };
    if (role === 'student') payload.roll_no = roll_no;
    if (role === 'admin') payload.adminSecret = adminSecret;

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        this.setState({ message: 'Registration successful! Token: ' + data.token });
        // Optionally, redirect to login page
      } else {
        this.setState({ message: data.error });
      }
    } catch (err) {
      this.setState({ message: 'Server error' });
    }
  };

  render() {
    const { name, role, roll_no, password, adminSecret, message } = this.state;

    return (
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleChange}
            placeholder="Name"
            required
          />

          <select name="role" value={role} onChange={this.handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {role === 'student' && (
            <input
              type="text"
              name="roll_no"
              value={roll_no}
              onChange={this.handleChange}
              placeholder="Roll Number"
              required
            />
          )}

          {role === 'admin' && (
            <input
              type="text"
              name="adminSecret"
              value={adminSecret}
              onChange={this.handleChange}
              placeholder="Admin Secret"
              required
            />
          )}

          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            placeholder="Password"
            required
          />

          <button type="submit">Register</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    );
  }
}

export default Register;
