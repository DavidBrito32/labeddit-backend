import z  from "zod";

export type Comments = {
    creatorId: string;
    creatorName: string;
    comment: string;
    createdAt: string;
}


//get posts DTO
export interface getPostsInputDTO {
    authorization: string;
}

export const getPostsInputSchemaDTO = z.object({
	authorization: z.string({
		invalid_type_error: "'token' - deve ser enviado em formato string",
		required_error: "'token' - é um dado obrigatorio"
	}).min(10)
}).transform(data => data as getPostsInputDTO);

export interface PostModelOutputDTO {
    id: string;
    content: string;
    like: number;
    dislike: number;
    creatorId: string;
    createdAt: string;
    updatedAt: string | null;
    creatorName: string;
}
// ------------------------------------------------------------------------------------
//INPUT DTO

export interface CreatePostInputDTO  {
    authorization: string;
    content: string;
    creatorId: string;
}

export const CreatePostSchemaDTO = z.object({
    content: z.string({
        invalid_type_error: "'content' - deve ser enviado no formato string",
        required_error: "'content' - não pode ser omitido"
    }).min(1),
    creatorId: z.string({
        invalid_type_error: "'creatorId' - deve ser enviado no formato string",
        required_error: "'creatorId' - não pode ser omitido"
    }).min(2),
    authorization: z.string({
        invalid_type_error: "'authorization' - deve ser enviado em formato string",
		required_error: "'authorization' - é um dado obrigatorio"
    }).min(5)
}).transform(data => data as CreatePostInputDTO);

export interface CreatePostsOutPutDTO {
    message: string;
}


// ------------------------------------------------------------------------------------

//UPDATE

export interface UpdatePostInputDTO {
    idPost: string;
    content?: string;
    authorization: string;
}

export const UpdatePostInputSchemaDTO = z.object({
    idPost: z.string({
        invalid_type_error: "'idPost' - deve ser enviado em formato string",
		required_error: "'idPost' - é um dado obrigatorio"
    }).min(5),
    content: z.string({
        invalid_type_error: "'content' - deve ser enviado em formato string"
    }).optional(),
    authorization: z.string({
        invalid_type_error: "'authorization' - deve ser enviado em formato string",
		required_error: "'authorization' - é um dado obrigatorio"
    }).min(5)
}).transform(data => data as UpdatePostInputDTO);

export interface UpdatePostOutputDTO {
    message: string;
}