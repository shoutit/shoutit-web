import createService from './createService';

export default createService({
  name: 'sortTypes',
  read: '/shouts/sort_types',
  cacheResponse: true,
});
