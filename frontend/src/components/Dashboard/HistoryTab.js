// HistoryTab.js
import React, { Component } from "react";

class HistoryTab extends Component {
  render() {
    const { history } = this.props;

    if (!history || history.length === 0) return <p>No past transactions.</p>;

    return (
      <div>
        <h3>Borrow History</h3>
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Borrowed At</th>
              <th>Returned At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{h.book_title}</td>
                <td>{new Date(h.borrowed_at).toLocaleDateString()}</td>
                <td>{h.returned_at ? new Date(h.returned_at).toLocaleDateString() : "-"}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default HistoryTab;
