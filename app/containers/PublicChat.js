import React from 'react';
import Chat from '../containers/Chat';

export default function PublicChat(props) {
  return <Chat type="public" { ...props } />;
}
