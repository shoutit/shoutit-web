import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: "ListeningCard",

    render() {
        return (
            <section className="si-card gray-card">
                <div className="card-header">
                    <h3>listening to</h3>
                </div>
                <ul className="shout">

                </ul>
            </section>
        );
    }
});
