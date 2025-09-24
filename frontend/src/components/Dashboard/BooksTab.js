import React from "react";
import BookCard from "../BookCard";
import './BooksTab.css'

const BooksTab = ({ searchTerm, handleSearch, filteredBooks, token, onDelete }) => (
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
          <BookCard key={book.id} book={book} token={token} onDelete={onDelete} />
        ))
      )}
    </div>
  </div>
);

export default BooksTab;
