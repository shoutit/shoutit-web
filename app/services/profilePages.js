import createService from './createService';

export default createService({
  name: 'profilePages',
  read: '/profiles/${username}/pages',
});
