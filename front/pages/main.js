import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { Input, Form, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import TypingTest from "../components/TypingTest";

const MouseOverBtn = styled(Button)`
  :hover {
    background-color: #d9d9d9aa;
    color: black;
    transition: 1s;
    border: 1 solid #d9d9d9;
    border-color: #d9d9d9;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: lightgray;
  overflow: hidden;
`;

const Desc1 = styled.div`
  margin-top: 30px;
  position: relative;
  z-index: 2;
  font-weight: bold;
  font-size: 2rem;
  color: tomato;
  left: 50%;
  transition: transform 2s;
  :hover {
    opacity: 0.5;
  }
`;

const Desc2 = styled.div`
  margin: 200px 0px;

  position: relative;
  z-index: 2;
  font-weight: bold;
  font-size: 1.5rem;
  color: rgb(70, 70, 223);
  right: 50%;
  transition: transform 2s;
  :hover {
    opacity: 0.5;
  }
`;

const Desc3 = styled.div`
  position: relative;
  z-index: 2;
  font-weight: bold;
  text-align: center;
  font-size: 60px;
  color: #666;
  opacity: 1;
`;

const Gallerylist = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  .galleryUl {
    font-size: 0; //ul 사이의 간격을 없앰
    display: flex;
    justify-content: space-around;
    height: 300px;
  }

  & .galleryLi {
    /* display: inline-block; */
  }

  & a {
    display: block;
    width: auto;
    text-decoration: none;
    margin: 5px;
  }

  & a :hover {
    .top {
      transition: 0.7s;

      bottom: 60%;
    }
    .bottom {
      transition: 0.5s;

      bottom: 50%;
    }

    img {
      opacity: 0.5;
      transition: 0.5;
    }
  }

  & .screen {
    position: relative;
    overflow: hidden;
    max-height: 300px;
    border-radius: 30px;
  }

  & .top {
    position: absolute;
    bottom: 150%;
    left: 30px;
    z-index: 2;
    color: #fff;
    font-size: 26px;
    font-weight: 900;
  }

  & .bottom {
    position: absolute;
    bottom: 150%;
    left: 30px;
    z-index: 2;
    color: #fff;
    font-size: 12px;
  }

  & img {
    width: 100%;
  }

  & .hiddenObject {
    font-size: 14px;
    text-align: center;
    padding: 20px;
    color: #666;
  }
`;

const Tooltip = styled.p`
  .tooltip {
    display: inline-block;
    color: deeppink;
    font-weight: bold;
  }

  .tooltip-text {
    display: none;
    position: absolute;
    max-width: 200px;
    border: 1px solid;
    border-radius: 5px;
    padding: 5px;
    font-size: 0.8em;
    color: white;
    background: deeppink;
  }

  .tooltip:hover .tooltip-text {
    display: block;
  }
`;

const InputWrapper = styled(Input)`
  text-align: center;
  border-radius: 0.5rem;
  :hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.2);
  }
`;

const LoginButtonWrapper = styled(Button)`
  background-color: #7d71ea;
  display: block;
  padding: 0;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 0.5rem;
  width: 90%;
  :hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 3px 2px rgba(0, 0, 0, 0.2);
    background-color: #3471ea;
    width: 93%;
  }
`;

const RegisterButtonWrapper = styled(Button)`
  margin-top: 10px;
  background-color: #ffffff;
  display: block;
  padding: 0;
  margin: 5px auto;
  font-weight: 400;
  color: #aaaaaa;
  text-align: center;
  cursor: pointer;
  border-radius: 0.5rem;
  width: 90%;
  :hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 3px 2px rgba(0, 0, 0, 0.2);
    width: 93%;
  }
`;

const main = () => {
  const submit = () => {
    console.log("hello");
  };

  const [positionValue, setPositionValue] = useState(0);

  function onScroll() {
    setPositionValue(Math.round(window.scrollY));
    console.log(Math.round(window.scrollY));
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const [postTitle, setPostTitle] = useState("test");

  const onMouseEnterPostTitle = useCallback(() => {
    setPostTitle("행복함");
    console.log("onMouseEnterPostTitle, 행복함");
  }, [postTitle]);

  const onMouseLeavePostTitle = useCallback(() => {
    setPostTitle("test");
  }, [postTitle]);

  const movePosition = () => {
    window.scroll(0, 1400);
  };

  return (
    <>
      <Head>
        <title>테스트 페이지 입니다.</title>
      </Head>

      <div className="custom-shape-divider-top-1642783835">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <h1 className="mainH1">건강 다이어리</h1>

      <div
        style={{
          width: "30rem",
          padding: "2rem",
          border: "3px solid #7d71ea",
          borderRadius: "0.7rem",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        <Form
          style={{ width: "100%" }}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={submit}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                type: "email",
                message: "이메일 양식이 맞지 않습니다.",
              },
            ]}
          >
            <InputWrapper
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해 주세요!!",
              },
            ]}
          >
            <InputWrapper
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <LoginButtonWrapper
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              로그인
            </LoginButtonWrapper>
            <RegisterButtonWrapper href="">회원가입!</RegisterButtonWrapper>
          </Form.Item>
        </Form>
        <div
          onMouseEnter={onMouseEnterPostTitle}
          onMouseLeave={onMouseLeavePostTitle}
        >
          {postTitle}
        </div>
        <Button onClick={movePosition}>움직이기</Button>
        <MouseOverBtn className="testButton">테스트</MouseOverBtn>
        <Tooltip>
          개발자를 위한 다양한 웹 기술을 배워보세요.
          <span className="tooltip">
            HTML
            <span className="tooltip-text">HyperText Markup Language</span>
          </span>
          은 웹페이지에 내용을 기술하고 정의하는 데 사용합니다.
          <span className="tooltip">
            CSS
            <span className="tooltip-text">Cascading Style Sheets</span>
          </span>
          는 웹페이지 콘텐츠의 모양이나 표현을 기술하는 데 사용합니다.
        </Tooltip>
      </div>
      <Container></Container>
      <Container>
        <Desc1 style={{ transform: `translateX(${-positionValue + 1000}px)` }}>
          안녕하세요 저는 컴퓨터 공학과를 재학중이고 <br />
          프론트 앤드 개발자를 꿈꾸고 있는 <br />
          이영재 입니다.
        </Desc1>

        <Desc2 style={{ transform: `translateX(${+positionValue - 600}px)` }}>
          안녕하세요 저는 컴퓨터 공학과를 재학중이고 프론트 앤드 개발자를 꿈꾸고
          있는 이영재 입니다.
        </Desc2>
      </Container>
      <Container>
        <Desc3 style={{ opacity: (positionValue - 1800) / 50 }}>
          저는 Html 할 수 있습니다.
        </Desc3>
        <Desc3 style={{ opacity: (positionValue - 1900) / 50 }}>
          CSS 할 수 있습니다.
        </Desc3>
        <Desc3 style={{ opacity: (positionValue - 2000) / 50 }}>
          {" "}
          JavaScript 할 수 있습니다.
        </Desc3>
        <Desc3 style={{ opacity: (positionValue - 2100) / 50 }}>
          {" "}
          React.js 할 수 있습니다.
        </Desc3>
        <Desc3 style={{ opacity: (positionValue - 2200) / 50 }}>
          {" "}
          Vue.js 할 수 있습니다.
        </Desc3>
      </Container>
      <Container>
        <TypingTest mainText={"오늘은 뭐먹지?"}></TypingTest>
      </Container>
      <Container>
        <Gallerylist>
          <ul className="galleryUl">
            <li className="galleryLi">
              <a href="#">
                <div className="screen">
                  <div className="top">상단 내용</div>
                  <div className="bottom">Mouse Hover 효과</div>
                  <img
                    className="GallerylistImg"
                    src="https://cdn.pixabay.com/photo/2021/01/04/14/00/balloons-5887644_1280.jpg"
                  ></img>
                </div>
                <div className="hiddenObject">
                  <h3>이미지 위에 오브젝트가 나타나는 효과</h3>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className="screen">
                  <div className="top">상단 내용</div>
                  <div className="bottom">Mouse Hover 효과</div>
                  <img
                    className="GallerylistImg"
                    src="https://cdn.pixabay.com/photo/2021/11/04/16/19/travel-6768660_1280.png"
                  ></img>
                </div>
                <div className="hiddenObject">
                  <h3>이미지 위에 오브젝트가 나타나는 효과</h3>
                </div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className="screen">
                  <div className="top">상단 내용</div>
                  <div className="bottom">Mouse Hover 효과</div>
                  <img
                    className="GallerylistImg"
                    src="https://cdn.pixabay.com/photo/2020/07/10/13/40/flower-5390711_1280.jpg"
                  ></img>
                </div>
                <div className="hiddenObject">
                  <h3>이미지 위에 오브젝트가 나타나는 효과</h3>
                </div>
              </a>
            </li>
          </ul>
        </Gallerylist>
      </Container>
    </>
  );
};

export default main;
