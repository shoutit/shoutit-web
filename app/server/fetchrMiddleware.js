// Redirect  trimming out slashes from url
import Fetchr from 'fetchr';

export const fetchrPath = '/fetchr';

export default function fetchrMiddleware(app) {


  app.use((req, res, next) => {
    req.fetchr = new Fetchr({
      xhrPath: fetchrPath,
      req,
    });
    next();
  });

}
