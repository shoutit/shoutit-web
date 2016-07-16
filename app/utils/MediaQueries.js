import React, { PropTypes } from 'react';
import MediaQuery from 'react-responsive';

export const SMARTPHONE = {
  maxWidth: 768,
};
export const DESKTOP = {
  minWidth: 769,
};

export function Smartphone(props) {
  return <MediaQuery { ...SMARTPHONE }>{ props.children }</MediaQuery>;
}

export function Desktop(props) {
  return <MediaQuery { ...DESKTOP }>{ props.children }</MediaQuery>;
}

Smartphone.propTypes = Desktop.propTypes = {
  children: PropTypes.node.isRequired,
};
