import React, { useEffect, useState } from "react";
import team from '../assets/team.jpg';

const AboutUs = () => {
  const [cards, setCards] = useState([]); // State to store card data

  // Fetch cards from the backend API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("https://vayuseva.onrender.com/api/cards");
        if (!response.ok) throw new Error("Failed to fetch cards");
        const data = await response.json();
        console.log("Fetched cards:", data); // Log the fetched data
        
        // Sort the cards by _id or date (most recent first)
        const sortedCards = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); /// Assuming _id has a timestamp-based order
        setCards(sortedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-teal-600 text-center mb-6">
        About Us
      </h2>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4">Our Organization</h3>
        <p className="text-gray-700 mb-4">
          Vayuseva is a non-profit organization focused on uplifting the
          underprivileged communities by providing food, clothing, medical aid,
          and other resources. Our mission is to ensure that every person has
          access to the basic necessities of life, regardless of their
          circumstances.
        </p>
        <p className="text-gray-700 mb-4">
          Founded by{" "}
          <span className="font-bold px-1 py-0.5 rounded">
            Thadaka SaiPraneeth
          </span>
          , we have been dedicated to improving the lives of the needy since
          2024, reaching thousands of families across the region.
        </p>
        <h4 className="text-xl font-semibold">Meet Our Team</h4>
        <p className="text-gray-700 mb-4">
          Our team is made up of passionate individuals who work tirelessly to
          ensure that we make a meaningful impact in our community. From
          volunteers to staff, everyone at Vayuseva is committed to serving
          those in need.
        </p>

        {/* Image of the team */}
        <div className="my-8 text-center">
          <img
            src={team}
            alt="Our Team"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-teal-600 mb-6 text-center">
          Work Done By Us
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render cards dynamically */}
          {cards.length > 0 ? (
            cards.map((work) => {
              return (
                <div
                  key={work._id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={work.thumbnail}  // This will now contain the full Base64 string
                    alt={work.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-xl font-semibold mb-2 text-center">
                    {work.title}
                  </h4>
                  <p className="text-gray-700 mb-4 text-center">
                    {work.description}
                  </p>
                  {work.instaLink && (
                    <a
                      href={work.instaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800"
                    >
                      View on Instagram
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-700">No cards available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
