import MobileDetect from 'mobile-detect';

const redirects = {
  '/discover': (req, res) => res.redirect(`/discover/${req.session.currentLocation.country.toLowerCase()}`),
  '/auth/verify_email': (req, res) => res.redirect(`/signup/verify/${req.query.token}`),
  '/services/reset_password': (req, res) => res.redirect(`/login/password/${req.query.reset_token}`),
  '/s/:shoutId': (req, res) => res.redirect(`/shout/${req.params.shoutId}`),
  '/u/:username': (req, res) => res.redirect(`/user/${req.params.username}`),
  '/t/:tagName': (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  '/m/:msgId': (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  '/search/:term/shouts': (req, res) => res.redirect(`/messages/${req.params.msgId}`),
  '/app': (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);
    if (md.is('iOS')) {
      res.redirect('https://geo.itunes.apple.com/de/app/shoutit-app/id947017118?mt=8');
    } else if (md.is('AndroidOS')) {
      res.redirect('https://play.google.com/store/apps/details?id=com.shoutit.app.android');
    } else {
      res.redirect('/');
    }
  },
};

export default redirects;
