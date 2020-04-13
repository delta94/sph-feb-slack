import React from 'react';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions';
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
      privateMessagesRef: firebase.database().ref('privateMessages'),
      user: this.props.currentUser,
      currentChannel: this.props.currentChannel,
      messagesLoading: false,
      isChannelStarred: false,
      usersRef: firebase.database().ref('users'),
      messages: [],
      searchTerm: '',
      searchLoading: false,
      numUniqueUSers: '1 User',
      searchResults: [],
    }
  }

   static getDerivedStateFromProps(props, state) {
    
    if (props.currentChannel !== state.currentUser) {
      return {
        currentChannel: props.currentChannel,
        currentUser: props.currentUser
      };
    }
  }
  
  componentDidUpdate(oldProps) {
    const newProps = this.props
    if(oldProps.currentChannel !== newProps.currentChannel) {
      const { currentChannel, currentUser } = newProps;
      
      if (oldProps.currentChannel != null) {
        this.getMessagesRef().child(oldProps.currentChannel.id).off();
      }
      
      this.addListeners(currentChannel);
      this.addUserStarsListener(currentChannel, currentUser);
    }
  }

  handleStar = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), ()=> this.starChannel());
  }

  starChannel = () => {
    
    if (this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .update({
          [this.state.currentChannel.id]: {
            name: this.state.currentChannel.name,
            details: this.state.currentChannel.details,
            createdBy: {
              name: this.state.currentChannel.createdBy.name,
              avatar: this.state.currentChannel.createdBy.avatar
            }
          }
        });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.currentChannel.id)
        .remove(err => {
          if (err !== null ) {
            console.log(err);
          }
        })
    }
  }

  addListeners = channel => {
    this.addMessageListener(channel);
  }

  addMessageListener = channel => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    this.setState({ messagesLoading: true, messages: [] });
    ref.child(channel.id).on("child_added", snap =>{
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
  }

  addUserStarsListener = (channel, user) => {
    this.state.usersRef
      .child(user.uid)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channel.id);

          this.setState({ isChannelStarred: prevStarred });
        }
      })
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef } = this.state;
    const { isPrivateChannel } = this.props;

    return isPrivateChannel ? privateMessagesRef : messagesRef;
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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      }  else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
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

  displayChannelName = (channel, isPrivateChannel) => {
    const symbol = isPrivateChannel ? '@' : '#';
    return channel ? `${symbol}${channel.name}` : '';
  }

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
          && (message.content.match(regex) 
              || message.user.name.match(regex))
        ) {
        acc.push(message);
      }

      return acc;
    },[]);

    this.setState({ searchResults });
  }

  render() {
    const { messagesRef, messages, numUniqueUSers, searchTerm, searchResults, isChannelStarred } = this.state;
    const { currentChannel, currentUser, isPrivateChannel } = this.props;
    
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <MessagesHeader 
          channelName={this.displayChannelName(currentChannel, isPrivateChannel)}
          numUniqueUSers={numUniqueUSers}
          isPrivateChannel={isPrivateChannel}
          handleSearchChange={this.handleSearchChange}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment style={{ flex: 1 }}>
          <Comment.Group 
            className="messages" 
            style={{ maxWidth: "100%" }}
          >
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
          isPrivateChannel={isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </div>
    )
  }
}

export default connect(null, { setUserPosts })(Messages);