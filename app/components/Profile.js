import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

import { useParams } from "react-router-dom";
import StateContext from "../StateContext";

import Axios from "axios";

const Profile = () => {
  const { username } = useParams();

  const appState = useContext(StateContext);

  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png",

    counts: {
      postCount: "",
      followerCount: "",
      followingCount: ""
    }
  });

  useEffect(async () => {
    try {
      const response = await Axios.post(`/profile/${username}`, {
        token: appState.user.token
      });

      setProfileData(response.data);
    } catch (e) {
      console.log("hex  x 0000*FE");
    }
  }, []);
  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
};
export default Profile;
