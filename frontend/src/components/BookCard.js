// BookCard.js
import React from "react";
import "./BookCard.css";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img
        src={book.image_url || "/default-book.png"}
        alt={book.title}
        className="book-image"
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">By {book.author}</p>
        {book.isbn && <p>ISBN: {book.isbn}</p>}
        {book.published_year && <p>Published: {book.published_year}</p>}
        {book.category && <p>Category: {book.category}</p>}
        {book.description && <p className="book-description">{book.description}</p>}
        <p>Available Copies: {book.available_copies}</p>
      </div>
    </div>
  );
};

export default BookCard;
