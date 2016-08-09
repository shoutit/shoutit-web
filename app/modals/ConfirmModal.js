import React from 'react';
import SimpleModal from './SimpleModal';
import { openModal } from '../actions/ui';

export default function confirm(header, body, buttons) {
  return openModal(
    <SimpleModal
      header={ header }
      buttons={ buttons }
    >
      { body }
    </SimpleModal>
  );
}
