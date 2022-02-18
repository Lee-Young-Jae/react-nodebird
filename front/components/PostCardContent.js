import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Button, Input } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const PostCardContent = ({
  postData,
  editMode,
  onCancleUpdate,
  onChangePost,
}) => {
  //"첫 번째 게시글 #해시태그 #익스프레스",

  const [editText, setEditText] = useState(postData);

  const { updatePostLoading } = useSelector((state) => state.post);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  }, []);

  return (
    <>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText}></TextArea>
          <Button.Group style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onCancleUpdate}>취소</Button>
            <Button
              type="primary"
              loading={updatePostLoading}
              onClick={onChangePost(editText)}
            >
              수정
            </Button>
          </Button.Group>
        </>
      ) : (
        <div>
          {postData.split(/(#[^#\s]+)/g).map((item, index) => {
            if (item[0] === "#") {
              // if ( item.match(/(#[^#\s]+)/) )
              return (
                <Link key={item + index} href={`/hashtag/${item.slice(1)}`}>
                  {/* #을 떼기 위해 slice(1)*/}
                  <a>{item}</a>
                </Link>
              );
            }
            return item;
          })}
        </div>
      )}
    </>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onCancleUpdate: PropTypes.func,
  onChangePost: PropTypes.func,
};

// PostCardContent.defaultProps = {
//   //is required 가 아닐경우 이렇게 추가해주는것이 좋음
//   // editMode: false,
// };

export default PostCardContent;
