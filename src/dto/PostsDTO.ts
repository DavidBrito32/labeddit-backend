import z from "zod";

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

export interface GetPostByIdInput {
	idPost: string;
	authorization: string;
}

export const getPostsByIdInputSchemaDTO = z.object({
	idPost: z.string({
		invalid_type_error: "'idPost' - deve ser enviado em formato string",
		required_error: "'idPost' - é um dado obrigatorio"
	}),
	authorization: z.string({
		invalid_type_error: "'token' - deve ser enviado em formato string",
		required_error: "'token' - é um dado obrigatorio"
	}).min(10)
}).transform(data => data as GetPostByIdInput);

export interface PostModelOutputDTO {
	id: string;
	content: string;
	like: number;
	dislike: number;
	creatorId: string;
	createdAt: string;
	comments: number;
	updatedAt: string | null;
	creatorName: string;
}

// ------------------------------------------------------------------------------------
//INPUT DTO

export interface CreatePostInputDTO {
	authorization: string;
	content: string;
}

export const CreatePostSchemaDTO = z.object({
	content: z.string({
		invalid_type_error: "'content' - deve ser enviado no formato string",
		required_error: "'content' - não pode ser omitido"
	}).min(1),
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


// ------------------------------------------------------------------------------------

//DELETE

export interface DeletePostsInputDTO {
	id: string;
	authorization: string;
}

export const DeletePostSchema = z.object({
	id: z.string({
		invalid_type_error: "'id' - deve ser enviado no formato string",
		required_error: "'id' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as DeletePostsInputDTO);

export interface DeletePostsOutputDTO {
	message: string;
}

// ------------------------------------------------------------------------------------

// LIKE

export interface LikePostInputDTO {
	like: boolean;
	postId: string;
	authorization: string;
}

export const LikePostSchema = z.object({
	like: z.boolean({
		invalid_type_error: "'like' - deve ser enviado no formato boolean",
		required_error: "'like' - é um dado obrigatorio, não pode ser omitido"
	}),
	postId: z.string({
		invalid_type_error: "'postId' - deve ser enviado no formato string",
		required_error: "'postId' - é um dado obrigatorio, não pode ser omitido"
	}),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as LikePostInputDTO);


export interface CheckLikeInput {
	postId: string;
	authorization: string;
}
export interface CheckLikeCommentInput {
	commentId: string;
	authorization: string;
}

export const CheckLikeInputSchema = z.object({
	postId: z.string({
		invalid_type_error: "'postId' - deve ser enviado no formado string",
		required_error: "'postId' - e um dado obrigatorio"
	}),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as CheckLikeInput);

export const CheckLikeCommentInputSchema = z.object({
	commentId: z.string({
		invalid_type_error: "'postId' - deve ser enviado no formado string",
		required_error: "'postId' - e um dado obrigatorio"
	}),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as CheckLikeCommentInput);

export interface CheckLikeOutput {
	like: number;
	dislike: number;
}



export interface LikePostOutputDTO {
	message: string;
}

//------------------------------------------------------------------------------------
// COMMENTS

export interface GetAllCommentsInputDTO {
	authorization: string;
	idPost: string;
}

export const GetAllCommentsSchema = z.object({
	idPost: z.string({
		invalid_type_error: "'idPost' - deve ser enviado no formato string",
		required_error: "'idPost' - é um dado obrigatorio, não pode ser omitido"
	}),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as GetAllCommentsInputDTO);

export interface GetCommentsOutPutDTO {
	id: string;
	creatorId: string;
	creatorName: string;
	comment: string;
	postId: string;
	postComment: string;
	createdAt: string;
	like: number;
	dislike: number;
	updatedAt: string | null;
}

export interface InputCommentDTO {
	id: string;
	authorization: string;
	comment: string;
}

export const InputCommentSchema = z.object({
	id: z.string({
		invalid_type_error: "'id' - deve ser enviado no formato string",
		required_error: "'id' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	comment: z.string({
		invalid_type_error: "'comment' - deve ser enviado no formato string",
		required_error: "'comment' - é um dado obrigatorio, não pode ser omitido"
	}).min(2)
}).transform(data => data as InputCommentDTO);

export interface InputCommentOutputDTO {
	message: string;
}

export interface CommentInputDeleteDTO {
	authorization: string;
	id: string;
}

export interface CommentOutputDeleteDTO {
	message: string;
}

export const CommentInputDeleteSchema = z.object({
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	id: z.string({
		invalid_type_error: "'id' - deve ser enviado no formato string",
		required_error: "'id' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as CommentInputDeleteDTO)

export interface CommentInputUpdateDTO {
	id: string;
	comment: string;
	authorization: string;
}
export interface CommentOutputUpdateDTO {
	message: string;
}

export const CommentInputUpdateSchemaDTO = z.object({
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	id: z.string({
		invalid_type_error: "'id' - deve ser enviado no formato string",
		required_error: "'id' - é um dado obrigatorio, não pode ser omitido"
	}).min(2),
	comment: z.string({
		invalid_type_error: "'comment' - deve ser enviado no formato string",
		required_error: "'comment' - é um dado obrigatorio, não pode ser omitido"
	}).min(2)
}).transform(data => data as CommentInputUpdateDTO);


// ---------------

//LIKE COMMENT

export interface LikeCommentInputDTO {
	authorization: string;
	idComment: string;
	like: boolean;
}

export const LikeCommentSchema = z.object({
	authorization: z.string({
		invalid_type_error: "'authorization' - deve ser enviado no formato string",
		required_error: "'authorization' - é um dado obrigatorio, não pode ser omitido"
	}),
	idComment: z.string({
		invalid_type_error: "'idComment' - deve ser enviado no formato string",
		required_error: "'idComment' - é um dado obrigatorio, não pode ser omitido"
	}),
	like: z.boolean({
		invalid_type_error: "'like' - deve ser enviado no formato boolean",
		required_error: "'like' - é um dado obrigatorio, não pode ser omitido"
	})
}).transform(data => data as LikeCommentInputDTO);

export interface LikeCommentOutputDTO {
	message: string;
}