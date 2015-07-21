import React from 'react';
import {Loader} from '../helper';

import Shout from '../feed/feed/shout.jsx';

export default React.createClass({
	displayName: "SearchShoutList",

	componentDidMount() {
		let term = this.props.term,
			shouts = this.props.search.shouts[term];

		if (!shouts) {
			this.props.flux.actions.searchShouts(term);
		}
	},

	renderShouts(shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render() {
		let term = this.props.term,
			shouts = this.props.search.shouts[term],
			content;

		if (shouts) {
			content = this.renderShouts(shouts);
		} else {
			content = <Loader/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				{content}
			</div>
		);
	}
});
