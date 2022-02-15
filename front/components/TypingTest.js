import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TypingTest = ({ mainText }) => {
  const txt = mainText;
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setText(text + txt[count]);
      setCount(count + 1);
    }, 200);
    if (count === txt.length) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  });

  return <h1 style={{ size: "10rem", textAlign: "center" }}>{text}</h1>;
};

TypingTest.propTypes = {
  mainText: PropTypes.string,
};

export default TypingTest;
