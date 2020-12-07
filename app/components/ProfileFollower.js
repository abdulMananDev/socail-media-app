import React, { useState, useEffect } from "react";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

import { useParams, Link } from "react-router-dom";

function ProfileFollower(props) {
  const { username } = useParams();

  const [postData, setPostData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const requestTerminate = Axios.CancelToken.source();
    async function postData() {
      try {
        const response = await Axios.get(
          `/profile/${username}/${props.action}`
        );
        setPostData(response.data);
        setLoading(false);
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
  }, [props.action]);

  if (isLoading)
    return (
      <>
        <LoadingDotsIcon />
      </>
    );
  return (
    <div className="list-group">
      {postData.map((foll, index) => {
        // taking in date for each element and formatting it
        return (
          <Link
            key={index}
            to={`/profile/${foll.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={foll.avatar} /> {foll.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollower;
