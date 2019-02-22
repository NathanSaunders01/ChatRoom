import React from "react";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { body: "" };
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    App.cable.subscriptions.subscriptions[0].speak({
      user: this.props.user,
      message: this.state.body
    });
    this.setState({ body: "" });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            value={this.state.body}
            onChange={this.update("body")}
            placeholder="Type message here"
            className="message-input"
          />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default MessageForm;
