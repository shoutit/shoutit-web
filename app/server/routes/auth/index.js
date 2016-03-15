import express from "express";
import resources from "../../resources";
import changePassword from "./changePassword";

const router = express.Router();
const ShoutClient = resources.auth();

router.route("/change_password")
  .post(changePassword(ShoutClient));

export default router;
