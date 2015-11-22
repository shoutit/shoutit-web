import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: "ShoutCard",

    render() {
        return (
            <section className="si-card">
                <div className="card-header">
                    <h3>suggested shout</h3>
                </div>
                <ul className="shout">

                </ul>
            </section>
        );
    }
});
