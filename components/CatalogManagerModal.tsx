
import React, { useState } from 'react';
import { Book, Rental } from '../types';

interface CatalogManagerModalProps {
  books: Book[];
  rentals: Rental[];
  onClose: () => void;
  onAddBook: (book: Book) => void;
  onRemoveBook: (bookId: string) => void;
}

const CatalogManagerModal: React.FC<CatalogManagerModalProps> = ({ 
  books, 
  rentals, 
  onClose, 
  onAddBook, 
  onRemoveBook 
}) => {
  const [tab, setTab] = useState<'add' | 'remove'>('add');
  const [error, setError] = useState<string | null>(null);

  // Form state - Added year field
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    genre: '',
    description: '',
    totalCopies: '1',
    rating: '5.0'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation - Added year check
    if (!formData.title || !formData.author || !formData.year || !formData.isbn || !formData.genre || !formData.description) {
      setError('All fields except rating are required.');
      return;
    }

    if (books.some(b => b.isbn === formData.isbn)) {
      setError('A book with this ISBN already exists in the catalog.');
      return;
    }

    // Fixed: Added year property to the newBook object
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      year: formData.year,
      isbn: formData.isbn,
      genre: formData.genre,
      description: formData.description,
      availableCopies: parseInt(formData.totalCopies),
      totalCopies: parseInt(formData.totalCopies),
      rating: parseFloat(formData.rating) || 5.0,
      coverUrl: `https://picsum.photos/seed/${formData.isbn}/400/600`,
      reviews: []
    };

    onAddBook(newBook);
    // Reset form
    setFormData({
      title: '',
      author: '',
      year: '',
      isbn: '',
      genre: '',
      description: '',
      totalCopies: '1',
      rating: '5.0'
    });
    setTab('remove');
  };

  const handleRemove = (book: Book) => {
    const isRented = rentals.some(r => r.bookId === book.id);
    if (isRented) {
      alert(`Cannot remove "${book.title}" because it has active rentals.`);
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove "${book.title}" from the catalog?`)) {
      onRemoveBook(book.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-bold text-stone-900 serif">Catalog Management</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex bg-stone-100 p-1 mx-6 mt-6 rounded-xl">
          <button 
            onClick={() => setTab('add')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'add' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Add New Title
          </button>
          <button 
            onClick={() => setTab('remove')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'remove' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Remove Titles
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          {tab === 'add' ? (
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Book Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. The Midnight Library"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Author</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Year</label>
                <input 
                  type="text" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. 2020"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">ISBN</label>
                <input 
                  type="text" 
                  value={formData.isbn} 
                  onChange={e => setFormData({...formData, isbn: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Genre</label>
                <input 
                  type="text" 
                  value={formData.genre} 
                  onChange={e => setFormData({...formData, genre: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Total Copies</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.totalCopies} 
                    onChange={e => setFormData({...formData, totalCopies: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Rating</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="5"
                    value={formData.rating} 
                    onChange={e => setFormData({...formData, rating: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>
              <button className="md:col-span-2 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-50 mt-2">
                Add to Collection
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              {books.map(book => {
                const isRented = rentals.some(r => r.bookId === book.id);
                return (
                  <div key={book.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-stone-50 group hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                        <img src={book.coverUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{book.title}</p>
                        <p className="text-xs text-stone-500">{book.author} • {book.isbn}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(book)}
                      className={`p-2 rounded-lg transition-colors ${isRented ? 'text-stone-300 cursor-not-allowed' : 'text-stone-400 hover:text-red-600 hover:bg-red-50'}`}
                      title={isRented ? "Cannot remove rented book" : "Remove book"}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogManagerModal;
