import { Request, Response, NextFunction } from "express";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (token === null)
      res.status(401).json({ message: "Unauthorized", status: 401 });

    try {
      next();
    } catch (error) {
      res.status(403).json({ message: "Forbidden", status: 403 });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", status: 401 });
  }
};
