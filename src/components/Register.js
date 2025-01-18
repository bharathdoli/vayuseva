import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation (Optional)
    if (!formData.name || formData.name.length < 3) {
      alert("Name must be at least 3 characters long");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Submit to backend
    try {
      const response = await axios.post("https://vayuseva.onrender.com/api/auth/register", formData);
      alert(response.data.message);
      setFormData({ name: "", email: "", password: "", role: "donor" });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Role</label>
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="donor">Donor</option>
          <option value="requester">Requester</option>
        </select>
      </div>
      
      <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default Register;
