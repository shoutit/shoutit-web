// Redirect  trimming out slashes from url
export default function slashMiddleware(req, res, next) {
  if (req.path.length > 1 && req.path.substr(-1) === '/') {
    const search = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + search);
    return;
  }
  next();
}
