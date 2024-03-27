import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { ZodError } from "zod";
import { CustomError } from "../errors/CustomError";
import { LoginInputSchema, SignupSchema } from "../dto/UserDTO";

export class UserController {
    constructor(
        public userBusiness: UserBusiness
    ){}

    public login = async (req: Request, res: Response): Promise<void> => {
        try{
            const input = LoginInputSchema.parse(req.body);
            const login = await this.userBusiness.Login(input);
            res.status(200).send(login);
        }catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
        };
    }

    public signup = async (req: Request, res: Response): Promise<void> => {
        try{
            const input = SignupSchema.parse(req.body);

            const output = await this.userBusiness.Signup(input);
            res.status(201).send(output);
        }catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
        };
    }
}