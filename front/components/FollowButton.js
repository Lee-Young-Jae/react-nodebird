import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const {
    me,
    followLoading,
    unfollowLoading,
    followLoadingUserId,
    unfollowLoadingUserId,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const onFollow = useCallback(() => {
    dispatch({
      type: FOLLOW_REQUEST,
      data: post.User.id,
    });
  }, []);
  const unfollow = useCallback(() => {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: post.User.id,
    });
  }, []);

  if (post.User.id === me.id) {
    return null;
  }

  return (
    <>
      {me?.Followings.find((e) => e.id === post.User.id) ? (
        <Button
          loading={unfollowLoading && unfollowLoadingUserId === post.User.id}
          onClick={unfollow}
        >
          언팔로우
        </Button>
      ) : (
        <Button
          loading={followLoading && followLoadingUserId === post.User.id}
          onClick={onFollow}
        >
          팔로우
        </Button>
      )}
    </>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.object),
    Comments: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default FollowButton;
