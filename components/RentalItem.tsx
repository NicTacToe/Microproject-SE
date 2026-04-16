
import React from 'react';
// Fixed import: LATE_FEE_PER_DAY is in constants.ts, not types.ts
import { Rental, Book } from '../types';
import { LATE_FEE_PER_DAY } from '../constants';

interface RentalItemProps {
  rental: Rental;
  book: Book;
  onReturn: (rentalId: string) => void;
  onExtend: (rentalId: string) => void;
}

const RentalItem: React.FC<RentalItemProps> = ({ rental, book, onReturn, onExtend }) => {
  const today = new Date();
  const dueDate = new Date(rental.dueDate);
  const isOverdue = today > dueDate;
  
  const daysDiff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
  const lateFee = isOverdue ? (daysDiff * LATE_FEE_PER_DAY).toFixed(2) : '0.00';

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
      <div className="w-24 h-36 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900 serif">{book.title}</h3>
            <p className="text-stone-500">by {book.author}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400 uppercase font-bold">Due Date</p>
            <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-emerald-700'}`}>
              {dueDate.toLocaleDateString()}
            </p>
            {isOverdue && (
              <p className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded mt-1">
                Late Fee: ${lateFee}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to return "${book.title}"?`)) {
                onReturn(rental.id);
                window.alert("Book successfully returned!");
              }
            }}
            className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors"
          >
            Return Book
          </button>
          
          {!rental.extended && !isOverdue && (
            <button 
              onClick={() => onExtend(rental.id)}
              className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors"
            >
              Extend 7 Days
            </button>
          )}
          
          {rental.extended && (
            <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-2 rounded-lg uppercase tracking-wider">
              Already Extended
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalItem;
