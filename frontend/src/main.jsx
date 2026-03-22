// frontend/src/main.jsx (ensure this line exists)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // <-- Make sure this line is 
import {AuthProvider} from "./context/AuthContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    
  </React.StrictMode>
);
