import z from "zod";

export interface UserModelOutPutDTO {
    name: string,
    email: string,
    password: string
}

export interface LoginOutputDTO {
    message: string;
    token: string;
}

export interface LoginInputDTO {
    email: string;
    password: string;
}

export const LoginInputSchema = z.object({
    email: z.string({
        invalid_type_error: "'email' - deve ser enviado no formato string",
        required_error: "'email' - é um campo obrigatorio"
    }),
    password: z.string({
        invalid_type_error: "'password' - deve ser enviado no formato string",
        required_error: "'password' - é um campo obrigatorio"
    }).min(2)
}).transform(data => data as LoginInputDTO);

// signup

export const SignupSchema = z.object({
    name: z.string({
        invalid_type_error: "'name' - deve ser enviado no formato string",
        required_error: "'name' - é um campo obrigatorio"
    }).min(2),
    email: z.string({
        invalid_type_error: "'email' - deve ser enviado no formato string",
        required_error: "'email' - é um campo obrigatorio"
    }).min(2),
    password: z.string({
        invalid_type_error: "'password' - deve ser enviado no formato string",
        required_error: "'password' - é um campo obrigatorio"
    }).min(8)
}).transform(data => data as UserModelOutPutDTO);