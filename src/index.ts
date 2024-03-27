import express, { Request, Response } from "express";
import cors from "cors";
import { User } from "./routes/UserRouter";

const App = express();
const port = 3380;
App.use(cors());
App.use(express.json());

App.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong")
});

App.use(User);


App.listen(port, () => {
    console.log(`API Rodando na porta ${port}`);
});