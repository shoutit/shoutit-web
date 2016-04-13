import React, { PropTypes } from 'react';

// Replace a new line with a <br/> element

export default function NewlineToBreak({ children }) {
  return (
    <span>
      { children.split(/\n/).map((item, i) => {
        if (i === 0) {
          return item;
        }
        return [<br />, item];
      }) }
    </span>
  );
}

NewlineToBreak.propTypes = {
  children: PropTypes.element.isRequired,
};
