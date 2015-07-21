import React from 'react';
import StaticFrame from './static/iFrame.jsx';
import DocumentTitle from 'react-document-title';

export default React.createClass({
	displayName: "Static",

	contextTypes: {
		router: React.PropTypes.func
	},

	render(){
		let name = this.context.router.getCurrentPathname()
			.replace('\/', '');

		return (
			<DocumentTitle title={name.charAt(0).toUpperCase() + name.slice(1) + " - Shoutit"}>
				<StaticFrame staticName={name}/>
			</DocumentTitle>
		);
	}
});
