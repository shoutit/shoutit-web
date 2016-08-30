import React, { PropTypes } from 'react';
import Linkify from 'react-linkify';
import ReactEmoji from 'react-emoji';


export function renderItem(item, activeLink, activeEmoji) {
  if (activeLink && activeEmoji) {
    return (<Linkify>{ ReactEmoji.emojify(item) }</Linkify>);
  }
  if (activeLink && !activeEmoji) {
    return (<Linkify>{item}</Linkify>);
  }
  if (!activeLink && activeEmoji) {
    return ReactEmoji.emojify(item);
  }
  return item;
}

// Replace a new line with a <br/> element

export default function NewlineToBreak({ children, activeLink, activeEmoji }) {

  return (
    <p>
      { children.split(/\n/).map((item, i) => {
        if (i === 0) {
          return renderItem(item, activeLink, activeEmoji);
        }
        return [<br />, renderItem(item, activeLink, activeEmoji)];
      }) }
    </p>
  );
}

NewlineToBreak.propTypes = {
  activeEmoji: PropTypes.bool,
  activeLink: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
