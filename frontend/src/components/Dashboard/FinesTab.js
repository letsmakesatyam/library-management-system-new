// FinesTab.js
import React, { Component } from "react";

const API_URL = process.env.REACT_APP_API_URL;

class FinesTab extends Component {
  handlePayFine = async (fineId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      const res = await fetch(`${API_URL}/fines/${fineId}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark fine as paid");

      alert("Fine marked as paid ✅");

      // Refresh fines list in parent component
      if (this.props.refreshFines) this.props.refreshFines();
    } catch (err) {
      alert(err.message);
    }
  };

  render() {
    const { fines, isAdmin } = this.props;

    if (!fines || fines.length === 0) {
      return <p>No fines pending ✅</p>;
    }

    return (
      <div className="fines-tab">
        <h3>📄 Fines</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Amount (₹)</th>
              <th>Paid</th>
              {isAdmin && <th>Action</th>}
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.book_title}</td>
                <td>{fine.amount}</td>
                <td>{fine.paid ? "✅ Paid" : "❌ Not Paid"}</td>
                {isAdmin && (
                  <td>
                    {!fine.paid && (
                      <button onClick={() => this.handlePayFine(fine.id)}>
                        Mark as Paid
                      </button>
                    )}
                  </td>
                )}
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
