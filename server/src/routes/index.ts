import { Router } from "express";
import logs_route from "./logs.route";

const mainAppRoutes = Router();

mainAppRoutes.use("/logs", logs_route);

export default mainAppRoutes;
