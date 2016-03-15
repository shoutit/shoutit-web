import express from "express";
import resources from "../../resources";

const router = express.Router();
const ShoutClient = resources.shouts();

router.route("/")
  .get(require("./list").default(ShoutClient))
  .post(require("./create").default(ShoutClient));

router.route("/:id")
  .get(require("./get").default(ShoutClient))
  .delete(require("./delete").default(ShoutClient));

router.route("/:id/related")
    .get(require("./get_related").default(ShoutClient));

router.route("/:id/call")
  .get(require("./getCall").default(ShoutClient));

router.route("/:id/reply")
  .post(require("./reply").default(ShoutClient));

export default router;
