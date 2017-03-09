import React, {Component} from 'react';

class Message extends Component {
  render() {
    console.log('Rendering <Message />');
    return (
        <div className="message">
          <span style={{color: this.props.color}} className="message-username">{this.props.username}</span>

          {(isURL(this.props.content) && checkURL(this.props.content) || checkURLBlob(this.props.content))
          && <span className="message-content"><img className="image" src={this.props.content}/></span>}

          {((!isURL(this.props.content) || !checkURL(this.props.content)) && !checkURLBlob(this.props.content))
          && <span className="message-content">{this.props.content}</span>}

        </div>
    );
  }
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function checkURLBlob(url) {
    return(url.match("blob:http://") != null);
}




export default Message;