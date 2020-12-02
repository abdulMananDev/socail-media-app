import Page from "./Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";

import React, { useState, useContext } from "react";
import DispatchContext from "../DispatchContext";

const CreatePost = props => {
  const appDispatch = useContext(DispatchContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handlePostSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const post = {
      token,
      title,
      body
    };
    try {
      const response = await Axios.post(`/create-post`, post);
      // setting up flash messages
      appDispatch({
        type: "flashMessages",
        value: `Hey!! it's an Amazing Post!!`
      });
      //   Redirect to new post URL
      props.history.push(`/post/${response.data}`);
      setBody("");
      setTitle("");
    } catch (e) {
      console.log(e.response.data);
    }
  };
  return (
    <Page title="Create Post">
      <form onSubmit={handlePostSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={e => setBody(e.target.value)}
            value={body}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};
export default withRouter(CreatePost);
