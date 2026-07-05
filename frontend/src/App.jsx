import { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  useEffect(() => {
    axios.get('http://localhost:3000/api/jokes')
    .then((response) => {
      setJokes(response.data)

    })
    .catch((error) => {
      console.log(error);
      
    })
  })

  // Wrapping in useCallback stops recreation passes, making it safe to depend on or call safely
  const fetchJokes = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      const fetchOptions = signal ? { signal } : {};
      const response = await fetch("/api/jokes", fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJokes(data);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to fetch jokes.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // Isolation pattern: keeps state updates cleanly nested inside the async microtask queue
    const initializeStream = async () => {
      await fetchJokes(controller.signal);
    };

    initializeStream();
    return () => controller.abort();
  }, [fetchJokes]);

  // Memoizing categories to ensure O(N) array calculations are cached
  const categories = useMemo(() => {
    return ["All", ...new Set(jokes.map((j) => j.category || "General"))];
  }, [jokes]);

  // Filter computation loop ($O(N)$ execution boundaries)
  const filteredJokes = useMemo(() => {
    return activeCategory === "All"
      ? jokes
      : jokes.filter((j) => (j.category || "General") === activeCategory);
  }, [jokes, activeCategory]);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <div className="brand-badge">PROTOTYPE V1</div>
          <h1 className="app-title">
            Chutkule Palace <span className="logo-emoji">🎭</span>
          </h1>
          <p className="app-subtitle">
            A robust, secure backend pipeline streaming premium humor
          </p>

          <div className="metric-row">
            <span className="metric-pill">
              Active Node: <strong>Port 3000</strong>
            </span>
            <span className="metric-pill">
              Data Stream: <strong>{jokes.length} items</strong>
            </span>
          </div>
        </header>

        {/* Filter Navigation Bar */}
        {!loading && !error && jokes.length > 0 && (
          <nav className="filter-nav">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-tab ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>
        )}

        {/* Dynamic App Shell Contents */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Interrogating database for humor assets...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <div className="error-icon">⚠️</div>
            <div>
              <h3>API Connection Dropped</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => fetchJokes()}>
                Re-establish Pipeline
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <main className="jokes-feed">
            {filteredJokes.length === 0 ? (
              <div className="state-container">
                No jokes found in this category.
              </div>
            ) : (
              filteredJokes.map((joke, index) => (
                <article
                  key={joke.id || index}
                  className="joke-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="card-header">
                    <span className="joke-id">
                      #{(joke.id || index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="category-tag">
                      {joke.category || "General"}
                    </span>
                  </div>
                  <h3>{joke.title || "Untitled Fragment"}</h3>
                  <p>{joke.content || joke.joke}</p>
                </article>
              ))
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
