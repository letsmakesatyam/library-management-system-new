// BooksTab.js
import React, { Component } from "react";
import BookCard from "../BookCard";
import './BooksTab.css';



class BooksTab extends Component {
  render() {
    const { filteredBooks, searchTerm, handleSearch, token, onDelete, userRole, onBorrow } = this.props;

    return (
      <div className="books-tab-content">
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
              <BookCard
                key={book.id}
                book={book}
                token={token}
                onDelete={onDelete}
                onBorrow={onBorrow} // Pass the onBorrow function here
                userRole={userRole}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default BooksTab;