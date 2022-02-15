import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
// import PropTypes from "prop-types";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user.js";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";

const LogoutButton = styled(Button)``;

const CardWrapper = styled(Card)`
  position: sticky;
  top: 5px;
`;

const UserProfile = () => {
  // const ProfileCardStyle = useMemo(
  //   () => ({
  //     display: "flex",
  //   }),
  //   []
  // );
  const dispatch = useDispatch();
  const logOutLoading = useSelector((state) => state.user.logOutLoading);
  const me = useSelector((state) => state.user.me);

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  // const userId = useSelector((state) => state.user.me.id);

  return (
    <CardWrapper
      actions={[
        <Link href={`/user/${me.id}`} key="twit">
          <a>
            <div>
              짹짹
              <br />
              {me.Posts.length}
            </div>
          </a>
        </Link>,
        <Link href={`/profile`} key="followings">
          <a>
            <div>
              {/* key="followings"*/}
              팔로잉
              <br />
              {me.Followings.length}
            </div>
          </a>
        </Link>,
        <Link href={`/profile`} key="follower">
          <a>
            <div>
              팔로워
              <br />
              {me.Followers.length}
            </div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link href={`/profile`}>
            <a>
              <Avatar>{me.nickname[0]}</Avatar>
            </a>
          </Link>
        }
        title={"환영합니다 " + me.nickname}
        // description="www.instagram.com"
      ></Card.Meta>
      <LogoutButton
        onClick={onLogout}
        loading={
          logOutLoading && <LoadingOutlined style={{ fontSize: 24 }} spin />
        }
      >
        로그아웃
      </LogoutButton>
    </CardWrapper>
  );
};

// UserProfile.propTypes = {
//   setIsLoggedIn: PropTypes.func.isRequired,
// };

export default UserProfile;
