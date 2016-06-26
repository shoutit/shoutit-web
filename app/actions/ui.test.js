/* eslint-env mocha, browser */
import { expect } from 'chai';
import * as actionTypes from '../actions/actionTypes';
import * as ui from './ui';

describe('actions/ui', () => {

  describe('closeModal', () => {
    it('should return the right action type', () => {
      const action = ui.closeModal();
      expect(action).to.have.property('type', actionTypes.CLOSE_MODAL);
    });
  });

  describe('openModal', () => {
    it('should return the right action type', () => {
      const action = ui.openModal('foo');
      expect(action).to.have.property('type', actionTypes.OPEN_MODAL);
    });
    it('should return the right payload', () => {
      const action = ui.openModal('foo');
      expect(action.payload).to.have.property('modal', 'foo');
    });
  });

});
