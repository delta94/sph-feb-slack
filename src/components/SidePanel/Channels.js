import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

class Channels extends React.Component {
  
  constructor(props){
    super(props)

    this.state = {
      user: this.props.currentUser,
      channels: [],
      channel: null,
      modal: false,
      channelName: '',
      channelDetails: '',
      channelsRef: firebase.database().ref('channels'),
      messagesRef: firebase.database().ref('messages'),
      notifications: [],
      firstLoad: true,
      activeChannel: ''
    };
  }

  componentDidMount() {
    this.addListener();
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    this.state.channelsRef.off();
  }
  
  addListener = () => {
    let loadedChannels = [];

    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on('value', snap => {
      if (this.state.channel) {
        this.handleNotification(channelId, this.state.channel.id, this.state.notifications, snap);
      }
    })
  }

  handleNotification = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;
    
    let index = notifications.findIndex(notification => notification.id === channelId );
   
    if (index !== -1) {

      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }

      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren,
        lastKnownTotal: snap.numChildren,
        count: 0
      })
    }

    this.setState({ notifications });

  }

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0]
      this.setActiveChannel(firstChannel)
      this.props.setCurrentChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    
    this.setState({ firstLoad: false });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  closeModal = () => this.setState({ modal: false });
  
  openModal = () => this.setState({ 
    modal: true,
    channelName: '',
    channelDetails: ''
  });
  
  addChannel = () => {
    const { channelsRef, channelName, channelDetails,user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.closeModal();
      }).catch( err => {
        console.log(err)
      })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

    if (index !== -1) {
      let updatedNotifications  = [...this.state.notifications];

      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;

      this.setState({ updatedNotifications });
    }
  }
  
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.addChannel();
    }
  };

  isFormValid = () => {
    return this.state.channelName && this.state.channelDetails;
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });
  
    if (count > 0 ) return count;
  }

  displayChannel = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        active= { channel.id === this.state.activeChannel }
        style= {{ opacity: 0.7 }}
      >
        { this.getNotificationCount(channel) && (
          <Label color="red">{ this.getNotificationCount(channel) }</Label>
        )}
        # { channel.name }
      </Menu.Item>
    ))
  )

  render() {
    const  { channels, modal } = this.state

    return(
      <>
        <Menu.Menu style={{ marginTop: "20px" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {this.displayChannel(channels)}
        </Menu.Menu>
        
        {/*Add Channel Modal*/}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input 
                  label="Channel Name"
                  name="channelName"
                  onChange={this.handleChange}
                  fluid
                />
              </Form.Field>

              <Form.Field>
                <Input 
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                  fluid
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button 
              color="green" 
              onClick={this.handleSubmit}  
              inverted
            >
              <Icon name="checkmark"/> Add
            </Button>

            <Button color="red" inverted onClose={this.closeModal}>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(
  null,
  {setCurrentChannel, setPrivateChannel}
)(Channels);