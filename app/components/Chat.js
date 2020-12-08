import React, { useContext, useRef, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:8080");
console.log(socket.emit());
console.log(socket.on());
const Chat = () => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const beToLatest = useRef(null);

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });
  const chatField = useRef(null);

  console.log(state.chatMessages);
  const handleChange = e => {
    const chat = e.target.value;

    setState(draft => {
      draft.fieldValue = chat;
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    console.log(state.fieldValue);
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token
    });

    setState(draft => {
      draft.chatMessages.push({
        message: state.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar
      });

      draft.fieldValue = "";
    });
  };
  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearReadMessages" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    console.log("here");
    socket.on("chatFromServer", msg => {
      console.log("here");
      setState(draft => {
        console.log(draft);
        draft.chatMessages.push(msg);
      });
    });
  }, []);

  // Use effect for scrolling to the latest message impreatively using useRef hook
  useEffect(() => {
    beToLatest.current.scrollTop = beToLatest.current.scrollHeight;
    /*The scrollTop property sets or returns the number of pixels- 
     an element's content is scrolled vertically.*/
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadMessages" });
    }
  }, [state.chatMessages]);

  return (
    <div
      id="chat-wrapper"
      className={`chat-wrapper  shadow border-top border-left border-right ${
        appState.isChatOpen ? "chat-wrapper--is-visible" : " "
      } `}
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: "crossCloseChat" })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={beToLatest}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          } else {
            return (
              <div key={index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img
                    className="avatar-tiny"
                    src={message.avatar}
                    alt="test"
                  />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          ref={chatField}
          value={state.fieldValue}
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          onChange={handleChange}
        />
      </form>
    </div>
  );
};
export default Chat;
