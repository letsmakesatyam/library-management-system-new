// Dashboard.js
import React, { Component } from "react";
import BookCard from "./BookCard";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    availableBooks: [],
    loading: true,
    error: "",
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) return;

    this.fetchBooks(token);
  }

  fetchBooks = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      this.setState({
        availableBooks: data,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        error: "Failed to fetch books",
        loading: false,
      });
    }
  };

  renderAvailableBooks() {
    const { availableBooks } = this.state;
    if (!availableBooks.length) return <p>No books available currently.</p>;

    return (
      <div className="books-grid">
        {availableBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    );
  }

  render() {
    const { loading, error } = this.state;

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
      <div className="dashboard-container">
        <h2>📖 Available Books</h2>
        {this.renderAvailableBooks()}
      </div>
    );
  }
}

export default Dashboard;
