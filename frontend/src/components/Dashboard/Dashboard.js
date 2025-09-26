// Dashboard.js
import React, { Component } from "react";
import Tabs from "./Tabs";
import BooksTab from "./BooksTab";
import AddBookForm from "./AddBookForm";
import UpdateDeleteTab from "./UpdateDeleteTab";
import StudentsTab from "./StudentTab";
import BookBorrowersTab from "./BookBorrowersTab";
import CurrentBorrowsTab from "./CurrentBorrowsTab";
import HistoryTab from "./HistoryTab";
import ProfileTab from "./ProfileTab";
import "./Dashboard.css";
import FinesTab from "./FinesTab";


class Dashboard extends Component {
  state = {
    availableBooks: [],
    loading: true,
    error: "",
    searchTerm: "",
    activeTab: "Books",
    editingBookId: null,
    currentBorrows: [],
    history: [],
    profile: null,
     fines: [],
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) return;
    this.fetchBooks(token);

    if (this.props.userRole === "student") {
      this.fetchCurrentBorrows(token);
      this.fetchHistory(token);
      this.fetchProfile(token);
      this.fetchFines(token);
    }
  }

  // ---------- Fetch Methods ----------
  fetchBooks = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({
        availableBooks: Array.isArray(data) ? data : [],
        loading: false,
        error: data.error || "",
      });
    } catch {
      this.setState({ availableBooks: [], error: "Failed to fetch books", loading: false });
    }
  };

  fetchCurrentBorrows = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/student/current-borrows", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({ currentBorrows: Array.isArray(data) ? data : [] });
    } catch {
      this.setState({ currentBorrows: [] });
    }
  };

  fetchHistory = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/student/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({ history: Array.isArray(data) ? data : [] });
    } catch {
      this.setState({ history: [] });
    }
  };

  fetchProfile = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      this.setState({ profile: data });
    } catch {
      this.setState({ profile: null });
    }
  };

  // ---------- Actions ----------
  handleAddBook = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const bookData = {
      title: event.target.title.value,
      author: event.target.author.value,
      isbn: event.target.isbn.value,
      copies: event.target.copies.value,
      description: event.target.description.value,
      published_year: event.target.published_year.value,
      category: event.target.category.value,
      image_url: event.target.image_url.value,
    };

    try {
      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add book");

      this.fetchBooks(token);
      event.target.reset();
    } catch (err) {
      alert(err.message);
    }
  };
 handleReturnBook = async (transactionId, bookId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Not authenticated");

  try {
    const res = await fetch(`http://localhost:3000/return/${transactionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to return book");

    alert("Book returned successfully ✅");

    // Update available copies in UI
    this.setState((prev) => ({
      availableBooks: prev.availableBooks.map((book) =>
        book.id === bookId
          ? { ...book, available_copies: book.available_copies + 1 }
          : book
      ),
    }));
  } catch (err) {
    alert(err.message);
  }
};



  handleSearch = (e) => this.setState({ searchTerm: e.target.value.toLowerCase() });

  filterBooks = () => {
    const { availableBooks, searchTerm } = this.state;
    return availableBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.category || "").toLowerCase().includes(searchTerm)
    );
  };

  setActiveTab = (tab) => this.setState({ activeTab: tab, editingBookId: null });

  handleDeleteBook = (id) =>
    this.setState((prev) => ({
      availableBooks: prev.availableBooks.filter((book) => book.id !== id),
    }));

  handleUpdateBook = async (event, id) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const updatedData = {
      title: event.target.title.value,
      author: event.target.author.value,
      isbn: event.target.isbn.value,
      total_copies: event.target.total_copies.value,
      available_copies: event.target.available_copies.value,
      description: event.target.description.value,
      published_year: event.target.published_year.value,
      category: event.target.category.value,
      image_url: event.target.image_url.value,
    };

    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update book");

      this.setState((prev) => ({
        availableBooks: prev.availableBooks.map((book) =>
          book.id === id ? data.book : book
        ),
        editingBookId: null,
      }));
    } catch (err) {
      alert(err.message);
    }
  };

 handleBorrowBook = async (bookId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Not authenticated");

  try {
    const res = await fetch(`http://localhost:3000/borrow/${bookId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to borrow book");

    alert("Book borrowed successfully ✅");

    // Update available copies in UI
    this.setState((prev) => ({
      availableBooks: prev.availableBooks.map((book) =>
        book.id === bookId
          ? { ...book, available_copies: book.available_copies - 1 }
          : book
      ),
    }));

    // ✅ Fetch updated current borrows
    await this.fetchCurrentBorrows(token);
  } catch (err) {
    alert(err.message);
  }
};
fetchFines = async (token) => {
  try {
    const res = await fetch("http://localhost:3000/student/fines", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    this.setState({ fines: Array.isArray(data) ? data : [] });
  } catch {
    this.setState({ fines: [] });
  }
};



  // ---------- Tabs ----------
  renderAdminTabs = () => {
    const { activeTab, searchTerm, editingBookId } = this.state;
    const token = localStorage.getItem("token");
    const filteredBooks = this.filterBooks();

    const tabs = ["Books", "Add Book", "Update/Delete Book", "Students", "Book Borrowers"];

    return (
      <div className="admin-dashboard">
        <Tabs activeTab={activeTab} setActiveTab={this.setActiveTab} tabs={tabs} />
        <div className="tab-content">
          {activeTab === "Books" && (
            <BooksTab searchTerm={searchTerm} handleSearch={this.handleSearch} filteredBooks={filteredBooks} token={token} onDelete={this.handleDeleteBook} />
          )}
          {activeTab === "Add Book" && <AddBookForm onSubmit={this.handleAddBook} />}
          {activeTab === "Update/Delete Book" && (
            <UpdateDeleteTab
              filteredBooks={filteredBooks}
              editingBookId={editingBookId}
              setEditingBookId={(id) => this.setState({ editingBookId: id })}
              token={token}
              onDelete={this.handleDeleteBook}
              onSave={this.handleUpdateBook}
            />
          )}
          {activeTab === "Students" && <StudentsTab token={token} onReturnBook={this.handleReturnBook}  />}
          {activeTab === "Book Borrowers" && <BookBorrowersTab availableBooks={this.state.availableBooks} />}
        </div>
      </div>
    );
  };

  renderStudentTabs = () => {
    const { activeTab, searchTerm, currentBorrows, history, profile , fines } = this.state;
    const token = localStorage.getItem("token");
    const filteredBooks = this.filterBooks();

    const tabs = ["Books", "Current Borrows", "History", "Profile" , "Fines"];

    return (
      <div className="student-dashboard">
        <Tabs activeTab={activeTab} setActiveTab={this.setActiveTab} tabs={tabs} />
        <div className="tab-content">
          {activeTab === "Books" && (
            <BooksTab searchTerm={searchTerm} handleSearch={this.handleSearch} filteredBooks={filteredBooks} token={token} onBorrow={this.handleBorrowBook} userRole="student" />
          )}
          {activeTab === "Current Borrows" && <CurrentBorrowsTab borrows={currentBorrows} />}
          {activeTab === "History" && <HistoryTab history={history} />}
          {activeTab === "Profile" && <ProfileTab profile={profile} />}
          {activeTab === "Fines" && <FinesTab fines={this.state.fines} />}

        </div>
      </div>
    );
  };

  render() {
    const { loading, error } = this.state;
    const isAdmin = this.props.userRole === "admin";

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
      <div className="dashboard-container">
        <h2>📚 Library Dashboard</h2>
        {isAdmin ? this.renderAdminTabs() : this.renderStudentTabs()}
      </div>
    );
  }
}

export default Dashboard;
