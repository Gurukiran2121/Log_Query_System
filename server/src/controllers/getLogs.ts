import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { Log } from "./postLogs";

const handleGetLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      level,
      resourceId,
      message,
      traceId,
      spanId,
      commit,
      timestamp_start,
      timestamp_end,
    } = req.query;

    console.log(timestamp_end, timestamp_start);

    const logsFilePath = path.join(process.cwd(), "database", "logs.json");

    const logsData = await fs.readFile(logsFilePath, "utf8");
    let logs = JSON.parse(logsData);
    let filteredLogs = logs;

    if (level) {
      filteredLogs = filteredLogs.filter((log: Log) => log.level === level);
    }
    if (resourceId) {
      filteredLogs = filteredLogs.filter(
        (log: Log) => log.resourceId === resourceId
      );
    }

    if (message) {
      filteredLogs = filteredLogs.filter((log: Log) =>
        log.message
          .toLowerCase()
          .includes((message as string).trim().toLowerCase())
      );
    }

    if (traceId) {
      filteredLogs = filteredLogs.filter((log: Log) => log.traceId === traceId);
    }

    if (spanId) {
      filteredLogs = filteredLogs.filter((log: Log) => log.spanId === spanId);
    }

    if (commit) {
      filteredLogs = filteredLogs.filter((log: Log) => log.commit === commit);
    }

    if (timestamp_start) {
      filteredLogs = filteredLogs.filter(
        (log: Log) =>
          new Date(log.timestamp) >= new Date(timestamp_start as string)
      );
    }

    if (timestamp_end) {
      filteredLogs = filteredLogs.filter(
        (log: Log) =>
          new Date(log.timestamp) <= new Date(timestamp_end as string)
      );
    }

    filteredLogs.sort(
      (
        a: { timestamp: string | number | Date },
        b: { timestamp: string | number | Date }
      ) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.status(200).json({ logs: filteredLogs, total: logs.length });
    return;
  } catch (error) {
    next(error);
  }
};

export default handleGetLogs;
