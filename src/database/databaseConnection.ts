import debugCreator from "debug";
import mongoose from "mongoose";
import chalk from "chalk";
import environment from "../loadEnvironment.js";

mongoose.set("strictQuery", false);

const debug = debugCreator("compraLista:database");

const databaseConnection = async (databaseUrl: string) => {
  try {
    await mongoose.connect(databaseUrl, { dbName: "CompraLista" });
    mongoose.set("debug", environment.mongoDbDebug === "true");
    mongoose.set("toJSON", {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ret;
      },
    });
    debug(chalk.green("Connected successfully to the database"));
  } catch (error) {
    debug(
      chalk.red(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `there was an error connectiong to the database: ${error.message}`
      )
    );
  }
};

export default databaseConnection;
