import React from 'react';
import UserImage from './userImage.jsx';

/**
 * Display more user images
 * TODO: set layout, css, etc (e.g. show a grid of users)
 *
 * @param {Array}  options.users
 * @param {Number} options.max The maximum number of images to show
 */
export default function ManyUsersImage({ users, max=4 }) {
  return (
    <div>
      { users.slice(0, max).map((user, i) => <UserImage key={i} image={ user.image } />) }
    </div>
  )
}
