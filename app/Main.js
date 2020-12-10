import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

// My Components
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import Terms from "./components/Terms";

import FlashMessage from "./components/FlashMessage";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
const Chat = React.lazy(() => import("./components/Chat"));

// Importing Context from ExampleContext component
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));

import LoadingDotsIcon from "./components/LoadingDotsIcon";

// setting base Url
Axios.defaults.baseURL = "http://localhost:8080";
// Main App/
function Main() {
  /*Using Reducer for mediating state.*/

  // = the initail state
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("avatar")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatMessages: 0
  };
  // = function
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessages":
        draft.flashMessages.push(action.value);
        break;
      case "openSearch":
        draft.isSearchOpen = true;
        break;
      case "closeSearch":
        draft.isSearchOpen = false;
        break;
      case "toggleChat":
        //for toggling
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "crossCloseChat":
        draft.isChatOpen = false;
        break;
      case "incrementUnreadMessages":
        draft.unreadChatMessages++;
        break;
      case "clearReadMessages":
        draft.unreadChatMessages = 0;
        break;
    }
  }

  // <Step-1

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.user.token);
      localStorage.setItem("username", state.user.username);
      localStorage.setItem("avatar", state.user.avatar);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      localStorage.removeItem("token");
    }
  }, [state.loggedIn]);

  // Token Age Check
  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();

      // we give it to request below
      // cancelling the previous request if undergoing
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: request.token }
          );
          console.log(response.data);
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashMessages", value: "Token-Expired" });
          }
        } catch (e) {
          e.response;
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, []);
  // </Step-1>

  // <step-2>

  /* Dispatch means like its name how to dispatch a change in state through different components
   any layers deep without disclosing 'how its done?'
   'How its done' meaning how the state is mutated is determined by the ourReducer( function )
   which keeps the logic mutatating the piece of state in the initialState object- which keeps
   track of the initail values just like in useState('')- we determine the initial state.*/

  // </step-2>

  /* UseCase-OF useReducer: In the value attribute of Context Component we can pass infinite state 
  pieces for differnt components without in typin */

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage flashMessages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>

              <Route path="/create-post" exact>
                <CreatePost />
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>

              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>

              <Route path="/about-us" exact>
                <About />
              </Route>

              <Route path="/terms" exact>
                <Terms />
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              {/* For any non-existant-path 
                This works perfectly fine.
                we pit this at the end of routes
            */}

              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <Footer />

          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            {/* div outside of suspense because of Css transition group- Removed form the Search  */}
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
