import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Col} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ShoutDetailBody from './shoutDetailBody.jsx';
import ItemScope from '../helper/microdata/itemscope.jsx';
import Loader from '../helper/loader.jsx';

export default React.createClass({
    displayName: "ShoutDetail",
    mixins: [FluxMixin(React), StoreWatchMixin("shouts")],

    contextTypes: {
        router: React.PropTypes.func
    },

    statics: {
        fetchData(client, session, params) {
            return client.shouts().get(session, params.shoutId);
        }
    },

    getStateFromFlux() {
        var findRes = this.getFlux().store("shouts").findShout(this.context.router.getCurrentParams().shoutId);

        return {
            shoutId: this.context.router.getCurrentParams().shoutId,
            shout: findRes.shout,
            full: findRes.full
        };
    },

    componentDidUpdate() {
        this.loadFullShout();
    },

    componentDidMount() {
        this.loadFullShout();
    },

    loadFullShout() {
        if (!this.state.loadingFull && !this.state.full) {
            this.setState({
                loadingFull: true
            });
            this.getFlux().actions.loadShout(this.state.shoutId);
        }
    },

    render() {
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
            content = (
                <Col xs={12} md={12} className="section-right">
                   <Loader/>
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
