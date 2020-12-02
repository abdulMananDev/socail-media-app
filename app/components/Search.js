import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  useEffect(() => {
    document.addEventListener("keyup", searchKeyUp);
    return () => {
      document.removeEventListener("keyup", searchKeyUp);
    };
  }, []);
  // immer state - imtermediatory of state that is bewtween useState and useReduces; Multiple state initialization and usage..
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  });
  const handleChange = e => {
    const Searchvalue = e.target.value;
    setState(draft => {
      // dont return. as we dont want the change in the DOM.
      draft.searchTerm = Searchvalue;
    });
  };
  useEffect(() => {
    const typingDelay = setTimeout(() => {
      setState(draft => {
        draft.requestCount++;
      });
      // console.log(state.searchTerm);
    }, 500);
    // cand=ceeling the previos timeout fom this thing./
    // After there is  a pause in typing ,
    // when the user types in again the the clean up will
    // clean th previos timeout.thats thing we type only occurs
    // after the desired time.
    return () => {
      clearTimeout(typingDelay);
    };
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const request = Axios.CancelToken.source();

      // we give it to request below
      // cancelling the previous request if undergoing
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: request.token }
          );
          console.log(response.data);
          setState(draft => {
            draft.results = response.data;
          });
        } catch (e) {
          e.response;
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.requestCount]);

  function searchKeyUp(e) {
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  }
  function changeToDate(date) {
    const reqDate = new Date(date);

    let dateObj = {
      day: reqDate.getDate(),
      month: reqDate.getMonth() + 1,
      year: reqDate.getFullYear()
    };
    return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
  }
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleChange}
          />

          <span
            onClick={() => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> {state.results.length} items
                found
              </div>
              {state.results.map(post => {
                return (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="list-group-item list-group-item-action"
                    onClick={() => appDispatch({ type: "closeSearch" })}
                  >
                    <img className="avatar-tiny" src={post.author.avatar} />{" "}
                    <strong>{post.title}</strong>{" "}
                    <span className="text-muted small">
                      {`by ${post.author.username} on`}{" "}
                      {changeToDate(post.createdDate)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
