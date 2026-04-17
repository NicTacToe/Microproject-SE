import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api.ts';

const API_URL = 'http://localhost:3001/api';

const createLocalStorageMock = (initial = {}) => {
  let store = { ...initial };
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

const createMockResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(body),
  text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
});

describe('api.ts test suite', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('localStorage', createLocalStorageMock());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Auth API', () => {
    it('login should call /login with POST and return parsed JSON', async () => {
      const credentials = { email: 'student1@example.com', password: 'pass1234' };
      const mockPayload = {
        user: { id: 'u-1', name: 'Test Student', role: 'Student', email: credentials.email },
        token: 'jwt-token-123',
      };

      fetch.mockResolvedValueOnce(createMockResponse(mockPayload));

      const result = await api.login(credentials);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      expect(result).toEqual(mockPayload);
    });

    it('login should throw backend text when response is not ok', async () => {
      fetch.mockResolvedValueOnce(createMockResponse('Invalid credentials', { ok: false, status: 401 }));

      await expect(api.login({ email: 'wrong@example.com', password: 'wrong' })).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('signup should call /signup with POST and return parsed JSON', async () => {
      const signupPayload = {
        email: 'newstudent@example.com',
        password: 'pass1234',
        name: 'New Student',
        role: 'Student',
        dob: '2005-08-14',
      };

      fetch.mockResolvedValueOnce(
        createMockResponse({
          user: { id: 'u-2', email: signupPayload.email, name: signupPayload.name, role: signupPayload.role },
          token: 'jwt-token-456',
        })
      );

      await api.signup(signupPayload);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      });
    });
  });

  describe('Books API', () => {
    it('getBooks should send Authorization header when token exists', async () => {
      localStorage.getItem.mockImplementation((key) => (key === 'verdant_token' ? 'abc123' : null));
      fetch.mockResolvedValueOnce(createMockResponse([]));

      await api.getBooks();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/books`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer abc123',
        },
      });
    });

    it('addBook should POST payload with auth headers', async () => {
      localStorage.getItem.mockImplementation((key) => (key === 'verdant_token' ? 'admin-token' : null));
      const book = {
        isbn: '9780000001234',
        title: 'API Test Book',
        author: 'Test Author',
        year: '2025',
        genre: 'Testing',
        description: 'Book added from Vitest',
        totalCopies: 3,
        rating: 4.5,
        coverUrl: 'https://picsum.photos/seed/postman/400/600',
      };
      fetch.mockResolvedValueOnce(createMockResponse({ id: 'b-1', ...book }));

      await api.addBook(book);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin-token',
        },
        body: JSON.stringify(book),
      });
    });
  });

  describe('Rentals API', () => {
    it('rentBook should POST /rentals with bookId in body', async () => {
      localStorage.getItem.mockImplementation((key) => (key === 'verdant_token' ? 'user-token' : null));
      fetch.mockResolvedValueOnce(createMockResponse({ id: 'r-1', bookId: 'b-1' }));

      await api.rentBook('b-1');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/rentals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user-token',
        },
        body: JSON.stringify({ bookId: 'b-1' }),
      });
    });

    it('returnBook should POST to /rentals/:id/return', async () => {
      localStorage.getItem.mockImplementation((key) => (key === 'verdant_token' ? 'user-token' : null));
      fetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      await api.returnBook('r-100');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/rentals/r-100/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user-token',
        },
      });
    });

    it('extendRental should POST to /rentals/:id/extend', async () => {
      localStorage.getItem.mockImplementation((key) => (key === 'verdant_token' ? 'user-token' : null));
      fetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      await api.extendRental('r-101');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/rentals/r-101/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user-token',
        },
      });
    });
  });
});
