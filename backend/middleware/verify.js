import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  console.log(authorizationHeader);
  const token = authorizationHeader.split(" ")[1];
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.secretkey, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authentitcated!");
  }
};
