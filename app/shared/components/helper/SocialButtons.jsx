import React from 'react';
import Button from '../../../ui/Button';
import SVGIcon from '../helper/SVGIcon';

export function FacebookButton(props) {
  return (
    <Button
      {...props}
      leftIcon={ <SVGIcon name="facebook" fill /> }
      className="facebook"
    />
  );
}

export function GoogleButton(props) {
  return (
    <Button
      {...props}
      leftIcon={ <SVGIcon name="google-plus" fill /> }
      className="google"
    />
  );
}
