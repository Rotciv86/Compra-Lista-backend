import express from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../controllers/usersControllers/usersControlers.js";
import registerUserSchema from "../schemas/registerUserSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post(
  "/sign-up",
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post("/login", loginUser);

export default usersRouter;
