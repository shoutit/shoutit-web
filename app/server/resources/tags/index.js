import get from './get';
import list from './list';
import listen from './listen';
import unlisten from './unlisten';
import getListeners from './getListeners';
import getRelated from './getRelated';

export default function () {
  return {
    get: get(this, 'tags'),
    list: list(this, 'tags'),
    listen: listen(this, 'tags'),
    unlisten: unlisten(this, 'tags'),
    getListeners: getListeners(this, 'tags'),
    getRelated: getRelated(this, 'tags'),
  };
}
