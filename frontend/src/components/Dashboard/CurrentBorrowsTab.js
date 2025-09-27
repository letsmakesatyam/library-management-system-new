// CurrentBorrowsTab.js
import React, { Component } from "react";
import "./CurrentBorrowsTab.css"; // Import the CSS file

class CurrentBorrowsTab extends Component {
  render() {
    const { borrows } = this.props;

    if (!borrows || borrows.length === 0) {
      return <p className="no-borrows-message">No current borrows.</p>;
    }

    return (
      <div className="current-borrows-container">
        <h3>Current Borrows</h3>
        <div className="table-wrapper">
          <table className="borrows-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrowed At</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b.id}>
                  <td>{b.book_title}</td>
                  <td>{new Date(b.borrowed_at).toLocaleDateString()}</td>
                  <td>{new Date(b.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default CurrentBorrowsTab;