import { CommentManager, FindCommentById, GetAllComments, InsertPosts, LikeCommentManager, LikeManager, PostDB, updateComment, UpdatePosts } from "../database/PostDB";
import { CommentInputDeleteDTO, CommentInputUpdateDTO, CommentOutputDeleteDTO, CommentOutputUpdateDTO, CreatePostInputDTO, CreatePostsOutPutDTO, DeletePostsInputDTO, DeletePostsOutputDTO, GetAllCommentsInputDTO, GetCommentsOutPutDTO, getPostsInputDTO, InputCommentDTO, InputCommentOutputDTO, LikeCommentInputDTO, LikeCommentOutputDTO, LikePostInputDTO, LikePostOutputDTO, PostModelOutputDTO, UpdatePostInputDTO, UpdatePostOutputDTO } from "../dto/PostsDTO";
import { BadRequest } from "../errors/BadRequest";
import { NotFound } from "../errors/NotFound";
import { Comments } from "../models/PostCommentsModel";
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
		const outPut: Array<PostModelOutputDTO> = posts.map(post => new Post(post.id, post.content, post.creator_id, post.creator_name, post.liked_as_user ,post.created_at, post.updated_at ,post.likes, post.dislikes));
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
			throw new NotFound("Desculpe, Post não encontrado! 🙅‍♂️");
		}
		const likePost = await this.postDB.findLikeByPostIdAndUserId(exists.id, verify.id);

		if(!likePost  && like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 0,
				like: 1,
				post_id: postId
			};			

			await this.postDB.insertLike(action);
		}

		if(!likePost  && !like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 1,
				like: 0,
				post_id: postId
			};

			await this.postDB.insertLike(action);
		}

		if(likePost && likePost.like === 0 && likePost.dislike === 0  && !like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 1,
				like: 0,
				post_id: postId
			};

			await this.postDB.updateLike(action);
		}

		if(likePost && likePost.like === 1 && likePost.dislike === 0 && like){
			const action: LikeManager = {
				creator_id: verify.id,
				dislike: 0,
				like: 0,
				post_id: postId
			};

			await this.postDB.updateLike(action);
		}

		if(likePost && likePost.like === 0 && likePost.dislike === 1 && !like){
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
		};
	};

	public createPost = async (input: CreatePostInputDTO): Promise<CreatePostsOutPutDTO> => {
		const { content, authorization } = input;
		const verifyToken = this.tokenManager.getPayload(authorization.split(" ")[1]);	

		if(verifyToken === null){
			throw new BadRequest("Você não tem permissão para acessar este recurso");
		}

		const id = this.idGenerator.generate();
		const createdAt: string = new Date().toISOString();

		const inputPost: InsertPosts = {
			id,
			content,
			creator_id: verifyToken.id,
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
			throw new NotFound("Desculpe, Post não encontrado! 🙅‍♂️");
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
			throw new BadRequest("Desculpe, Post não encontrado! 🙅‍♂️");
		}

		if(exists.creator_id !== verify.id){
			throw new BadRequest("Não é possivel deletar um post de outro usuario");
		}

		const newPost = new Post(exists.id, exists.content, exists.creator_id, exists.creator_name, exists.liked_as_user, exists.created_at, exists.updated_at, exists.likes, exists.dislikes);

		await this.postDB.deletePost(newPost.getId());

		return {
			message: "Post Deletado com sucesso! ✨"
		};

	};

	public getAllCommentsPostsById = async (input: GetAllCommentsInputDTO): Promise<Array<GetCommentsOutPutDTO>> => {
		const { authorization, idPost }: GetAllCommentsInputDTO = input;

		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const CommentsByPost: Array<GetAllComments> = await this.postDB.getAllCommentById(idPost);

		const output = CommentsByPost.map(item => new Comments(item.id, item.creator_id, item.creator_name, item.comment, item.post_id, item.post_content, item.created_at, item.updated_at, item.likes, item.dislikes).getCommentModel());

		
		return output;
	};

	public createCommentInPost = async (input: InputCommentDTO): Promise<InputCommentOutputDTO> => {
		const { authorization, id, comment }: InputCommentDTO = input;
		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const PostExists = await this.postDB.findPostsById(id);
		
		if(!PostExists){
			throw new NotFound("Desculpe, Post não encontrado! 🙅‍♂️");
		}

		const idGerado = this.idGenerator.generate();

		const InputComentario: CommentManager = {
			id: idGerado,
			comment,
			creator_id: verify.id,
			post_id: PostExists.id,
			created_at: new Date().toISOString()
		};

		await this.postDB.insertComment(InputComentario);

		return {
			message: "comentario adicionado com sucesso! ✅"
		};
	};

	public updateComment = async (input: CommentInputUpdateDTO): Promise<CommentOutputUpdateDTO> => {
		const { authorization, comment, id } = input;
		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const exists: FindCommentById = await this.postDB.findCommentById(id);

		if(!exists){
			throw new BadRequest("Desculpe, Comentario não encontrado! 🙅‍♂️");
		}

		if(exists.creator_id !== verify.id){
			throw new BadRequest("Voce nao pode editar um comentario de outro usuario");
		}

		const inputUpdate: updateComment = {
			id: exists.id,
			comment,
			updated_at: new Date().toISOString()
		}

		await this.postDB.updateComment(inputUpdate);

		return {
			message: "Comentario editado com sucesso!"
		};

	} 

	public deleteComment = async (input: CommentInputDeleteDTO): Promise<CommentOutputDeleteDTO> => {
		const { authorization, id }: CommentInputDeleteDTO = input;

		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const comment: FindCommentById = await this.postDB.findCommentById(id);

		if(!comment){
			throw new BadRequest("Desculpe, Comentario não encontrado! 🙅‍♂️");
		}

		if(comment.creator_id !== verify.id){
			throw new BadRequest("Não pode apagar o comentario de outra pessoa");
		}

		await this.postDB.deleteComment(comment.id);

		return {
			message: "Comentario removido com sucesso!"
		}


	}

	public insertLikeComment = async (input: LikeCommentInputDTO): Promise<LikeCommentOutputDTO> => {
		const { authorization, idComment, like }: LikeCommentInputDTO = input;
		const verify = this.tokenManager.getPayload(authorization.split(" ")[1]);
		
		if(verify === null){
			throw new BadRequest("'authorization' - não foi possivel validar sua identidade");
		}

		const comment = await this.postDB.findCommentById(idComment);
		if(!comment){
			throw new NotFound("Desculpe, Comentario não encontrado! 🙅‍♂️");
		}

		const likedUser = await this.postDB.findLikeByCommentIdAndUserId(idComment, verify.id);		

		//LIKE ACTIONS
		if(!likedUser  && like ){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 1,
				dislike: 0
			};

			await this.postDB.insertLikeComment(action);
		} // OK ✅ CASO O USUARIO NÃO TENHA DADO LIKE E NEM DISLIKE -> DEU LIKE AQUI -> FUNCIONAL

		if(likedUser && likedUser.like === 0 && likedUser.dislike === 0 && like){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 1,
				dislike: 0
			};

			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO LIKE -> REMOVE O LIKE AQUI -> FUNCIONAL

		if(likedUser && likedUser.like === 1 && likedUser.dislike === 0 && like){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 0,
				dislike: 0
			};

			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO DISLIKE -> REMOVE O DISLIKE E DA LIKE AQUI -> FUNCIONAL

		//---------------------------------------------------
		//DISLIKE ACTIONS
		if(!likedUser  && !like ){
			const action: LikeCommentManager = {
				comment_id: idComment,
				creator_id: verify.id,
				like: 0,
				dislike: 1
			};

			await this.postDB.insertLikeComment(action);
		} // OK ✅ CASO O USUARIO NÃO TENHA DADO LIKE E NEM DISLIKE -> DEU DISLIKELIKE AQUI -> FUNCIONAL

		if(likedUser && likedUser.like === 0 && likedUser.dislike === 0 && !like ){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 0,
				dislike: 1
			};
			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO LIKE OU NEM DISLIKE -> DEU DISLIKELIKE AQUI

		if(likedUser && likedUser.like === 0  && !like ){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 0,
				dislike: 1
			};

			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO LIKE OU DISLIKE -> DEU DISLIKELIKE AQUI -> FUNCIONAL

		if(likedUser && likedUser.like === 0 && likedUser.dislike === 1 && !like){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 0,
				dislike: 0
			};

			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO DISLIKE -> REMOVE O DISLIKE AQUI -> FUNCIONAL

		if(likedUser && likedUser.like === 1 && likedUser.dislike === 0 && !like){
			const action: LikeCommentManager = {
				comment_id: comment.id,
				creator_id: verify.id,
				like: 0,
				dislike: 1
			};

			await this.postDB.updateLikeComment(action);
		} // OK ✅ CASO O USUARIO JA TENHA DADO DISLIKE -> REMOVE O DISLIKE E DA LIKE AQUI -> FUNCIONAL

		return {
			message: "ação Realizada com sucesso! ✔✨"
		}; // OK ✅


	};

}