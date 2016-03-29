/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import Scrollable from './Scrollable';

describe('Scrollable', () => {

  let rootNode;

  beforeEach(() => {
    rootNode = document.createElement('div');
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(rootNode);
    document.body.removeChild(rootNode);
  });

  it('should render with children', () => {
    const scrollable = ReactDOM.render(
      <Scrollable className="foo" style={{ height: 500 }}><span>bar</span></Scrollable>, rootNode);

    const node = ReactDOM.findDOMNode(scrollable);
    expect(node).to.exist;
    expect(node.className).to.equal('foo');
    expect(node.style.height).to.equal('500px');
    expect(node.children[0].innerHTML).to.equal('bar');
  });

  it('should scroll to bottom when mounted', () => {
    const scrollable = ReactDOM.render(
      <Scrollable initialScroll="bottom" style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);

    expect(ReactDOM.findDOMNode(scrollable).scrollTop).to.equal(400);
  });

  it('should scroll to bottom when its unique id changes', () => {
    const scrollable = ReactDOM.render(
      <Scrollable initialScroll="bottom" uniqueId="foo" style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);
    const node = ReactDOM.findDOMNode(scrollable);
    node.scrollTop = 50;
    TestUtils.Simulate.scroll(node, { target: node });

    ReactDOM.render(
      <Scrollable initialScroll="bottom" uniqueId="bar" style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);

    expect(ReactDOM.findDOMNode(scrollable).scrollTop).to.equal(400);
  });

  it("should mantain current scroll when content's height changes", () => {
    const scrollable = ReactDOM.render(
      <Scrollable initialScroll="bottom" uniqueId="foo" style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);
    const node = ReactDOM.findDOMNode(scrollable);
    node.scrollTop = 50;
    TestUtils.Simulate.scroll(node, { target: node });

    ReactDOM.render(
      <Scrollable initialScroll="bottom" uniqueId="foo" style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 800 }} />
      </Scrollable>, rootNode);

    expect(ReactDOM.findDOMNode(scrollable).scrollTop).to.equal((800 - 500 + 50));
  });


  it('should scroll to top when mounted', () => {
    const scrollable = ReactDOM.render(
      <Scrollable style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);

    expect(ReactDOM.findDOMNode(scrollable).scrollTop).to.equal(0);
  });

  it('should call onScrollTop when scrolling to the top', () => {
    const spy = sinon.spy();
    const scrollable = ReactDOM.render(
      <Scrollable onScrollTop={ spy }
        style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);

    const node = ReactDOM.findDOMNode(scrollable);
    node.scrollTop = 0;
    TestUtils.Simulate.scroll(node, { target: node });
    expect(spy).to.have.been.called;
  });

  it('should call onScrollBottom when scrolling to the bottom', () => {
    const spy = sinon.spy();
    const scrollable = ReactDOM.render(
      <Scrollable onScrollBottom={ spy }
        style={{ height: 100, overflow: 'auto' }}>
        <div style={{ height: 500 }} />
      </Scrollable>, rootNode);

    const node = ReactDOM.findDOMNode(scrollable);
    node.scrollTop = 400;
    TestUtils.Simulate.scroll(node, { target: node });
    expect(spy).to.have.been.called;
  });


});
