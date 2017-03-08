import React, {Component} from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  // handleSubmit = (event) => {
  //   if (event.key == 'Enter'){
  //     this.setState({userInput: this.input.value})
  //   }
  // }

  render() {
    console.log('Rendering <ChatBar />');
    return (
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.currentUser.name || 'Anonymous'} onKeyPress={this.props.handleUserChange} placeholder="Your Name(Optional)"/>
        <input id="userInput" className="chatbar-message" ref={(input) => { this.textInput = input; }}
        onKeyPress={this.props.handleSubmit} placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }

}
export default ChatBar;
