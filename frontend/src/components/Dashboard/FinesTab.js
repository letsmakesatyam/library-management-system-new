// FinesTab.js
import React, { Component } from "react";

class FinesTab extends Component {
  render() {
    const { fines } = this.props;

    if (!fines || fines.length === 0) {
      return <p>No fines pending ✅</p>;
    }

    return (
      <div className="fines-tab">
        <h3>📄 Your Fines</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Amount (₹)</th>
              <th>Paid</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.book_title}</td>
                <td>{fine.amount}</td>
                <td>{fine.paid ? "✅ Paid" : "❌ Not Paid"}</td>
                <td>{new Date(fine.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FinesTab;
