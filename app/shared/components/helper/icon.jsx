import React from 'react';

export default React.createClass({
	displayName: "Icon",

    getDefaultProps() {
        return {
            style: {}
        }
    },

	render() {
		let className = "icon res1x-" + this.props.name + " " + (this.props.className || "");
        let icon = this.props.onSwitchClick? 
                <div className={className} style={this.props.style} onClick={this.props.onSwitchClick}/>:
                <div className={className} style={this.props.style}/>;

		return icon;
	}
});