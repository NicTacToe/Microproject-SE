
import React from 'react';
import { Book, User } from '../types';

interface BookDetailsModalProps {
  book: Book | null;
  user: User | null;
  onClose: () => void;
  onRent: (bookId: string) => void;
  isRented: boolean;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, user, onClose, onRent, isRented }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="md:w-1/3 bg-stone-100 h-64 md:h-auto relative">
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden bg-white/80 p-2 rounded-full shadow"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="md:w-2/3 p-6 md:p-10 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">{book.genre}</span>
              <h2 className="text-3xl font-bold text-stone-900 serif mb-2">{book.title}</h2>
              <p className="text-xl text-stone-600 italic">by {book.author} ({book.year})</p>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block text-stone-400 hover:text-stone-600 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-6 mb-8 py-4 border-y border-stone-100">
            <div>
              <p className="text-xs text-stone-400 uppercase font-bold mb-1">Rating</p>
              <p className="text-lg font-bold text-stone-800">★ {book.rating}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase font-bold mb-1">Availability</p>
              <p className={`text-lg font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {book.availableCopies} / {book.totalCopies}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase font-bold mb-1">ISBN</p>
              <p className="text-lg font-bold text-stone-800">{book.isbn}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 mb-3 serif">Description</h3>
            <p className="text-stone-600 leading-relaxed">{book.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 mb-4 serif">Reader Reviews</h3>
            {book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map(review => (
                  <div key={review.id} className="bg-stone-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-stone-800">{review.userName}</span>
                      <span className="text-sm text-stone-400">{review.date}</span>
                    </div>
                    <div className="text-amber-500 text-sm mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    <p className="text-stone-600 text-sm italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-400 italic">No reviews yet for this title.</p>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-4">
            {isRented ? (
              <div className="w-full bg-emerald-50 text-emerald-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 border border-emerald-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Currently Rented
              </div>
            ) : book.availableCopies > 0 ? (
              <button 
                onClick={() => onRent(book.id)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Rent for 7 Days
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-stone-200 text-stone-400 font-bold py-4 px-6 rounded-xl cursor-not-allowed"
              >
                Temporarily Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
