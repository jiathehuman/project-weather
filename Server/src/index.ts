import "dotenv/config";
import authRouter from "../routes/userRoutes";
import prefRouter from "../routes/preferenceRoutes";
import weatherRouter from "../routes/weatherRoute";
import express from "express";
import cors from 'cors'
import "reflect-metadata";
import { initDatabase } from "./init_db";
import dashboardRouter from "../routes/dashboardRoutes";


// const app = express();



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

async function main() {
  try {
    await initDatabase();

    const app = express();
    app.use(cors())
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use("/preferences", prefRouter);
    app.use("/weather", weatherRouter)
    app.use("/dashboard", dashboardRouter)

      app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  })

    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
}

main();
