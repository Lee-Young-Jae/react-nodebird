import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col, message } from "antd";
// eslint-disable-next-line no-unused-vars
import { createGlobalStyle } from "styled-components";

import // AppstoreOutlined,

"@ant-design/icons";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import styled from "styled-components";
import { useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import Router from "next/router";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const ColStyle = styled(Col)`
  background-color: #7c7c9d09;
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 4px 0;
  border-radius: 3px;
`;

const Global = createGlobalStyle` //거터로 인해 생긴 하단의 스크롤바 없애기
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput("");
  const { me } = useSelector((state) => state.user);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onSearch = useCallback(() => {
    if (!searchInput) {
      message.warning("검색할 해시태그를 입력해주세요");
    }

    Router.push(`/hashtag/${searchInput}`); //프로그래밍 적으로 주소를 옮길때는 Router를 사용
  }, [searchInput]);

  // const [userId, setUserId] = useState("");
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="menuItem_1">
          <Link href="/">
            <a>홈으로</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="menuItem_2">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="menuItem_3">
          <Link href="/health">
            <a>건강정보</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="menuItem_4">
          <SearchInput
            placeholder="해시태그 검색"
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          ></SearchInput>
        </Menu.Item>
        <Menu.Item key="menuItem_5">
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Global></Global>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <ColStyle xs={24} md={12}>
          {children}
        </ColStyle>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/Lee-Young-Jae"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made By Ori_
          </a>
        </Col>
      </Row>
    </>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
