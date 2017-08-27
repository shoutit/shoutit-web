import React from 'react';
import sd from 'skin-deep';
import { expect } from 'chai';

import { ProfileCover } from './ProfileCover';

describe('ProfileCover', () => {

  it('should render correctly', () => {
    const tree = sd.shallowRender(<ProfileCover profile={ { } } />);
    expect(tree.props.className).to.include('ProfileCover');
  });

  it('should display the pattern when no cover is set', () => {
    const tree = sd.shallowRender(<ProfileCover profile={ { cover: null } } />);
    const cover = tree.findNode('.ProfileCover-image');
    expect(cover.props.style.backgroundImage).to.eql('url("http://localhost:3000/assets/images/pattern@2x.png")');
  });

  it('should display the large variation of the profile\'s cover', () => {
    const tree = sd.shallowRender(<ProfileCover profile={ { cover: 'foo.jpg' } } />);
    const cover = tree.findNode('.ProfileCover-image');
    expect(cover.props.style.backgroundImage).to.eql('url("foo_large.jpg")');
  });

});
