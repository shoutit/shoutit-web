import React from 'react';
import Dialog from '../modals/Dialog';
import * as actionTypes from './actionTypes';

export function closeModal() {
  return {
    type: actionTypes.CLOSE_MODAL,
  };
}

export function openModal(modal) {
  return {
    type: actionTypes.OPEN_MODAL,
    payload: { modal },
  };
}

export function confirm(title, message, buttons) {
  return openModal(
    <Dialog title={ title } buttons={ buttons }>
      { message }
    </Dialog>
  );
}
