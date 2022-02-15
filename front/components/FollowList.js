import React, { useMemo } from "react";
import { Button, List, Card } from "antd";
import PropTypes from "prop-types";
import { StopOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";
import Link from "next/link";

const FollowList = ({ header, data, onClickMore, loading }) => {
  const ListStyle = useMemo(
    () => ({
      marginBottom: "20px",
    }),
    []
  );

  const ListGrid = useMemo(
    () => ({
      gutter: 4,
      xs: 2,
      md: 3,
    }),
    []
  );

  const ListDivStyle = useMemo(
    () => ({
      textAlign: "center",
      margin: "10px 0",
    }),
    []
  );

  const ListItemStyle = useMemo(
    () => ({
      marginTop: "20px",
    }),
    []
  );

  const dispatch = useDispatch();
  const unFollow = (id) => () => {
    if (header === "팔로잉 목록")
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    else if (header === "팔로워 목록") {
      console.log("팔로워 제거 기능");
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    }
  };

  return (
    <List
      style={ListStyle}
      grid={ListGrid}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={ListDivStyle}>
          <Button loading={loading} onClick={onClickMore}>
            더 보기
          </Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={ListItemStyle}>
          <Card
            actions={[<StopOutlined onClick={unFollow(item.id)} key="stop" />]}
          >
            <Card.Meta
              description={
                <Link href={`/user/${item.id}`}>
                  <a>{item.nickname}</a>
                </Link>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string,
  data: PropTypes.array,
  onClickMore: PropTypes.func,
  loading: PropTypes.bool,
};

export default FollowList;
