import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
import uuid from 'node-uuid'

class App extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const chattySocket = new WebSocket("ws://localhost:4000");
    this.socket = chattySocket;
    console.log(this.state.messages)
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type){
      case 'incomingMessage':
        delete data.type;
        const newMsgArr = this.state.messages.concat(data);
        this.setState({messages: newMsgArr});
        break;
      case 'incomingNotification':
        this.setState({oldName: data.name})
        break;
      default:
        throw new Error("Unknown event type " + data.type);
    }
    }
  }



  handleSubmit = (event) => {
    // this.setState({userInput: event.target.value})
    if (event.key == 'Enter' && event.target.value.length > 0){
      const newMessage = {type: 'postMessage', id: uuid.v1(), username: this.state.currentUser.name, content: event.target.value};
      this.socket.send(JSON.stringify(newMessage));
      event.target.value = "";
    }
  }

  handleUserChange = (event) => {
    if(event.key == 'Enter' && event.target.value.length > 0){
      const newNotification = {type: 'postNotification', name: this.state.currentUser.name}
      this.socket.send(JSON.stringify(newNotification));
      this.setState({currentUser: {name: event.target.value}})
    }
  }


  render() {
    console.log('Rendering <App />');
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList currentUser={this.state.currentUser} oldName={this.state.oldName} messages={this.state.messages}/>
        <ChatBar handleSubmit={this.handleSubmit} handleUserChange={this.handleUserChange} currentUser={this.state.currentUser} />
      </div>
    );
  }
}
export default App;
