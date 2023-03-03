import CustomError from "./CustomError.js";

describe("Given the CustomError class", () => {
  describe("When it is initialized with the message 'Error' statusCode '500' and publicMessage 'There was a server error'", () => {
    test("Then it should create a new instance object from its class with the same data", () => {
      const expectedCustomError = {
        message: "Error",
        status: 500,
        publicMessage: "There was a server error, try again later",
      };
      const { message, status, publicMessage } = expectedCustomError;

      const expectedCustomErrorKeys = Object.keys(expectedCustomError);
      const [messageProperty, statusProperty, publicMessageProperty] =
        expectedCustomErrorKeys;

      const resultCustomError = new CustomError(message, status, publicMessage);

      expect(resultCustomError).toHaveProperty(messageProperty, message);
      expect(resultCustomError).toHaveProperty(statusProperty, status);
      expect(resultCustomError).toHaveProperty(
        publicMessageProperty,
        publicMessage
      );
    });
  });
});
