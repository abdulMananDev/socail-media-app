import React, { useEffect, useContext, useCallback } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import DispatchContext from "../DispatchContext";

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: true,
      checkCount: 0
    },
    email: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: true,
      checkCount: 0
    },
    password: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: true,
      checkCount: 0
    },
    submitCount: 0
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameInstant":
        draft.username.value = action.value;
        draft.username.hasError = false;
        if (draft.username.value.length > 25) {
          draft.username.hasError = true;
          draft.username.errorMessage =
            "Username must only be 25 characters Long!! ";
        }
        if (
          draft.username.value &&
          !/^[a-zA-Z0-9]+$/.test(draft.username.value)
        ) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Invalid Character Input in Username";
        }
        return;
      case "usernameDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasError = true;
          draft.username.errorMessage =
            "Username must be atleast 3 characters Long!! ";
        }
        if (!draft.username.hasError && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "isUsernameUnique":
        if (action.value) {
          draft.username.hasError = true;
          draft.username.isUnique = false;
          draft.username.errorMessage = "Username is taken";
        } else {
          draft.username.isUnique = true;
        }
      case "emailInstant":
        draft.email.value = action.value;
        draft.email.hasError = false;
        // if (!draft.email.value) {
        //   draft.email.hasError = true;
        //   draft.email.errorMessage = "Email Length Can't be Zero";
        // }

        return;
      case "emailDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasError = true;
          draft.email.errorMessage = "Email must be a valid One";
        }
        if (!draft.email.hasError && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;
      case "isUsernameUnique":
        if (action.value) {
          draft.username.hasError = true;
          draft.username.isUnique = false;
          draft.username.errorMessage = "email is taken";
        } else {
          draft.username.isUnique = true;
        }
        return;

      case "passwordInstant":
        draft.password.value = action.value;
        draft.password.hasError = false;
        if (draft.password.value.length > 50) {
          draft.password.hasError = true;
          draft.password.errorMessage = "We care about Your Privacy!!";
        }
        return;
      case "passwordDelay":
        if (draft.password.value.length < 8) {
          draft.password.hasError = true;
          draft.password.errorMessage =
            "Password must be atleast 8 characters Long!! ";
        }
        return;
      case "submitForm":
        if (
          !draft.username.hasError &&
          draft.username.isUnique &&
          !draft.email.hasError &&
          draft.email.isUnique &&
          !draft.password.hasError
        ) {
          draft.submitCount++;
          console.log("here");
        }
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch({ type: "usernameInstant", value: state.username.value });
    dispatch({
      type: "usernameDelay",
      value: state.username.value,
      noRequest: true
    });

    dispatch({ type: "emailInstant", value: state.email.value });
    dispatch({ type: "emailDelay", value: state.email.value, noRequest: true });

    dispatch({ type: "passwordInstant", value: state.password.value });
    dispatch({ type: "passwordDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  };
  // for username
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "usernameDelay" });
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const request = Axios.CancelToken.source();

      // we give it to request below
      // cancelling the previous request if undergoing
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesUsernameExist",
            { username: state.username.value },
            { cancelToken: request.token }
          );
          dispatch({ type: "isUsernameUnique", value: response.data });
        } catch (e) {
          e.response;
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.username.checkCount]);
  // for email
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailDelay" });
      }, 1600);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.email.checkCount) {
      const request = Axios.CancelToken.source();

      // we give it to request below
      // cancelling the previous request if undergoing
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToken: request.token }
          );
          dispatch({ type: "isEmailUnique", value: response.data });
        } catch (e) {
          e.response;
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.email.checkCount]);
  // for password
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordDelay" });
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  // for submit axios Request
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();

      // we give it to request below
      // cancelling the previous request if undergoing
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value
            },
            { cancelToken: request.token }
          );
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessages",
            value: "Welcome to Your Writing World!!"
          });
        } catch (e) {
          e.response;
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.submitCount]);

  return (
    <>
      <Page title="Home" wide={true}>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">Remember Writing</h1>
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
