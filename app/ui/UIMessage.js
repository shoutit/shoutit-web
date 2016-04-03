import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./UIMessage.scss');
}

const UIMessage = ({
  title,
  details,
  retryAction,
  type = 'info',
}) =>
  <div className={`UIMessage ${type}`}>
    <div className="UIMessage-content">
      <h4>{ title }</h4>
      <div className="UIMessage-details">
        { details }
        { retryAction &&
          <span className="UIMessage-retry" onClick={ retryAction }>
            Retry?
          </span>
        }
      </div>
    </div>
  </div>;

export default UIMessage;

UIMessage.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  retryAction: PropTypes.func,
  type: PropTypes.oneOf(['info', 'error']),
};
