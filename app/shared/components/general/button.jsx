import React from 'react';
import assign from 'lodash/object/assign';

// color pallett
var COLORS = [
    'green',
    'orange',
    'blue',
    'gray'
];

export default React.createClass({

    proprTypes: {
        height: React.PropTypes.string,
        width: React.PropTypes.string,
        fontSize: React.PropTypes.string,
        color: React.PropTypes.oneOf(COLORS),
        // style which will be applied to the text inside button
        textStyle: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            fontSize: '1.6rem',
            color: 'green',
            textStyle: {}
        }
    },

    generateStyle() {
        let style = {};

        if(this.props.style) {
            assign(style, this.props.style);
        }

        return style;
    },

    generateClass() {
        let className = 'si-button ';
        className += this.props.darken? `darken-${this.props.color} `: `${this.props.color} `;
        // adding developer defined class
        this.props.className? className+= className + this.props.className: undefined;

        return className; 
    },

    render() {
        let style = this.generateStyle(),
            className = this.generateClass(),
            props, textProps;

        props = {
            className,
            style
        }

        if(this.props.onClick) {
            props.onClick = this.props.onClick;
        }

        return (
            <div {...props}>
                <span style={this.props.textStyle}>{this.props.children}</span>
            </div>
        );
        
    }
});
