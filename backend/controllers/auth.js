import db from "../models/index.js";
import { userSchema } from "../validations/user.js";
import { generateCode } from "../utils/randomcode.js";
import { sendActivationEmail } from "../utils/email.config.js";
import moment from "moment";
const User = db.user;
import bcrypt from "bcrypt";
import { activationSchema } from "../validations/activation.js";
import { deactivationSchema } from "../validations/deactivation.js";
import { profilepixSchema } from "../validations/profilepix.js";
import { validationResult, check } from "express-validator";

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
      const hashpassword =
        password &&
        (await bcrypt.hash(process.env.secretPrefix + password, 10));
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
      message: "created successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const activateUser = async (req, res, next) => {
  let { email, activationcode } = req.body;

  try {
    await activationSchema.validate(
      { email, activationcode },
      { abortEarly: false }
    );
    let user = await User.findOne({ where: { email } });
    if (user.status) {
      return res.status(409).json({
        message: "Your account has already been activated",
      });
    }
    if (activationcode != user.activationcode) {
      return res
        .status(400)
        .json({ message: "Activation code is not correct" });
    } else {
      await User.update(
        { status: true, dateactivated: moment().format("YYYY-MM-DD HH:mm:ss") },
        {
          where: {
            email,
            activationcode,
          },
        }
      );
      return res.status(200).json({ message: "User activated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  let { email } = req.body;

  try {
    await deactivationSchema.validate({ email }, { abortEarly: false });
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(409).json({
        message: "Account doesnt exist",
      });
    }
    if (user?.status === false) {
      return res.status(409).json({
        message: "This account has already been deactivated",
      });
    } else {
      await User.update(
        {
          status: false,
          datedeactivated: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          where: {
            email,
          },
        }
      );
      return res.status(200).json({ message: "User deactivated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  let { profilepicture } = req.body;
  let { userid } = req.params;

  try {
    if (!profilepicture) {
      return res
        .status(400)
        .json({ message: "Please provide profile picture" });
    } else if (!userid) {
      return res.status(400).json({ message: "Please provide userid" });
    }
    await User.update(
      { profilepicture },
      {
        where: {
          id: userid,
        },
      }
    );
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully " });
  } catch (error) {
    next(error);
  }
};
