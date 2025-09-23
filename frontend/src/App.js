import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import "./App.css";
import Dashboard from './components/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    this.setState({ isLoggedIn: !!token });
  }

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({ isLoggedIn: false });
  };

  render() {
    const { isLoggedIn } = this.state;

    return (
      <div className="app-container">
        <header className="app-header">
          <h2>📚 Library App</h2>
          <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={this.handleLogout}
          />
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
                isLoggedIn ? (
                  <Home {...props} />
                ) : (
                  <Register {...props} />
                )
              }
            />
            <Route
              path="/dashboard"
              render={(props) =>
                this.state.isLoggedIn ? (
                  <Dashboard {...props} />
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
