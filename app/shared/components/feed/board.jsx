import React from 'react';
import Cards from '../cards';

export default React.createClass({
    displayName: "Board",

    propTypes: {
        items: React.PropTypes.array.isRequired
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