import React, { PropTypes } from 'react';
import Sticky from 'react-sticky-state';

import MiniFooter from '../layout/MiniFooter';
if (process.env.BROWSER) {
  require('./Page.scss');
}

const stickyProps = {
  stickyWrapperClass: 'Page-sticky-wrap',
  stickyClass: 'Page-sticky',
  fixedClass: 'Page-sticky-fixed',
  stateClass: 'Page-is-sticky',
  disabledClass: 'Page-sticky-disabled',
  absoluteClass: 'Page-is-absolute',
};

export default function Page({ children, className, startColumn, stickyStartColumn = false, endColumn, stickyEndColumn = false, miniFooter = true }) {
  let cssClass = 'Page htmlContentWidth';
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass }>
      { startColumn &&
        <div className="Page-column">
          { stickyStartColumn ?
            <Sticky { ...stickyProps }>
              <div>
                { startColumn }
              </div>
            </Sticky> :
            startColumn
          }
        </div>
      }
      <div className="Page-body">
        { children }
      </div>
      { endColumn &&
        <div className="Page-column">
          { stickyEndColumn ?
            <Sticky { ...stickyProps }>
              <div>
                { endColumn }
              </div>
            </Sticky> :
            [
              endColumn,
              miniFooter ? <MiniFooter key="minifooter" /> : null,
            ]
          }
        </div>
      }
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  startColumn: PropTypes.node,
  stickyStartColumn: PropTypes.bool,
  endColumn: PropTypes.node,
  stickyEndColumn: PropTypes.bool,
  title: PropTypes.string,
  miniFooter: PropTypes.bool,
};
