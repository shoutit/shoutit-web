import React, { PropTypes } from 'react';

// Replace a new line with a <br/> element

export default function NewlineToBreak({ children }) {
  return (
    <p>
      { children.split(/\n/).map((item, i) => {
        if (i === 0) {
          return item;
        }
        return [<br />, item];
      }) }
    </p>
  );
}

NewlineToBreak.propTypes = {
  children: PropTypes.node.isRequired,
};
