import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import ChartTest from "../components/ChartTest";
import {
  // useDispatch,
  useSelector,
} from "react-redux";
import Router from "next/router";
import {
  // LOAD_FOLLOWERS_REQUEST,
  // LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { END } from "redux-saga";
import useSWR from "swr";
import { backUrl } from "../config/config";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  // const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `${backUrl}/user/followers?limit=${followersLimit}`,
    fetcher
  );

  const { data: followingsData, error: followingError } = useSWR(
    `${backUrl}:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => {
      return prev + 3;
    });
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => {
      return prev + 3;
    });
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return (
      <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
        내 정보 로딩중...
      </div>
    ); // me를 로딩하는 동안 보여줄 화면
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return (
      <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
        팔로잉/팔로워 로딩중 에러가 발생했습니다.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>내 프로필 | 짹짹이</title>
      </Head>
      <AppLayout>
        <NicknameEditForm></NicknameEditForm>
        {/* <>{console.log("me : " + me)}</> */}
        <FollowList
          loading={!followingsData && !followingError}
          header="팔로잉 목록"
          data={followingsData}
          onClickMore={loadMoreFollowings}
        ></FollowList>
        <FollowList
          loading={!followersData && !followerError}
          header="팔로워 목록"
          data={followersData}
          onClickMore={loadMoreFollowers}
        ></FollowList>
        <ChartTest></ChartTest>
      </AppLayout>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // 서버쪽으로 쿠키를 전달하기 위한 코드. 서버쪽에서 실행되면 context.req가 존재한다.
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = ""; // 쿠키 비워주기 (*중요) 로그인이 공유될 수 있음
    if (context.req && cookie) {
      //서버일때와 쿠키가 있을때만 쿠키를 전달
      axios.defaults.headers.Cookie = cookie;
    }
    // 서버사이드 렌더링 HOME이 렌더링 되기 전에 실행된다. getStaticProps도 비슷
    //context 안엔 store가 들어있음
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END); //REQUEST가 끝나길 기다려주는 역할
    await context.store.sagaTask.toPromise();
  }
);

export default Profile;
