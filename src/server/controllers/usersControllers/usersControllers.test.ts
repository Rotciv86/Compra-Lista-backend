import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../../../database/models/User.js";
import type { RegisterUserData } from "../../types.js";
import { registerUser } from "./usersControlers.js";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given the registerUser controller", () => {
  describe("When it receives a request with username 'Víctor', password '2689' and dosen't exists in the database", () => {
    test("Then its method status should be called with a 201 and its method json should be called with Victor's data", async () => {
      const expectedEstatusCode = 201;
      const registerData: RegisterUserData = {
        username: "Víctor",
        password: "2689",
      };

      const req: Partial<Request> = { body: registerData };

      const hashedPassword = "95847156";
      const userId = new mongoose.Types.ObjectId();

      bcryptjs.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockResolvedValue({
        ...registerData,
        pasword: hashedPassword,
        _id: userId,
      });

      const expectedMessage = {
        message: "User Víctor has been created successfully at the database",
      };

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedEstatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Víctor' and password '4231' and it already exists at the data base", () => {
    test("Then it should call the next function with a CustomError", async () => {
      const registerData: RegisterUserData = {
        username: "Víctor",
        password: "4231",
      };

      const req: Partial<Request> = { body: registerData };

      const next = jest.fn();
      const error = new Error("This user already exists");

      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
