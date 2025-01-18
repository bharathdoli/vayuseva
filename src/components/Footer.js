import React from "react";

const Footer = () => (
  <footer className="bg-teal-500 text-white py-4 text-center sm:py-6 md:py-8">
    <p className="text-sm sm:text-base md:text-lg">
      © {new Date().getFullYear()} Vayuseva. All Rights Reserved.
    </p>
  </footer>
);

export default Footer;
