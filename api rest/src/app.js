import express from "express";
import cors from "cors";
import IARouter from "./routers/IARouter.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota IA
app.use("/ia", IARouter);

export default app;