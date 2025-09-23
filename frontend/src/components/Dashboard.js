// Dashboard.js
import React, { Component } from "react";
import BookCard from "./BookCard";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    availableBooks: [],
    loading: true,
    error: "",
    searchTerm: "",
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
        availableBooks: Array.isArray(data) ? data : [],
        loading: false,
        error: data.error || "",
      });
    } catch (err) {
      console.error(err);
      this.setState({
        availableBooks: [],
        error: "Failed to fetch books",
        loading: false,
      });
    }
  };

  // 🆕 Add book handler with backend's variable names
  handleAddBook = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const bookData = {
      title: event.target.title.value,
      author: event.target.author.value,
      isbn: event.target.isbn.value,
      copies: event.target.copies.value, // backend expects "copies"
      description: event.target.description.value,
      published_year: event.target.published_year.value,
      category: event.target.category.value,
      image_url: event.target.image_url.value,
    };

    try {
      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add book");

      this.fetchBooks(token); // reload list
      event.target.reset();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🆕 search handler
  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value.toLowerCase() });
  };

  filterBooks = () => {
    const { availableBooks, searchTerm } = this.state;
    return availableBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.category || "").toLowerCase().includes(searchTerm)
    );
  };

  render() {
    const { loading, error, searchTerm } = this.state;
    const isAdmin = this.props.userRole === "admin"; // passed from App.js

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="error">{error}</p>;

    const filteredBooks = this.filterBooks();

    return (
      <div className="dashboard-container">
        <h2>📚 Library Dashboard</h2>

        {isAdmin ? (
          <div className="admin-dashboard">
            {/* LEFT: Books list with search */}
            <div className="admin-books">
              <h3>All Books</h3>
              <input
                type="text"
                placeholder="Search by title, author, or category"
                value={searchTerm}
                onChange={this.handleSearch}
              />
              <div className="books-grid">
                {filteredBooks.length === 0 ? (
                  <p>No books found.</p>
                ) : (
                  filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: Add new book form */}
            <div className="add-book-form">
              <h3>Add New Book</h3>
              <form onSubmit={this.handleAddBook}>
                <input type="text" name="title" placeholder="Title" required />
                <input type="text" name="author" placeholder="Author" required />
                <input type="text" name="isbn" placeholder="ISBN" />
                <input type="number" name="copies" placeholder="Total Copies" required />
                <input type="text" name="category" placeholder="Category" />
                <input type="number" name="published_year" placeholder="Published Year" />
                <input type="text" name="image_url" placeholder="Image URL" />
                <textarea name="description" placeholder="Description"></textarea>
                <button type="submit">➕ Add Book</button>
              </form>
            </div>
          </div>
        ) : (
          // Student view
          <div className="books-grid">
            {filteredBooks.length === 0 ? (
              <p>No books available currently.</p>
            ) : (
              filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
