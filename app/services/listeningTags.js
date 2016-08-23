import createService from './createService';

export default createService({
  name: 'listeningTags',
  read: '/profiles/${username}/interests',
});
