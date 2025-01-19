import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [isFetchingDonations, setIsFetchingDonations] = useState(false);
  const [showDonations, setShowDonations] = useState(false);
  const [donationsError, setDonationsError] = useState(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setIsLoading(true);
          const response = await axios.get("https://vayuseva.onrender.com/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchDonations = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        setIsFetchingDonations(true);
        setDonationsError(null); // Reset any previous errors
    
        const response = await axios.get("https://vayuseva.onrender.com/api/donations", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const filteredDonations = response.data.filter(
          (donation) => donation.email === user.email
        );
        setDonations(filteredDonations);
        setShowDonations(true); // Open the modal to display donations
      } catch (error) {
        console.error("Error fetching donations:", error);
        setDonationsError("Error fetching donations. Please try again.");
      } finally {
        setIsFetchingDonations(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setShowDonations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsDropdownOpen(false);
    setShowDonations(false);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <nav className="bg-teal-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-semibold">
            <Link to="/">Vayuseva</Link>
          </div>
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-teal-600 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-semibold mb-4 md:mb-0 flex justify-between w-full md:w-auto">
          <Link to="/">Vayuseva</Link>

          {/* Hamburger Menu (Only on mobile) */}
          <button
            className="block md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu Links (on Desktop & Mobile) */}
        <div className={`md:flex ${isOpen ? "block" : "hidden"} md:items-center`}>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-white text-left">
            <li>
              <Link to="/" className="hover:text-teal-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-teal-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-teal-200">
                Donate
              </Link>
            </li>
            <li>
              <Link to="/request" className="hover:text-teal-200">
                Request Help
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-teal-200">
                Contact Us
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-teal-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-teal-200">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <div className="flex items-center space-x-2 relative" ref={profileRef}>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=256`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                <span
                  className="text-white cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.name}
                </span>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute bg-white text-black mt-2 rounded shadow-lg w-60 z-50"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)", // Center the dropdown
                    }}
                  >
                    <ul>
                      <li className="px-4 py-2 font-semibold border-b">
                        {user.name}
                      </li>
                      <li className="px-4 py-2 text-sm text-gray-600">{user.email}</li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate("/changepassword")}
                      >
                        Change Password
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={fetchDonations}
                      >
                        My Donations
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>

      {showDonations && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">My Donations</h2>
            {isFetchingDonations ? (
              <p>Loading donations...</p>
            ) : donationsError ? (
              <p className="text-red-600">{donationsError}</p>
            ) : donations.length === 0 ? (
              <p>No donations found.</p>
            ) : (
              <ul className="space-y-4">
                {donations.map((donation) => (
                  <li key={donation._id} className="p-4 border rounded-md bg-gray-100">
                    <div>
                      <strong>Category:</strong> {donation.category}
                    </div>
                    <div>
                      <strong>Description:</strong> {donation.description}
                    </div>
                    <div>
                      <strong>Contact:</strong> {donation.email} | {donation.phoneNumber}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded"
              onClick={() => setShowDonations(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
