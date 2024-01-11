import yup from "yup";

export const profilepixSchema = yup.object({
  id: yup.number().required("Userid is required"),
  profilepicture: yup.string().required("Please upload profile picture"),
});
