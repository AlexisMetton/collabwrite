import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});