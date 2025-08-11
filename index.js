import express from "express";
// import { connection } from "./postgres/postgres.js";
import cors from "cors";
import auhtRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

app.use(morgan("dev"));
app.use("/auth", auhtRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log("server is running at port:", PORT);
});

// connection();
