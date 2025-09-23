import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userRole: null, // 🆕 track role (student/admin)
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.setState({
          isLoggedIn: true,
          userRole: payload.role, // extract role from token
        });
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        this.setState({ isLoggedIn: false, userRole: null });
      }
    }
  }

  handleLogin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.setState({
          isLoggedIn: true,
          userRole: payload.role,
        });
      } catch (err) {
        console.error("Invalid token after login", err);
        this.setState({ isLoggedIn: true, userRole: null });
      }
    } else {
      this.setState({ isLoggedIn: true });
    }
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ isLoggedIn: false, userRole: null });
  };

  render() {
    const { isLoggedIn, userRole } = this.state;

    return (
      <div className="app-container">
        <header className="app-header">
          <h2>📚 Library App</h2>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
        </header>

        <main className="app-main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />

            <Route
              path="/login"
              render={(props) =>
                isLoggedIn ? (
                  <Home {...props} />
                ) : (
                  <Login {...props} handleLogin={this.handleLogin} />
                )
              }
            />

            <Route
              path="/register"
              render={(props) =>
                isLoggedIn ? <Home {...props} /> : <Register {...props} />
              }
            />

            <Route
              path="/dashboard"
              render={(props) =>
                isLoggedIn ? (
                  <Dashboard {...props} userRole={userRole} />
                ) : (
                  <Login {...props} handleLogin={this.handleLogin} />
                )
              }
            />
          </Switch>
        </main>

        <footer className="app-footer">
          <p>© 2025 Library App</p>
        </footer>
      </div>
    );
  }
}

export default App;

