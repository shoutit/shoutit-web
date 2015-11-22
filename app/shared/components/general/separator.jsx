import React from 'react';

export default React.createClass({
    displayName: 'Separator',

    propTypes: {
        vertical: React.PropTypes.bool,
        size: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            vertical: false,
            size: '100%'
        }
    },

    render() {
        let CompStyle = {
            display: 'block',
            background: '#bfbfbf',
            width: this.props.size,
            height: '1px',
            margin: '10px auto',
            padding: '0'
        }
        if(this.props.vertical) {
            CompStyle.width = '1px';
            CompStyle.height = this.props.size;
            CompStyle.float = 'left';
            CompStyle.margin = '18px 5px 0';
        }
        return (
            <span style={CompStyle}></span>
        );
    }
});