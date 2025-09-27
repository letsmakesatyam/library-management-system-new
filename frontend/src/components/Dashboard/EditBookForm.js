// EditBookForm.js
import React from "react";
import './EditBookForm.css'; // Import the CSS file

const EditBookForm = ({ book, onSave, onCancel, onDelete }) => (
  <form className="edit-book-form" onSubmit={(e) => onSave(e, book.id)}>
    <input type="text" name="title" defaultValue={book.title || ""} placeholder="Title" required />
    <input type="text" name="author" defaultValue={book.author || ""} placeholder="Author" required />
    <input type="text" name="isbn" defaultValue={book.isbn || ""} placeholder="ISBN" />
    <input type="number" name="total_copies" defaultValue={book.total_copies || 0} placeholder="Total Copies" required />
    <input type="number" name="available_copies" defaultValue={book.available_copies || 0} placeholder="Available Copies" required />
    <input type="text" name="category" defaultValue={book.category || ""} placeholder="Category" />
    <input type="number" name="published_year" defaultValue={book.published_year || ""} placeholder="Published Year" />
    <input type="text" name="image_url" defaultValue={book.image_url || ""} placeholder="Image URL" />
    <textarea name="description" defaultValue={book.description || ""} placeholder="Description"></textarea>
    <div className="edit-actions">
      <button type="submit" className="save-btn">💾 Save</button>
      <button type="button" onClick={onCancel} className="cancel-btn">❌ Cancel</button>
      <button type="button" onClick={() => onDelete(book.id)} className="delete-btn">🗑 Delete</button>
    </div>
  </form>
);

export default EditBookForm;