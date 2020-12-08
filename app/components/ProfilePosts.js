import React, { useState, useEffect } from "react";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Post from "./Post";

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
        // taking in date for each element and formatting it
        return <Post post={post} key={post._id} noAuthor={true} />;
      })}
    </div>
  );
};
export default ProfilePosts;
