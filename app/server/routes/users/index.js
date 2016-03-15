import express from "express";
import resources from "../../resources";

const router = express.Router();
const ShoutClient = resources.users();

router.route("/")
  .get(require("./list").default(ShoutClient));

router.route("/:id")
  .get(require("./get").default(ShoutClient))
  .post(require("./update").default(ShoutClient));

router.route("/:id/listeners")
  .get(require("./getListeners").default(ShoutClient));

router.route("/:id/listening")
  .get(require("./getListening").default(ShoutClient));

router.route("/:id/listen")
  .post(require("./listen").default(ShoutClient))
  .delete(require("./unlisten").default(ShoutClient));

export default router;
