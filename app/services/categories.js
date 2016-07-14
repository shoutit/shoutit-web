import createService from './createService';

export default createService({
  name: 'categories',
  read: '/shouts/categories',
  cacheResponse: true,
});
