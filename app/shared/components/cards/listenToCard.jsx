import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: "listenToCard",

    render() {
        return (
            <section className="si-card">
                <div className="card-header">
                    <h3>to listen to</h3>
                </div>
                <ul className="listen">

                </ul>
            </section>
        );
    }
});
