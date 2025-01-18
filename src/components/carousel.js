// src/components/Carousel.js
import React from 'react';
import Slider from 'react-slick';
import image1 from '../assets/Screenshot 2024-12-11 215542.png';


const Carousel = () => {
  const carouselImages = [
    image1,
    image1,
    image1,
    image1
  ];

  const settings = {
    dots: true, // Show dots navigation
    infinite: true, // Infinite loop
    speed: 500, // Speed of transition
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto play
    autoplaySpeed: 2000, // Speed of autoplay
    arrows: true, // Show arrows for navigation
    responsive: [
      {
        breakpoint: 768, // For screens smaller than 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024, // For screens larger than 768px but smaller than 1024px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {carouselImages.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`carousel-slide-${index}`} className="w-full h-auto" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
