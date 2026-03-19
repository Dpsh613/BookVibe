// // frontend/src/components/auth/SignupForm.jsx
// import React, { useState } from "react";
// import InputField from "../ui/InputField";
// import Button from "../ui/Button";

// function SignupForm({ onSignupSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError(""); // Clear previous errors
//     setIsLoading(true);

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Use the relative path - Vite proxy handles it
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Use error message from backend if available
//         throw new Error(
//           data.message || `HTTP error! Status: ${response.status}`
//         );
//       }

//       // Signup successful!
//       console.log("Signup successful:", data);
//       // Call the success handler passed from the parent component
//       if (onSignupSuccess) {
//         onSignupSuccess(data.user); // Pass user data up
//       }
//       // Optionally clear form fields here, though component might unmount
//       setUsername("");
//       setPassword("");
//     } catch (err) {
//       console.error("Signup error:", err);
//       setError(err.message || "Signup failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-xl font-bold text-slate-800 mb-6 text-center md:text-left">
//         Create an Account
//       </h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <InputField
//           id="signup-username"
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           disabled={isLoading}
//         />
//         <InputField
//           id="signup-password"
//           label="Password (min. 6 chars)"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           minLength="6"
//           disabled={isLoading}
//         />
//         <div className="pt-2">
//           <Button type="submit" variant="success" disabled={isLoading}>
//             {isLoading ? "Signing Up..." : "Sign Up"}
//           </Button>
//         </div>
//         {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default SignupForm;
