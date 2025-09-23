import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar"; // ✅ import Navbar
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h2>📚 Library App</h2>
        <Navbar /> {/* ✅ Now Navbar is separate */}
      </header>

      <main className="app-main">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </main>

      <footer className="app-footer">
        <p>© 2025 Library App</p>
      </footer>
    </div>
  );
}

export default App;
