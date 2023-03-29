import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import type { RegisterUserData } from "../../types.js";
import { loginUser, registerUser } from "./usersControlers.js";
import CustomError from "../../../utils/CustomError.js";

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

describe("Given the loginUser controller", () => {
  const req: Partial<Request> = {
    body: { username: "Juan", password: "1234" },
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockedUser = {
    _id: "2",
    username: "paco",
    password: "1254",
  };
  const next = jest.fn() as Partial<NextFunction>;

  describe("When it receives a request with the username 'Juan' with the password 1234 in its body", () => {
    test("Then it should call the status method of the response  with value 200 and json method with a token", async () => {
      jwt.sign = jest.fn().mockReturnValueOnce("1234");

      bcryptjs.compare = jest.fn().mockResolvedValueOnce(true);

      User.findOne = jest.fn().mockResolvedValue(mockedUser);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "1234" });
    });
  });

  describe("When it receives a request with a username 'admin' and the user is not found", () => {
    test("Then the function next should be invoked with a CustomError", async () => {
      const error = new CustomError(
        "Username not found",
        401,
        "Wrong credentials"
      );

      User.findOne = jest.fn().mockResolvedValueOnce(null);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request with a username 'admin' and password 'admin', and the password is not correct", () => {
    test("Then the function next should be invoked with a CustomError", async () => {
      const error = new CustomError(
        "Incorrect password",
        401,
        "Wrong credentials"
      );

      User.findOne = jest.fn().mockResolvedValueOnce(mockedUser);
      bcryptjs.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
