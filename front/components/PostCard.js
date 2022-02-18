import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Comment, List, Popover, Modal } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "antd/lib/avatar/avatar";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  UPDATE_POST_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";
import Link from "next/link";
// import styled from "styled-components";
import moment from "moment";

function warning(title, content) {
  Modal.warning({
    title: title,
    content: content,
  });
}

moment.locale("ko");

const PostCard = ({ post }) => {
  // const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [updateFormOpend, setUpdateFormOpened] = useState(false);
  const { me } = useSelector((state) => state.user);
  const id = me?.id; //me && me.id   <= optional chaining 연산자
  //위 두줄을 이렇게 줄일 수 있음 const id = useSelector((state)=> state.user.me?.id);

  const dispatch = useDispatch();
  // const removePostLoading = useSelector(
  //   (state) => state.post.removePostLoading
  // );

  const { removePostLoading } = useSelector((state) => state.post);

  const onLike = useCallback(() => {
    if (!id) {
      return warning("로그인이 필요합니다!");
    }
    // setLinked((prev) => !prev); // toggle 코드 true는 false로 false는 true로
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return warning("로그인이 필요합니다!");
    }
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onToggleUpdate = useCallback(() => {
    setUpdateFormOpened((prev) => !prev);
  }, []);

  const onCancleUpdate = useCallback(() => {
    setUpdateFormOpened(false);
  });

  const onChangePost = useCallback(
    (editText) => () => {
      if (!id) {
        return warning("로그인이 필요합니다!");
      }

      const postData = { postId: post.id, content: editText };
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: postData,
      });

      onCancleUpdate();
    },
    [post]
  );

  const onRemovePost = useCallback(() => {
    if (!id) {
      return warning("로그인이 필요합니다!");
    }
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return warning("로그인이 필요합니다!", "리트윗을 할 수 없습니다.");
    }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const liked = post.Likers.find((e) => e.id === id);

  const cardStyle = useMemo(
    () => ({
      marginBottom: "20px",
    }),
    []
  );

  const today = new Date();
  // const year = today.getFullYear();
  // const month = today.getMonth() + 1;
  // const day = today.getDate();

  // const format =
  //   year +
  //   "-" +
  //   ("00" + month.toString()).slice(-2) +
  //   "-" +
  //   ("00" + day.toString()).slice(-2);
  const format = today.toLocaleString();

  const dateObj = new Date(post.createdAt);
  const timeString = dateObj.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  const timeTable = () => {
    if (timeString.slice(0, 12) === format.slice(0, 12)) {
      return timeString.slice(12, timeString.length) + " 작성됨";
    } else {
      return timeString.slice(0, 12);
    }
  };
  return (
    <>
      <Card
        style={cardStyle}
        // title={post.User.nickname}
        cover={post.Images[0] && <PostImages images={post.Images}></PostImages>}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet}></RetweetOutlined>,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onUnlike}
            ></HeartTwoTone>
          ) : (
            <HeartOutlined key="heart" onClick={onLike}></HeartOutlined>
          ),
          <MessageOutlined
            key="comment"
            onClick={onToggleComment}
          ></MessageOutlined>,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && id === post.User.id ? (
                  <>
                    {!post.RetweetId && (
                      <Button onClick={onToggleUpdate}>수정</Button>
                    )}
                    <Button
                      type="danger"
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button type="danger">신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined></EllipsisOutlined>
          </Popover>,
        ]}
        title={
          post.Retweet ? `${post.User.nickname} 님의 리트윗` : timeTable()
          //post.createdAt.slice(0, 19).replace("T", " ") + " 작성됨" // 2022-02-08T15:05:32.000Z
        }
        extra={id && <FollowButton post={post}></FollowButton>}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images}></PostImages>
              )
            }
          >
            <div style={{ float: "right" }}>
              {moment(post.Retweet.createdAt, "YYYYMMDD").fromNow()}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  postData={post.Retweet.content}
                ></PostCardContent>
              }
            ></Card.Meta>
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link href={`/user/${post.User.id}`}>
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User.nickname}
            description={
              <PostCardContent
                postData={post.content}
                editMode={updateFormOpend}
                onCancleUpdate={onCancleUpdate}
                onChangePost={onChangePost}
              ></PostCardContent>
            }
          ></Card.Meta>
        )}
      </Card>

      {commentFormOpened && (
        <div>
          <CommentForm post={post}></CommentForm>
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                ></Comment>
              </li>
            )}
          ></List>
        </div>
      )}
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.object),
    Comments: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
