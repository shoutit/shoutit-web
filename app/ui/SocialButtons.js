import React from 'react';
import Button from './Button';
import Icon from './Icon';

export function FacebookButton(props) {
  return (
    <Button
      {...props}
      leftIcon={ <Icon name="facebook" fill /> }
      className="facebook"
    />
  );
}

export function GoogleButton(props) {
  return (
    <Button
      {...props}
      leftIcon={ <Icon name="google-plus" fill /> }
      className="google"
    />
  );
}
