import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Carousel from '../components/carousel'; // Adjust the path if needed

const Home = () => {
  return (
    <div>
      <section id="home" className="pt-24 pb-12 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 w-full mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center md:text-left">
                Eternal Giving , Infinite hope
              </h1>
              <p className="text-gray-600 mb-8 text-center md:text-left">
                Join us in making a difference by donating essential items to those in need. Every donation counts, every life matters.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                {/* Link added to buttons */}
                <Link to="/donate">
                  <button className="bg-teal-600 text-white py-2 px-6 rounded-full w-full sm:w-auto text-center">
                    Donate Now
                  </button>
                </Link>
                <Link to="/request">
                  <button className="border-2 border-teal-600 text-teal-600 py-2 px-6 rounded-full w-full sm:w-auto text-center">
                    Request Help
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 w-full mt-8 md:mt-0">
              <Carousel />
            </div>
          </div>
        </div>
      </section>

      {/* More sections here */}
    </div>
  );
};

export default Home;
