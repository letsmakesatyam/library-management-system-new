// BookCard.js
import React from "react";
import "./BookCard.css";

const API_URL = process.env.REACT_APP_API_URL;

const BookCard = ({ book, onDelete, token }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // required for verifyToken
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Book deleted successfully!");
        if (onDelete) onDelete(id); // update parent UI
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete the book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Something went wrong!");
    }
  };

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
        {book.description && (
          <p className="book-description">{book.description}</p>
        )}
        <p>Available Copies: {book.available_copies}</p>

        {/* Delete button only visible for admins */}
        {token && (
          <button
            className="delete-btn"
            onClick={() => handleDelete(book.id)}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
