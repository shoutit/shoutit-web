import createService from './createService';

export default createService({
  name: 'currencies',
  read: '/misc/currencies',
  cacheResponse: true,
});
