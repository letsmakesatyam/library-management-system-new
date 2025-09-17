// backend/app.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const pool = require('./db');


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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

// Admin route to add a book
// Admin route to add a book
// Admin route to add a book
app.post('/books', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add books' });
  }

  const { title, author, isbn, copies } = req.body;
  if (!title || !author || !copies) {
    return res.status(400).json({ error: 'Title, author, and copies are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $4)
       RETURNING *`,
      [title, author, isbn, copies]
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
    const result = await pool.query(
      `INSERT INTO transactions (user_id, book_id, status)
       VALUES ($1, $2, 'borrowed') RETURNING *`,
      [req.user.id, bookId]
    );

    res.json({ message: 'Book borrowed successfully ✅', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Get transactions
app.get('/transactions', verifyToken, async (req, res) => {
  const studentId = req.query.user_id; // optional for admin to filter specific student

  try {
    let result;

    if (req.user.role === 'admin') {
      // Admin: filter by student if user_id provided, else get all
      if (studentId) {
        result = await pool.query(
          `SELECT t.id, u.name AS student_name, b.title AS book_title, t.borrowed_at, t.returned_at, t.status
           FROM transactions t
           JOIN users u ON t.user_id = u.id
           JOIN books b ON t.book_id = b.id
           WHERE u.id = $1
           ORDER BY t.borrowed_at DESC`,
          [studentId]
        );
      } else {
        result = await pool.query(
          `SELECT t.id, u.name AS student_name, b.title AS book_title, t.borrowed_at, t.returned_at, t.status
           FROM transactions t
           JOIN users u ON t.user_id = u.id
           JOIN books b ON t.book_id = b.id
           ORDER BY t.borrowed_at DESC`
        );
      }
    } else {
      // Student: only their own transactions
      result = await pool.query(
        `SELECT t.id, b.title AS book_title, t.borrowed_at, t.returned_at, t.status
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
// Admin returns a book
app.patch('/transactions/:id/return', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can return books' });
  }

  const transactionId = req.params.id;

  try {
    // Get the transaction
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = result.rows[0];

    // Check if already returned
    if (transaction.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // Update transaction to returned
    await pool.query(
      `UPDATE transactions
       SET returned_at = NOW(), status = 'returned'
       WHERE id = $1`,
      [transactionId]
    );

    // Increment available copies in books table
    await pool.query(
      `UPDATE books
       SET available_copies = available_copies + 1
       WHERE id = $1`,
      [transaction.book_id]
    );

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
