import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ProfileCover from './ProfileCover';

import { expect } from 'chai';

describe('ProfileCover', () => {
  it('should render correctly', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ProfileCover profile={ { cover: null } } />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include('ProfileCover');
  });
  it('should include a large version of the profile\'s cover', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ProfileCover profile={ { cover: 'foo.jpg' } } />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include('ProfileCover');
    expect(output.props.style.backgroundImage).to.eql('url("foo_large.jpg")');
  });
});
