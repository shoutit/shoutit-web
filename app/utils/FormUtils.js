import first from 'lodash/first';
import last from 'lodash/last';
import some from 'lodash/some';

export function areEquals(...changes) {
  return some(changes, change => {
    return first(change) !== last(change);
  });
}
