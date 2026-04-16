
import React, { useState } from 'react';
import { Book, Rental } from '../types';

interface EditBookModalProps {
  book: Book;
  rentals: Rental[];
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, rentals, onClose, onSave }) => {
  const rentedCount = book.totalCopies - book.availableCopies;
  
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    year: book.year,
    genre: book.genre,
    description: book.description,
    totalCopies: book.totalCopies.toString()
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newTotal = parseInt(formData.totalCopies);
    
    // Validation
    if (!formData.title || !formData.author || !formData.year || !formData.genre || !formData.description) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(newTotal) || newTotal < rentedCount) {
      setError(`Total copies cannot be less than the number of active rentals (${rentedCount}).`);
      return;
    }

    const updatedBook: Book = {
      ...book,
      title: formData.title,
      author: formData.author,
      year: formData.year,
      genre: formData.genre,
      description: formData.description,
      totalCopies: newTotal,
      // Recalculate available copies based on new total and existing rentals
      availableCopies: newTotal - rentedCount
    };

    onSave(updatedBook);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-bold text-stone-900 serif">Edit Book Information</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Author</label>
              <input 
                type="text" 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Year</label>
              <input 
                type="text" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Genre</label>
              <input 
                type="text" 
                value={formData.genre} 
                onChange={e => setFormData({...formData, genre: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">ISBN (Read Only)</label>
              <input 
                type="text" 
                value={book.isbn} 
                disabled
                className="w-full px-4 py-2 rounded-lg border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Total Copies</label>
              <input 
                type="number" 
                min={rentedCount}
                value={formData.totalCopies} 
                onChange={e => setFormData({...formData, totalCopies: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <p className="text-[10px] text-stone-400 mt-1">Minimum required: {rentedCount} (currently rented)</p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Description</label>
              <textarea 
                rows={3}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
