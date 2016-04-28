import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Icon from '../app/ui/Icon';
import icons from '../assets/icons';

const renderIcons = props => (
  <div style={ { margin: '1rem' } }>
    { icons.map(name =>
      <div key={ name } style={ { margin: '5px 0' } }>
        <span style={ { background: 'white', padding: 3, verticalAlign: 'middle', display: 'inline-block', marginRight: 5 } }>
          <Icon name={ name } {...props} />
        </span>
        { name }
      </div>
      ) }
  </div>
);

storiesOf('ui.Icon', module)
  .add('normal state', () => renderIcons());
