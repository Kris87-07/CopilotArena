import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('javascript');
  const [inputValue, setInputValue] = useState('javascript');

  useEffect(() => {
    fetchBooks(searchQuery);
  }, [searchQuery]);

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`
      );
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Biblioteka Książek</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Szukaj książek..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Szukaj
          </button>
        </form>
      </header>

      <main className="books-container">
        {loading ? (
          <div className="loading">Ładowanie książek...</div>
        ) : (
          <div className="books-grid">
            {books.map((book, index) => (
              <div key={`${book.key}-${index}`} className="book-card">
                <div className="book-cover">
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                    />
                  ) : (
                    <div className="no-cover">Brak okładki</div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    {book.author_name ? book.author_name.join(', ') : 'Nieznany autor'}
                  </p>
                  <p className="book-year">
                    {book.first_publish_year || 'Rok nieznany'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
