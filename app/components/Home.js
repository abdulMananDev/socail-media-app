import React, { useContext, useEffect } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import Axios from "axios";
import { useImmer } from "use-immer";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

import { Link } from "react-router-dom";

const Home = () => {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    loading: true,
    feed: []
  });
  useEffect(() => {
    async function followingData() {
      try {
        const response = await Axios.post(`/getHomeFeed`, {
          token: appState.user.token
        });

        setState(draft => {
          draft.loading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        e.response;
      }
    }
    followingData();
  }, []);
  // function changeToDate(date) {
  //   const reqDate = new Date(date);

  //   let dateObj = {
  //     day: reqDate.getDate(),
  //     month: reqDate.getMonth() + 1,
  //     year: reqDate.getFullYear()
  //   };
  //   return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
  // }
  if (state.loading == true) return <LoadingDotsIcon />;

  return (
    <Page title="Home">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
          {state.feed.map(post => {
            return <Post post={post} />;
          })}
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 class="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p class="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
};
export default Home;
