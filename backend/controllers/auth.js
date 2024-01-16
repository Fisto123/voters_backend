import db from "../models/index.js";
import { userSchema } from "../validations/auth/user.js";
import { generateCode } from "../utils/randomcode.js";
import { sendActivationEmail } from "../utils/email.config.js";
import moment from "moment";
import bcrypt from "bcrypt";
import { activationSchema } from "../validations/auth/activation.js";
import { deactivationSchema } from "../validations/auth/deactivation.js";
import { loginSchema } from "../validations/auth/login.js";
import { generateToken } from "../utils/token.js";
import { changeSchema, forgotSchema } from "../validations/auth/forgot.js";
import { resetSchema } from "../validations/auth/reset.js";
const User = db.user;

export const register = async (req, res, next) => {
  const { email, firstname, lastname, phonenumber, password } = req.body;

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
        sendActivationEmail(
          email,
          activationcode,
          firstname,
          lastname,
          "activation"
        );
        await User.create({
          email,
          firstname,
          lastname,
          phonenumber,
          hashpassword,
          activationcode,
        });
      }
    }
    return res.status(200).json({
      message: "Successful. Activation code sent to your email",
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
      return res.status(200).json({
        message: "Account already activated. please login",
      });
    }
    if (activationcode != user.activationcode) {
      return res
        .status(400)
        .json({ message: "Invalid activation code. Please check your email" });
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

export const adminLogin = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({
      where: { email },
    });
    await loginSchema.validate(
      { email, password },
      {
        abortEarly: false,
      }
    );

    if (!user) {
      return res.status(409).json({
        message: "Email does not exist",
      });
    } else if (user.status === false) {
      return res.status(409).json({
        message: "Please activate your account to login",
      });
    } else {
      if (password && user?.hashpassword) {
        const ispasswordCorrect = await bcrypt.compare(
          process.env.secretPrefix + password,
          user.hashpassword
        );
        if (!ispasswordCorrect) {
          return res.status(404).json({
            message: "Inorrect password",
          });
        } else {
          const token = generateToken(user);
          res.setHeader("Authorization", `Bearer ${token}`);
          return res.status(200).send({ token });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  let user = await User.findOne({
    where: {
      email,
    },
  });

  try {
    await forgotSchema.validate(
      { email },
      {
        abortEarly: false,
      }
    );
    if (!user) {
      return res.status(404).send({ message: "email deosnt exist" });
    } else {
      const forgotcode = generateCode();
      if (forgotcode && email) {
        sendActivationEmail(
          user?.email,
          forgotcode,
          user?.firstname,
          user?.lastname,
          "forgot password"
        );
      }
      await User.update({ forgotcode }, { where: { email: user?.email } });
      return res
        .status(200)
        .send("Please check your mail for the 6digits code");
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, forgotcode, password } = req.body;
  let user = await User.findOne({
    where: {
      email,
    },
  });
  try {
    await resetSchema.validate(
      { email, forgotcode, password },
      {
        abortEarly: false,
      }
    );
    if (!user) {
      return res.status(400).send({ message: "Email deosnt exist" });
    } else if (forgotcode != user?.forgotcode) {
      return res
        .status(400)
        .send({ message: "Incorrect code, Please check your email" });
    } else {
      const hashpassword =
        password &&
        (await bcrypt.hash(process.env.secretPrefix + password, 10));
      await User.update({ hashpassword }, { where: { email: user?.email } });
      return res.status(200).send("Password changed successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  let { email, oldpassword, newpassword } = req.body;
  let user = await User.findOne({ where: { email } });
  try {
    await changeSchema.validate(
      { email, newpassword },
      {
        abortEarly: false,
      }
    );
    if (!user) {
      return res.status(404).send("Email doesnt exist");
    } else {
      const ispasswordCorrect = await bcrypt.compare(
        process.env.secretPrefix + oldpassword,
        user.hashpassword
      );
      if (!ispasswordCorrect) {
        return res.status(400).send("Old password is not correct");
      } else {
        const hashpassword =
          newpassword &&
          (await bcrypt.hash(process.env.secretPrefix + newpassword, 10));
        await User.update({ hashpassword }, { where: { email: user?.email } });
        return res.status(200).send("Password changed successfully");
      }
    }
  } catch (error) {
    next(error);
  }
};
