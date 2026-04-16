
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'library.db');

const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      role TEXT,
      dob TEXT
    )`);

    // Books Table
    db.run(`CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      isbn TEXT UNIQUE,
      title TEXT,
      author TEXT,
      year TEXT,
      genre TEXT,
      description TEXT,
      total_copies INTEGER,
      rating REAL,
      cover_url TEXT
    )`);

    // Rentals Table
    db.run(`CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      book_id TEXT,
      rented_at TEXT,
      due_date TEXT,
      returned_at TEXT,
      extended INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(book_id) REFERENCES books(id)
    )`);

    // Initial Admin Account
    const adminId = 'admin-1';
    const adminEmail = 'admin@verdant.edu';
    db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (!row) {
        const hash = bcrypt.hashSync('password123', 10);
        db.run('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
          [adminId, adminEmail, hash, 'Librarian', 'Admin']);
      }
    });
  });
};

export default db;
