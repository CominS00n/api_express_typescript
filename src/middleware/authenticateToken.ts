import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  

  if (token == null)
    res.status(401).json({ message: "Unauthorized", status: 401 });

  try {
    const user = jwt.verify(token, "supersecret");
    res.cookie("user", user, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden", status: 403 });
  }
};
