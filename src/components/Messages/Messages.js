import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import Message from './Message';
import firebase from '../../firebase';
import MessagesForm from './MessagesForm';
import MessagesHeader from './MessagesHeader';

class Messages extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      messagesRef: firebase.database().ref('messages'),
      user: this.props.currentUser,
      channel: this.props.currentChannel,
      messagesLoading: false,
      messages: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentChannel, currentUser } = nextProps;

    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.setState({ messagesLoading: true })
    
    this.state.messagesRef.child(channelId).on("child_added", snap =>{
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  }

  displayMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message 
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ))
  )

  render() {
    const { messagesRef, messages } = this.state;
    const { currentChannel, currentUser } = this.props;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <MessagesHeader />

        <Segment style={{ flex: 1 }}>
          <Comment.Group className="messages" style={{ maxWidth: "100%" }}>
            { this.displayMessages(messages) }
          </Comment.Group>
        </Segment>

        <MessagesForm 
          messagesRef={messagesRef} 
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </div>
    )
  }
}

export default Messages;