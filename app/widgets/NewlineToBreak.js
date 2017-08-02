import React, { PropTypes } from 'react';
import Linkify from 'react-linkify';

// Replace a new line with a <br/> element

export default function NewlineToBreak({ children, shouldBeLinkified }) {
  const breakChildrenIntoLines = () => {
    return children.split(/\n/).map((item, i) => {
      if (i === 0) {
        return item;
      }
      return [<br />, item];
    });
  };

  const LinkifiedChildren = shouldBeLinkified ?
    (<Linkify properties={{ target: '_blank', rel: 'noopener noreferrer' }}>
      { breakChildrenIntoLines() }
    </Linkify>) :
    breakChildrenIntoLines();

  return (
    <p>{ LinkifiedChildren }</p>
  );
}

NewlineToBreak.propTypes = {
  children: PropTypes.node.isRequired,
  shouldBeLinkified: PropTypes.bool,
};
