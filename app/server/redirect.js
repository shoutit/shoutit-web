import MobileDetect from "mobile-detect";

export default function(app) {

  // Short url redirects
  app.get("/s/:shoutId", (req, res) => res.redirect(`/shout/${req.params.shoutId}`));
  app.get("/u/:username", (req, res) => res.redirect(`/user/${req.params.username}`));
  app.get("/t/:tagName", (req, res) => res.redirect(`/tag/${req.params.tagName}`));
  app.get("/m/:msgId", (req, res) => res.redirect(`/messages/${req.params.msgId}`));
  app.get("/search/:term/shouts", (req, res) => res.redirect(`/search/${req.params.term}`));

  app.get("/profile", (req, res) => {
    const user = req.session ? req.session.user : null;
    if (!user) {
      return res.redirect("/login");
    }
    res.redirect(`/user/${user.username}`);
  });

  app.get("/messages/?*", (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    next();
  });

  app.get("/app", (req, res) => {
    const md = new MobileDetect(req.headers["user-agent"]);
    if (md.is("iOS")) {
      res.redirect("https://geo.itunes.apple.com/de/app/shoutit-app/id947017118?mt=8");
    } else if (md.is("AndroidOS")) {
      res.redirect("https://play.google.com/store/apps/details?id=com.shoutit.app.android");
    } else {
      res.redirect("/");
    }
  });
}
