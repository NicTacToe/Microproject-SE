
const API_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('verdant_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async signup(data: any) {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Books
  async getBooks() {
    const res = await fetch(`${API_URL}/books`, { headers: getHeaders() });
    return res.json();
  },

  async addBook(book: any) {
    const res = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(book)
    });
    return res.json();
  },

  async updateBook(id: string, book: any) {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(book)
    });
    return res.json();
  },

  async removeBook(id: string) {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Rentals
  async getRentals() {
    const res = await fetch(`${API_URL}/rentals`, { headers: getHeaders() });
    return res.json();
  },

  async rentBook(bookId: string) {
    const res = await fetch(`${API_URL}/rentals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ bookId })
    });
    return res.json();
  },

  async returnBook(id: string) {
    const res = await fetch(`${API_URL}/rentals/${id}/return`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  async extendRental(id: string) {
    const res = await fetch(`${API_URL}/rentals/${id}/extend`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  }
};
