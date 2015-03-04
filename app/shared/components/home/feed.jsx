var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	Container = require('react-bootstrap/Grid'),
	Col = require('react-bootstrap/Col'),
	Button = require('react-bootstrap/Button'),
	Shout = require('./feed/shout.jsx'),
	Spinner = require('../misc/spinner.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("shouts")],

	displayName: "Feed",

	getStateFromFlux: function () {
		var flux = this.getFlux();
		return flux.store("shouts").getState();
	},

	render: function () {
		var shouts = this.state.shouts;
		var onLastVisibleChange = this.onLastVisibleChange;
		var shoutEls = shouts.length > 0 ? shouts.map(function (shout, i) {
			return <Shout key={"shout-" + i} shout={shout} index={i} last={i === shouts.length - 1 ? onLastVisibleChange : null}/>;
		}) : <Spinner />;

		if (this.state.next && shouts.length > 0) {
			shoutEls.push(<section key={"shout-" + shouts.length}>
				<Col xs={12} md={12}>
					<Button onClick={this.onClickLoadMore} bsStyle="link">LoadMore</Button>
				</Col>
			</section>);
		}

		return (
			<Col xs={12} md={8}>
				{shoutEls}
			</Col>
		)
	},

	onLastVisibleChange: function (isVisible) {
		if (isVisible) {
			this.getFlux().actions.loadMore();
		}
	},

	componentDidMount: function () {
		if (this.state.shouts.length === 0) {
			this.getFlux().actions.update();
		}
	},

	onClickLoadMore: function (e) {
		e.preventDefault();
		this.getFlux().actions.loadMore();
	}
});