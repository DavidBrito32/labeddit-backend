import { CustomError } from "./CustomError";

export class NotFound extends CustomError {
	constructor(
		message: string = "Desculpe, encontramos o recurso solicitado",
	){
		super(404, message);
	}
}