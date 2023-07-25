import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ImageSlider = () => {
  const images = [
    "https://cdn.pixabay.com/photo/2020/10/01/17/11/store-5619201_640.jpg",
    "https://cdn.pixabay.com/photo/2018/01/25/08/14/beverages-3105631_640.jpg",
    "https://cdn.pixabay.com/photo/2016/11/19/15/40/clothes-1839935_640.jpg",
    `https://cdn.pixabay.com/photo/2016/11/23/15/14/jars-1853439_640.jpg`,
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // set the duration between slide transitions in milliseconds
  };

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <div key={image}>
          <img
            style={{
              margin: "auto",
              height: "100vh",
              width: "100vw",
              borderBottomLeftRadius: "20px",
            }}
            src={image}
            alt="slide"
          />
        </div>
      ))}
    </Slider>
  );
};

function ImgApp() {
  return (
    <div className={""}>
      <ImageSlider />
    </div>
  );
}
export default ImgApp;
