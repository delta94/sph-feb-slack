import React from 'react';
import { Segment, Header, Input, Icon } from 'semantic-ui-react';

class MessageHeader extends React.Component {

  render() {
    const { channelName, numUniqueUSers,handleSearchChange, isPrivateChannel, handleStar, isChannelStarred } = this.props;

    return (
      <Segment clearing>
        {/* Channel Tittle */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            { !isPrivateChannel && (
              <Icon 
                name={ isChannelStarred ? 'star' : 'star outline' } 
                onClick={handleStar} 
                color={ isChannelStarred ? 'yellow' : 'black'}
              />
            )}
          </span>
          { !isPrivateChannel && <Header.Subheader>{numUniqueUSers}</Header.Subheader> }
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Message"
            onChange={handleSearchChange}
          />
        </Header>
      </Segment>
    )
  }
}

export default MessageHeader;