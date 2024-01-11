import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      status: user.status,
      email: user.email,
    },
    process.env.secretkey,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
