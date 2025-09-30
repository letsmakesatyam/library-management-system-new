// backend/app.js
const express = require('express');
require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const pool = require('./db');
const path = require('path');


app.use(express.json());
app.use(cors());
const finesRoutes = require("./routes/fines");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // store decoded info in req.user
    next();
  });
};

app.use("/api/fines", verifyToken, finesRoutes);



app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 3000;

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});



// Secret admin key (hardcoded for now, can move to .env later)
const ADMIN_SECRET = "admin123";

// Register endpoint
// Register endpoint
app.post('/register', async (req, res) => {
  const { name, role, roll_no, password, adminSecret } = req.body;

  try {
    if (role === 'admin') {
      // Admin must provide correct secret
      if (adminSecret !== ADMIN_SECRET) {
        return res.status(401).json({ error: 'Invalid admin secret' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO users (name, role, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, role`,
        [name, 'admin', hashedPassword]
      );

      const token = jwt.sign(
        { id: result.rows[0].id, role: result.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ token });
    }

    if (role === 'student') {
  if (!roll_no || !password) {
    return res.status(400).json({ error: 'Roll number and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, role, roll_no, password)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, role`,
    [name, 'student', roll_no, hashedPassword]
  );

  const token = jwt.sign(
    { id: result.rows[0].id, role: result.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({ token });
}


    return res.status(400).json({ error: 'Invalid role' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find user by name
    const result = await pool.query(
      `SELECT * FROM users WHERE name = $1`,
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Middleware to verify JWT and extract user info


// Admin route to add a book
// Admin route to add a book
// Admin route to add a book
// Admin route to add a book
app.post('/books', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add books' });
  }

  const { title, author, isbn, copies, description, published_year, category, image_url } = req.body;

  if (!title || !author || !copies) {
    return res.status(400).json({ error: 'Title, author, and copies are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO books 
        (title, author, isbn, total_copies, available_copies, description, published_year, category, image_url)
       VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, author, isbn, copies, description || null, published_year || null, category || null, image_url || null]
    );

    res.json({ book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




// Student/Admin view all books
app.get('/books', verifyToken, async (req, res) => {
  try {
    // Allow both student and admin
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Student borrows a book
app.post('/borrow/:bookId', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can borrow books' });
  }

  const { bookId } = req.params;

  try {
    // Check if book exists and is available
    const book = await pool.query(
      `SELECT * FROM books WHERE id = $1`,
      [bookId]
    );

    if (book.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.rows[0].available_copies <= 0) {
      return res.status(400).json({ error: 'No copies available' });
    }

    // Decrease available copies
    await pool.query(
      `UPDATE books SET available_copies = available_copies - 1 WHERE id = $1`,
      [bookId]
    );

    // Insert transaction
    // Insert transaction with due_date (14 days default)
const result = await pool.query(
  `INSERT INTO transactions (user_id, book_id, status, due_date)
   VALUES ($1, $2, 'borrowed', NOW() + INTERVAL '14 days')
   RETURNING *`,
  [req.user.id, bookId]
);


    res.json({ message: 'Book borrowed successfully ✅', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Get transactions
// backend/app.js

// ... (existing code before the /transactions endpoint)

app.get('/transactions', verifyToken, async (req, res) => {
    const studentId = req.query.user_id; // optional for admin to filter specific student

    try {
        let result;

        if (req.user.role === 'admin') {
            // Admin: filter by student if user_id provided, else get all
            if (studentId) {
                result = await pool.query(
                    `SELECT t.id, u.name AS student_name, b.title AS book_title, t.borrowed_at, t.returned_at, t.status, t.due_date
                    FROM transactions t
                    JOIN users u ON t.user_id = u.id
                    JOIN books b ON t.book_id = b.id
                    WHERE u.id = $1
                    ORDER BY t.borrowed_at DESC`,
                    [studentId]
                );
            } else {
                result = await pool.query(
                    `SELECT t.id, u.name AS student_name, b.title AS book_title, t.borrowed_at, t.returned_at, t.status, t.due_date
                    FROM transactions t
                    JOIN users u ON t.user_id = u.id
                    JOIN books b ON t.book_id = b.id
                    ORDER BY t.borrowed_at DESC`
                );
            }
        } else {
            // Student: only their own transactions
            result = await pool.query(
                `SELECT t.id, b.title AS book_title, t.borrowed_at, t.returned_at, t.status, t.due_date
                FROM transactions t
                JOIN books b ON t.book_id = b.id
                WHERE t.user_id = $1
                ORDER BY t.borrowed_at DESC`,
                [req.user.id]
            );
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ... (existing code after the /transactions endpoint)
// Admin returns a book
// Admin returns a book with fine calculation
app.patch('/transactions/:id/return', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can return books' });
  }

  const { id } = req.params;

  try {
    // 1️⃣ Fetch transaction
    const txResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (txResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = txResult.rows[0];

    if (transaction.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // 2️⃣ Calculate fine (e.g., ₹10 per day late)
    let fineAmount = 0;
    const today = new Date();
    const dueDate = new Date(transaction.due_date);

    if (today > dueDate) {
      const lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = lateDays * 10; // ₹10 per day late
    }

    // 3️⃣ Update transaction
    await pool.query(
      `UPDATE transactions
       SET returned_at = NOW(), status = 'returned'
       WHERE id = $1`,
      [id]
    );

    // 4️⃣ Increment available copies
    await pool.query(
      `UPDATE books
       SET available_copies = available_copies + 1
       WHERE id = $1`,
      [transaction.book_id]
    );

    // 5️⃣ If fine > 0, insert into fines table
    if (fineAmount > 0) {
      await pool.query(
        `INSERT INTO fines (transaction_id, student_id, amount)
         VALUES ($1, $2, $3)`,
        [transaction.id, transaction.user_id, fineAmount]
      );
    }

    res.json({
      message: 'Book returned successfully ✅',
      fine: fineAmount > 0 ? `Fine applied: ₹${fineAmount}` : 'No fine'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to return book' });
  }
});


// Admin: update a book
app.patch('/books/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update books' });
  }

  const bookId = req.params.id;
  const { title, author, isbn, total_copies, available_copies, description, published_year, category, image_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, total_copies = $4, available_copies = $5,
           description = $6, published_year = $7, category = $8, image_url = $9
       WHERE id = $10
       RETURNING *`,
      [title, author, isbn, total_copies, available_copies, description, published_year, category, image_url, bookId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' }); // ✅ JSON response
  }
});



// Admin: delete a book
app.delete('/books/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete books' });
  }

  const bookId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [bookId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Get all students (Admin only)
app.get('/users', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view students' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, roll_no FROM users WHERE role = $1',
      ['student']
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all borrowers of a specific book (Admin only)
app.get('/transactions/book/:bookId', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view borrowers' });
  }

  const { bookId } = req.params;

  try {
    const result = await pool.query(
      `SELECT t.id, u.name AS student_name, u.roll_no, 
              t.borrowed_at, t.returned_at, t.status
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE t.book_id = $1
       ORDER BY t.borrowed_at DESC`,
      [bookId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ===============================
// Student Dashboard APIs
// ===============================

// Get logged-in student profile
app.get('/student/profile', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view profile' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, roll_no FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all borrow history of logged-in student
app.get('/student/history', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view history' });
  }

  try {
    const result = await pool.query(
      `SELECT t.id, b.title AS book_title, t.borrowed_at, t.returned_at, t.status
       FROM transactions t
       JOIN books b ON t.book_id = b.id
       WHERE t.user_id = $1
       ORDER BY t.borrowed_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get currently borrowed (not returned) books with due date
// (for simplicity, we assume 14 days due period after borrow)
app.get('/student/current-borrows', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view current borrows' });
  }

  try {
    const result = await pool.query(
      `SELECT t.id, b.title AS book_title, t.borrowed_at, t.due_date
       FROM transactions t
       JOIN books b ON t.book_id = b.id
       WHERE t.user_id = $1 AND t.status = 'borrowed'
       ORDER BY t.borrowed_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// RETURN BOOK API
app.post("/return/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  try {
    // 1️⃣ Find the transaction
    const transactionResult = await pool.query(
      "SELECT * FROM transactions WHERE id = $1 AND status = 'borrowed'",
      [transactionId]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found or already returned" });
    }

    const transaction = transactionResult.rows[0];

    // 2️⃣ Update transaction status to returned
    await pool.query(
      "UPDATE transactions SET status = 'returned', returned_at = NOW() WHERE id = $1",
      [transactionId]
    );

    // 3️⃣ Increment available copies in books
    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
      [transaction.book_id]
    );

    res.json({ message: "Book returned successfully", transactionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to return book" });
  }
});
// 🛠️ Admin: Update due_date for a transaction
app.patch('/transactions/:id/due-date', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can edit due dates' });
  }

  const { id } = req.params;
  const { new_due_date } = req.body;

  if (!new_due_date) {
    return res.status(400).json({ error: 'new_due_date is required (YYYY-MM-DD format)' });
  }

  try {
    const result = await pool.query(
      `UPDATE transactions 
       SET due_date = $1
       WHERE id = $2
       RETURNING id, user_id, book_id, borrowed_at, due_date, status`,
      [new_due_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Due date updated successfully ✅', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update due date' });
  }
});


// Student: view their fines
app.get('/student/fines', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view their fines' });
  }

  try {
    const result = await pool.query(
      `SELECT f.id, f.amount, f.paid, t.book_id, b.title AS book_title, f.created_at
       FROM fines f
       JOIN transactions t ON f.transaction_id = t.id
       JOIN books b ON t.book_id = b.id
       WHERE f.student_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
});

// Admin: view all fines (optionally filter by student)
app.get('/fines', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view fines' });
  }

  const studentId = req.query.student_id; // optional filter

  try {
    let result;
    if (studentId) {
      result = await pool.query(
        `SELECT f.id, f.amount, f.paid, t.book_id, b.title AS book_title, u.name AS student_name, f.created_at
         FROM fines f
         JOIN transactions t ON f.transaction_id = t.id
         JOIN users u ON f.student_id = u.id
         JOIN books b ON t.book_id = b.id
         WHERE f.student_id = $1
         ORDER BY f.created_at DESC`,
        [studentId]
      );
    } else {
      result = await pool.query(
        `SELECT f.id, f.amount, f.paid, t.book_id, b.title AS book_title, u.name AS student_name, f.created_at
         FROM fines f
         JOIN transactions t ON f.transaction_id = t.id
         JOIN users u ON f.student_id = u.id
         JOIN books b ON t.book_id = b.id
         ORDER BY f.created_at DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
});

// Admin: mark fine as paid
app.patch('/fines/:id/pay', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update fines' });
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE fines
       SET paid = true
       WHERE id = $1
       RETURNING id, transaction_id, student_id, amount, paid, created_at`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    res.json({
      message: 'Fine marked as paid ✅',
      fine: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update fine' });
  }
});


// Get fine for a particular transaction
app.get('/fines/transaction/:transactionId', verifyToken, async (req, res) => {
  const { transactionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT f.id, f.amount, f.paid, t.book_id, b.title AS book_title, f.created_at
       FROM fines f
       JOIN transactions t ON f.transaction_id = t.id
       JOIN books b ON t.book_id = b.id
       WHERE f.transaction_id = $1`,
      [transactionId]
    );

    // always return an array
    return res.json(result.rows);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fine' });
  }
});

app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return index.html for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));