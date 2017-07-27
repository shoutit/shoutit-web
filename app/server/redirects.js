import url from 'url';
import MobileDetect from 'mobile-detect';
import { getValidIPv4Address } from '../utils/InternetUtils';
import mixpanel from './mixpanelServer';

const redirects = {
  '/discover': (req, res) => res.redirect(`/discover/${req.session.currentLocation.country.toLowerCase()}`),
  '/auth/verify_email': (req, res) => res.redirect(`/signup/verify/${req.query.token}`),
  '/services/reset_password': (req, res) => res.redirect(`/login/password/${req.query.reset_token}`),
  '/s/:shoutId': (req, res) => res.redirect(`/shout/${req.params.shoutId}`),
  '/u/:username': (req, res) => res.redirect(`/user/${req.params.username}`),
  '/t/:tagName': (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  '/m/:msgId': (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  '/search/:term/shouts': (req, res) => res.redirect(`/messages/${req.params.msgId}`),
  '/app(-:code*)?': (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);
    let os = 'web';
    if (md.is('AndroidOS')) {
      os = 'android';
    } else if (md.is('iOS')) {
      os = 'ios';
    } else if (md.mobile()) {
      os = 'mobile';
    }
    const osRedirects = {
      android: 'https://play.google.com/store/apps/details',  // Package name is added later with other parameters
      ios: 'https://itunes.apple.com/app/id947017118',
      mobile: '/',
      web: '/',
    };
    const code = typeof req.params.code !== 'undefined' ? req.params.code : '$direct';
    const ip = getValidIPv4Address(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    const utms = {
      utm_campaign: code,
      utm_medium: req.query.utm_medium || '',
      utm_source: req.query.utm_source || '',
      utm_content: req.query.utm_content || '',
      utm_term: req.query.utm_term || '',
    };
    const trackProperties = {
      ip,
      ...utms,
      md_ua: md.userAgent() || req.headers['user-agent'],
      md_os: md.os() || 'Desktop',
    };
    // Todo (Nour): can this be done async?
    mixpanel.track('app_link_open', trackProperties);
    const platformURL = url.format({
      pathname: osRedirects[os],
      query: {
        ...utms,
        ...os === 'android' && { id: 'com.shoutit.app.android' },
      },
    });
    res.redirect(platformURL);
  },
};

export default redirects;
