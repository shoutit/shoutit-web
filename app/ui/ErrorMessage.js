import React, { PropTypes, Component } from 'react';

if (process.env.BROWSER) {
  require('./ErrorMessage.scss');
}

export default function ErrorMessage({ details = "Something didn't work as expected.", title='There was an error', error, retryAction }) {
  return (
    <div className="ErrorMessage">
      <div className="ErrorMessage-content">
        <h4>{ title }</h4>
        <div className="ErrorMessage-details">
          { details }

          { retryAction &&
            <span className="ErrorMessage-retry" onClick={ retryAction }>Retry?</span>
          }
        </div>
      </div>
    </div>
  );
}
