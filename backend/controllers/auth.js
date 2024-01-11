import db from "../models/index.js";
import { userSchema } from "../validations/user.js";
import { generateCode } from "../utils/randomcode.js";
import { sendActivationEmail } from "../utils/email.config.js";
const User = db.user;
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { email, firstname, lastname, phonenumber, password, profilepicture } =
    req.body;

  try {
    await userSchema.validate(
      { email, firstname, lastname, phonenumber, password },
      {
        abortEarly: false,
      }
    );
    let doesPhoneExist = await User.findOne({ where: { phonenumber } });
    let doesEmailExist = await User.findOne({ where: { email } });
    if (doesPhoneExist) {
      return res.status(409).json({ message: "Phonenumber already exists" });
    } else if (doesEmailExist) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      const hashpassword = password && (await bcrypt.hash(password, 10));
      let activationcode = generateCode();
      if ((email, activationcode && firstname && lastname)) {
        sendActivationEmail(email, activationcode, firstname, lastname);
        await User.create({
          email,
          firstname,
          lastname,
          phonenumber,
          hashpassword,
          profilepicture,
          activationcode,
        });
      }
    }

    return res.status(200).json({
      email,
      firstname,
      lastname,
      phonenumber,
      password,
      phonenumber,
      profilepicture,
      message: "created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const yupErrors = {};
      error.inner.forEach((e) => {
        yupErrors[e.path] = e.message;
      });
      return res
        .status(400)
        .json({ message: "Validation error", errors: yupErrors });
    }

    // Handle other errors
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
