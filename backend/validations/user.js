import yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

export const userSchema = yup.object().shape({
  firstname: yup
    .string()
    .required("firstname is required")
    .trim()
    .min(3, "Firstname must be not be less 3 characters")
    .max(30, "Firstname must not be more than 30 characters"),
  lastname: yup
    .string()
    .required("surname is required")
    .trim()
    .min(3, "Surname must be not be less 3 characters")
    .max(30, "Surname must not be more than 30 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .matches(emailRegex, "Invalid email address")
    .required("Email is required")
    .min(13, "email must be not be less 13 characters")
    .max(70, "email must not be more than 70 characters"),
  password: yup
    .string()
    .trim()
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not be more than 16 characters"),
  phonenumber: yup
    .string()
    .matches(/^[0]\d{10,15}$/, {
      message: "Invalid Nigerian phone number",
    })
    .min(11, "Phone number must be at least 11 characters")
    .max(16, "Phone number must be at least 16 characters"),
});
