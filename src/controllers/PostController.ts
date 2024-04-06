import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod";
import { CustomError } from "../errors/CustomError";
import { CommentInputDeleteSchema, CommentInputUpdateSchemaDTO, CreatePostSchemaDTO, DeletePostSchema, GetAllCommentsSchema, getPostsInputSchemaDTO, InputCommentSchema, LikeCommentSchema, LikePostSchema, UpdatePostInputSchemaDTO } from "../dto/PostsDTO";
import { BadRequest } from "../errors/BadRequest";

export class PostController {
	constructor(
        public postBusinnes: PostBusiness
	){}

	public getAllPosts = async (req: Request, res: Response): Promise<void> => {
		try{
			const token = getPostsInputSchemaDTO.parse(req.headers);
			const Posts = await this.postBusinnes.getPosts(token);
			res.status(200).send(Posts);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public likePosts = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = LikePostSchema.parse({
				like: req.body.like,
				postId: req.params.id,
				authorization: req.headers.authorization
			});

			const output = await this.postBusinnes.likePosts(input);
			res.status(201).send(output);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public createPost = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = CreatePostSchemaDTO.parse({
				authorization: req.headers.authorization,
				content: req.body.content,
				creatorId: req.body.creatorId
			});

			const post = await this.postBusinnes.createPost(input);
			res.status(201).send(post);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public editPost = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = UpdatePostInputSchemaDTO.parse({
				authorization: req.headers.authorization,
				content: req.body.content,
				idUser: req.body.idUser,
				idPost: req.params.id
			});

			const post = await this.postBusinnes.editPost(input);
			res.status(200).send(post);

		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public deletePost = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = DeletePostSchema.parse({
				id: req.params.id,
				authorization: req.headers.authorization,
			});

			const post = await this.postBusinnes.deletePost(input);
			res.status(200).send(post);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public GetAllComments = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = GetAllCommentsSchema.parse({
				idPost: req.params.id,
				authorization: req.headers.authorization
			});

			const output = await this.postBusinnes.getAllCommentsPostsById(input);
			res.status(200).send(output);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public createComment = async (req: Request, res: Response): Promise<void> => {
		try{
			if(req.params.id === ":id"){
				throw new BadRequest("'id' - nao pode ser omitido");
			}
			const input = InputCommentSchema.parse({
				authorization: req.headers.authorization,
				comment: req.body.comment,
				id: req.params.id,
			});

			const output = await this.postBusinnes.createCommentInPost(input);
			res.status(201).send(output);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public updateCommet = async (req: Request, res: Response): Promise<void> => {
		try{
			if(req.params.id === ":id"){
				throw new BadRequest("'id' - nao pode ser omitido");
			}
			const input = CommentInputUpdateSchemaDTO.parse({
				authorization: req.headers.authorization,
				id: req.params.id,
				comment: req.body.comment
			});

			const output = await this.postBusinnes.updateComment(input);

			res.status(200).send(output);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	} // OK ✔

	public insertLikeInComment = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = LikeCommentSchema.parse({
				authorization: req.headers.authorization,
				idComment: req.params.id,
				like: req.body.like
			});

			const output = await this.postBusinnes.insertLikeComment(input);
			res.status(201).send(output);
		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	}; // OK ✔

	public removeComment = async (req: Request, res: Response): Promise<void> => {
		try{
			const input = CommentInputDeleteSchema.parse({
				authorization: req.headers.authorization,
				id: req.params.id
			});

			const output = await this.postBusinnes.deleteComment(input);
			res.status(200).send(output);

		}catch (err){
			if(err instanceof ZodError){
				res.status(400).send(err.issues);
			}else if (err instanceof CustomError){
				res.status(err.statusCode).send(err.message);
			}else{
				res.status(500).send(`Erro não tratado: DESC: ${err}`);
			}
		}
	} // OK ✔		
} 