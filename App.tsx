
import React, { useState, useEffect, useMemo } from 'react';
import { Book, User, Rental, ViewState, UserRole } from './types';
import Navigation from './components/Navigation';
import BookCard from './components/BookCard';
import BookDetailsModal from './components/BookDetailsModal';
import RentalItem from './components/RentalItem';
import CatalogManagerModal from './components/CatalogManagerModal';
import EditBookModal from './components/EditBookModal';
import { api } from './api';

const App: React.FC = () => {
  // ======================
  // Core State
  // ======================
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [isLoading, setIsLoading] = useState(true);
  
  // ======================
  // Auth State
  // ======================
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState<UserRole>('Student');

  // ======================
  // UI State
  // ======================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // ======================
  // Effects
  // ======================
  useEffect(() => {
    const token = localStorage.getItem('verdant_token');
    const storedUser = localStorage.getItem('verdant_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('dashboard');
    }
    fetchCatalog();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchRentals();
    }
  }, [user]);

  const fetchCatalog = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (e) { console.error('Failed to fetch books', e); }
  };

  const fetchRentals = async () => {
    try {
      const data = await api.getRentals();
      setRentals(data);
    } catch (e) { console.error('Failed to fetch rentals', e); }
  };

  // ======================
  // Derived Data
  // ======================
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  }, [books, searchQuery]);

  const userRentals = useMemo(() => {
    if (!user) return [];
    // Only show active rentals for non-admins, or all for admins
    return rentals.filter(r => r.returnedAt === null);
  }, [rentals, user]);

  // ======================
  // Handlers
  // ======================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      localStorage.setItem('verdant_token', res.token);
      localStorage.setItem('verdant_user', JSON.stringify(res.user));
      setCurrentView('dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.signup({ email, password, name: fullName, role, dob });
      setUser(res.user);
      localStorage.setItem('verdant_token', res.token);
      localStorage.setItem('verdant_user', JSON.stringify(res.user));
      setCurrentView('dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Signup failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('verdant_token');
    localStorage.removeItem('verdant_user');
    setAuthMode('login');
    setCurrentView('login');
  };

  const handleAddBook = async (newBook: Book) => {
    await api.addBook(newBook);
    fetchCatalog();
  };

  const handleRemoveBook = async (bookId: string) => {
    await api.removeBook(bookId);
    fetchCatalog();
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    await api.updateBook(updatedBook.id, updatedBook);
    fetchCatalog();
    setEditingBook(null);
  };

  const handleRent = async (bookId: string) => {
    await api.rentBook(bookId);
    fetchCatalog();
    fetchRentals();
    setSelectedBook(null);
  };

  const handleReturn = async (rentalId: string) => {
    await api.returnBook(rentalId);
    fetchCatalog();
    fetchRentals();
  };

  const handleExtend = async (rentalId: string) => {
    await api.extendRental(rentalId);
    fetchRentals();
  };

  // Auth UI
  const renderLogin = () => (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-stone-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 serif">Verdant Library</h1>
          <p className="text-stone-500 mt-2">{authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <div className="flex mb-6 bg-stone-100 rounded-xl p-1">
          <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authMode === 'login' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}>Login</button>
          <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authMode === 'signup' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}>Sign Up</button>
        </div>

        {loginError && <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">{loginError}</div>}

        <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <input type="text" required placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none" />
          )}
          <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none" />
          {authMode === 'signup' && (
            <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none" />
          )}
          <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none" />
          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setRole('Student')} className={`py-3 rounded-xl font-semibold transition-all ${role === 'Student' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>Student</button>
              <button type="button" onClick={() => setRole('Admin')} className={`py-3 rounded-xl font-semibold transition-all ${role === 'Admin' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>Admin</button>
            </div>
          )}
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-colors shadow-lg">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );

  if (isLoading) return <div className="min-h-screen bg-stone-100 flex items-center justify-center font-bold text-stone-400">Loading Library Systems...</div>;
  if (currentView === 'login') return renderLogin();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <Navigation currentView={currentView} setView={setCurrentView} user={user} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto pb-20">
          {currentView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              <header className="bg-emerald-600 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-emerald-100">
                <div>
                  <h2 className="text-3xl font-bold serif mb-2">Welcome, {user?.name.split(' ')[0]}</h2>
                  <p className="text-emerald-50/80">{user?.role === 'Admin' ? 'Catalog Management active.' : `You have ${userRentals.length} active rentals.`}</p>
                </div>
                <button onClick={() => setCurrentView('search')} className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold">Browse Catalog</button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <section className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm lg:col-span-2">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 serif">Featured</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {books.slice(0, 3).map(book => <BookCard key={book.id} book={book} user={user} onClick={setSelectedBook} onEdit={setEditingBook} />)}
                  </div>
                </section>
                <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 serif">Status</h3>
                  <p className="text-stone-500 text-sm">System operational. {books.length} titles available.</p>
                </section>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-stone-900 serif">Catalog</h2>
                  {user?.role === 'Admin' && <button onClick={() => setIsCatalogModalOpen(true)} className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Manage</button>}
                </div>
                <div className="relative w-full max-w-md">
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredBooks.map(book => <BookCard key={book.id} book={book} user={user} onClick={setSelectedBook} onEdit={setEditingBook} />)}
              </div>
            </div>
          )}

          {currentView === 'my-books' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900 serif">Active Rentals</h2>
              {userRentals.length > 0 ? (
                <div className="grid gap-4">
                  {userRentals.map(r => {
                    const book = books.find(b => b.id === r.bookId);
                    if (!book) return null;
                    return <RentalItem key={r.id} rental={r} book={book} onReturn={handleReturn} onExtend={handleExtend} />;
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-stone-400 font-medium">Your shelf is currently empty.</div>
              )}
            </div>
          )}
        </div>
      </main>

      <BookDetailsModal book={selectedBook} user={user} onClose={() => setSelectedBook(null)} onRent={handleRent} isRented={!!userRentals.find(r => r.bookId === selectedBook?.id)} />
      {isCatalogModalOpen && <CatalogManagerModal books={books} rentals={rentals} onClose={() => setIsCatalogModalOpen(false)} onAddBook={handleAddBook} onRemoveBook={handleRemoveBook} />}
      {editingBook && <EditBookModal book={editingBook} rentals={rentals} onClose={() => setEditingBook(null)} onSave={handleUpdateBook} />}
    </div>
  );
};

export default App;
