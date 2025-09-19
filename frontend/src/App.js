import { Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register  from "./components/Register";

import "./App.css";


function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h2>📚 Library App</h2>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to = "/register" className="nav-link">Register</Link>
        </nav>
      </header>

      <main className="app-main">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path = "/register" component = {Register} />
        </Switch>
      </main>

      <footer className="app-footer">
        <p>© 2025 Library App</p>
      </footer>
    </div>
  );
}

export default App;
