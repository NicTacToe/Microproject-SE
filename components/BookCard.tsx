
import React from 'react';
import { Book, User } from '../types';

interface BookCardProps {
  book: Book;
  user: User | null;
  onClick: (book: Book) => void;
  onEdit?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, user, onClick, onEdit }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:border-emerald-200 group relative"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-stone-100">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Waitlist'}
          </span>
          {user?.role === 'Admin' && onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book);
              }}
              className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xl"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              EDIT
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-stone-900 font-bold text-lg mb-1 truncate serif">{book.title}</h3>
        <p className="text-stone-500 text-sm mb-2">{book.author} ({book.year})</p>
        <div className="flex items-center gap-1">
          <span className="text-amber-500 text-sm">★</span>
          <span className="text-stone-700 text-sm font-medium">{book.rating}</span>
          <span className="text-stone-400 text-xs ml-auto uppercase tracking-wider font-semibold">{book.genre}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
