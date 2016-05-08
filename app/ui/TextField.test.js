import React from 'react';
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';

import TextField from './TextField';

describe('ui/TextField', () => {

  it('should render an input text form field', () => {
    const textField = TestUtils.renderIntoDocument(<TextField name="test" />);
    expect(textField.refs.field.props.field).to.equal('input');
    expect(textField.refs.field.props.type).to.equal('text');
  });

  it('should accept different types', () => {
    const textField = TestUtils.renderIntoDocument(<TextField type="email" name="test" />);
    expect(textField.refs.field.props.type).to.equal('email');
  });

  describe('when type is `url`', () => {
    it('should append http:// to its value', () => {
      const textField = TestUtils.renderIntoDocument(<TextField type="url" name="test" value="www.shoutit.com" />);
      expect(textField.getValue()).to.equal('http://www.shoutit.com');
    });
    it('should not append http:// if present', () => {
      const textField = TestUtils.renderIntoDocument(<TextField type="url" name="test" value="http://www.shoutit.com" />);
      expect(textField.getValue()).to.equal('http://www.shoutit.com');
    });
    it('should not append https:// if present', () => {
      const textField = TestUtils.renderIntoDocument(<TextField type="url" name="test" value="https://www.shoutit.com" />);
      expect(textField.getValue()).to.equal('https://www.shoutit.com');
    });
  });

});
