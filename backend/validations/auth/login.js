import yup from "yup";

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .matches(emailRegex, "Invalid email address")
    .required("Email is required")
    .max(70, "Email must not be more than 70 characters"),
  password: yup.string().trim().required("Password is required"),
});

export const votersloginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .matches(emailRegex, "Invalid email address")
    .required("Email is required")
    .max(70, "Email must not be more than 70 characters"),
  password: yup
    .string()
    .required("Password is required")
    .test({
      name: "is-valid-number",
      message: "password must be a valid number",
      test: (value) => !isNaN(value),
    })
    .test("len", "password must be exactly 8 characters", (val) => {
      if (val) {
        const strVal = val.toString();
        return strVal.length === 8;
      }
      return false;
    }),
});
