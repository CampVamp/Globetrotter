import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

const app = express();

const morganFormat =
  process.env.NODE_ENV === "development" ? "dev" : "combined";

app.use(cors());
app.use(helmet());
app.use(morgan(morganFormat));
app.use(express.json());

// Routes
// app.use("/api", router);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("GlobeTrotter API is running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
