import React from 'react';
import Cards from '../cards';

export default React.createClass({
    displayName: "Board",

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

    componentDidMount() {
        this.context.flux.actions.getSuggestions();
    },

    render() {
        const {items} = this.props;

        return React.createElement.apply(undefined, [
                    'div',
                    null
                    ].concat(
                        items.map((component) => {
                            return React.createElement(Cards[component], {key: component}, null)
                        })
                    )
                );
    }
});