const express = require("express");
const router = express.Router();
const pool = require("../db"); // adjust path if needed

const DAILY_FINE = 10; // ₹10 per day late

// Function to calculate & update fines for a user
async function updateFinesForUser(userId) {
  // Get all overdue transactions
  const overdue = await pool.query(
    `SELECT t.id AS transaction_id, t.due_date
     FROM transactions t
     WHERE t.user_id = $1
       AND t.status = 'borrowed'
       AND t.due_date < NOW()`,
    [userId]
  );

  for (let row of overdue.rows) {
    const daysLate = Math.floor(
      (new Date() - new Date(row.due_date)) / (1000 * 60 * 60 * 24)
    );
    const fineAmount = daysLate * DAILY_FINE;

    // Check if fine already exists
    const existing = await pool.query(
      `SELECT id FROM fines WHERE transaction_id = $1`,
      [row.transaction_id]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO fines (transaction_id, student_id, amount, paid)
         VALUES ($1, $2, $3, false)`,
        [row.transaction_id, userId, fineAmount]
      );
    } else {
      await pool.query(
        `UPDATE fines SET amount = $1 WHERE transaction_id = $2`,
        [fineAmount, row.transaction_id]
      );
    }
  }
}

// GET fines for logged-in student
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // comes from verifyToken middleware

    await updateFinesForUser(userId);

    const fines = await pool.query(
      `SELECT f.id, f.amount, f.paid, t.book_id, b.title AS book_title, t.due_date
       FROM fines f
       JOIN transactions t ON f.transaction_id = t.id
       JOIN books b ON t.book_id = b.id
       WHERE f.student_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(fines.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fines" });
  }
});

module.exports = router;
