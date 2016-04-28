import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Button from '../app/ui/Button';

const buttons = (props) => (
  <div style={ { padding: '1rem', backgroundColor: 'white' } }>
    <div style={ { marginTop: 5 } }>
      <Button action="default" {...props}>Default</Button>
    </div>
    <div style={ { marginTop: 5 } }>
      <Button action="primary" {...props}>Primary</Button>
    </div>
    <div style={ { marginTop: 5 } }>
      <Button action="primary-alt" {...props}>Primary (alt)</Button>
    </div>
    <div style={ { marginTop: 5 } }>
      <Button action="destructive" {...props}>Destructive</Button>
    </div>
    <div style={ { marginTop: 5 } }>
      <Button action="inverted" {...props}>Inverted</Button>
    </div>
    <div style={ { marginTop: 5 } }>
      <Button action="primary" {...props} icon="sparkle">With icon</Button>
    </div>
    <div style={ { marginTop: 5, width: 300 } }>
      <Button action="primary" block {...props} icon="sparkle">Block</Button>
    </div>
  </div>
);

storiesOf('ui.Button', module)
  .add('default size', () => buttons())
  .add('small size', () => buttons({ size: 'small' }))
  .add('disabled', () => buttons({ disabled: true }));
