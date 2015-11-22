import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: "tagsCard",

    render() {
        return (
            <section className="si-card">
                <div className="card-header">
                    <h3>suggested tags</h3>
                </div>
                <ul className="tags">
                    <li>
                        <Icon name="tag" />
                        <span>Cars</span>
                    </li>
                    <li>
                        <Icon name="tag" />
                        <span>Gaming</span>
                    </li>
                    <li>
                        <Icon name="tag" />
                        <span>Houses</span>
                    </li>
                </ul>
            </section>
        );
    }
});
