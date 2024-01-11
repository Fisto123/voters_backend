import yup from "yup";

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

export const resetSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .matches(emailRegex, "Invalid email address")
    .required("Email is required")
    .max(70, "Email must not be more than 70 characters"),
  forgotcode: yup
    .number()
    .required("Activation code is required")
    .test({
      name: "is-valid-number",
      message: "Activation code must be a valid number",
      test: (value) => !isNaN(value),
    })
    .test("len", "Activation code must be exactly 6 characters", (val) => {
      if (val) {
        const strVal = val.toString();
        return strVal.length === 6;
      }
      return false;
    }),
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
});
