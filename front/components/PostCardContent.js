import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const PostCardContent = ({ postData }) => {
  //"첫 번째 게시글 #해시태그 #익스프레스",

  return (
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
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
