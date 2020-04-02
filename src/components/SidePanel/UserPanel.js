import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

import firebase from '../../firebase';

class UserPanel extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      user: this.props.currentUser
    }
  }
  
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{ this.state.user.displayName }</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text:<span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <div onClick={this.handleSignOut}>Signout</div>
    }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Sign Out!!!'))
  };

  render() {
    const { displayName , photoURL} = this.state.user    
  
    return (
      <Grid>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.5rem 0", margin:0 }}>
          {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>
                AwesomeChat
              </Header.Content>
            </Header>
          </Grid.Row>

          {/* User Dropdown */}
          <Header style={{ padding: '0.50rem'}} as="h4" inverted>
            <Dropdown trigger={
              <span>
                <Image src={photoURL} spaced="right" avatar/>
                { displayName }
              </span>
            } options={ this.dropdownOptions() }/>
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;