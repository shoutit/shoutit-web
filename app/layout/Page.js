import React from 'react';
import Sticky from 'react-sticky-state';
if (process.env.BROWSER) {
  require('./Page.scss');
}
export default function Page({ children, startColumn, stickyStartColumn = false, endColumn, stickyEndColumn = false }) {
  const stickyProps = {
    stickyWrapperClass: 'Page-sticky-wrap',
    stickyClass: 'Page-sticky',
    fixedClass: 'Page-sticky-fixed',
    stateClass: 'Page-is-sticky',
    disabledClass: 'Page-sticky-disabled',
    absoluteClass: 'Page-is-absolute',
  };
  return (
    <div className="Page htmlContentWidth">
      { startColumn &&
        <div className="Page-column">
          { stickyStartColumn ?
            <Sticky {...stickyProps}>
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
            <Sticky {...stickyProps}>
              <div>
                { endColumn }
              </div>
            </Sticky> :
            endColumn
          }
        </div>
      }
    </div>
  );
}
