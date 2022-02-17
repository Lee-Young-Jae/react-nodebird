import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {
  CloseBtn,
  Global,
  Header,
  ImgWrapper,
  Indicator,
  Overlay,
  SlickWrapper,
} from "./styles";

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global></Global> {/* 아무데나 넣어도 된다.*/}
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} //0번 이미지부터
            beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)}
            infinite //무한반복
            arrows={false} // 양옆 화살표 지우기
            slidesToShow={1} //한번에 하나씩만 보이게
            slidesToScroll={1} // 하나씩만 넘길 수 있게
          >
            {images.map((item) => (
              <ImgWrapper key={item.src}>
                <img src={item.src} alt={item.src}></img>
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
