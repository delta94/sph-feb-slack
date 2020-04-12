import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

//Components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel 
      key={currentUser ?? currentChannel.id}
      currentUser={currentUser}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages 
        key={currentUser ?? currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel 
        key={currentUser ?? currentChannel.id}
        isPrivateChannel={isPrivateChannel}
        currentChannel={currentChannel}
        userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
)

const mapStateFromProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  isPrivateChannel: channel.isPrivateChannel,
  userPosts: channel.userPosts
});

export default connect(mapStateFromProps)(App);