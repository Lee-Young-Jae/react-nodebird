import React from "react";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import Head from "next/head";
import wrapper from "../store/configureStore";
import "../styles/global.css";

//_app.js 는 next.js에서 pages들의 공통적인 부분을 담당하는 모든 컴포넌트의 부모역할이다.
const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>짹짹이</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Dongle:wght@400;700&family=Gowun+Batang&family=Single+Day&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Component />
    </>
  );
};
App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

// wrapper.withRedux로 페이지를 감싸게 되면 redux가 결합된 라이프사이클을 사용할 수 있게 된다. configureStore.js
export default wrapper.withRedux(App);
