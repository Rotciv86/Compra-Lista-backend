import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcryptjs from "bcryptjs";
import databaseConnection from "../../database/databaseConnection.js";
import User from "../../database/models/User.js";
import app from "../app.js";
import type { RegisterUserData, UserCredentials } from "../types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await databaseConnection(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given the POST /users/sign-up endpoint", () => {
  describe("When it receives a request with a not existent database username'Víctor' and password '1234'", () => {
    test("Then it should respond with status 201 and the message:'User Víctor has been created successfully'", async () => {
      const requestBody: RegisterUserData = {
        username: "Víctor",
        password: "1234",
      };

      const expectedStatus = 201;
      const expectedMessage = {
        message: "User Víctor has been created successfully at the database",
      };

      const res = await request(app)
        .post("/users/sign-up")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with an existent database username 'James' and password '4321'", () => {
    test("Then it should respon with status 500 and the message:'An error has ocurred on registration'", async () => {
      await User.create({
        username: "James",
        password: await bcryptjs.hash("4321", 10),
      });

      const requestBody: RegisterUserData = {
        username: "James",
        password: "4321",
      };
      const expectedStatus = 500;
      const expectedMessage = {
        error: "An error has ocurred on registration",
      };

      const res = await request(app)
        .post("/users/sign-up")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  beforeEach(async () => {
    const hashedPassword = await bcryptjs.hash("1234", 10);
    const registerUserData = {
      username: "Mario",
      password: hashedPassword,
    };

    await User.create(registerUserData);
  });

  describe("When it receives a request with an existent database username 'Mario' and password '1234'", () => {
    test("Then it should respond with a 200 status and their corresponding token", async () => {
      const expectedStatus = 200;
      const loginData = { username: "Mario", password: "1234" };
      const userToken = "token";

      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(userToken);
    });
  });

  describe("When it receives a request with a not existent in database username 'Round' and password '1313'", () => {
    test("Then it should respond with status code 401 and the message 'Wrong credentials'", async () => {
      const requestBody: UserCredentials = {
        username: "Round",
        password: "1313",
      };
      const expectedStatus = 401;
      const expectedMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post("/users/login")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
