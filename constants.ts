
import { Book } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    isbn: '978-0141439518',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813',
    description: 'A romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book.',
    genre: 'Classic Literature',
    availableCopies: 3,
    totalCopies: 5,
    rating: 4.8,
    coverUrl: 'https://picsum.photos/seed/austen/400/600',
    reviews: [
      { id: 'r1', userName: 'Alice Smith', rating: 5, comment: 'Absolutely timeless.', date: '2023-10-12' },
      { id: 'r2', userName: 'Bob Jones', rating: 4, comment: 'A bit slow start but great ending.', date: '2023-11-05' }
    ]
  },
  {
    id: '2',
    isbn: '978-0061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: '1960',
    description: 'A novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
    genre: 'Southern Gothic',
    availableCopies: 1,
    totalCopies: 4,
    rating: 4.9,
    coverUrl: 'https://picsum.photos/seed/lee/400/600',
    reviews: [
      { id: 'r3', userName: 'Charlie Brown', rating: 5, comment: 'Essential reading.', date: '2023-09-20' }
    ]
  },
  {
    id: '3',
    isbn: '978-0451524935',
    title: '1984',
    author: 'George Orwell',
    year: '1949',
    description: 'A dystopian social science fiction novel and cautionary tale, written by George Orwell as a warning against totalitarianism.',
    genre: 'Dystopian',
    availableCopies: 0,
    totalCopies: 3,
    rating: 4.7,
    coverUrl: 'https://picsum.photos/seed/orwell/400/600',
    reviews: [
      { id: 'r4', userName: 'Dana White', rating: 4, comment: 'A terrifyingly accurate depiction of surveillance.', date: '2024-01-15' }
    ]
  },
  {
    id: '4',
    isbn: '978-0743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    description: 'A 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby.',
    genre: 'Classic',
    availableCopies: 5,
    totalCopies: 5,
    rating: 4.5,
    coverUrl: 'https://picsum.photos/seed/gatsby/400/600',
    reviews: [
      { id: 'r5', userName: 'Eve Adams', rating: 5, comment: 'Beautifully written prose.', date: '2023-12-01' }
    ]
  },
  {
    id: '5',
    isbn: '978-0345339683',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: '1937',
    description: 'The Hobbit follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.',
    genre: 'Fantasy',
    availableCopies: 2,
    totalCopies: 6,
    rating: 4.9,
    coverUrl: 'https://picsum.photos/seed/tolkien/400/600',
    reviews: []
  },
  {
    id: '6',
    isbn: '978-0316769488',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: '1951',
    description: 'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school.',
    genre: 'Young Adult',
    availableCopies: 4,
    totalCopies: 4,
    rating: 4.2,
    coverUrl: 'https://picsum.photos/seed/salinger/400/600',
    reviews: []
  }
];

export const LATE_FEE_PER_DAY = 0.50;
