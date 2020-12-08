import React, { useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition, CSSTransitions } from "react-transition-group";

const HomeGuest = () => {
  const initialState = {
    username: {
      value: "",
      hasError: false,
      errorMessage: ""
    },
    email: {
      value: "",
      hasError: false,
      errorMessage: ""
    },
    password: {
      value: "",
      hasError: false,
      errorMessage: ""
    }
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameInstant":
        draft.username.value = action.value;
        draft.username.hasError = false;
        if (draft.username.value.length > 25) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username can be 25 characters Long!! ";
        }
        if (
          draft.username.value &&
          !/^[a-zA-Z0-9_]+$/.test(draft.username.value)
        ) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Invalid Character Input in Username";
        }
        return;
      case "usernameDelay":
        return;
      case "emailInstant":
        draft.email.value = action.value;
        draft.email.hasError = false;
        if (draft.email.value.length > 25) {
          draft.email.hasError = true;
          draft.email.errorMessage = "email can be 25 characters Long!! ";
        }
        return;
      case "emailDelay":
        return;
      case "passwordInstant":
        draft.password.value = action.value;
        draft.password.hasError = false;
        if (draft.password.value.length > 25) {
          draft.password.hasError = true;
          draft.password.errorMessage = "password can be 25 characters Long!! ";
        }

        return;
      case "passwordDelay":
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleSubmit = async e => {
    e.preventDefault();

    // TRY Catch for axios
  };
  return (
    <>
      <Page title="Home" wide={true}>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">Remember Writing?</h1>
            <p className="lead text-muted">
              Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
              posts that are reminiscent of the late 90&rsquo;s email forwards?
              We believe getting back to actually writing is the key to enjoying
              the internet again.
            </p>
          </div>
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input
                  id="username-register"
                  name="username"
                  className="form-control"
                  type="text"
                  placeholder="Pick a username"
                  autoComplete="off"
                  onChange={e =>
                    dispatch({ type: "usernameInstant", value: e.target.value })
                  }
                />
                <CSSTransition
                  in={state.username.hasError}
                  timeout={330}
                  classNames="liveValidateMessage"
                  unmountOnExit
                >
                  <div className="alert alert-danger small liveValidateMessage">
                    {state.username.errorMessage}
                  </div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input
                  id="email-register"
                  name="email"
                  className="form-control"
                  type="text"
                  placeholder="you@example.com"
                  autoComplete="off"
                  onChange={e =>
                    dispatch({
                      type: "emailInstant",
                      value: e.target.value
                    })
                  }
                />
                <CSSTransition
                  in={state.email.hasError}
                  timeout={330}
                  classNames="liveValidateMessage"
                  unmountOnExit
                >
                  <div className="alert alert-danger small liveValidateMessage">
                    {state.email.errorMessage}
                  </div>
                </CSSTransition>
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input
                  id="password-register"
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Create a password"
                  onChange={e =>
                    dispatch({
                      type: "passwordInstant",
                      value: e.target.value
                    })
                  }
                />
                <CSSTransition
                  in={state.password.hasError}
                  timeout={330}
                  classNames="liveValidateMessage"
                  unmountOnExit
                >
                  <div className="alert alert-danger small liveValidateMessage">
                    {state.password.errorMessage}
                  </div>
                </CSSTransition>
              </div>
              <button
                type="submit"
                className="py-3 mt-4 btn btn-lg btn-success btn-block"
              >
                Sign up for ComplexApp
              </button>
            </form>
          </div>
        </div>
      </Page>
    </>
  );
};
export default HomeGuest;
