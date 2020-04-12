import React from 'react';
import firebase from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { Segment, Button, Input} from 'semantic-ui-react';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessagesForm extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      errors: [],
      message: '',
      modal: false,
      loading: false,
      uploadTask: null,
      percentUpload: 0,
      uploadState: '',
      user: this.props.currentUser,
      storageRef: firebase.storage().ref()
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  createMessage = ( fileUrl = null) => {
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };

    if (fileUrl !=null) {
      newMessage['image'] = fileUrl;
    } else {
      newMessage['content'] = this.state.message;
    }

    return newMessage;
  }

  sendMessage = () => {
    const { getMessagesRef, currentChannel  } = this.props;
    const { message } = this.state;
    
    if (message) {
      this.setState({ loading: true });

      getMessagesRef()
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

  getPath = () => {
    const { currentChannel, isPrivateChannel  } = this.props;
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return 'chat/public';
    }
  }

  uploadFile =( file, metadata )=> {

    const { currentChannel  } = this.props;
    const pathToUpload = currentChannel.id;
    const ref = this.props.getMessagesRef;
    const filePath = `${this.getPath()}${uuidv4()}.jpg`;

    this.setState({
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentUpload = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          this.setState({ percentUpload });
        },
          err => {
            console.log(err)
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          },
          () => { 
            this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.sendFileMessage(downloadURL, ref, pathToUpload);
            })
            .catch(err =>{
              console.log(err)
              this.setState({
                errors: this.state.errors.concat(err),
                uploadState: 'error',
                uploadTask: null
              });
            })
          }
        )
      }
    );
  };
  
  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref().child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch(err =>{
        this.setState({
          errors: this.state.errors.concat(err)
        });
      })
  }  

  render() {
    const { errors, message, loading, modal, uploadState, percentUpload } = this.state;
    
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
            disabled={uploadState === 'uploading'}
            labelPosition="right"
            icon="cloud upload"
          />

        </Button.Group>

        <FileModal 
          modal={modal}
          uploadFile={this.uploadFile}
          closeModal={this.closeModal}
        />
        <ProgressBar 
          uploadState={uploadState}
          percentUpload={percentUpload}
        />
      </Segment>
    )
  }
}

export default MessagesForm;