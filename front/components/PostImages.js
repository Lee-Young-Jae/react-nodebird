import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom";
import { backUrl } from "../config/config";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  const divStyled = useMemo(
    () => ({
      display: "inline-block",
      width: "50%",
      textAlign: "center",
      verticalAlign: "middle",
    }),
    []
  );

  const imgStyled = useMemo(
    () => ({
      width: "50%",
      display: "inline-block",
    }),
    []
  );

  const myUrl = backUrl;

  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation"
          src={myUrl + images[0].src}
          alt={myUrl + images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          style={imgStyled}
          role="presentation"
          src={myUrl + images[0].src}
          alt={myUrl + images[0].src}
          onClick={onZoom}
        />
        <img
          style={imgStyled}
          role="presentation"
          src={myUrl + images[1].src}
          alt={myUrl + images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <>
      <div style={{ background: "rgba(0, 0, 0, 0.055)" }}>
        <img
          role="presentation"
          style={imgStyled}
          src={myUrl + images[0].src}
          alt={myUrl + images[0].src}
          onClick={onZoom}
        />
        <div role="presentation" style={divStyled} onClick={onZoom}>
          <PlusOutlined></PlusOutlined>
          <br />
          {images.length - 1} 개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
