import express from "express";
import registerUser from "../controllers/usersControllers/usersControlers.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post("/sign-up", registerUser);

export default usersRouter;
