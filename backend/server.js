import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./error/error.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import votersRoutes from "./routes/votersRoutes.js";

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

const PORT = process.env.PORT || 8000; // Use 8000 if PORT is not defined in the environment variables

//routes
app.use("/voterz/v1", authRoutes);
app.use("/voterz/v1", electionRoutes);
app.use("/voterz/v1", positionRoutes);
app.use("/voterz/v1", candidateRoutes);
app.use("/voterz/v1", votersRoutes);

//error
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
