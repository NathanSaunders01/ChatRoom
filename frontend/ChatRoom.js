import React from "react";
import MessageForm from "./MessageForm.js";
import dateFormat from "dateformat";
import Cookies from "js-cookie";

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], user: "", hasAccount: false };
    this.bottom = React.createRef();
  }

  componentDidMount() {
    const user = Cookies.get("chat_user");

    this.setState({
      user: user ? user : "",
      hasAccount: user ? true : false
    });
    console.log(user);

    App.cable.subscriptions.create(
      { channel: "ChatChannel" },
      {
        received: data => {
          switch (data.type) {
            case "message":
              this.setState({
                messages: this.state.messages.concat(data.message)
              });
              break;
            case "messages":
              this.setState({
                messages: data.messages
              });
              break;
          }
        },
        speak: function(data) {
          return this.perform("speak", data);
        },
        load: function() {
          return this.perform("load");
        }
      }
    );
  }

  loadChat(e) {
    e.preventDefault();
    App.cable.subscriptions.subscriptions[0].load();
  }

  componentDidUpdate() {
    if (this.state.messages.length > 0) {
      this.bottom.current.scrollIntoView();
    }
  }

  handleSubmitUsername = () => {
    if (this.state.user.length === 0) return false;
    const { user } = this.state;
    Cookies.set("chat_user", user, { expires: 7 });
    this.setState({
      hasAccount: true
    });
  };

  handleUserChange = e => {
    const val = e.target.value;
    this.setState({
      user: val
    });
  };

  render() {
    let content = (
      <div className="username-container">
        <h4>Enter your username:</h4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <form onSubmit={this.handleSubmitUsername}>
            <input
              type="text"
              value={this.state.user}
              placeholder="Username"
              className="username-input"
              onChange={this.handleUserChange}
            />
            <input
              type="submit"
              onClick={this.handleSubmitUsername}
              className="username-submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    );

    if (this.state.hasAccount) {
      content = (
        <div>
          <div style={{ paddingBottom: "10px" }}>ChatRoom</div>
          <button className="load-button" onClick={this.loadChat.bind(this)}>
            Load Chat History
          </button>
          <div className="message-list">
            {this.state.messages.map((message, idx) => {
              console.log(message);
              return (
                <li key={message.id} className="message-line">
                  <span>{message.body}</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      alignSelf: "flex-end",
                      marginLeft: "6px"
                    }}
                  >
                    ({message.user === this.state.user ? "You" : message.user})
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    {dateFormat(message.created_at, "h:MM TT")}
                  </span>
                  <div ref={this.bottom} />
                </li>
              );
            })}
          </div>
          <MessageForm user={this.state.user} />
        </div>
      );
    }

    return <div className="chatroom-container">{content}</div>;
  }
}

export default ChatRoom;
