import React from 'react';
import DocumentTitle from 'react-document-title';
import Loader from '../helper/loader.jsx';

export default React.createClass({
    displayName: "Simple",

    title: "Shout It- Not implemented yet.",

    render() {
        return (
            <DocumentTitle title={this.title}>
                <div>
                    <Loader/>
                </div>
            </DocumentTitle>
        );
    }
});
