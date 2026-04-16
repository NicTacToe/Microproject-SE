
export type UserRole = 'Student' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  year: string;
  description: string;
  genre: string;
  availableCopies: number;
  totalCopies: number;
  rating: number;
  coverUrl: string;
  reviews: Review[];
}

export interface Rental {
  id: string;
  userId: string;
  bookId: string;
  rentedAt: string;
  dueDate: string;
  returnedAt: string | null;
  extended: boolean;
}

export type ViewState = 'dashboard' | 'search' | 'my-books' | 'login';

export interface AuthResponse {
  user: User;
  token: string;
}
