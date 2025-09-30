// BookBorrowersTab.js
import React, { Component } from "react";
import './BookBorrowersTab.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList
} from "recharts";

class BookBorrowersTab extends Component {
  state = {
    selectedBook: null,
    borrowers: [],
    searchTerm: '',
    filteredBooks: this.props.books || [],
    borrowCounts: [], // Chart data for all books
  };

  componentDidMount() {
    if (this.props.books) this.calculateBorrowCounts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.books !== this.props.books) {
      this.setState({ filteredBooks: this.props.books }, () => {
        this.calculateBorrowCounts();
      });
    }
  }

  // Calculate borrow count for all books
  calculateBorrowCounts = async () => {
    const token = this.props.token;
    if (!token) return;

    try {
      const borrowCounts = await Promise.all(
        this.props.books.map(async (book) => {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/transactions/book/${book.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) return { title: book.title, count: 0 };
          const data = await res.json();
          return { title: book.title, count: data.length };
        })
      );
      this.setState({ borrowCounts });
    } catch (err) {
      console.error("Error calculating borrow counts", err);
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
    const { filteredBooks, searchTerm, selectedBook, borrowers, borrowCounts } = this.state;

    if (selectedBook) {
      // Chart data for borrowers of selected book
      const borrowerChartData = borrowers.reduce((acc, b) => {
        const existing = acc.find(x => x.name === b.student_name);
        if (existing) existing.count += 1;
        else acc.push({ name: b.student_name, count: 1 });
        return acc;
      }, []);

      return (
        <div className="book-borrowers-tab-container">
          <button className="back-btn" onClick={this.goBack}>← Back to Books</button>

          <div className="book-info-card">
            <h3 className="book-title">{selectedBook.title}</h3>
            <p><b>Author:</b> {selectedBook.author}</p>
            <p><b>Category:</b> {selectedBook.category}</p>
            <p><b>ISBN:</b> {selectedBook.isbn}</p>
            <p><b>Total Copies:</b> {selectedBook.total_copies}</p>
            <p><b>Available Copies:</b> {selectedBook.available_copies}</p>
            <p><b>Published Year:</b> {selectedBook.published_year}</p>
            <p><b>Description:</b> {selectedBook.description}</p>
          </div>

          <h4 className="section-title">Borrowers List</h4>
          <div className="borrowers-table-wrapper">
            {borrowers.length === 0 ? <p>No borrowers yet.</p> :
              <>
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

                <h4 className="section-title">Borrower Activity Chart</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={borrowerChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d">
                      <LabelList dataKey="count" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            }
          </div>
        </div>
      );
    }

    // Main book list view
    return (
      <div className="book-borrowers-tab-container">
        <h3 className="section-title">All Books</h3>
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

        <h4 className="section-title">Borrowed Books Comparison</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={borrowCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" interval={0} angle={-25} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default BookBorrowersTab;
