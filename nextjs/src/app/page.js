

import React from "react";
import Carousel from "./components/Carousel/Carousel";
import Menu from "./components/MenuBar/page";
import Footer from "./components/Footer/page";
import EventShow from "./components/EventShow/page";
export default function Home() {
  return (
    <div >
      
      <Carousel />
      <Menu />
        <EventShow />
      <Footer />

    </div>
  );
}
