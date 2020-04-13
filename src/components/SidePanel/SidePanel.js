import React from 'react';
import { Menu } from 'semantic-ui-react';

//Components
import Starred from './Starred';
import Channels from './Channels';
import UserPanel from './UserPanel';
import DirectMessages from './DirectMessages';

class SidePanel extends React.Component {

  render() {
    const { currentUser } = this.props
    return (
      <Menu
    		size="large"
    		fixed="left"
    		style={{ background: '#4c3c4c', fontSize: '1.2rem'}}
    		vertical
    		inverted
      >
      	<UserPanel currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    )
  }
}

export default SidePanel;