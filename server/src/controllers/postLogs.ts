import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";

// 1. Zod schema is the single source of truth.
const logSchema = z.object({
  level: z.enum(["error", "warn", "info"]),
  message: z.string(),
  resourceId: z.string(),
  timestamp: z.string().datetime(),
  traceId: z.string(),
  spanId: z.string(),
  commit: z.string(),
  metadata: z.record(z.any()), // Changed to z.any() for flexibility
});

// 2. Type is inferred from the schema.
export type Log = z.infer<typeof logSchema>;

const handlePostLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = logSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Invalid log format",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const newLog: Log = validationResult.data;

    const logsFilePath = path.join(process.cwd(), "database", "logs.json");
    const fileData = await fs.readFile(logsFilePath, "utf8");
    const existingLogs: Log[] = JSON.parse(fileData);

    const existingSpanIds = new Set(
      existingLogs.map((item: Log) => item.spanId)
    );
    if (existingSpanIds.has(newLog.spanId)) {
      // BUG FIX: Added 'return' to stop execution after sending the error.
      res.status(409).json({
        message: "Duplicate log: A log with this spanId already exists.",
      });
      return;
    }

    existingLogs.push(newLog);
    await fs.writeFile(
      logsFilePath,
      JSON.stringify(existingLogs, null, 2),
      "utf8"
    );

    res.status(201).json(newLog);
    return;
  } catch (error) {
    next(error);
  }
};

export default handlePostLogs;
