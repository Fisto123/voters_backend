import yup from "yup";

export const voterSchema = yup.object({
  idnumber: yup.string().required("ID number is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phonenumber: yup.string().required("Phone number is required"),
  profile: yup.string().required("Profile is required"),
  fullname: yup.string().required("Full name is required"),
});
