import React, {Component} from 'react';
import Dropzone from 'react-dropzone';

class ChatBar extends Component {

  constructor(props) {
    super(props);
    this.state = {files: []}
  }


  // handleSubmit = (event) => {
  //   if (event.key == 'Enter'){
  //     this.setState({userInput: this.input.value})
  //   }
  // }



  render() {
    // console.log('Rendering <ChatBar />');
    return (
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.currentUser.name || 'Anonymous'} onKeyPress={this.props.handleUserChange} placeholder="Your Name(Optional)"/>
        <input id="userInput" className="chatbar-message" ref={(input) => { this.textInput = input; }}
        onKeyPress={this.props.handleSubmit} placeholder="Type a message and hit ENTER" />
        <Dropzone activeClassName="dropzone-active" className ="dropzone" onDrop={this.props.onDrop}>
          <div>Try dropping an image here, or click to select image to upload.</div>
        </Dropzone>
        {this.state.files[0] && <img src={this.state.files[0].preview} />}
      </footer>
    );
  }

}
export default ChatBar;

