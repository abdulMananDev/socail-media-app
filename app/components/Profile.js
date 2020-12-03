import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

import { useParams } from "react-router-dom";
import StateContext from "../StateContext";

import { useImmer } from "use-immer";
import Axios from "axios";

const Profile = () => {
  const { username } = useParams();

  const appState = useContext(StateContext);

  const [state, setState] = useImmer({
    followRequestLoading: false,
    setFollowingCount: 0,
    stopFollowingCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar:
        "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png",
      isFollowing: false,
      counts: {
        postCount: "",
        followerCount: "",
        followingCount: ""
      }
    }
  });

  function startFollowing() {
    setState(draft => {
      draft.setFollowingCount++;
    });
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingCount++;
    });
  }
  useEffect(() => {
    if (state.setFollowingCount > 0) {
      setState(draft => {
        draft.followRequestLoading = true;
      });

      async function followingData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token
            }
          );

          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followRequestLoading = false;
          });
        } catch (e) {
          console.log("hex  x 0000*FE");
        }
      }
      followingData();
    }
  }, [state.setFollowingCount]);

  useEffect(() => {
    if (state.stopFollowingCount > 0) {
      setState(draft => {
        draft.followRequestLoading = true;
      });

      async function followingData() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token
            }
          );

          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followRequestLoading = false;
          });
        } catch (e) {
          console.log("hex  x 0000*FE");
        }
      }
      followingData();
    }
  }, [state.stopFollowingCount]);

  useEffect(async () => {
    try {
      const response = await Axios.post(`/profile/${username}`, {
        token: appState.user.token
      });

      setState(draft => {
        draft.profileData = response.data;
      });
    } catch (e) {
      console.log("hex  x 0000*FE");
    }
  }, [username]);
  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followRequestLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followRequestLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Post Count {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
};
export default Profile;
