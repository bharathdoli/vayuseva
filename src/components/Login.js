import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom v6

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(process.env.REACT_APP_ADMIN_EMAIL);
  console.log(process.env.REACT_APP_ADMIN_PASSWORD);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    setIsSubmitting(true);// Reset error message on new submission
    try {
      const response = await axios.post("https://vayuseva.onrender.com/api/auth/login", formData);
      const { token, user } = response.data; // Extract token and user from the response
      
      if (token) {
        // Save the token in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user)); // Optionally save user details
  
        alert("Login successful!");
        if (user.email === process.env.REACT_APP_ADMIN_EMAIL && formData.password === process.env.REACT_APP_ADMIN_PASSWORD) {
          navigate("/add-card"); // Redirect to the Add Card page
        } else {
            window.location.href = "/"; // Redirect to the homepage
        }
      } else {
        setErrorMessage("Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed! Please try again.";
      setErrorMessage(message);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      {errorMessage && (
        <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-teal-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
