// BookBorrowersTab.js
import React, { Component } from "react";
import './BookBorrowersTab.css';

class BookBorrowersTab extends Component {
  state = {
    selectedBook: null,
    borrowers: [],
    searchTerm: '',
    filteredBooks: this.props.books || [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.books !== this.props.books) {
      this.setState({ filteredBooks: this.props.books });
    }
  }

  handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = this.props.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      (book.category && book.category.toLowerCase().includes(searchTerm))
    );
    this.setState({ searchTerm: e.target.value, filteredBooks });
  }

  selectBook = async (book) => {
    this.setState({ selectedBook: book, borrowers: [] });
    const token = this.props.token;
    if (!token) return alert("Not authenticated");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/transactions/book/${book.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch borrowers");
      const data = await res.json();
      this.setState({ borrowers: data });
    } catch (err) {
      console.error(err);
      alert("Error fetching borrowers");
    }
  }

  goBack = () => {
    this.setState({ selectedBook: null, borrowers: [] });
  }

  render() {
    const { filteredBooks, searchTerm, selectedBook, borrowers } = this.state;

    if (selectedBook) {
      return (
        <div className="book-borrowers-tab-container">
          <button className="back-btn" onClick={this.goBack}>← Back to Books</button>

          <h3 className="book-title">{selectedBook.title}</h3>
          <p><b>Author:</b> {selectedBook.author}</p>
          <p><b>Category:</b> {selectedBook.category}</p>
          <p><b>ISBN:</b> {selectedBook.isbn}</p>
          <p><b>Total Copies:</b> {selectedBook.total_copies}</p>
          <p><b>Available Copies:</b> {selectedBook.available_copies}</p>
          <p><b>Published Year:</b> {selectedBook.published_year}</p>
          <p><b>Description:</b> {selectedBook.description}</p>

          <h4>Borrowers</h4>
          <div className="borrowers-table-wrapper">
            {borrowers.length === 0 ? <p>No borrowers yet.</p> :
              <table className="borrowers-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Borrowed At</th>
                    <th>Returned At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowers.map(b => (
                    <tr key={b.id}>
                      <td>{b.student_name}</td>
                      <td>{b.roll_no}</td>
                      <td>{new Date(b.borrowed_at).toLocaleString()}</td>
                      <td>{b.returned_at ? new Date(b.returned_at).toLocaleString() : '-'}</td>
                      <td>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>
      );
    }

    return (
      <div className="book-borrowers-tab-container">
        <h3>All Books</h3>
        <input
          type="text"
          placeholder="Search by title, author, or category"
          value={searchTerm}
          onChange={this.handleSearch}
          className="books-search-input"
        />
        <div className="books-table-wrapper">
          <table className="books-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Available Copies</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr><td colSpan="4">No books found.</td></tr>
              ) : (
                filteredBooks.map(book => (
                  <tr key={book.id} onClick={() => this.selectBook(book)} className="book-row">
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.available_copies}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default BookBorrowersTab;
