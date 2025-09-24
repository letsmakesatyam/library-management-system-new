import React from "react";
import './AddBookForm.css'

const AddBookForm = ({ onSubmit }) => (
  <div className="add-book-form">
    <h3>Add New Book</h3>
    <form onSubmit={onSubmit}>
      <input type="text" name="title" placeholder="Title" required />
      <input type="text" name="author" placeholder="Author" required />
      <input type="text" name="isbn" placeholder="ISBN" />
      <input type="number" name="copies" placeholder="Total Copies" required />
      <input type="text" name="category" placeholder="Category" />
      <input type="number" name="published_year" placeholder="Published Year" />
      <input type="text" name="image_url" placeholder="Image URL" />
      <textarea name="description" placeholder="Description"></textarea>
      <button type="submit">➕ Add Book</button>
    </form>
  </div>
);

export default AddBookForm;
