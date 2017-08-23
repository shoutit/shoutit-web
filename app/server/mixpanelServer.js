import Mixpanel from 'mixpanel';
import { MIXPANEL_TOKEN } from '../config';

const mixpanel = Mixpanel.init(MIXPANEL_TOKEN, {
  protocol: 'https',
});

export default mixpanel;
