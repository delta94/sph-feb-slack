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
      messages: [],
      searchTerm: '',
      searchLoading: false,
      numUniqueUSers: 'Loading...',
      searchResults: []
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

      this.countUniqueUsers(loadedMessages);
    });
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc ,message) =>{
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc;
    },[]);
  
    const plural = uniqueUsers.length > 1 ? 'Users' : 'User';
    const numUniqueUSers = `${uniqueUsers.length} ${plural}`;

    this.setState({ numUniqueUSers })
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

  displayChannelName = channel => channel ? `#${channel.name}` : '';

  handleSearchChange = e => {
    this.setState({
      searchTerm: e.target.value,
      searchLoading: true
    }, () => this.handleSearchMessage());
  }

  handleSearchMessage = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) =>{
      if (
          message.content 
          && message.content.match(regex) 
          || message.user.name.match(regex)
        ) {
        acc.push(message);
      }

      return acc;
    },[]);

    this.setState({ searchResults });
  }

  render() {
    const { messagesRef, messages, numUniqueUSers, searchTerm, searchResults } = this.state;
    const { currentChannel, currentUser } = this.props;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <MessagesHeader 
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUSers={numUniqueUSers}
          handleSearchChange={this.handleSearchChange}
        />

        <Segment style={{ flex: 1 }}>
          <Comment.Group className="messages" style={{ maxWidth: "100%" }}>
            { 
              searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages) 
            }
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