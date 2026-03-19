// // frontend/src/components/auth/LoginForm.jsx
// import React, { useState } from "react";
// import InputField from "../ui/InputField";
// import Button from "../ui/Button";

// function LoginForm({ onLoginSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || `HTTP error! Status: ${response.status}`
//         );
//       }

//       // Login successful!
//       console.log("Login successful:", data);
//       if (onLoginSuccess) {
//         onLoginSuccess(data.user); // Pass user data up
//       }
//       setUsername("");
//       setPassword("");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-xl font-bold text-slate-800 mb-6 text-center md:text-left">
//         Log In
//       </h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <InputField
//           id="login-username"
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           disabled={isLoading}
//         />
//         <InputField
//           id="login-password"
//           label="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           disabled={isLoading}
//         />
//         <div className="pt-2">
//           <Button type="submit" variant="primary" disabled={isLoading}>
//             {isLoading ? "Logging In..." : "Log In"}
//           </Button>
//         </div>
//         {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//       </form>
//     </div>
//   );
// }
// export default LoginForm;
