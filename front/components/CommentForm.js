import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import useInput from "../hooks/useInput.js";
import { useDispatch, useSelector } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post.js";
import { LoadingOutlined } from "@ant-design/icons";

// function warning(title, content) {
//   Modal.warning({
//     title: title,
//     content: content,
//   });
// }

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const addCommentDone = useSelector((state) => state.post.addCommentDone);
  const { addCommentLoading } = useSelector(
    //addCommentError
    (state) => state.post
  );
  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  // useEffect(() => {
  //   if (addCommentError) {
  //     warning("로그인 오류", addCommentError);
  //   }
  // }, [addCommentError]);

  const formItemStyled = useMemo(
    () => ({
      position: "relative",
      margin: 0,
    }),
    []
  );

  const formButtonStyled = useMemo(
    () => ({
      position: "absolute",
      right: 0,
      bottom: -40,
      zIndex: 1,
    }),
    []
  );

  const dispatch = useDispatch();
  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
    console.log(post.id, commentText, id);
  }, [commentText, id]);

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  return (
    <>
      {id ? (
        <Form onFinish={onSubmitComment}>
          <Form.Item style={formItemStyled}>
            <Input.TextArea
              value={commentText}
              onChange={onChangeCommentText}
            ></Input.TextArea>

            <Button
              style={formButtonStyled}
              type="primary"
              htmlType="submit"
              loading={
                addCommentLoading && (
                  <LoadingOutlined style={{ fontSize: 24 }} spin />
                )
              }
            >
              삐약
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <span>코멘트를 남기시려면 로그인이 필요합니다.</span>
      )}
    </>
  );
};

CommentForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.object),
    Comments: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default CommentForm;
