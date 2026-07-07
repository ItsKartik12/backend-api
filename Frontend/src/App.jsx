import { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchJokes = useCallback(async (cancelSignal = null) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/jokes", {
        ...(cancelSignal && { signal: cancelSignal }),
      });
      setJokes(response.data);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.message || "Failed to fetch jokes pipeline.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initializeStream = async () => {
      await fetchJokes(controller.signal);
    };
    initializeStream();
    return () => controller.abort();
  }, [fetchJokes]);

  const categories = useMemo(() => {
    return ["All", ...new Set(jokes.map((j) => j.category || "General"))];
  }, [jokes]);

  const filteredJokes = useMemo(() => {
    return activeCategory === "All"
      ? jokes
      : jokes.filter((j) => (j.category || "General") === activeCategory);
  }, [jokes, activeCategory]);

  return (
    <>
      <h1>Its Kartik Page</h1>

      {/* Category Filter UI (Uses categories & setActiveCategory) */}
      <div className="category-filters" style={{ marginBottom: "20px" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              fontWeight: activeCategory === category ? "bold" : "normal",
              marginRight: "8px",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State Handling */}
      {loading && <p>Loading humor assets...</p>}

      {/* Error State Handling */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Render Feed */}
      {!loading && !error && (
        <>
          <p>JOKES DISPLAYED: {filteredJokes.length}</p>
          {/* Fixed: Mapping over filteredJokes with an implicit return () */}
          {filteredJokes.map((joke) => (
            <div
              key={joke.id || joke._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{joke.title || "Untitled Fragment"}</h3>
              <p>{joke.content || joke.joke}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default App;
