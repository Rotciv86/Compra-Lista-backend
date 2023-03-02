import express from "express";
import morgan from "morgan";
import environment from "../loadEnvironment.js";
import cors from "cors";

const { corsAllowedDomain } = environment;

const app = express();

app.disable("x-powered-by");
const allowedOrigins = [corsAllowedDomain];

const options: cors.CorsOptions = { origin: allowedOrigins };

app.use(cors(options));
app.use(express.json());
app.use(morgan("dev"));
app.use("/", (req, res) => {
  res.send("It is working");
});

export default app;
