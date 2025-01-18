import React, { useState } from 'react';

const Request = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the data to be sent
    const requestData = { category, description, contact };
    console.log(requestData); // Check the data here
  
    try {
      const response = await fetch('https://vayuseva.onrender.com/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        alert('Request submitted successfully!');
        setCategory('');
        setDescription('');
        setContact('');
      } else {
        alert('Error submitting request');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Error submitting request');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
      <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">Request Help</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
            <option value="essentials">Essentials</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows="4"
            placeholder="Describe your needs"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Information</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter your phone number or email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Request;
