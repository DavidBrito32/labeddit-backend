import { InsertUserT, UserDB } from "../database/UserDB";
import { LoginOutputDTO, LoginInputDTO, UserModelOutPutDTO } from "../dto/UserDTO";
import { BadRequest } from "../errors/BadRequest";
import { HashManager } from "../services/HashManager";
import { TokenManager, TokenPayload } from "../services/token";
import { IdGenerator } from "../services/uuid";

export class UserBusiness {
	constructor(
        public userDB: UserDB,
        public token: TokenManager,
        public idManager: IdGenerator,
        public hash: HashManager
	){}

	public Login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
		const { email, password } = input;        
		const checkUser = await this.userDB.findUserByEmail(email);
        
		if(!checkUser){
			throw new BadRequest("Verifique as informações e tente novamente");
		}
        
		const checkPassword = await this.hash.compare(password, checkUser.password);
		if(!checkPassword){
			throw new BadRequest("Verifique as informações e tente novamente");
		}

		const payload: TokenPayload = {
			id: checkUser.id,
			name: checkUser.name
		};

		const token = this.token.createToken(payload);

		const output: LoginOutputDTO = {
			message: "Bem vindo de volta 😎🌻",
			token,
			user: checkUser.name
		};

		return output;

	};

	public Signup = async (input: UserModelOutPutDTO): Promise<LoginOutputDTO> => {
		const { name, email, password } = input;
		const exists = await this.userDB.findUserByEmail(email);

		if(exists){
			throw new BadRequest("'email' - ja registrado, utilize outro email");
		}

		const id: string = this.idManager.generate();
		const createdAt: string = new Date().toISOString();
		const newPassword = await this.hash.hash(password);
		const data: InsertUserT = {id, name, email, password: newPassword, created_at: createdAt};
       

		const payload: TokenPayload = { id, name };
		const token = this.token.createToken(payload);


		const output: LoginOutputDTO = {
			message: "Seja bem vindo a Labeddit, publique posts incriveis! ✨🐱‍🏍",
			token,
			user: name
		};

		await this.userDB.insertUser(data);

		return output;
	};

}