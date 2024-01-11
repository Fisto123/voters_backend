import jwt from "jsonwebtoken";
console.log(process.env.secretkey);
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      status: user.status,
      email: user.email,
    },
    "ZoJzc70XB0hXJNaPmnKkooOd5wiaJz0e",
    {
      expiresIn: "1h",
    }
  );
  return token;
};
