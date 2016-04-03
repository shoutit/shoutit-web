import React from 'react';
import DocumentTitle from "../../../ui/DocumentTitle";

export default React.createClass({
    displayName: "NotFound",

    title: "Not Found",

    render() {
        return (
            <DocumentTitle title={this.title}>
                <div>
                    Page not Found!
                </div>
            </DocumentTitle>
        );
    }
});
