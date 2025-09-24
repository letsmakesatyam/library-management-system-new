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
    activeTab: "Books",
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

  handleAddBook = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const bookData = {
      title: event.target.title.value,
      author: event.target.author.value,
      isbn: event.target.isbn.value,
      copies: event.target.copies.value,
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

      this.fetchBooks(token);
      event.target.reset();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

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

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleDeleteBook = (id) => {
    // Remove deleted book from state
    this.setState((prevState) => ({
      availableBooks: prevState.availableBooks.filter((book) => book.id !== id),
    }));
  };

  renderAdminTabs = () => {
    const { activeTab, searchTerm } = this.state;
    const token = localStorage.getItem("token");
    const filteredBooks = this.filterBooks();

    return (
      <div className="admin-dashboard">
        {/* Tab Navigation */}
        <div className="admin-tabs">
          {["Books", "Add Book", "Update/Delete Book", "Students", "Book Borrowers"].map(
            (tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active-tab" : ""}
                onClick={() => this.setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tab Contents */}
        <div className="tab-content">
          {activeTab === "Books" && (
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
                    <BookCard
                      key={book.id}
                      book={book}
                      token={token}
                      onDelete={this.handleDeleteBook} // ✅ pass delete callback
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Add Book" && (
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
          )}

          {activeTab === "Update/Delete Book" && (
          <div className="update-delete-books">
            <h3>Update / Delete Books</h3>
            <div className="books-grid">
              {filteredBooks.length === 0 ? (
                <p>No books found.</p>
              ) : (
                filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    token={token} // needed for delete
                    onDelete={this.handleDeleteBook} // updates Dashboard state
                  />
                ))
              )}
            </div>
          </div>
          )}


          {activeTab === "Students" && (
            <div>
              <h3>All Students & Transactions (Coming Soon)</h3>
            </div>
          )}

          {activeTab === "Book Borrowers" && (
            <div>
              <h3>Book Borrowers Details (Coming Soon)</h3>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { loading, error } = this.state;
    const isAdmin = this.props.userRole === "admin";

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
      <div className="dashboard-container">
        <h2>📚 Library Dashboard</h2>
        {isAdmin
          ? this.renderAdminTabs()
          : (
            <div className="books-grid">
              {this.filterBooks().map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
      </div>
    );
  }
}

export default Dashboard;
