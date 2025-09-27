// BookBorrowersTab.js
import React, { Component } from "react";
import "./BookBorrowersTab.css";

// ✅ Use backend URL from .env
const API_URL = process.env.REACT_APP_API_URL;

class BookBorrowersTab extends Component {
  state = {
    borrowers: [],
    selectedBookId: null,
    loading: false,
    error: "",
  };

  fetchBorrowers = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    this.setState({ loading: true, error: "", selectedBookId: bookId });

    try {
      const res = await fetch(`${API_URL}/transactions/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch borrowers");

      this.setState({ borrowers: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ error: err.message, loading: false, borrowers: [] });
    }
  };

  render() {
    const { availableBooks } = this.props;
    const { borrowers, selectedBookId, loading, error } = this.state;

    return (
      <div className="borrowers-tab">
        <h3>📖 Book Borrowers</h3>
        <div className="books-list">
          {availableBooks.map((book) => (
            <div
              key={book.id}
              className={`book-card ${selectedBookId === book.id ? "active" : ""}`}
              onClick={() => this.fetchBorrowers(book.id)}
            >
              <p><b>{book.title}</b></p>
              <p className="author">by {book.author}</p>
            </div>
          ))}
        </div>

        <div className="borrowers-list">
          {loading && <p>Loading borrowers...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && borrowers.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Status</th>
                  <th>Borrowed At</th>
                  <th>Returned At</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.map((b) => (
                  <tr key={b.id}>
                    <td>{b.student_name}</td>
                    <td>{b.roll_no}</td>
                    <td>{b.status}</td>
                    <td>{new Date(b.borrowed_at).toLocaleString()}</td>
                    <td>{b.returned_at ? new Date(b.returned_at).toLocaleString() : "Not Returned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && selectedBookId && borrowers.length === 0 && !error && (
            <p>No borrowers found for this book.</p>
          )}
        </div>
      </div>
    );
  }
}

export default BookBorrowersTab;
