import React from 'react';
import { Segment, Header, Input, Icon } from 'semantic-ui-react';

class MessageHeader extends React.Component {
  render() {
    return (
      <Segment clearing>
        {/* Channel Tittle */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            channel
            <Icon name="star outline" color="black"/>
          </span>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Message"
          />
        </Header>
      </Segment>
    )
  }
}

export default MessageHeader;