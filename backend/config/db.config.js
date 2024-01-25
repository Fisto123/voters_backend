import dotenv from "dotenv";
dotenv.config();
export const dbConn = {
  HOST: "162.214.0.180",
  USER: "omotayoiyiola_voterz",
  PASSWORD: "12SkanYaba@#",
  DB: "omotayoiyiola_voterz",
  dialect: "mysql",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
};
