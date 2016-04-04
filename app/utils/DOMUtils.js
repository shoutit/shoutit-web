import { getVariation } from './APIUtils';
import { imagesPath } from '../config';

export function getStyleBackgroundImage(path, variation) {
  if (!path) {
    return {
      backgroundImage: `url("${imagesPath}/pattern@2x.png")`,
      backgroundSize: '100%',
      backgroundRepeat: 'repeat',
    };
  }
  return {
    backgroundImage: `url("${getVariation(path, variation)}")`,
  };
}
