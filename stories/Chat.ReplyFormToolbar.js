import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ReplyFormToolbar from '../app/chat/ReplyFormToolbar';

const renderIcons = () => (
  <div className="StorybookContent">
    <ReplyFormToolbar />
  </div>
);

storiesOf('chat.ReplyFormToolbar', module)
  .add('normal state', () => renderIcons());
