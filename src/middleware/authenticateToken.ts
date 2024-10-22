import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (token == null) res.status(401).json({ error: "Unauthorized" });

  try {
    const user = jwt.verify(token, "supersecret");
    res.cookie("user", user);
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden" });
  }
};
