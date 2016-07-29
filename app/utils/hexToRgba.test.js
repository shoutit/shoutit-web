import hexToRgba from './hexToRgba';
import { expect } from 'chai';

describe('utils/hexToRgba', () => {
  it('should convert a 8-hex string to rgba', () => {
    expect(hexToRgba('#FFC0C0C0')).to.eql([192, 192, 192, 1]);
  });
  it('should convert the alpha value', () => {
    expect(hexToRgba('#26FFE8A4')).to.eql([255, 232, 164, 0.15]);
  });
});
