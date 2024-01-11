import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./error/error.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

let PORT = process.env.PORT;

//routes
app.use("/voterz/v1", authRoutes);

//error
app.use(errorHandler);

app.listen(8000, () => console.log(`server is running on port 7000`));

export default app;
