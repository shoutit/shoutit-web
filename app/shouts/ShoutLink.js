import React from 'react';
import { Link } from 'react-router';

export default function ShoutLink({ shout, children, ...props }) {
  return (
    <Link to={ `/shout/${shout.id}` } {... props}>
      { children }
    </Link>
  );
}
