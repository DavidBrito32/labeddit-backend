import { Db } from "./db";

export interface UserDbT {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
}

export interface UserLoginT {
    email: string;
    password: string;
}

export interface InsertUserT {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
}



export class UserDB extends Db {
	public login = async (input: UserLoginT): Promise<UserDbT | undefined> => {
		const { email, password } = input;
		const [user]: Array<UserDbT> = await Db.connection("users").where({email, password});
		return user;
	};

	public findUserById = async (id: string): Promise<UserDbT | undefined> => {
		const [user]: Array<UserDbT> = await Db.connection("users").where({id});
		return user;
	};

	public findUserByEmail = async (email: string): Promise<UserDbT | undefined> => {
		const [user]: Array<UserDbT> = await Db.connection("users").where({email});
		return user;
	};

	public insertUser = async (input: InsertUserT): Promise<void> => {
		await Db.connection("users").insert(input);
	};
}