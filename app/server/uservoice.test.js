import { expect } from 'chai';

import uservoice from './uservoice';

describe('uservoice', () => {

  it('should return the script content with the API key', () => {
    expect(uservoice).to.contain('NBlfnPFrkEttGeEqYUhA');
    expect(uservoice).to.contain('UserVoice');
  });

});
