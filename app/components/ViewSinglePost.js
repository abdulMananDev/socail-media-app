import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

import Axios from "axios";
import { Link, useParams, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactTootip from "react-tooltip";
import NotFound from "./NotFound";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const ViewSinglePost = props => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const terminateRequest = Axios.CancelToken.source();
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // date-modifier
  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  useEffect(async () => {
    try {
      const response = await Axios.get(`/post/${id}`, {
        cancelToken: terminateRequest.token
      });
      setPost(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e.response.data);
    }
    return () => {
      terminateRequest.cancel();
    };
  }, [id]);

  // handling post-delete
  async function handleDelete() {
    const confirmation = window.confirm(
      "Do you really wanna delete the post??!!"
    );
    if (confirmation) {
      try {
        const response = await Axios({
          url: `/post/${id}`,
          data: { token: appState.user.token },
          method: "delete"
        });
        if (response.data == "Success") {
          appDispatch({
            type: "flashMessages",
            value: `${post.title} was deleted`
          });
          // Redirection to users
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  // isloading is the placeholde for time in sync request without it rewuest won't work
  if (isLoading) {
    return <LoadingDotsIcon />;
  }
  if (!isLoading && !post) {
    return <NotFound />;
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link
            to={`/post/${post._id}/edit`}
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </Link>
          {/* React tootip  */}
          <ReactTootip id="edit" className="custom-tooltip" />{" "}
          <Link
            onClick={handleDelete}
            data-tip="Delete"
            data-for="delete"
            className="delete-post-button text-danger"
            to={`/profile/${post.author.username}`}
          >
            <i className="fas fa-trash"></i>
          </Link>
          <ReactTootip id="delete" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img className="avatar-tiny" src={post.author.avatar} />
        </a>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        {/* React Markdown */}
        <ReactMarkdown
          source={post.body}
          // allowedTypes={[
          //   "paragraph",
          //   "strong",
          //   "heading",
          //   "list",
          //   "listItem",
          //   "emphasis"
          // ]}
        />
      </div>
    </Page>
  );
};
export default withRouter(ViewSinglePost);
