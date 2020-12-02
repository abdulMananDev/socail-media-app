import React, { useContext, useEffect } from "react";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Axios from "axios";
import { Link, useParams, withRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import NotFound from "./NotFound";

const EditPost = props => {
  // useing state and dispatch context to get token data from MAin Reducer and set the flash message
  // respt.
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  // Axios terminate token.call()
  const terminateRequest = Axios.CancelToken.source();
  // state-initialization.
  // imagine doing this with useState.
  const originalState = {
    title: {
      value: "",
      hasError: false,
      errorMessage: ""
    },
    body: {
      value: "",
      hasError: false,
      errorMessage: ""
    },
    isFetching: true,
    isSaving: true,
    id: useParams().id, //=== const {id} = useParams();
    sendCount: false,
    serverError: false
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchPost":
        draft.isFetching = false;
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        return;

      case "titleChange":
        draft.title.value = action.value;
        return;

      case "bodyChange":
        draft.body.value = action.value;
        break;

      case "saveUpdatedPost":
        draft.sendCount = true;
        break;

      case "startUpdateRequest":
        draft.isSaving = false;
        return;

      case "finishUpdateRequest":
        draft.isSaving = true;
        return;

      case "errorCheckerBody":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.errorMessage = `Post Without Body!!`;
        } else {
          draft.body.hasError = false;
          draft.body.errorMessage = null;
        }
        return;
      case "errorCheckerTitle":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.errorMessage = `Post Without Title!!`;
        } else {
          draft.title.hasError = false;
          draft.title.errorMessage = null;
        }
        return;
      case "serverError":
        draft.serverError = true;
    }
  };
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  // Reducer logic ends

  // useEffect for Fetch
  useEffect(async () => {
    try {
      const response = await Axios.get(`/post/${state.id}`, {
        cancelToken: terminateRequest.token
      });
      if (response.data) {
        dispatch({ type: "fetchPost", value: response.data });
        // Redirection with withRouter.
        if (appState.user.username != response.data.author.username) {
          props.history.push("/");
          appDispatch({
            type: "flashMessages",
            value: "Not Your Writing Playground"
          });
        }
      } else dispatch({ type: "serverError" });
    } catch (e) {
      console.log(e.response.data);
    }
    return () => {
      terminateRequest.cancel();
    };
  }, []);
  // UseEffect for saving updated-post to db
  useEffect(async () => {
    if (state.sendCount) {
      const data = {
        title: state.title.value,
        body: state.body.value,
        token: appState.user.token
      };
      try {
        dispatch({ type: "startUpdateRequest" });
        await Axios.post(`/post/${state.id}/edit`, data, {
          cancelToken: terminateRequest.token
        });
        dispatch({ type: "finishUpdateRequest" });
        appDispatch({ type: "flashMessages", value: "Post Updated" });
      } catch (e) {
        console.log(e);
      }
      return () => {
        terminateRequest.cancel();
      };
    }
  }, [state.sendCount]);

  // Handle Form
  const updatePost = e => {
    e.preventDefault();
    state.title.hasError || state.body.hasError
      ? appDispatch({ type: "flashMessages", value: `Incomplete Idea!!` })
      : dispatch({ type: "saveUpdatedPost" });
  };
  if (state.serverError) {
    return <NotFound />;
  }
  return (
    <Page title="Edit Post">
      <Link className="medium font-weight-bold" to={`/post/${state.id}`}>
        &laquo; {`${" "}View ${state.title.value}`}
      </Link>
      <form onSubmit={updatePost}>
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
            onBlur={e =>
              dispatch({ type: "errorCheckerTitle", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            value={state.title.value}
          />
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.errorMessage}
            </div>
          )}
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
            onBlur={e =>
              dispatch({ type: "errorCheckerBody", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            value={state.body.value}
          />
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.errorMessage}
            </div>
          )}
        </div>

        <button className="btn btn-primary">
          {!state.isSaving ? <LoadingDotsIcon /> : "Update Post"}
        </button>
      </form>
    </Page>
  );
};
export default withRouter(EditPost);
