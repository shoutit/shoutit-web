import React from 'react';
import SimpleModal from '../modals/SimpleModal';
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

export function confirm(header, body, buttons) {
  return openModal(
    <SimpleModal
      header={ header }
      buttons={ buttons }
    >
      { body }
    </SimpleModal>
  );
}
