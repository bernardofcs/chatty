import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
import uuid from 'node-uuid'

class App extends Component {
  constructor(props) {
    super(props);
    this.state =
    {
      currentUser: {}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      connectedUsers: 0
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const chattySocket = new WebSocket("ws://localhost:4000");
    this.socket = chattySocket;
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type){
      case 'ownConnection':
        console.log(data)
        this.setState({userId: data.userId})
        break;
      case 'incomingMessage':
        delete data.type;
        const newMsgArr = this.state.messages.concat(data);
        this.setState({messages: newMsgArr});
        break;
      case 'incomingNotification':
        this.setState({oldName: data.oldName, newName: data.newName})
        break;
      case 'incomingConnection':
        this.setState({connectedUsers: data.clientsConnected, currentUser: {name: 'Anonymous'}});
        break;
      case 'incomingDisconnection':
        this.setState({connectedUsers: data.clientsConnected});
        break;
      default:
        throw new Error("Unknown event type " + data.type);
    }
    }
  }


  handleSubmit = (event) => {
    // this.setState({userInput: event.target.value})
    if (event.key == 'Enter' && event.target.value.length > 0){
      const newMessage = {type: 'postMessage', userId: this.state.userId, id: uuid.v1(), username: this.state.currentUser.name, content: event.target.value};
      this.socket.send(JSON.stringify(newMessage));
      event.target.value = "";
    }
  }

  handleUserChange = (event) => {
    if(event.key == 'Enter' && event.target.value.length > 0){
      const newNotification = {type: 'postNotification', oldName: this.state.currentUser.name, newName: event.target.value}
      this.socket.send(JSON.stringify(newNotification));
      this.setState({currentUser: {name: event.target.value}})
    }
  }


  render() {
    console.log('Rendering <App />');
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a><div className="navbar-users">{this.state.connectedUsers} users connected</div>
        </nav>
        <MessageList userColor={this.state.userColor} currentUser={this.state.currentUser} oldName={this.state.oldName} newName={this.state.newName} messages={this.state.messages}/>
        <ChatBar handleSubmit={this.handleSubmit} handleUserChange={this.handleUserChange} currentUser={this.state.currentUser} />
      </div>
    );
  }
}
export default App;
