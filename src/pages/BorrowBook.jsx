import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/book');
        setBooks(res.data.filter(book => book.quantity > 0));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load books');
      }
    };
    fetchBooks();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:3000/api/borrowing',
        { book_id: parseInt(bookId), due_date: new Date(dueDate).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/borrowing/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Borrow Book</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="bookId" className="form-label">Select Book</label>
            <select
              id="bookId"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Choose a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} ({book.quantity} available)
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Borrow Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowBook;