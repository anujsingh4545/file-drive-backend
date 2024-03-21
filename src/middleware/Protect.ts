import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import "dotenv/config";

export const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const temp = req.headers["authorization"] as string | undefined;

  if (!temp) {
    return res.status(400).send({
      messsage: "no token found",
      stats: false,
    });
  }

  const token = temp.split(" ")[1];

  try {
    const verify: string | JwtPayload = jwt.verify(token, process.env.JWTSECRET!);
    if (!verify || typeof verify == "string") {
      return res.status(400).send({
        message: "verification failed",
        success: false,
      });
    }

    req.body.userId = verify.id;
    next();
  } catch (error: any) {
    return res.status(400).send({
      message: "Something went wrong",

      success: false,
    });
  }
};
