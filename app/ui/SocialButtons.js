import React from 'react';
import Button from './Button';

export function FacebookButton(props) {
  return (
    <Button
      { ...props }
      kind="social"
      icon="facebook"
      className="facebook"
    />
  );
}

export function GoogleButton(props) {
  return (
    <Button
      { ...props }
      kind="social"
      icon="google-plus"
      className="google"
    />
  );
}
