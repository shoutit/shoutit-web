var React = require('react'),
    Icon = require('./icon.jsx');

module.exports = React.createClass({
    displayName: "Mui",

    getDefaultProps: function () {
        return {
            right: false
        };
    },

    render: function () {
        return (
            <Icon className={this.props.right ? "mui1" : "mui"} name={this.props.right ? "mui1" : "mui"}/>
        );
    }
});