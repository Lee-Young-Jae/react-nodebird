import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { useSelector } from "react-redux";
import Router from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { END } from "redux-saga";
import HealthForm from "../components/HealthForm";
import HealthCard from "../components/HealthCard";

const Health = () => {
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return null; // me를 로딩하는 동안 보여줄 화면
  }
  return (
    <>
      <Head>
        <title>건강정보 입력 | 짹짹이</title>
      </Head>
      <AppLayout>
        <HealthForm></HealthForm>
        {me.Health &&
          me.Health.map((e, i) => {
            return <HealthCard key={e + i} healthData={e}></HealthCard>;
          })}
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

export default Health;
