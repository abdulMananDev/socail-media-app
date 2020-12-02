import React, { useState, useReducer, useEffect } from "react";
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
import CreatePost from "./components/CreatePost";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessage from "./components/FlashMessage";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";

// Importing Context from ExampleContext component
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

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
    isSearchOpen: false
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
            <Route path="/profile/:username" exact>
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
          <Footer />

          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
