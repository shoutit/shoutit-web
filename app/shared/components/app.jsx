import React from 'react';

export default React.createClass({
	displayName: "App",

    componentWillReceiveProps() {
        // saving prev location to check if back button is available in some pages
        window.previousLocation = this.props.location;
      },

	render() {
		return <div>{this.props.children}</div>;
	}
});
