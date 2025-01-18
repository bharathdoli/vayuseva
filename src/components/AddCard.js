import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCard = () => {
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    thumbnail: null,
    instaLink: "",
  });
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("https://vayuseva.onrender.com/api/donations");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://vayuseva.onrender.com/api/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDonations();
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewCard({ ...newCard, thumbnail: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newCard.title);
    formData.append("description", newCard.description);
    formData.append("thumbnail", newCard.thumbnail);
    formData.append("instaLink", newCard.instaLink);

    try {
      const response = await axios.post(
        "https://vayuseva.onrender.com/api/cards",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 201) {
        throw new Error(response.data.message || "Failed to add card");
      }

      setSuccessMessage("Card added successfully!");
      setNewCard({
        title: "",
        description: "",
        thumbnail: null,
        instaLink: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-teal-600 text-center">
          Add a New Card
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={newCard.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={newCard.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Add Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instagram Link
          </label>
          <input
            type="text"
            name="instaLink"
            value={newCard.instaLink}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg font-semibold text-lg hover:bg-teal-600 transition duration-300"
        >
          Submit
        </button>
      </form>

      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-xl font-semibold text-teal-600 mb-4">Donations</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-2 border border-gray-300 text-left">Category</th>
              <th className="p-2 border border-gray-300 text-left">
                Description
              </th>
              <th className="p-2 border border-gray-300 text-left">Email</th>
              <th className="p-2 border border-gray-300 text-left">Phone</th>
              <th className="p-2 border border-gray-300 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr
                key={donation._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-teal-100`}
              >
                <td className="p-2 border border-gray-300">
                  {donation.category}
                </td>
                <td className="p-2 border border-gray-300">
                  {donation.description}
                </td>
                <td className="p-2 border border-gray-300">{donation.email}</td>
                <td className="p-2 border border-gray-300">
                  {donation.phoneNumber}
                </td>
                <td className="p-2 border border-gray-300">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-teal-600 mt-8 mb-4">
          Requests
        </h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-2 border border-gray-300 text-left">Category</th>
              <th className="p-2 border border-gray-300 text-left">
                Description
              </th>
              <th className="p-2 border border-gray-300 text-left">Contact</th>
              <th className="p-2 border border-gray-300 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr
                key={request._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-teal-100`}
              >
                <td className="p-2 border border-gray-300">
                  {request.category}
                </td>
                <td className="p-2 border border-gray-300">
                  {request.description}
                </td>
                <td className="p-2 border border-gray-300">
                  {request.contact}
                </td>
                <td className="p-2 border border-gray-300">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCard;
