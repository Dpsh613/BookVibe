// ===================================================================================
//
//                              OLD / ORIGINAL App.jsx
//
// ===================================================================================

/*
import { useState, useEffect, useMemo } from "react";
import "./App.css"; // Keep if you have App-specific styles
// Make sure index.css (with Tailwind directives) is imported in main.jsx

// Import Components
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import WantToReadList from "./components/WantToReadList";
// NO api.js import needed

function App() {
  // --- State Variables ---
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [authError, setAuthError] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // List State
  const [wantList, setWantList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState("");

  // Search State
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Derived state for checking if a book is in the list quickly
  const wantListIds = useMemo(
    () => new Set(wantList.map((book) => book.id)),
    [wantList]
  );

  // --- Define API Call Functions HERE ---

  // Helper for fetch calls (optional but good practice)
  const fetchAPI = async (url, options = {}) => {
    try {
      const response = await fetch(url, options); // Uses Vite proxy for /api
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error(`API Error (${options.method || "GET"} ${url}):`, error);
      throw error; // Re-throw to be caught by handlers
    }
  };

  const checkLoginStatusAPI = async () => {
    return fetchAPI("/api/auth/status");
  };

  const logoutUserAPI = async () => {
    return fetchAPI("/api/auth/logout", { method: "POST" });
  };

  const fetchWantListAPI = async () => {
    return fetchAPI("/api/my-list");
  };

  const searchBooksAPI = async (searchTerm) => {
    return fetchAPI(`/api/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const addBookToListAPI = async (bookData) => {
    return fetchAPI("/api/my-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  };

  const removeBookFromListAPI = async (bookId) => {
    return fetchAPI(`/api/my-list/${bookId}`, { method: "DELETE" });
  };

  // --- Fetch Want List Function (uses the above API function) ---
  const fetchWantList = async () => {
    // No need to check currentUser here again, called only when logged in
    setIsListLoading(true);
    setListError("");
    try {
      const listData = await fetchWantListAPI(); // Call function defined above
      setWantList(listData);
    } catch (error) {
      console.error("Failed to fetch want list:", error);
      setListError(error.message || "Could not load your list.");
      setWantList([]); // Clear list on error
    } finally {
      setIsListLoading(false);
    }
  };

  // --- Initial Status Check (uses API function defined above) ---
  useEffect(() => {
    setIsLoadingStatus(true);
    setShowAuthPrompt(false);
    checkLoginStatusAPI() // Call function defined above
      .then((data) => {
        if (data.isLoggedIn) {
          setCurrentUser(data.user);
          fetchWantList(); // Fetch list *after* confirming login
        } else {
          setCurrentUser(null);
          setWantList([]); // Ensure list is empty if logged out
        }
      })
      .catch((err) => {
        console.error("Auth status check failed:", err);
        setAuthError("Could not verify login status.");
        setCurrentUser(null);
        setWantList([]);
      })
      .finally(() => {
        setIsLoadingStatus(false);
      });
  }, []); // Run once on mount

  // --- Auth Handlers (passed to forms) ---
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setShowAuthPrompt(false);
    setAuthError("");
    fetchWantList(); // Fetch list after login
  };

  const handleSignupSuccess = (userData) => {
    setCurrentUser(userData);
    setShowAuthPrompt(false);
    setAuthError("");
    fetchWantList(); // Fetch list after signup
  };

  const handleLogout = async () => {
    setAuthError("");
    try {
      await logoutUserAPI(); // Call function defined above
      setCurrentUser(null);
      setShowAuthPrompt(false);
      setWantList([]); // Clear list state
      setSearchResults([]); // Clear search results
      setSearchError("");
      setListError("");
    } catch (err) {
      console.error("Logout error:", err);
      setAuthError(err.message || "Logout failed.");
    }
  };

  // --- Prompt Login Handler (passed to components) ---
  const promptLogin = () => {
    setShowAuthPrompt(true);
    document
      .getElementById("authArea")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Search Handler (passed to SearchBar) ---
  const handleSearch = async (searchTerm) => {
    setIsSearchLoading(true);
    setSearchError("");
    setSearchResults([]); // Clear previous results
    try {
      const results = await searchBooksAPI(searchTerm); // Call function defined above
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError(error.message || "Search failed.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  // --- List Action Handlers (passed to SearchResults/WantToReadList via BookItem) ---
  const handleAddToWantList = async (bookToAdd) => {
    if (!currentUser || wantListIds.has(bookToAdd.id)) return;
    try {
      await addBookToListAPI({
        // Call function defined above
        id: bookToAdd.id,
        title: bookToAdd.title,
        authors: bookToAdd.authors,
      });
      fetchWantList(); // Refresh list after adding
    } catch (error) {
      console.error("Failed to add book:", error);
      alert(`Error adding book: ${error.message}`); // Simple feedback for now
    }
  };

  const handleRemoveFromWantList = async (bookIdToRemove) => {
    if (!currentUser) return;
    try {
      await removeBookFromListAPI(bookIdToRemove); // Call function defined above
      fetchWantList(); // Refresh list after removing
    } catch (error) {
      console.error("Failed to remove book:", error);
      alert(`Error removing book: ${error.message}`); // Simple feedback for now
    }
  };

  // --- Render logic ---
  if (isLoadingStatus) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading Authentication...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Classic Book Finder
      </h1>
      // ... Old JSX for rendering ...
    </div>
  );
}

export default App;
*/

// ===================================================================================
//
//                         NEW / REFACTORED App.jsx
//
// ===================================================================================

import { useState, useEffect, useMemo } from "react";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Card from "./components/layout/Card";

// Feature Components
import AuthSection from "./components/auth/AuthSection";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/book/SearchResults";
import WantToReadList from "./components/book/WantToReadList";
import Spinner from "./components/ui/Spinner";

function App() {
  // --- State Variables ---
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [authError, setAuthError] = useState("");
  const [wantList, setWantList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [searchResults, setSearchResults] = useState(null); // Use null for initial state
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const wantListIds = useMemo(
    () => new Set(wantList.map((book) => book.id)),
    [wantList]
  );

  // --- API Call Functions (Unchanged from original) ---
  const fetchAPI = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      // The console.error is now handled by the calling function for better context
      throw error;
    }
  };

  const checkLoginStatusAPI = () => fetchAPI("/api/auth/status");
  const logoutUserAPI = () => fetchAPI("/api/auth/logout", { method: "POST" });
  const fetchWantListAPI = () => fetchAPI("/api/my-list");
  const searchBooksAPI = (searchTerm) =>
    fetchAPI(`/api/search?q=${encodeURIComponent(searchTerm)}`);
  const addBookToListAPI = (bookData) =>
    fetchAPI("/api/my-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  const removeBookFromListAPI = (bookId) =>
    fetchAPI(`/api/my-list/${bookId}`, { method: "DELETE" });

  // --- Data Fetching & Initial Status Check ---
  const fetchWantList = async () => {
    setIsListLoading(true);
    setListError("");
    try {
      const listData = await fetchWantListAPI();
      setWantList(listData);
    } catch (error) {
      console.error("Failed to fetch want list:", error);
      setListError(error.message || "Could not load your list.");
      setWantList([]);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    setIsLoadingStatus(true);
    checkLoginStatusAPI()
      .then((data) => {
        if (data.isLoggedIn) {
          setCurrentUser(data.user);
          fetchWantList();
        } else {
          setCurrentUser(null);
          setWantList([]);
        }
      })
      .catch((err) => {
        console.error("Auth status check failed:", err);
        setAuthError("Could not verify login status. Is the server running?");
        setCurrentUser(null);
        setWantList([]);
      })
      .finally(() => {
        setIsLoadingStatus(false);
      });
  }, []);

  // --- Handler Functions ---
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setAuthError("");
    fetchWantList();
  };

  const handleSignupSuccess = (userData) => {
    setCurrentUser(userData);
    setAuthError("");
    setWantList([]);
  };

  const handleLogout = async () => {
    setAuthError("");
    try {
      await logoutUserAPI();
      setCurrentUser(null);
      setWantList([]);
      setSearchResults(null);
      setSearchError("");
      setListError("");
    } catch (err) {
      console.error("Logout error:", err);
      setAuthError(err.message || "Logout failed.");
    }
  };

  const handleSearch = async (searchTerm) => {
    setIsSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const results = await searchBooksAPI(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError(error.message || "Search failed.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const promptLogin = () => {
    const authElement = document.getElementById("authArea");
    if (authElement) {
      authElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a visual cue to draw the user's attention
      authElement.classList.add(
        "transition-all",
        "duration-300",
        "ring-2",
        "ring-indigo-500",
        "ring-offset-4",
        "ring-offset-slate-100"
      );
      setTimeout(() => {
        authElement.classList.remove(
          "ring-2",
          "ring-indigo-500",
          "ring-offset-4",
          "ring-offset-slate-100"
        );
      }, 2500);
    }
  };

  const handleAddToWantList = async (bookToAdd) => {
    if (!currentUser) {
      promptLogin();
      return;
    }
    if (wantListIds.has(bookToAdd.id)) return;

    // Optimistic UI Update: Add book to state immediately
    const newWantList = [...wantList, bookToAdd];
    setWantList(newWantList);

    try {
      await addBookToListAPI({
        id: bookToAdd.id,
        title: bookToAdd.title,
        authors: bookToAdd.authors,
      });
      // The API call succeeded, our optimistic state is correct.
    } catch (error) {
      console.error("Failed to add book:", error);
      alert(`Error adding book: ${error.message}`);
      // Revert the state if the API call fails
      setWantList(wantList.filter((b) => b.id !== bookToAdd.id));
    }
  };

  const handleRemoveFromWantList = async (bookIdToRemove) => {
    if (!currentUser) return;

    // Keep the original list in case we need to revert
    const originalList = [...wantList];
    // Optimistic UI Update: Remove from state immediately
    setWantList((prevList) =>
      prevList.filter((book) => book.id !== bookIdToRemove)
    );

    try {
      await removeBookFromListAPI(bookIdToRemove);
      // The API call succeeded, our optimistic state is correct.
    } catch (error) {
      console.error("Failed to remove book:", error);
      alert(`Error removing book: ${error.message}`);
      // Revert the state if the API call fails
      setWantList(originalList);
    }
  };

  // --- Render Logic ---
  if (isLoadingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner />
          <p className="mt-2 text-lg font-medium text-slate-600">
            Checking Status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl p-4 space-y-8">
        {!currentUser && (
          <div id="authArea">
            <AuthSection
              onLoginSuccess={handleLoginSuccess}
              onSignupSuccess={handleSignupSuccess}
              error={authError}
            />
          </div>
        )}

        {currentUser && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p>
              Welcome back,{" "}
              <span className="font-semibold">{currentUser.username}</span>!
            </p>
            <button
              onClick={handleLogout}
              className="mt-3 sm:mt-0 bg-red-500 hover:bg-red-600 transition-colors text-white font-bold py-2 px-4 rounded-md text-sm shadow-sm"
            >
              Log Out
            </button>
          </div>
        )}

        <Card title="Search for Classics">
          <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} />
          {searchError && (
            <p className="text-red-500 mt-3">Error: {searchError}</p>
          )}
          <div className="mt-6 min-h-[100px]">
            <SearchResults
              isLoading={isSearchLoading}
              results={searchResults}
              currentUser={currentUser}
              onAddToList={handleAddToWantList}
              wantListIds={wantListIds}
            />
          </div>
        </Card>

        <Card title="My Want-to-Read List">
          {listError && <p className="text-red-500 mt-2">Error: {listError}</p>}
          <WantToReadList
            list={wantList}
            onRemoveFromList={handleRemoveFromWantList}
            isLoading={isListLoading}
            isLoggedIn={!!currentUser}
          />
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default App;
