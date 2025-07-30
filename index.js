import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { adminRouter, authRouter, bookingRouter, cloudKitchenRouter } from "./backend/routes/index.routes.js";
import { errorHandler } from "./backend/middlewares/index.middlewares.js";

const app = express();
dotenv.config();

const frontendUrl = process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : process.env.FRONTEND_URL_DEV;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: "GET, POST, PATCH, DELETE, PUT, OPTIONS",
  })
);

app.get("/", (req, res) => {
  res.send("This is Home Page");
});

app.use("/api/auth", authRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cloud-kitchen", cloudKitchenRouter);


app.use(errorHandler);

const startBackend = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(8000, () => {
      console.log(
        `Server running on http://localhost:8000`
      );
    });
  } catch (err) {
    console.log("Error while connecting to Backend", err.message);
  }
};

startBackend();
