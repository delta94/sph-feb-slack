import React from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input} from 'semantic-ui-react';

import FileModal from './FileModal';

class MessagesForm extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      message: '',
      loading: false,
      user: this.props.currentUser,
      errors: []
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  createMessage = () => {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message,
      modal: false
    };

    return newMessage;
  }

  sendMessage = () => {
    const { messagesRef, currentChannel  } = this.props;
    const { message } = this.state;
    
    if (message) {
      this.setState({ loading: true });

      messagesRef
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: []})
        })
        .catch( err => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message'})
      });
    }
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  render() {
    
    const { errors, message, loading, modal } = this.state;
    
    return (
      <Segment className="message__form">
        <Input
          name="message"
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Enter Your Message"
          style={{ marginBottom: '0.7em'}}
          onChange={this.handleChange}
          value={message}
          className={
            errors.some(err => err.message.includes('message'))  ? 'error' : ''
          }
          fluid
        />
        <Button.Group 
          style={{ width: "100%" }}
          width="2"
          icon 
        >
          <Button 
            onClick={this.sendMessage}
            color="orange"
            disabled={loading}
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />

          <Button 
            color="teal"
            onClick={this.openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />

        </Button.Group>

        <FileModal 
          modal={modal}
          closeModal={this.closeModal}
        />
      </Segment>
    )
  }
}

export default MessagesForm;