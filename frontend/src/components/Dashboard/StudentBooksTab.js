// BooksTab.js
import React, { Component } from "react";

class BooksTab extends Component {
  render() {
    const { filteredBooks, handleSearch, onBorrow, userRole } = this.props;

    return (
      <div>
        <h3>Books</h3>
        <input
          type="text"
          placeholder="Search by title, author, or category"
          onChange={handleSearch}
        />
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Available Copies</th>
              {userRole === "student" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr><td colSpan={userRole === "student" ? 5 : 4}>No books found.</td></tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category || "-"}</td>
                  <td>{book.available_copies}</td>
                  {userRole === "student" && (
                    <td>
                      {book.available_copies > 0 ? (
                        <button onClick={() => onBorrow(book.id)}>Borrow</button>
                      ) : (
                        "Unavailable"
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default BooksTab;
