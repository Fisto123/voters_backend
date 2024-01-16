// electionname, details, captionimage, datestart,

import yup from "yup";

export const electionSchema = yup.object().shape({
  electionname: yup
    .string()
    .required("election name is required")
    .trim()
    .min(5, "election name must be not be less 5 characters")
    .max(100, "election name must not be more than 100 characters"),
  electionacronym: yup.string().required("election acronym is required").trim(),
  ///captionimage: yup.string().required("caption image is required"),
  generalinstruction: yup
    .string()
    .required("General instruction is required")
    .trim()
    .min(1, "General instruction must be not be less 1 characters")
    .max(500, "General instruction must not be more than 500 characters"),
  startdate: yup
    .date()
    .typeError("Invalid date format")
    .required("Date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
  enddate: yup
    .date()
    .typeError("Invalid date format")
    .required("Date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
});

export const editElectionSchema = yup.object().shape({
  electionname: yup
    .string()
    .required("election name is required")
    .trim()
    .min(5, "election name must be not be less 5 characters")
    .max(100, "election name must not be more than 100 characters"),
  electionacronym: yup.string().required("election acronym is required").trim(),
  ///captionimage: yup.string().required("caption image is required"),
  generalinstruction: yup
    .string()
    .required("General instruction is required")
    .trim()
    .min(1, "General instruction must be not be less 1 character")
    .max(500, "General instruction must not be more than 500 characters"),
  startdate: yup
    .date()
    .typeError("Invalid date format")
    .required("Date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
  enddate: yup
    .date()
    .typeError("Invalid date format")
    .required("Date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
});
