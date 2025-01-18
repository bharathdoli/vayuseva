import React, { useState } from "react";
import QR from '../assets/my oq.jpg';

const Donate = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleItemDonation = async (e) => {
    e.preventDefault();

    const donationData = { category, description, email, phoneNumber };

    try {
      const response = await fetch("https://vayuseva.onrender.com/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        alert("Item donation submitted successfully!");
        setCategory("");
        setDescription("");
        setEmail("");
        setPhoneNumber("");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting item donation:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Donate to Vayuseva</h2>

      {/* Item Donation Form */}
      <form
        onSubmit={handleItemDonation}
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mb-8"
      >
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Select Category</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
            <option value="essentials">Essentials</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows="4"
            placeholder="Describe the items you are donating"
            required
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-medium">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your 10-digit phone number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Submit Item Donation
        </button>
      </form>

      {/* Money Donation Section */}
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Donate Money</h2>
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="mb-4 text-gray-600 text-lg">
          You can donate money directly by scanning the QR code below or using
          the UPI ID provided.
        </p>
        <img
          src={QR} // Your QR code image
          alt="QR Code for Donation"
          className="mx-auto mb-4 w-40 h-40 rounded-lg shadow-md"
        />
        <p className="text-xl text-gray-800 font-semibold mb-6">UPI ID: 7993940534@ybl</p>
      </div>
    </div>
  );
};

export default Donate;
