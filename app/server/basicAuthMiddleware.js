import auth from 'basic-auth';

export default function basicAuthMiddleware(req, res, next) {
  if (req.url === '/heartbeat') {
    next();
    return;
  }
  const credentials = auth(req);
  if (!credentials || credentials.name !== process.env.BASIC_AUTH_USERNAME || credentials.pass !== process.env.BASIC_AUTH_PASSWORD) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="shoutit"');
    res.end('Access denied');
    return;
  }
  next();
}
