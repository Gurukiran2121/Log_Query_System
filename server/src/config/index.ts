import { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly apiVersion: string;
  readonly whiteListOrigins: readonly string[];
}

const config: AppConfig = Object.freeze({
  port: Number(process.env.PORT) || 8000,
  nodeEnv: String(process.env.NODE_ENV) || "development",
  apiVersion: "/api/v1",
  whiteListOrigins: ["mydomain.com"],
});

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (config.nodeEnv === "development") {
      console.log(`CORS is running at ${config.nodeEnv} env`);
      return callback(null, true);
    }
    if (requestOrigin && config.whiteListOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `CORS error the origin ${requestOrigin} is not allowed by cors`
        ),
        false
      );
    }
  },
};
export default config;
