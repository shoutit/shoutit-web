import createService from './createService';

export default createService({
  name: 'listeners',
  read: '/profiles/${username}/listeners',
});
