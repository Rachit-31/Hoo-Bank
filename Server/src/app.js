import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/UserRoutes.js"
import accountRouter from "./routes/AccountRoutes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/account", accountRouter)

export default app;