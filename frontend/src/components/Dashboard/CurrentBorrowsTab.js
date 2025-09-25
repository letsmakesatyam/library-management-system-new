// CurrentBorrowsTab.js
import React, { Component } from "react";

class CurrentBorrowsTab extends Component {
  render() {
    const { borrows } = this.props;

    if (!borrows || borrows.length === 0) return <p>No current borrows.</p>;

    return (
      <div>
        <h3>Current Borrows</h3>
        <table>
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
    );
  }
}

export default CurrentBorrowsTab;
