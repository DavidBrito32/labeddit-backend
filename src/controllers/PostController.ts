import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod";
import { CustomError } from "../errors/CustomError";
import { CreatePostSchemaDTO, DeletePostSchema, getPostsInputSchemaDTO, LikePostSchema, UpdatePostInputSchemaDTO } from "../dto/PostsDTO";

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

	
}