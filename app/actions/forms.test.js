import { expect } from 'chai';

import * as forms from '../actions/forms';

describe('actions/form', () => {

  describe('saveDraft', () => {
    const action = forms.saveDraft('a_form_name', { a_field: 'a_value' });
    it('should return the correct payload', () => {
      expect(action).to.have.deep.property('payload.name', 'a_form_name');
      expect(action).to.have.deep.property('payload.fields.a_field', 'a_value');
    });
  });

});
