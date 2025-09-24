import React, { Component } from "react";
import "./StudentsTab.css";

class StudentsTab extends Component {
  state = {
    students: [],
    selectedStudentId: null,
    transactions: [],
    loading: false,
    error: "",
  };

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = async () => {
    const { token } = this.props;
    try {
      const res = await fetch("http://localhost:3000/users?role=student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({ students: data });
    } catch (err) {
      console.error(err);
      this.setState({ error: "Failed to fetch students" });
    }
  };

  fetchTransactions = async (studentId) => {
    const { token } = this.props;
    this.setState({ loading: true, transactions: [] });
    try {
      const res = await fetch(
        `http://localhost:3000/transactions?user_id=${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      this.setState({ transactions: data, loading: false, selectedStudentId: studentId });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, error: "Failed to fetch transactions" });
    }
  };

  handleStudentClick = (studentId) => {
    this.fetchTransactions(studentId);
  };

  render() {
    const { students, selectedStudentId, transactions, loading, error } = this.state;

    return (
      <div className="students-tab">
        <h3>Students</h3>
        {error && <p className="error">{error}</p>}

        <div className="students-list">
          {students.length === 0 ? (
            <p>No students found</p>
          ) : (
            students.map((student) => (
              <button
                key={student.id}
                className={selectedStudentId === student.id ? "active" : ""}
                onClick={() => this.handleStudentClick(student.id)}
              >
                {student.name} ({student.roll_no})
              </button>
            ))
          )}
        </div>

        {selectedStudentId && (
          <div className="transactions-list">
            <h4>
              Transactions of {students.find(s => s.id === selectedStudentId)?.name}
            </h4>
            {loading ? (
              <p>Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed At</th>
                    <th>Returned At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.book_title}</td>
                      <td>{new Date(t.borrowed_at).toLocaleString()}</td>
                      <td>{t.returned_at ? new Date(t.returned_at).toLocaleString() : "-"}</td>
                      <td>{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default StudentsTab;
