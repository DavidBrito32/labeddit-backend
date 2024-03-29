import express, { Request, Response } from "express";
import cors from "cors";
import { User } from "./routes/UserRouter";
import { Post } from "./routes/PostRouter";

const App = express();
const port = 3380;
App.use(cors());
App.use(express.json());

App.get("/ping", (req: Request, res: Response) => {
	res.status(200).send("pong");
});

App.use("/user", User);

App.use("/posts", Post);



App.listen(port, () => {
	console.log(`API Rodando na porta ${port}`);
});