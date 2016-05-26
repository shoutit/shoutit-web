import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ListItem from '../ui/ListItem';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { formatPrice } from '../utils/CurrencyUtils';

if (process.env.BROWSER) {
  require('./ShoutListItem.scss');
}

export default function ShoutListItem({
  shout,
  size = 'medium',
  link = true,
  onClick,
}) {

  const image = <span className="ShoutListItem-thumbnail" style={ getStyleBackgroundImage(shout.thumbnail, 'small') } />;
  let content = (
    <ListItem className="ShoutListItem" size={ size } nowrap start={ image } onClick={ onClick }>
      <div className="ShoutListItem-child">
        <div className="ShoutListItem-title">{ shout.title }</div>
        <div className="ShoutListItem-details">
          { formatPrice(shout.price, shout.currency) }
        </div>
      </div>
    </ListItem>
  );
  if (link) {
    content = (
      <Link to={ `/shout/${shout.id}` }>
        { content }
      </Link>
    );
  }
  return content;
}

ShoutListItem.propTypes = {
  shout: PropTypes.object.isRequired,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
