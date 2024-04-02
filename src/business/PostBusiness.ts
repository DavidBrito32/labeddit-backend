import { InsertPosts, LikeManager, PostDB, UpdatePosts } from "../database/PostDB";
import { CreatePostInputDTO, CreatePostsOutPutDTO, DeletePostsInputDTO, DeletePostsOutputDTO, getPostsInputDTO, LikePostInputDTO, LikePostOutputDTO, PostModelOutputDTO, UpdatePostInputDTO, UpdatePostOutputDTO } from "../dto/PostsDTO";
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

	public likePosts = async (input: LikePostInputDTO): Promise<LikePostOutputDTO> => {
		const { authorization, like, postId }: LikePostInputDTO = input;
		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		if(verify === null){
			throw new BadRequest("'authorization' - você não tem permissão para acessar este recurso! 🧤");
		}

		const finder = await this.postDB.getAllPosts();
		const exists = finder.find((item) => item.id === postId);

		if(!exists){
			throw new NotFound("Desculpe, Recurso não encontrado! 🙅‍♂️");
		}

		if(exists.likes === 0 && exists.dislikes === 0 && like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 0,
				like: 1,
				post_id: postId
			};

			await this.postDB.insertLike(action);
		}

		if(exists.likes === 0 && exists.dislikes === 0 && !like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 1,
				like: 0,
				post_id: postId
			};

			await this.postDB.insertLike(action);
		}

		if(exists.likes === 1 && exists.dislikes === 0 && like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 0,
				like: 0,
				post_id: postId
			};

			await this.postDB.updateLike(action);
		}

		if(exists.likes === 0 && exists.dislikes === 1 && !like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 0,
				like: 0,
				post_id: postId
			};

			await this.postDB.updateLike(action);
		}		

		return {
			message: "ação Realizada com sucesso! ✔✨"
		}
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
		};

		await this.postDB.insertPost(inputPost);

		return {
			message: "Post adicionado com sucesso! 🌟🤩"
		};
	};

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
		};

		await this.postDB.updatePost(inputEdit);

		return {
			message: "post editado com sucesso! 🐱‍🏍✨"
		};
	};

	public deletePost = async (input: DeletePostsInputDTO): Promise<DeletePostsOutputDTO> => {
		const { id, authorization }: DeletePostsInputDTO = input;

		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const exists = await this.postDB.findPostsById(id);

		if(!exists){
			throw new BadRequest("'id' - verifique o post e tente novamente");
		}

		if(exists.creator_id !== verify.id){
			throw new BadRequest("Não é possivel deletar um post de outro usuario");
		}

		const newPost = new Post(exists.id, exists.content, exists.creator_id, exists.creator_name, exists.created_at, exists.updated_at, exists.likes, exists.dislikes);

		await this.postDB.deletePost(newPost.getId());

		return {
			message: "Post Deletado com sucesso! ✨"
		};

	};

}