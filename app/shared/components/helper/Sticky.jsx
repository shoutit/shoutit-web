var React = require('react');
var stickyPosition = require('sticky-position');

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      className: 'sticky',
      computeWidth: true,
      tag: "div",
    };
  },
  componentDidMount: function() {
    this.sticky = stickyPosition({
      primary: this.refs.primary,
      placeholder: this.refs.placeholder,
      wrapper: this.refs.wrapper,
      computeWidth: this.props.computeWidth,
    })
  },
  componentWillUnmount: function() {
    this.sticky.destroy();
  },
  render: function() {
    const { tag, children } = this.props;
    return React.createElement(tag, {ref: 'wrapper', ...this.props}, [
      React.createElement(tag, {ref: 'primary', key: 0}, children),
      React.createElement(tag, {ref: 'placeholder', key: 1})
    ]);
  }
});
