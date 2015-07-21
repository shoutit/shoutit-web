import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';

import Shout from '../feed/feed/shout.jsx';

let map = {
	request: "Requests",
	offer: "Offers"
};

export default React.createClass({
	displayName: "TagProfileShoutList",

	componentDidMount() {
		let tagName = this.props.tagName;

		if (!this.props.tags[tagName] || !this.props.tags[tagName][this.props.type + 's']) {
			this.props.flux.actions.loadTagShouts(this.props.tagName, this.props.type);
		}
	},

	renderTagProfileShouts(shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render() {
		let tagName = this.props.tagName,
			tag = this.props.tags[tagName].tag,
			tags = this.props.tags[tagName][this.props.type + 's'],
			content, stat;

		if (tags) {
			content = this.renderTagProfileShouts(tags);
			stat = <span>{' (' + tags.length + ')'}</span>;
		} else {
			content = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>
							{tag.name + " - " + map[this.props.type] + ":"}
							{stat}
						</p>
					</div>
					<Clear />

					<div className="listener-scroll ctn-offerpro" tabIndex="5000"
						 style={{outline: "none"}}>
						{content}
					</div>
				</div>
			</Col>
		);
	}
});
