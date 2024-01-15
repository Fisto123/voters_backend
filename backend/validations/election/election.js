// electionname, details, captionimage, datestart,

import yup from "yup";

export const electionSchema = yup.object().shape({
  electionname: yup
    .string()
    .required("election name is required")
    .trim()
    .min(5, "election name must be not be less 5 characters")
    .max(100, "election name must not be more than 100 characters"),
  details: yup
    .string()
    .required("election details is required")
    .trim()
    .min(5, "election details must be not be less 5 characters")
    .max(500, "election details must not be more than 500 characters"),
  captionimage: yup.string().required("election details is required").trim(),
  datetimestart: yup
    .date()
    .required("date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
  datetimeend: yup
    .date()
    .required("date is required")
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
});
export const editElectionSchema = yup.object().shape({
  electionname: yup
    .string()
    .trim()
    .min(5, "election name must be not be less 5 characters")
    .max(100, "election name must not be more than 100 characters"),
  details: yup
    .string()
    .trim()
    .min(5, "election details must be not be less 5 characters")
    .max(500, "election details must not be more than 500 characters"),
  captionimage: yup.string().trim(),
  datetimestart: yup
    .date()
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
  datetimeend: yup
    .date()
    .min(new Date(), "Date cannot be earlier than today")
    .max(new Date("2024-12-31"), "Date cannot be later than 2024-12-31"),
});
