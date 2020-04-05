import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { setCurrentChannel } from '../../actions';

class Channels extends React.Component {
  
  constructor(props){
    super(props)

    this.state = {
      user: this.props.currentUser,
      channels: [],
      modal: false,
      channelName: '',
      channelDetails: '',
      channelsRef: firebase.database().ref('channels'),
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
    });
  };

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0]
      this.setActiveChannel(firstChannel)
      this.props.setCurrentChannel(firstChannel);
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

  displayChannel = channels => (
    channels.length > 0 && channels.map(channel => (
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

  changeChannel = channel => {
    this.setActiveChannel(channel)
    this.props.setCurrentChannel(channel)
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

  render() {
    const  { channels, modal } = this.state

    return(
      <>
        <Menu.Menu style={{ marginTop: "15px" }}>
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
  {setCurrentChannel}
)(Channels);