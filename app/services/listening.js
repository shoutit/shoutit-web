import createService from './createService';

export default createService({
  name: 'listening',
  read: '/profiles/${username}/listening',
});
