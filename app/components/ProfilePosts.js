import React, { useState, useEffect } from "react";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ProfilePosts = () => {
  const { username } = useParams();

  const [postData, setPostData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const requestTerminate = Axios.CancelToken.source();
    async function postData() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: requestTerminate.token
        });
        setPostData(response.data);
        setLoading(false);

        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
    postData();
    return (
      // return returns fucntions or variables defined above it; we cannot define something into Return

      () => {
        requestTerminate.cancel();
      }
    );
  }, [username]);

  if (isLoading)
    return (
      <>
        <LoadingDotsIcon />
      </>
    );
  return (
    <div className="list-group">
      {postData.map(post => {
        const date = new Date(post.createdDate);
        const dateFormatted = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        // taking in date for each element and formatting it
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>
            {"   "}
            <span className="text-muted small">{dateFormatted}</span>
          </Link>
        );
      })}
    </div>
  );
};
export default ProfilePosts;
