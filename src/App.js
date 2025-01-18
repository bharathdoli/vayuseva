import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Request from './pages/Request';
import Login from './components/Login';
import Register from './components/Register';
import Footer from "./components/Footer";
import AboutUs from "./pages/Aboutus";
import AddCard from "./components/AddCard";
import ContactUs from "./components/ContactUs";
import ChangePassword from "./components/ChangePassword";

const App = () => (
  <Router>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/donate" element={<Donate />} />
          <Route path="/request" element={<Request />} />
          <Route path="/contact" element={<ContactUs/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/changepassword" element={<ChangePassword/>}/>
          <Route path="/add-card" element={<AddCard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
);

export default App;
