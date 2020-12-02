import Axios from "axios";
import React, { useContext, useState } from "react";
import DispatchContext from "../DispatchContext";

const HeaderLoggedOut = props => {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async e => {
    e.preventDefault();
    const userLoginDetails = {
      username,
      password
    };
    try {
      const response = await Axios.post("/login", userLoginDetails);
      if (response.data) {
        console.log(response.data);

        appDispatch({ type: "login", data: response.data });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };
  return (
    <form onSubmit={handleLogin} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};
export default HeaderLoggedOut;
