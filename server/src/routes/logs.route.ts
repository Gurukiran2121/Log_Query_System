import { Router } from "express";
import handlePostLogs from "../controllers/postLogs";
import handleGetLogs from "../controllers/getLogs";

const logs_route = Router();

logs_route.get("/", handleGetLogs);
logs_route.post("/", handlePostLogs);

export default logs_route;
