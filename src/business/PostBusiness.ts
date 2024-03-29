import { InsertPosts, PostDB, UpdatePosts } from "../database/PostDB";
import { CreatePostInputDTO, CreatePostsOutPutDTO, getPostsInputDTO, PostModelOutputDTO, UpdatePostInputDTO, UpdatePostOutputDTO } from "../dto/PostsDTO";
import { BadRequest } from "../errors/BadRequest";
import { NotFound } from "../errors/NotFound";
import { Post } from "../models/PostModel";
import { TokenManager } from "../services/token";
import { IdGenerator } from "../services/uuid";

export class PostBusiness {
	constructor(
        public postDB: PostDB,
		public idGenerator: IdGenerator,
		public tokenManager: TokenManager
	){}    

	public getPosts = async (input: getPostsInputDTO): Promise<Array<PostModelOutputDTO>> => {		
		const verifyToken = this.tokenManager.getPayload(input.authorization.split(" ")[1]);	
		if(verifyToken === null){
			throw new BadRequest("Você não tem permissão para acessar este recurso");
		}
		
		const posts = await this.postDB.getAllPosts();
		const outPut: Array<PostModelOutputDTO> = posts.map(post => new Post(post.id, post.content, post.creator_id, post.creator_name ,post.created_at, post.updated_at ,post.likes, post.dislikes));
		return outPut;
	};


	public createPost = async (input: CreatePostInputDTO): Promise<CreatePostsOutPutDTO> => {
		const { content, creatorId, authorization } = input;
		const verifyToken = this.tokenManager.getPayload(authorization.split(" ")[1]);	

		if(verifyToken === null){
			throw new BadRequest("Você não tem permissão para acessar este recurso");
		}

		const id = this.idGenerator.generate();
		const createdAt: string = new Date().toISOString();

		const inputPost: InsertPosts = {
			id,
			content,
			creator_id: creatorId,
			created_at: createdAt
		}

		await this.postDB.insertPost(inputPost);

		return {
			message: "Post adicionado com sucesso! 🌟🤩"
		}
	}

	public editPost = async (input: UpdatePostInputDTO): Promise<UpdatePostOutputDTO> => {
		const { authorization, idPost, content } = input;
		const verifyToken = this.tokenManager.getPayload(authorization.split(" ")[1]);
		if(verifyToken === null){
			throw new BadRequest("Você não tem permissão para acessar este recurso");
		}
		
		const exists = await this.postDB.findPostsById(idPost);

		if(!exists){
			throw new NotFound("post não encontrado");
		}

		if(verifyToken.id !== exists.creator_id){
			throw new BadRequest("não pode editar o post de outro usuario");
		}
		
		const inputEdit: UpdatePosts = {
			content: content || exists.content,
			creator_id: verifyToken.id,
			updated_at: new Date().toISOString(),
			idPost			
		}

		await this.postDB.updatePost(inputEdit);

		return {
			message: "post editado com sucesso! 🐱‍🏍✨"
		}
	}

}