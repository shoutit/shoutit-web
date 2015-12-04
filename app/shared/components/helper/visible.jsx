import React from 'react';

export default React.createClass({
    displayName: "ReactVisible",

    propTypes: {
        condition: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProp() {
        return {
            condition: true
        }
    },

    render() {
        let style = !this.props.condition? {display: 'none'}: {};

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }

});