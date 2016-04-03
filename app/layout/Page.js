import React from 'react';
import Sticky from 'react-sticky-state';
import MiniFooter from '../layout/MiniFooter';
import DocumentTitle from '../ui/DocumentTitle';

if (process.env.BROWSER) {
  require('./Page.scss');
}
export default function Page({ children, className, startColumn, stickyStartColumn = false, endColumn, stickyEndColumn = false, title = '' }) {
  const stickyProps = {
    stickyWrapperClass: 'Page-sticky-wrap',
    stickyClass: 'Page-sticky',
    fixedClass: 'Page-sticky-fixed',
    stateClass: 'Page-is-sticky',
    disabledClass: 'Page-sticky-disabled',
    absoluteClass: 'Page-is-absolute',
  };

  let cssClass = 'Page htmlContentWidth';
  if (className) {
    cssClass += ` ${className}`;
  }

  return (
    <DocumentTitle title={ title }>
      <div className={ cssClass }>
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
              [endColumn, <MiniFooter />]
            }
          </div>
        }
      </div>
    </DocumentTitle>
  );
}
