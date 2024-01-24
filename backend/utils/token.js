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

export const generateTokenVoter = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      fullname: user.fullname,
      idnumber: user.idnumber,
      electionid: user.electionid,
      email: user.email,
    },
    process.env.secretkey,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
