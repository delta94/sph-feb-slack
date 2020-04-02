import React from 'react';
import { Menu } from 'semantic-ui-react';

//Components
import UserPanel from './UserPanel';
import Channels from './Channels';

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
      	<UserPanel currentUser={currentUser}/>
        <Channels currentUser={currentUser} />
      </Menu>
    )
  }
}

export default SidePanel;