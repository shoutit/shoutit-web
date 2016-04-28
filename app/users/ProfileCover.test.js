import React from 'react';
import { ProfileCover } from './ProfileCover';
import sd from 'skin-deep';

import { expect } from 'chai';

describe('ProfileCover', () => {

  it('should render correctly', () => {
    const tree = sd.shallowRender(<ProfileCover profile={ { cover: null } } />);
    expect(tree.props.className).to.include('ProfileCover');
    const cover = tree.findNode('.ProfileCover-image');
    expect(cover.props.style.backgroundImage).to.eql('url("http://localhost:3000/images/pattern@2x.png")');
  });

  it('should display the large variation of the profile\'s cover', () => {
    const tree = sd.shallowRender(<ProfileCover profile={ { cover: 'foo.jpg' } } />);
    const cover = tree.findNode('.ProfileCover-image');
    expect(cover.props.style.backgroundImage).to.eql('url("foo_large.jpg")');
  });

});
