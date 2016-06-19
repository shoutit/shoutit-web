import React from 'react';
import Button from './Button';

export function FacebookButton(props) {
  return (
    <Button
      { ...props }
      icon="facebook"
      className="facebook"
    />
  );
}

export function GoogleButton(props) {
  return (
    <Button
      { ...props }
      icon="google-plus"
      className="google"
    />
  );
}
