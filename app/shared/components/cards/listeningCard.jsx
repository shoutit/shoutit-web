import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: "ListeningCard",

    contextTypes: {
        params: React.PropTypes.object
    },

    render() {
        let isShoutPage = Boolean(this.context.params.shoutId);

        if(!isShoutPage) {
            return (
                <section className="si-card gray-card">
                    <div className="card-header">
                        <h3>listening to</h3>
                    </div>
                    <ul className="shout">

                    </ul>
                </section>
            );
        } else {
            return null;
        }
    }
});
