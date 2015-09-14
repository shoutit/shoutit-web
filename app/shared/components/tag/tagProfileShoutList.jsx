import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';

import Shout from '../feed/feed/shout.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

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
						  //last={i === shouts.length - 1 ? onLastVisibleChange : null}/>;
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
						{this.renderViewportSensor()}
						
					</div>
				</div>
			</Col>
		);
	},

	renderViewportSensor() {
		if(this.props.loading) {
			return (
				<section>
						<Col xs={12} md={12}>
							<Loader />
						</Col>
				</section>);
		} else {
			return (
				<section>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
					</Col>
				</section>);
		}
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.loadMore();
		}
	},

	loadMore() {
		this.props.flux.actions.loadMoreTagShouts(this.props.tagName, this.props.type);
		//alert('last');
	}
});
