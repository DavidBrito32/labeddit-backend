import express from "express";
import { UserController } from "../controllers/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDB } from "../database/UserDB";
import { TokenManager } from "../services/token";
import { IdGenerator } from "../services/uuid";
import { HashManager } from "../services/HashManager";

export const User = express.Router();
const userControler = new UserController(
	new UserBusiness(
		new UserDB(), 
		new TokenManager(), 
		new IdGenerator(),
		new HashManager()
	)
);

User.post("/login", userControler.login);
User.post("/signup", userControler.signup);