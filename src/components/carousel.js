import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('/api/cards');
        const data = await response.json();

        // Ensure only unique thumbnails
        const uniqueImages = Array.from(new Set(data.map((card) => card.thumbnail)));
        setCarouselImages(uniqueImages);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
    };

    fetchCarouselImages();
  }, []);

  const settings = {
    dots: true,
    infinite: false, // Disable infinite looping to avoid duplicate images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {carouselImages.length > 0 ? (
        <Slider {...settings}>
          {carouselImages.map((image, index) => (
            <div key={index} className="flex justify-center items-center h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img src={image} alt={`carousel-slide-${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">No images available</p>
      )}
    </div>
  );
};

export default Carousel;
