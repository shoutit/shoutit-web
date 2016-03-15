import express from "express";

import shouts from "./shouts";
import users from "./users";
import discover from "./discover";
import tags from "./tags";
import pusher from "./pusher";
import conversations from "./conversations";
import auth from "./auth";
import misc from "./misc";

const apiRouter = new express.Router();

apiRouter.use("/shouts", shouts);
apiRouter.use("/users", users);
apiRouter.use("/discover", discover);
apiRouter.use("/tags", tags);
apiRouter.use("/pusher", pusher);
apiRouter.use("/conversations", conversations);
apiRouter.use("/auth", auth);
apiRouter.use("/misc", misc);

export default apiRouter;
