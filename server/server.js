
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDb } from './database.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'verdant-secret-key-2024';

app.use(cors());
app.use(express.json());

initDb();

// Provide a simple root page so visiting the backend base URL is useful
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head><title>Verdant Library API</title></head>
      <body style="font-family:system-ui,Segoe UI,Arial;margin:2rem">
        <h1>Verdant Library — API Server</h1>
        <p>The API is running. Use the following endpoints:</p>
        <ul>
          <li><a href="/api/books">/api/books</a></li>
          <li><a href="/api/rentals">/api/rentals</a></li>
          <li><a href="/api/login">/api/login</a> (POST)</li>
        </ul>
        <p>Frontend dev server (Vite) default URL: <a href="http://localhost:5173">http://localhost:5173</a></p>
      </body>
    </html>
  `);
});

// --- Middleware ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// --- Auth Routes ---
app.post('/api/signup', (req, res) => {
  const { email, password, name, role, dob } = req.body;
  const id = `u-${Date.now()}`;
  const hash = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (id, email, password_hash, name, role, dob) VALUES (?, ?, ?, ?, ?, ?)',
    [id, email, hash, name, role, dob], (err) => {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      const token = jwt.sign({ id, email, role, name }, JWT_SECRET);
      res.json({ user: { id, email, role, name }, token });
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name }, token });
  });
});

// --- Book Routes ---
app.get('/api/books', (req, res) => {
  db.all(`
    SELECT b.*, 
    (b.total_copies - (SELECT COUNT(*) FROM rentals r WHERE r.book_id = b.id AND r.returned_at IS NULL)) as availableCopies 
    FROM books b
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = rows.map(r => ({
      ...r,
      totalCopies: r.total_copies,
      coverUrl: r.cover_url,
      reviews: [] // Reviews could be another table, keeping it simple for now
    }));
    res.json(formatted);
  });
});

app.post('/api/books', authenticate, authorize('Admin'), (req, res) => {
  const { isbn, title, author, year, genre, description, totalCopies, rating, coverUrl } = req.body;
  const id = `b-${Date.now()}`;
  db.run(`INSERT INTO books (id, isbn, title, author, year, genre, description, total_copies, rating, cover_url) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, isbn, title, author, year, genre, description, totalCopies, rating, coverUrl], (err) => {
      if (err) return res.status(400).json({ error: 'ISBN must be unique' });
      res.json({ id, ...req.body });
    });
});

app.put('/api/books/:id', authenticate, authorize('Admin'), (req, res) => {
  const { title, author, year, genre, description, totalCopies } = req.body;
  db.run(`UPDATE books SET title=?, author=?, year=?, genre=?, description=?, total_copies=? WHERE id=?`,
    [title, author, year, genre, description, totalCopies, req.params.id], (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    });
});

app.delete('/api/books/:id', authenticate, authorize('Admin'), (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- Rental Routes ---
app.get('/api/rentals', authenticate, (req, res) => {
  const query = req.user.role === 'Admin' 
    ? 'SELECT * FROM rentals' 
    : 'SELECT * FROM rentals WHERE user_id = ?';
  const params = req.user.role === 'Admin' ? [] : [req.user.id];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({
      ...r,
      userId: r.user_id,
      bookId: r.book_id,
      rentedAt: r.rented_at,
      dueDate: r.due_date,
      returnedAt: r.returned_at,
      extended: !!r.extended
    })));
  });
});

app.post('/api/rentals', authenticate, (req, res) => {
  const { bookId } = req.body;
  const id = `r-${Date.now()}`;
  const rentedAt = new Date().toISOString();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  
  db.run('INSERT INTO rentals (id, user_id, book_id, rented_at, due_date) VALUES (?, ?, ?, ?, ?)',
    [id, req.user.id, bookId, rentedAt, dueDate.toISOString()], (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id, bookId, rentedAt, dueDate: dueDate.toISOString() });
    });
});

app.post('/api/rentals/:id/return', authenticate, (req, res) => {
  const returnedAt = new Date().toISOString();
  db.run('UPDATE rentals SET returned_at = ? WHERE id = ? AND user_id = ?',
    [returnedAt, req.params.id, req.user.id], (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    });
});

app.post('/api/rentals/:id/extend', authenticate, (req, res) => {
  db.get('SELECT due_date, extended FROM rentals WHERE id = ?', [req.params.id], (err, row) => {
    if (!row || row.extended) return res.status(400).json({ error: 'Cannot extend' });
    const newDueDate = new Date(row.due_date);
    newDueDate.setDate(newDueDate.getDate() + 7);
    db.run('UPDATE rentals SET due_date = ?, extended = 1 WHERE id = ?',
      [newDueDate.toISOString(), req.params.id], (err) => {
        res.json({ success: true, newDueDate: newDueDate.toISOString() });
      });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
