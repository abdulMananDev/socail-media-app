import React from "react";

import { Link } from "react-router-dom";

const Post = props => {
  const post = props.post;
  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  return (
    <>
      <Link
        key={post._id}
        to={`/post/${post._id}`}
        className="list-group-item list-group-item-action"
        onClick={props.onClick}
      >
        <img className="avatar-tiny" src={post.author.avatar} />{" "}
        <strong>{post.title}</strong>{" "}
        <span className="text-muted small">
          {!props.noAuthor && <>by {post.author.username} </>} on{" "}
          {dateFormatted}
        </span>
      </Link>
    </>
  );
};
export default Post;
