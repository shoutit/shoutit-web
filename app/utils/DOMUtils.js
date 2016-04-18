import { getVariation } from './APIUtils';
import { imagesPath } from '../config';

export function getStyleBackgroundImage(path, variation) {
  if (!path) {
    return {
      backgroundImage: `url("${imagesPath}/pattern@2x.png")`,
      backgroundSize: '250px 409px',
      backgroundRepeat: 'repeat',
    };
  }
  return {
    backgroundImage: `url("${variation ? getVariation(path, variation) : path}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
