import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Menu, Icon } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

class DirectMessages extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      activeChannel: '',
      usersRef: firebase.database().ref('users'),
      user: this.props.currentUser,
      users: [],
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence')
    }
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userId => {

    this.state.usersRef.on('child_added', snap => {
      if (userId !== snap.key) {
        let user = snap.val();

        user['uid'] = snap.key;
        user['status'] = 'offline';
        
        let joined = this.state.users.concat(user);
        this.setState({ users: joined })
      }
    });

    this.state.connectedRef.on('value', snap =>{
      if (snap.value === true) {
        const ref = this.state.presenceRef.child(userId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
          }
        })
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if (userId !== snap.key) {
        this.addStatusToUser(snap.key, false)
      }
    })
  }

  addStatusToUser = (userId, connected= true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${ connected ? 'online' : 'false' }`;
      }
      return acc.concat(user);
    }, []);

    this.setState({ users: updatedUsers });
  }

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };

    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  }

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId });
  }

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;

    return userId < currentUserId 
           ? `${userId}/${currentUserId}`
           : `${currentUserId}/${userId}`;
  }

  render() {
    const { users, activeChannel } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{' '}
          ({ users.length })
        </Menu.Item>
        {
          users.map(user => (
            <Menu.Item
              key={user.uid}
              active={user.uid === activeChannel}
              onClick={() => this.changeChannel(user)}
              style={{ opacity: 0.7, fontStyle: 'italic' }}
            >
            @ { user.name }
            <Icon 
              name="circle"
              color={ user.status === 'online' ? 'green' : 'red'}
            />
           </Menu.Item>
          ))
        }
      </Menu.Menu>
    )
  }
}

export default connect(
  null,
  {setCurrentChannel, setPrivateChannel}
)(DirectMessages);