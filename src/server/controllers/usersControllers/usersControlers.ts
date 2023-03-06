import type { NextFunction, Request, Response } from "express";
import type { RegisterUserData } from "../../types.js";
import bcryptjs from "bcryptjs";
import User from "../../../database/models/User.js";
import CustomError from "../../../utils/CustomError.js";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as RegisterUserData;

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const newUser = await User.create({ username, password: hashedPassword });

    res
      .status(201)
      .json({
        message: `User ${newUser.username} has been created successfully at the database`,
      });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "An error has ocurred on registration"
    );
    next(customError);
  }
};

export default registerUser;
