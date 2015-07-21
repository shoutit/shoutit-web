import React from 'react';

export default React.createClass({
	displayName: "Icon",
	render() {
		let className = "icon icons-" + this.props.name + " " + (this.props.className || "");
		return (
			<div className={className}/>
		)
	}
});