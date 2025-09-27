// UpdateDeleteTab.js
import React, { Component } from "react";
import BookCard from "../BookCard";
import EditBookForm from "./EditBookForm";
import './UpdateDeleteTab.css';

class UpdateDeleteTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      filteredBooks: props.filteredBooks || [],
    };
  }

  componentDidUpdate(prevProps) {
    // Update filteredBooks if props change
    if (prevProps.filteredBooks !== this.props.filteredBooks) {
      this.setState({ filteredBooks: this.props.filteredBooks });
    }
  }

  handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = this.props.filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.category && book.category.toLowerCase().includes(searchTerm))
    );
    this.setState({ searchTerm: e.target.value, filteredBooks });
  };

  render() {
    const { editingBookId, setEditingBookId, token, onDelete, onSave } = this.props;
    const { searchTerm, filteredBooks } = this.state;

    return (
      <div className="update-delete-tab-container">
        <h3 className="tab-title">Update / Delete Books</h3>

        <input
          type="text"
          placeholder="Search by title, author, or category"
          value={searchTerm}
          onChange={this.handleSearch}
          className="book-search-input"
        />

        {filteredBooks.length === 0 ? (
          <p className="no-books-msg">No books found.</p>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card-wrapper">
                {editingBookId === book.id ? (
                  <EditBookForm
                    book={book}
                    onSave={onSave}
                    onCancel={() => setEditingBookId(null)}
                    onDelete={onDelete}
                  />
                ) : (
                  <>
                    <BookCard book={book} token={token} onDelete={onDelete} />
                    <button
                      className="edit-book-btn"
                      onClick={() => setEditingBookId(book.id)}
                    >
                      ✏️ Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default UpdateDeleteTab;
