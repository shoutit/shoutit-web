import MobileDetect from "mobile-detect";

const redirects = {
  "/s/:shoutId": (req, res) => res.redirect(`/shout/${req.params.shoutId}`),
  "/u/:username": (req, res) => res.redirect(`/user/${req.params.username}`),
  "/t/:tagName":  (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  "/m/:msgId": (req, res) => res.redirect(`/tag/${req.params.tagName}`),
  "/search/:term/shouts": (req, res) => res.redirect(`/messages/${req.params.msgId}`),

  "/profile": (req, res) => {
    const user = req.session ? req.session.user : null;
    if (!user) {
      return res.redirect("/login");
    }
    res.redirect(`/user/${user.username}`);
  },

  "/messages/?*": (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    next();
  },

  "/app": (req, res) => {
    const md = new MobileDetect(req.headers["user-agent"]);
    if (md.is("iOS")) {
      res.redirect("https://geo.itunes.apple.com/de/app/shoutit-app/id947017118?mt=8");
    } else if (md.is("AndroidOS")) {
      res.redirect("https://play.google.com/store/apps/details?id=com.shoutit.app.android");
    } else {
      res.redirect("/");
    }
  }

};

export default redirects;
