// BooksTab.js
import React, { Component } from "react";
import BookCard from "../BookCard";
import './BooksTab.css';

const API_URL = process.env.REACT_APP_API_URL;

class BooksTab extends Component {
  handleBorrow = async (bookId) => {
    const { token } = this.props;
    try {
      const res = await fetch(`${API_URL}/borrow/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to borrow book");
      alert("Book borrowed successfully ✅");

      // Optional: refresh books after borrow
      if (this.props.refreshBooks) this.props.refreshBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  handleReturn = async (transactionId) => {
    const { token } = this.props;
    try {
      const res = await fetch(`${API_URL}/transactions/${transactionId}/return`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to return book");
      alert("Book returned successfully ✅");

      // Optional: refresh books after return
      if (this.props.refreshBooks) this.props.refreshBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  render() {
    const { filteredBooks, searchTerm, handleSearch, token, onDelete, userRole } = this.props;

    return (
      <div className="admin-books">
        <h3>All Books</h3>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or category"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="books-grid">
          {filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id}>
                <BookCard book={book} token={token} onDelete={onDelete} />
                {userRole === "student" && book.available_copies > 0 && (
                  <button onClick={() => this.handleBorrow(book.id)}>Borrow</button>
                )}
                {userRole === "admin" && book.status === "borrowed" && book.transactionId && (
                  <button onClick={() => this.handleReturn(book.transactionId)}>Return</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default BooksTab;
