import React from "react";
import BookCard from "../BookCard";
import EditBookForm from "./EditBookForm";
import './UpdateDeleteTab.css'

const UpdateDeleteTab = ({ filteredBooks, editingBookId, setEditingBookId, token, onDelete, onSave }) => (
  <div className="update-delete-books">
    <h3>Update / Delete Books</h3>
    <div className="books-grid">
      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        filteredBooks.map((book) => (
          <div key={book.id} className="book-edit-card">
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
                <button onClick={() => setEditingBookId(book.id)}>✏️ Edit</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

export default UpdateDeleteTab;
