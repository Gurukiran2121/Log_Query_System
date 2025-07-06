import express from "express";
import helmet from "helmet";
import timeOut from "connect-timeout";
import cors from "cors";
import errorHandler from "./errorHandler/error.handler";
import mainAppRoutes from "./routes";
import config, { corsOptions } from "./config";
const app = express();

app.use(helmet());
app.use(express.json());
app.use(timeOut("5s"));
app.use(cors(corsOptions));

//logs routes
app.use(`${config.apiVersion}`, mainAppRoutes);

//global error handler
app.use(errorHandler);

export default app;
