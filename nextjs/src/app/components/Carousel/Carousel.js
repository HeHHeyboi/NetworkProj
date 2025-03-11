"use client"; // บอกว่าไฟล์นี้เป็น client-side component

import React from "react";
import Slider from "react-slick"; // นำเข้า Slider component จาก react-slick สำหรับการทำ carousel
import Image from "next/image"; // นำเข้า Image component จาก next/image สำหรับการแสดงผลภาพที่มีประสิทธิภาพ
import "slick-carousel/slick/slick.css"; // นำเข้า default styles สำหรับ slick carousel
import "slick-carousel/slick/slick-theme.css"; // นำเข้า theme styles สำหรับ slick carousel
import "./Carousel.css"; // นำเข้า custom styles สำหรับ carousel

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const Carousel = () => {
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const images = [
    { src: "/Note.JPG", alt: "Note" },
    { src: "/Jaemin.JPG", alt: "Jaemin" },
    { src: "/Valentine.JPG", alt: "Valentine" },
    { src: "/JHope.JPG", alt: "JHope" },
    { src: "/BTS.JPG", alt: "BTS" },
  ];

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="carousel-slide">
            <div className="relative w-full h-[31.25vw] max-h-[500px]">
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover "
                priority={index === 0} 
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
