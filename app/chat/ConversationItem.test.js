import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { Link } from 'react-router';
import sd from 'skin-deep';

import ConversationItem from './ConversationItem';

describe('ConversationItem', () => {
  const conversation = {
    id: 100,
    profiles: [{ username: 'a', name: 'A' }, { username: 'b', name: 'B' }],
  };

  it('should render correctly', () => {
    const tree = sd.shallowRender(
      <ConversationItem conversation={ conversation } />
    );

    const output = tree.getRenderOutput();

    expect(output.type).to.equal(Link);
    expect(output.props.to).to.equal('/messages/100');
    expect(output.props.className).to.contain('ConversationItem');

    expect(tree.findNode('.ConversationItem-user-avatar')).to.be.defined;
    expect(tree.findNode('.ConversationItem-body')).to.be.defined;
  });

  it('should use is-selected class', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <ConversationItem
        selected
        conversation={ conversation }
      />
    );

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.contain('is-selected');
  });

  it('should use is-unread class', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <ConversationItem
        unread
        conversation={ conversation }
      />
    );

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.contain('is-unread');
  });

});
