import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Message from './Message.jsx'

class MessageList extends Component {




  componentDidUpdate() {
    this.messagesEnd.scrollIntoView();
  }

  render() {
    console.log('Rendering <MessageList />');

    return (
      <main className="messages">
        {
          this.props.messages.map((message) => {
            return(
              <Message username={message.username} color={message.clientColor} content={message.content} key={message.id}/>
            )
          })
        }
        {this.props.oldName &&
          <div className="message system" ref={(el) => { this.messagesEnd = el; }}>
             {this.props.oldName} changed their name to {this.props.newName}
          </div>
        }
        <div ref={(el) => { this.messagesEnd = el; }}></div>
      </main>
    );
  }
}
export default MessageList;