import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

class Starred extends React.Component {
  
  state = {
    activeChannel: '',
    usersRef: firebase.database().ref('users'),
    user: this.props.currentUser,
    starredChannels: []
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userId => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_added', snap=> {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          starredChannels: [...this.state.starredChannels, starredChannel]
        });
      });

     this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_removed', snap=> {
        const channelRemoved = { id: snap.key, ...snap.val() };
        const filterChannels = this.state.starredChannels.filter(channel => {
          return channel.id !== channelRemoved.id;
        });
        this.setState({
          starredChannels: filterChannels
        });
      });
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  displayChannel = starredChannels => (
    starredChannels.length > 0 && starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        active= { channel.id === this.state.activeChannel }
        style= {{ opacity: 0.7 }}
      >
        # { channel.name }
      </Menu.Item>
    ))
  )

  render () {
    const { starredChannels } = this.state;
    
    return (
      <Menu.Menu style={{ marginTop: "15px" }}>
        <Menu.Item>
          <span>
            <Icon name="star outline"/> Starred
          </span>
          ({ starredChannels.length })
        </Menu.Item>
        {this.displayChannel(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null, 
  { setCurrentChannel, setPrivateChannel }
)(Starred);