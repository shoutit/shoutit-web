var React = require('react'),
	Router = require('react-router'),
	StateMixin = Router.State,
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	moment = require('moment'),
	Col = require('react-bootstrap/Col'),
	Rating = require('./rating.jsx'),
	ShoutDetailActions = require('./shoutDetailActions.jsx'),
	TagList = require('../home/feed/shout/tags.jsx'),
	Video = require('./video.jsx'),
	DocumentTitle = require('react-document-title');


var ShoutDetailBody = require('./shoutDetailBody.jsx'),
	Image = require('../helper/image.jsx'),
	ItemScope = require('../helper/microdata/itemscope.jsx');

module.exports = React.createClass({
	displayName: "ShoutDetail",
	mixins: [StateMixin, FluxMixin, StoreWatchMixin("shouts")],

	statics: {
		fetchData: function (client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux: function () {
		var findRes = this.getFlux().store("shouts").findShout(this.getParams().shoutId);

		return {
			shoutId: this.getParams().shoutId,
			shout: findRes.shout,
			full: findRes.full
		};
	},

	componentDidUpdate: function () {
		this.loadFullShout();
	},

	componentDidMount: function () {
		this.loadFullShout()
	},

	loadFullShout: function () {
		if (!this.state.loadingFull && !this.state.full) {
			this.setState({
				loadingFull: true
			});
			this.getFlux().actions.loadShout(this.state.shoutId);
		}
	},

	render: function () {
		var shout = this.state.shout;

		var content;

		if (shout && shout.id) {
			content =
				<DocumentTitle title={"Shoutit - " + shout.title}>
					<ItemScope type="Product">
						<ShoutDetailBody shout={shout} flux={this.getFlux()}/>
					</ItemScope>
				</DocumentTitle>;
		} else if (shout === null) {
			content = (
				<Col xs={12} md={12} className="section-right">
					<h1>Shout not found!</h1>
				</Col>
			);
		} else {
			var Loader = require('halogen').PulseLoader;
			content = (
				<Col xs={12} md={12} className="section-right">
					<Loader color="#bfdd6d"/>
				</Col>
			);
		}

		return (
			<Col xs={12} md={8}>
				<section className="col-xs-12 col-md-12 section-12">
					{content}
				</section>
			</Col>
		);
	}
});