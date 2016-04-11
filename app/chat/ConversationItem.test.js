import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { Link } from 'react-router';
import sd from 'skin-deep';

import ConversationItem from './ConversationItem';
import { getUnixTime, formatCreatedAt } from '../../app/utils/DateUtils';

describe('ConversationItem', () => {
  const users = [{ username: 'a', name: 'A' }, { username: 'b', name: 'B' }];

  it('should render correctly', () => {
    const tree = sd.shallowRender(
      <ConversationItem
        id={100}
        users={ users }
      />
    );

    const output = tree.getRenderOutput();

    expect(output.type).to.equal(Link);
    expect(output.props.to).to.equal('/messages/100');
    expect(output.props.className).to.contain('ConversationItem');

    expect(tree.findNode('.ConversationItem-usersImage')).to.be.defined;
    expect(tree.findNode('.ConversationItem-body')).to.be.defined;
    expect(tree.findNode('.ConversationItem-partecipants').props).to.have
      .property('children', 'A, B');
  });

  it('should use is-selected class', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <ConversationItem
        id={100}
        selected
        users={ users }
      />
    );

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.contain('is-selected');
  });

  it('should use is-unread class', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <ConversationItem
        id={100}
        unread
        users={ users }
      />
    );

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.contain('is-unread');
  });

  it('should show the title of the shout it is about', () => {
    const tree = sd.shallowRender(
      <ConversationItem
        id={100}
        type="about_shout"
        about={{ title: 'Foo' } }
        users={ users }
      />
    );
    expect(tree.findNode('.ConversationItem-aboutShout').props).to.have
      .property('children', 'Foo');
  });

  it('should show the last message', () => {
    const created_at = getUnixTime();
    const tree = sd.shallowRender(
      <ConversationItem
        id={100}
        lastMessage={{ text: 'Bar', created_at } }
        users={ users }
      />
    );
    expect(tree.findNode('.ConversationItem-lastMessage').props).to.have
      .property('children', 'Bar');
    expect(tree.findNode('.ConversationItem-createdAt').props).to.have
      .property('children', formatCreatedAt(created_at));
  });
});
