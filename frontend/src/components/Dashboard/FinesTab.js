import React, { Component } from "react";
import "./FinesTab.css";

class FinesTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fines: [],
    };
  }

  componentDidMount() {
    this.fetchFines();
  }

  fetchFines() {
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/api/fines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ fines: data });
      })
      .catch((err) => {
        console.error("Error fetching fines:", err);
      });
  }

  render() {
    const { fines } = this.state;

    return (
      <div className="fines-container">
        <h2 className="fines-title">Your Fines</h2>
        {fines.length === 0 ? (
          <p className="no-fines">No fines 🎉</p>
        ) : (
          <div className="fines-list">
            {fines.map((fine) => (
              <div className="fine-card" key={fine.id}>
                <div className="fine-row">
                  <span className="fine-label">Book:</span>{" "}
                  <span className="fine-value">
                    {fine.book_title || `Book ID ${fine.book_id}`}
                  </span>
                </div>
                <div className="fine-row">
                  <span className="fine-label">Due Date:</span>{" "}
                  <span className="fine-value">
                    {fine.due_date
                      ? new Date(fine.due_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="fine-row">
                  <span className="fine-label">Amount:</span>{" "}
                  <span className="fine-value">₹{fine.amount}</span>
                </div>
                <div className="fine-row">
                  <span className="fine-label">Paid:</span>{" "}
                  <span
                    className={`fine-value ${
                      fine.paid ? "paid" : "unpaid"
                    }`}
                  >
                    {fine.paid ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default FinesTab;
