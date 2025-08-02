// public/script.js

// --- DOM Elements ---
// Auth Area
const authArea = document.getElementById("authArea");
const loggedOutView = document.getElementById("loggedOutView");
const loggedInView = document.getElementById("loggedInView");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupUsernameInput = document.getElementById("signupUsername");
const signupPasswordInput = document.getElementById("signupPassword"); // Password input
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword"); // Password input
const signupErrorP = document.getElementById("signupError");
const loginErrorP = document.getElementById("loginError");
const loggedInUsernameSpan = document.getElementById("loggedInUsername");
const logoutButton = document.getElementById("logoutButton");
// Password Toggle Checkboxes (NEW)
const toggleSignupPasswordCheckbox = document.getElementById(
  "toggleSignupPassword"
);
const toggleLoginPasswordCheckbox = document.getElementById(
  "toggleLoginPassword"
);

// Main Content Area (Search & List) - Initially Hidden
const mainContent = document.getElementById("mainContent");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsArea = document.getElementById("resultsArea");
const wantToReadListDiv = document.getElementById("wantToReadList");
const emptyListMessage = document.getElementById("emptyListMessage");

// Loading Indicator
const loadingIndicator = document.getElementById("loadingIndicator"); // Assuming you added this

// --- API URLs ---
const AUTH_API_BASE = "/api/auth"; // Use relative URLs
const SEARCH_API_URL = "/api/search";
const LIST_API_URL = "/api/my-list";

// --- State ---
let currentWantListIds = new Set(); // Store IDs of books in the user's current list

// --- Utility Functions ---
function showLoading(show) {
  // Basic loading indicator - replace with something better if needed
  console.log("Loading:", show);
  // if (loadingIndicator) loadingIndicator.classList.toggle('hidden', !show);
}
function displayAuthError(formType, message) {
  const errorP = formType === "signup" ? signupErrorP : loginErrorP;
  errorP.textContent = message;
}
function clearAuthErrors() {
  signupErrorP.textContent = "";
  loginErrorP.textContent = "";
}

// --- Password Toggle Helper Function (NEW) ---
function togglePasswordVisibility(checkbox, passwordInput) {
  if (!checkbox || !passwordInput) return; // Safety check
  if (checkbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

// --- UI Update Functions ---
function updateUIForLoginState(isLoggedIn, username = "") {
  clearAuthErrors(); // Clear errors on state change
  if (isLoggedIn) {
    loggedInView.classList.remove("hidden");
    loggedOutView.classList.add("hidden");
    mainContent.classList.remove("hidden"); // Show main app content
    loggedInUsernameSpan.textContent = username;
    // Fetch and display the user's list
    displayWantList(); // Automatically refresh list on login state change
  } else {
    loggedOutView.classList.remove("hidden");
    loggedInView.classList.add("hidden");
    mainContent.classList.add("hidden"); // Hide main app content
    // Clear previous search/list data
    resultsArea.innerHTML =
      '<p class="text-gray-500">Please log in to search.</p>';
    wantToReadListDiv.innerHTML =
      '<p class="text-gray-500">Please log in to see your list.</p>';
    currentWantListIds.clear();
  }
  showLoading(false);
}

// --- API Call Functions ---

async function checkLoginStatus() {
  showLoading(true);
  try {
    const response = await fetch(`${AUTH_API_BASE}/status`);
    if (!response.ok) {
      // Handle network errors etc.
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateUIForLoginState(data.isLoggedIn, data.user?.username);
  } catch (error) {
    console.error("Error checking login status:", error);
    updateUIForLoginState(false); // Assume logged out on error
  } finally {
    // Ensure loading is hidden even if displayWantList is called by updateUI
    showLoading(false);
  }
}

async function handleSignup(event) {
  event.preventDefault();
  clearAuthErrors();
  showLoading(true);
  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;

  try {
    const response = await fetch(`${AUTH_API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    // Signup successful, backend logs user in automatically
    updateUIForLoginState(true, data.user.username); // This will trigger displayWantList
    signupForm.reset(); // Clear form
    // Reset password field type (NEW)
    if (toggleSignupPasswordCheckbox)
      toggleSignupPasswordCheckbox.checked = false;
    signupPasswordInput.type = "password";
  } catch (error) {
    console.error("Signup failed:", error);
    displayAuthError("signup", error.message);
    showLoading(false);
  }
  // Loading state handled by updateUIForLoginState or the catch block
}

async function handleLogin(event) {
  event.preventDefault();
  clearAuthErrors();
  showLoading(true);
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  try {
    const response = await fetch(`${AUTH_API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    // Login successful
    updateUIForLoginState(true, data.user.username); // This will trigger displayWantList
    loginForm.reset(); // Clear form
    // Reset password field type (NEW)
    if (toggleLoginPasswordCheckbox)
      toggleLoginPasswordCheckbox.checked = false;
    loginPasswordInput.type = "password";
  } catch (error) {
    console.error("Login failed:", error);
    displayAuthError("login", error.message);
    showLoading(false);
  }
  // Loading state handled by updateUIForLoginState or the catch block
}

async function handleLogout() {
  showLoading(true);
  try {
    const response = await fetch(`${AUTH_API_BASE}/logout`, { method: "POST" });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    // Logout successful
    updateUIForLoginState(false);
  } catch (error) {
    console.error("Logout failed:", error);
    alert(`Logout failed: ${error.message}`); // Simple alert for now
    showLoading(false); // Ensure loading is hidden even on error
  }
}

// --- Search Functionality ---
async function searchBooks() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    resultsArea.innerHTML =
      '<p class="text-red-500">Please enter a search term.</p>';
    return;
  }
  resultsArea.innerHTML = '<p class="text-gray-500">Searching...</p>';

  try {
    const response = await fetch(
      `${SEARCH_API_URL}?q=${encodeURIComponent(searchTerm)}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const books = await response.json();
    displayResults(books); // Uses the global currentWantListIds
  } catch (error) {
    console.error("Error fetching books:", error);
    resultsArea.innerHTML = `<p class="text-red-500">Error: ${error.message}. Check console.</p>`;
  }
}

function displayResults(books) {
  resultsArea.innerHTML = "";
  if (!books || books.length === 0) {
    resultsArea.innerHTML =
      '<p class="text-gray-500">No public domain books found matching that term.</p>';
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add(
      "p-3",
      "border",
      "rounded",
      "bg-gray-50",
      "flex",
      "justify-between",
      "items-center"
    );

    const isAlreadyAdded = currentWantListIds.has(book.id); // Check against the Set

    const displayTitle =
      book.title.length > 60 ? book.title.substring(0, 57) + "..." : book.title;
    const displayAuthors =
      book.authors.length > 40
        ? book.authors.substring(0, 37) + "..."
        : book.authors;

    bookElement.innerHTML = `
            <div>
                <h3 class="font-semibold text-md">${
                  displayTitle || "No Title"
                }</h3>
                <p class="text-sm text-gray-600">By: ${
                  displayAuthors || "N/A"
                }</p>
            </div>
            <button
                class="add-button text-xs ${
                  isAlreadyAdded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white py-1 px-2 rounded"
                data-book-id="${book.id}"
                data-book-title="${book.title}"
                data-book-authors="${book.authors}"
                ${isAlreadyAdded ? "disabled" : ""}
            >
                ${isAlreadyAdded ? "Added" : "Add to List"}
            </button>
        `;
    resultsArea.appendChild(bookElement);

    if (!isAlreadyAdded) {
      const addButton = bookElement.querySelector(".add-button");
      addButton.addEventListener("click", handleAddToListAPI);
    }
  });
}

// --- Want to Read List Functionality (Uses API) ---

async function fetchWantList() {
  // This function is called internally by displayWantList now
  try {
    const response = await fetch(LIST_API_URL); // GET request
    if (!response.ok) {
      if (response.status === 401) return [];
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const list = await response.json();
    currentWantListIds = new Set(list.map((book) => book.id)); // Update the global set
    return list;
  } catch (error) {
    console.error("Failed to fetch want list:", error);
    // Error display handled by displayWantList caller
    currentWantListIds.clear();
    throw error; // Re-throw error to be caught by displayWantList
  }
}

async function handleAddToListAPI(event) {
  const button = event.target;
  const bookData = {
    id: parseInt(button.dataset.bookId, 10),
    title: button.dataset.bookTitle,
    authors: button.dataset.bookAuthors,
  };

  button.textContent = "Adding...";
  button.disabled = true;

  try {
    const response = await fetch(LIST_API_URL, {
      // POST request
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    const savedBook = await response.json();

    if (!response.ok) {
      throw new Error(
        savedBook.message || `HTTP error! status: ${response.status}`
      );
    }
    // Success
    button.textContent = "Added";
    button.classList.remove("bg-green-500", "hover:bg-green-600");
    button.classList.add("bg-gray-400", "cursor-not-allowed");
    currentWantListIds.add(bookData.id); // Update set
    displayWantList(); // Refresh displayed list
  } catch (error) {
    console.error("Failed to add book via API:", error);
    alert(`Error adding book: ${error.message}`);
    // Re-enable button on failure
    button.textContent = "Add to List";
    button.disabled = false;
  }
}

async function handleRemoveFromListAPI(event) {
  const button = event.target;
  const bookIdToRemove = parseInt(button.dataset.bookId, 10);

  button.textContent = "Removing...";
  button.disabled = true;

  try {
    const response = await fetch(`${LIST_API_URL}/${bookIdToRemove}`, {
      // DELETE request
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }
    // Success
    currentWantListIds.delete(bookIdToRemove); // Update set
    displayWantList(); // Refresh displayed list

    // Re-enable corresponding add button in search results
    const addButtonInResults = resultsArea.querySelector(
      `.add-button[data-book-id="${bookIdToRemove}"]`
    );
    if (addButtonInResults) {
      addButtonInResults.textContent = "Add to List";
      addButtonInResults.disabled = false;
      addButtonInResults.classList.add("bg-green-500", "hover:bg-green-600");
      addButtonInResults.classList.remove("bg-gray-400", "cursor-not-allowed");
    }
  } catch (error) {
    console.error("Failed to remove book via API:", error);
    alert(`Error removing book: ${error.message}`);
    // Re-enable button on failure
    button.textContent = "Remove";
    button.disabled = false;
  }
}

async function displayWantList() {
  // This function now handles fetching AND displaying
  wantToReadListDiv.innerHTML = '<p class="text-gray-500">Loading list...</p>';
  emptyListMessage.style.display = "none";
  showLoading(true); // Show loading specific to list display

  try {
    const list = await fetchWantList(); // Fetch user's list from API

    wantToReadListDiv.innerHTML = ""; // Clear loading/previous

    if (list.length === 0) {
      wantToReadListDiv.appendChild(emptyListMessage);
      emptyListMessage.style.display = "block";
    } else {
      emptyListMessage.style.display = "none";
      list.forEach((book) => {
        const listItem = document.createElement("div");
        listItem.classList.add(
          "p-3",
          "border",
          "rounded",
          "bg-blue-50",
          "flex",
          "justify-between",
          "items-center"
        );

        const displayTitle =
          book.title.length > 60
            ? book.title.substring(0, 57) + "..."
            : book.title;
        const displayAuthors =
          book.authors.length > 40
            ? book.authors.substring(0, 37) + "..."
            : book.authors;

        listItem.innerHTML = `
                    <div>
                        <h3 class="font-semibold text-md">${
                          displayTitle || "No Title"
                        }</h3>
                        <p class="text-sm text-gray-600">By: ${
                          displayAuthors || "N/A"
                        }</p>
                    </div>
                    <button
                        class="remove-button text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        data-book-id="${book.id}"
                    >
                        Remove
                    </button>
                `;
        wantToReadListDiv.appendChild(listItem);

        const removeButton = listItem.querySelector(".remove-button");
        removeButton.addEventListener("click", handleRemoveFromListAPI); // Attach the remove handler
      });
    }
  } catch (error) {
    // Error display if fetchWantList fails
    wantToReadListDiv.innerHTML = `<p class="text-red-500">Error loading your list.</p>`;
    emptyListMessage.style.display = "none";
  } finally {
    showLoading(false); // Hide loading when done or on error
  }
}

// --- Initial Load & Event Listeners ---

// Check login status when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded, checking login status...");
  checkLoginStatus();

  // Authentication forms
  signupForm.addEventListener("submit", handleSignup);
  loginForm.addEventListener("submit", handleLogin);
  logoutButton.addEventListener("click", handleLogout);

  // Search functionality
  searchButton.addEventListener("click", searchBooks);
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchBooks();
    }
  });

  // --- Password Visibility Toggles (NEW) ---
  if (toggleSignupPasswordCheckbox && signupPasswordInput) {
    toggleSignupPasswordCheckbox.addEventListener("change", () => {
      togglePasswordVisibility(
        toggleSignupPasswordCheckbox,
        signupPasswordInput
      );
    });
  }
  if (toggleLoginPasswordCheckbox && loginPasswordInput) {
    toggleLoginPasswordCheckbox.addEventListener("change", () => {
      togglePasswordVisibility(toggleLoginPasswordCheckbox, loginPasswordInput);
    });
  }
}); // End DOMContentLoaded listener
