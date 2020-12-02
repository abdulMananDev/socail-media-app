import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoops, You Are Lost in the Space of Posts</h2>
        <p className="lead text-muted">
          Move to your <Link to="/">World</Link>
        </p>
      </div>
    </Page>
  );
};
export default NotFound;
