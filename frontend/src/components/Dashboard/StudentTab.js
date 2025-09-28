// StudentsTab.js
import React, { Component } from "react";
import "./StudentsTab.css";

const API_URL = process.env.REACT_APP_API_URL;

class StudentsTab extends Component {
  state = {
    students: [],
    filteredStudents: [],
    selectedStudent: null,
    transactions: [],
    loading: false,
    error: "",
    searchTerm: "",
    editingTransactionId: null,
    newDueDate: "",
  };

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = async () => {
    const { token } = this.props;
    try {
      const res = await fetch(`${API_URL}/users?role=student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const studentsList = Array.isArray(data) ? data : [];
      this.setState({ students: studentsList, filteredStudents: studentsList });
    } catch (err) {
      console.error(err);
      this.setState({ error: "Failed to fetch students" });
    }
  };

  fetchTransactions = async (student) => {
    const { token } = this.props;
    this.setState({ loading: true, transactions: [], selectedStudent: student });
    try {
      const res = await fetch(`${API_URL}/transactions?user_id=${student.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({
        transactions: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, error: "Failed to fetch transactions" });
    }
  };

  handleReturn = async (transactionId, bookId) => {
    await this.props.onReturnBook(transactionId, bookId);
    if (this.state.selectedStudent) {
      this.fetchTransactions(this.state.selectedStudent);
    }
  };

  handleUpdateDueDate = async (transactionId) => {
    const { token } = this.props;
    const { newDueDate, selectedStudent } = this.state;
    if (!newDueDate) {
      alert("Please select a new due date.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/transactions/${transactionId}/due-date`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_due_date: newDueDate }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update due date");
      }

      alert("Due date updated successfully! ✅");
      this.setState({ editingTransactionId: null, newDueDate: "" });
      if (selectedStudent) {
        this.fetchTransactions(selectedStudent);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  handleEditClick = (transaction) => {
    const formattedDate = transaction.due_date ? new Date(transaction.due_date).toISOString().slice(0, 10) : "";
    this.setState({
      editingTransactionId: transaction.id,
      newDueDate: formattedDate,
    });
  };

  handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStudents = this.state.students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm) ||
        (s.roll_no && s.roll_no.toLowerCase().includes(searchTerm))
    );
    this.setState({ searchTerm: e.target.value, filteredStudents });
  };

  // Helper function to format a date string
  formatDate = (dateString) => {
    try {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  render() {
    const {
      filteredStudents,
      selectedStudent,
      transactions,
      loading,
      error,
      searchTerm,
      editingTransactionId,
      newDueDate,
    } = this.state;

    return (
      <div className="students-tab-container">
        <h3 className="tab-title">Students</h3>
        {error && <p className="error-msg">{error}</p>}

        {!selectedStudent && (
          <>
            <input
              type="text"
              placeholder="Search by name or roll no"
              value={searchTerm}
              onChange={this.handleSearch}
              className="student-search-input"
            />
            <div className="students-table-wrapper">
              {filteredStudents.length === 0 ? (
                <p className="no-students-msg">No students found.</p>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => this.fetchTransactions(student)}
                        className="student-row"
                      >
                        <td>{student.name}</td>
                        <td>{student.roll_no}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {selectedStudent && (
          <div className="transactions-table-wrapper">
            <button
              onClick={() => this.setState({ selectedStudent: null, transactions: [] })}
              className="back-btn"
            >
              ⬅ Back to Students
            </button>
            <h4 className="transactions-title">Transactions of {selectedStudent.name}</h4>
            {loading ? (
              <p>Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="no-transactions-msg">No transactions found.</p>
            ) : (
              <div className="transactions-table-scroll">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Borrowed At</th>
                      <th>Due Date</th>
                      <th>Returned At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.book_title}</td>
                        <td>{this.formatDate(t.borrowed_at)}</td>
                        <td>
                          {editingTransactionId === t.id ? (
                            <input
                              type="date"
                              value={newDueDate}
                              onChange={(e) => this.setState({ newDueDate: e.target.value })}
                              className="due-date-input"
                            />
                          ) : (
                            this.formatDate(t.due_date)
                          )}
                        </td>
                        <td>{this.formatDate(t.returned_at)}</td>
                        <td>{t.status}</td>
                        <td>
                          {t.status === "borrowed" && (
                            <>
                              {editingTransactionId === t.id ? (
                                <>
                                  <button
                                    onClick={() => this.handleUpdateDueDate(t.id)}
                                    className="save-btn"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => this.setState({ editingTransactionId: null })}
                                    className="cancel-btn"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => this.handleEditClick(t)}
                                  className="edit-due-date-btn"
                                >
                                  Edit Due Date ✏️
                                </button>
                              )}
                              <button
                                onClick={() => this.handleReturn(t.id, t.book_id)}
                                className="return-btn"
                              >
                                Return
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default StudentsTab;