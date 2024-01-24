import yup from "yup";

export const candidateSchema = yup.object().shape({
  firstname: yup
    .string()
    .required("first name is required")
    .trim()
    .min(3, "first name must be not be less 3 characters")
    .max(30, "first name must not be more than 30 characters"),
  lastname: yup
    .string()
    .required("last name is required")
    .trim()
    .min(3, "last name must be not be less 3 characters")
    .max(30, "last name must not be more than 30 characters"),
  profile: yup
    .string()
    .required("profile is required")
    .trim()
    .min(5, "profile  must be not be less 5 characters")
    .max(100, "profile  must not be more than 100 characters"),
});
