import oauth from './auth/oauth';
import ShoutitClient from './resources';

const smsRE = /^(z|Z)[a-zA-Z0-9]{5,9}/;

export default function smsMiddleware(req, res, next) {
  if (!req.params.smscode || !req.params.smscode.match(smsRE)) {
    next();
  }
  oauth
    .sms(req, req.params.smscode)
    .then(user => {
      ShoutitClient.users().getShouts(req.session, user.username)
        .on('complete', (result, response) => {
          if (result instanceof Error || response.statusCode !== 200) {
            return next(result);
          }
          const firstShout = result.results[0];
          res.redirect('/shout/' + firstShout.id);
        });
    }, () => res.redirect('/'));
}
