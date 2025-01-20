import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <footer className="bg-teal-600 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Vayuseva</h3>
            <p className="text-sm text-teal-100">
              Vayuseva is committed to serving communities by facilitating donations and assistance for those in need. Join us in making a difference!
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:bharathdoli7@gmail.com"
                  className="hover:text-teal-200"
                >
                  support@vayuseva.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_vayuseva_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-200"
                >
                  Instagram: @_vayuseva_
                </a>
              </li>
              <li className="hover:text-teal-200">+91 6304223380</li>
            </ul>
          </div>

          {/* Call to Action */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Us</h3>
            <button
              className="bg-white text-teal-600 hover:bg-teal-500 hover:text-white py-2 px-4 rounded-full transition duration-300"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 border-t border-teal-500 pt-4 flex flex-col sm:flex-row justify-center items-center">
          <div className="text-sm text-teal-100 text-center">
            © {new Date().getFullYear()} Vayuseva. All Rights Reserved.
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-100 hover:text-white"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/_vayuseva_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-100 hover:text-white"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-100 hover:text-white"
            >
              <i className="fab fa-dribbble"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
