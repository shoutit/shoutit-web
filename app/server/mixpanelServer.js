import Mixpanel from 'mixpanel';
import { mixpanelToken } from '../config';

const mixpanel = Mixpanel.init(mixpanelToken, {
  protocol: 'https',
});

export default mixpanel;
