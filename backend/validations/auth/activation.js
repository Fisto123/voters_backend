import yup from "yup";

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

export const activationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .matches(emailRegex, "Invalid email address")
    .required("Email is required")
    .max(70, "Email must not be more than 70 characters"),
  activationcode: yup
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
});
