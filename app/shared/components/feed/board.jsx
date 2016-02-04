import React from 'react';
import Cards from '../cards';
import {StoreWatchMixin} from 'fluxxor';

export default React.createClass({
    displayName: "Board",
    mixins: [new StoreWatchMixin("suggestions")],

    statics: {
        fetchId: 'suggestions',
        fetchData(client, session, params) {
            return client.misc().suggestions(session, params);
        }
    },

    propTypes: {
        items: React.PropTypes.array.isRequired
    },

    contextTypes: {
        flux: React.PropTypes.object
    },

    getStateFromFlux() {
        const {flux} = this.context;
        const suggestions = flux.store('suggestions').getState();

        return {
            suggestions
        }
    },

    componentDidMount() {
        this.context.flux.actions.getSuggestions();
    },

    render() {
        const {items} = this.props;
        const {suggestions} = this.state;

        return React.createElement.apply(this, [
                    'div',
                    null
                    ].concat(
                        items.map((component) => {
                            return React.createElement(Cards[component],
                                   {key: component, suggestions}, null)
                        })
                    )
                );
    }
});