//다이나믹 라우팅 id는 1,2,3,4.... 순으로 올라간다
import React from "react";
import { useRouter } from "next/router";
import wrapper from "../../store/configureStore";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
// import styled from "styled-components";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { Empty } from "antd";
import Head from "next/head";

// const PostTitle = styled.p`
//   font-size: 1.2rem;
//   font-weight: bold;
//   border-bottom: 1px solid gray;
//   padding: 1em;
//   margin-bottom: 0;
// `;
// const PostCard = styled.div`
//   margin: 2rem;
//   .flex {
//     display: flex;
//     justify-content: space-between;
//     height: 50px;
//   }
// `;

// const UserProfile = styled.div`
//   font-weight: bold;
//   .profileBox {
//     display: inline-block;
//     width: 40px;
//     height: 40px;
//     border-style: solid silver;
//     border-radius: 50%;
//     background-color: silver;
//     color: white;
//     text-align: center;
//     vertical-align: middle;
//     font-size: 26px;
//     margin-right: 10px;
//   }
// `;

// const TimeZone = styled.p`
//   opacity: 0.4;
//   :hover {
//     opacity: 1;
//   }
// `;

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        {singlePost ? (
          <>
            <title>짹짹이 | {singlePost.User.nickname} 님의 게시글</title>
            <meta name="description" content={singlePost.content} />
            <meta
              property="og:title"
              content={`${singlePost.User.nickname}님의 게시글`}
            />
            <meta property="og:description" content={singlePost.content} />
            <meta
              property="og:image"
              content={
                singlePost.Images[0]
                  ? singlePost.Images[0].src
                  : "https://nodebird.com/favicon.ico"
              }
            />
            <meta
              property="og:url"
              content={`https://nodebird.com/post/${id}`}
            />
          </>
        ) : (
          <title>짹짹이 | 존재하지 않는 게시글 입니다.</title>
        )}
      </Head>
      <AppLayout>
        {/* <PostTitle>{id} 번 게시글</PostTitle>
        {singlePost ? (
          <PostCard>
            <div className="flex">
              <UserProfile>
                <div className="profileBox">{singlePost.User.nickname[0]}</div>
                {singlePost.User.nickname}
              </UserProfile>
              <TimeZone>{timeString}</TimeZone>
            </div>
            {singlePost.content}
          </PostCard>
        ) : (
          <div>게시글이 존재하지 않습니다.</div>
        )} */}
        {singlePost ? (
          <PostCard post={singlePost}></PostCard>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="게시글이 존재하지 않습니다."
          />
        )}
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
      type: LOAD_POST_REQUEST,
      data: context.params.id, //router.query의 id
    });
    context.store.dispatch(END); //REQUEST가 끝나길 기다려주는 역할
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
