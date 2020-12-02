import React, { useState } from "react";
import Page from "./Page";
import Axios from "axios";

const HomeGuest = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    const user = {
      username,
      email,
      password
    };
    // TRY Catch for axios
    try {
      await Axios.post("/register", user);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (e) {
      e.response.data;
      // data
    }
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
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                />
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
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
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
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
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
