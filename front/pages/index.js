import AppLayout from "../components/AppLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import {
  LOAD_POSTS_REQUEST,
  RETWEET_ERROR_INITIALIZATION,
} from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { Modal } from "antd";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

function warning(title, content) {
  Modal.warning({
    title: title,
    content: content,
  });
}

const Home = () => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.me);
  const mainPosts = useSelector((state) => state.post.mainPosts);
  const hasMorePosts = useSelector((state) => state.post.hasMorePosts);
  const loadPostsLoading = useSelector((state) => state.post.loadPostsLoading);

  const { retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      warning(retweetError, "");
      dispatch({
        type: RETWEET_ERROR_INITIALIZATION,
      });
    }
  }, retweetError);
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 600
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId =
            mainPosts[mainPosts.length - 1] &&
            mainPosts[mainPosts.length - 1].id; // mainPosts[mainPosts.length - 1]?.id 랑 같다
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId: lastId,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm></PostForm>}
      {mainPosts.map((item) => {
        return <PostCard post={item} key={item.id}></PostCard>;
      })}
    </AppLayout>
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

export default Home;
