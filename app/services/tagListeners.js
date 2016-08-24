import createService from './createService';

export default createService({
  name: 'tagListeners',
  read: '/tags/${slug}/listeners',
});
