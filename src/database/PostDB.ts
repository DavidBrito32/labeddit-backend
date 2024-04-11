import { Db } from "./db";

export interface GetPosts {
  id: string;
  content: string;
  creator_id: string;
  liked_as_user: string | null;
  like_as_creator_id: string | null;
  creator_name: string;
  likes: number;
  dislikes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

export interface InsertPosts {
  id: string;
  content: string;
  creator_id: string;
  created_at: string;
}

export interface UpdatePosts {
  idPost: string;
  content: string;
  creator_id: string;
  updated_at: string;
}

export interface LikeManager {
  creator_id: string;
  post_id: string;
  like: number;
  dislike: number;
}

export interface CommentManager {
  id: string;
  creator_id: string;
  post_id: string;
  comment: string;
  created_at: string;
}

export interface LikeCommentManager {
  creator_id: string;
  comment_id: string;
  like: number;
  dislike: number;
}

export interface GetAllComments {
  id: string;
  creator_id: string;
  comment: string;
  post_id: string;
  post_content: string;
  creator_name: string;
  created_at: string;
  updated_at: string | null;
  likes: number;
  dislikes: number;
}

export interface FindCommentById {
	id: string;
	creator_id: string;
	comment: string;
	likes: number;
	dislikes: number;
	created_at: string;
	updated_at: string;
}

export interface LikeComment {
	creator_id: string;
	comment_id: string;
	like: number;
	dislike: number;
}

export interface GetLikes {
	creator_id: string;
	post_id: string;
	like: number;
	dislike: number;
}

export interface updateComment {
	id: string;
	comment: string;
	updated_at: string;
}

export class PostDB extends Db {
	public getAllPosts = async (): Promise<Array<GetPosts>> => {
		const query: string = `
		SELECT
		posts.id as id,
		posts.content as content,
		posts.creator_id as creator_id,
		users.name as creator_name,
		(SELECT COALESCE(SUM(like), 0) FROM likes_dislikes WHERE post_id = posts.id) AS likes,
		(SELECT COALESCE(SUM(dislike), 0) FROM likes_dislikes WHERE post_id = posts.id) AS dislikes,
		(SELECT COALESCE(COUNT(id), 0) FROM comments WHERE post_id = posts.id) AS comments,
		posts.created_at as created_at,
		posts.updated_at as updated_at
	FROM 
		posts
	INNER JOIN 
		users ON posts.creator_id = users.id;
        `;

		const posts: Array<GetPosts> = await Db.connection.raw(query);
		return posts;
	};

	public findPostsById = async (id: string): Promise<GetPosts | undefined> => {
		const [post]: Array<GetPosts> | undefined = await Db.connection(
			"posts"
		).where({ id });
		return post;
	};

	public insertLike = async (input: LikeManager): Promise<void> => {
		const { post_id, creator_id, like, dislike }: LikeManager = input;
		await Db.connection("likes_dislikes").insert({
			creator_id,
			post_id,
			like,
			dislike,
		});
	};

	public findLikeByPostIdAndUserId = async (postId: string, userId: string): Promise<GetLikes> => {
		const [like]: Array<GetLikes> = await Db.connection("likes_dislikes").where({creator_id: userId, post_id: postId});

		return like;
	};

	public updateLike = async (input: LikeManager): Promise<void> => {
		const { post_id, creator_id, like, dislike }: LikeManager = input;
		await Db.connection("likes_dislikes")
			.update({
				like,
				dislike,
			})
			.where({
				creator_id,
				post_id,
			});
	};

	public deleteLike = async (input: LikeManager): Promise<void> => {
		const { creator_id, post_id }: LikeManager = input;

		await Db.connection("posts").delete().where({
			creator_id,
			post_id,
		});
	};

	public insertPost = async (input: InsertPosts): Promise<void> => {
		const { id, content, creator_id, created_at } = input;
		await Db.connection("posts").insert({
			id,
			content,
			creator_id,
			created_at,
		});
	};

	public updatePost = async (input: UpdatePosts): Promise<void> => {
		const { idPost, content, creator_id, updated_at } = input;
		await Db.connection("posts")
			.update({ content, updated_at })
			.where({ id: idPost, creator_id });
	};

	public deletePost = async (id: string): Promise<void> => {
		await Db.connection("posts").delete().where({ id });
	};
	
	public getAllCommentById = async (
		id: string
	): Promise<Array<GetAllComments>> => {
		const query = `
		SELECT
    comments.id as id,
    comments.creator_id as creator_id,
    comments.comment as comment,
    posts.id as post_id,
    posts.content as post_content,
    posts.created_at as created_at,
    comments.updated_at as updated_at,
    users.name as creator_name,
    COALESCE(likes_count.likes, 0) AS likes,
    COALESCE(dislikes_count.dislikes, 0) AS dislikes
	FROM comments
	INNER JOIN users ON comments.creator_id = users.id
	LEFT JOIN posts ON comments.post_id = posts.id
	LEFT JOIN (
    SELECT comment_id, COUNT(*) AS likes
    FROM likes_dislikes_comment
    WHERE like = 1
    GROUP BY comment_id
	) AS likes_count ON comments.id = likes_count.comment_id
	LEFT JOIN (
    SELECT comment_id, COUNT(*) AS dislikes
    FROM likes_dislikes_comment
    WHERE dislike = 1
    GROUP BY comment_id
	) AS dislikes_count ON comments.id = dislikes_count.comment_id
	WHERE posts.id = '${id}';

		`;
		const comments: Array<GetAllComments> = await Db.connection.raw(query);

		return comments;
	};

	public findCommentById = async (id: string): Promise<FindCommentById> => {
		const query = `
		SELECT 
		comments.id AS id,
		comments.comment AS comment,
		comments.creator_id AS creator_id,
		comments.created_at AS created_at,
		comments.updated_at AS updated_at,
		SUM(CASE WHEN likes_dislikes_comment.like = 1 THEN 1 END) AS likes,
		SUM(CASE WHEN likes_dislikes_comment.dislike = 1 THEN 1 END) AS dislikes
	FROM 
		comments
	LEFT JOIN 
		likes_dislikes_comment ON comments.id = likes_dislikes_comment.comment_id
	WHERE 
		comments.id = '${id}'
	GROUP BY
		comments.id;	
		`;
		
		const [comment]: Array<FindCommentById> = await Db.connection.raw(query);

		return comment;
	};

	public findLikeByCommentIdAndUserId = async (commentId: string, userId: string): Promise<LikeComment> => {
		const [like]: Array<LikeComment> = await Db.connection("likes_dislikes_comment").where({
			comment_id: commentId,
			creator_id: userId
		});

		return like;
	};

	public insertComment = async (input: CommentManager): Promise<void> => {
		const { id, post_id, creator_id, comment, created_at } = input;
		await Db.connection("comments").insert({
			id,
			post_id,
			creator_id,
			comment,
			created_at,
		});
	};

	public updateComment = async (input: updateComment): Promise<void> => {
		const { id, comment, updated_at } = input;
		await Db.connection("comments").update({
			comment,
			updated_at
		}).where({id});
	}

	public insertLikeComment = async (
		input: LikeCommentManager
	): Promise<void> => {
		const { comment_id, creator_id, like, dislike }: LikeCommentManager = input;
		await Db.connection("likes_dislikes_comment").insert({
			comment_id,
			creator_id,
			like,
			dislike,
		});
	};

	public updateLikeComment = async (
		input: LikeCommentManager
	): Promise<void> => {
		const { like, dislike, comment_id, creator_id }: LikeCommentManager = input;
		await Db.connection("likes_dislikes_comment")
			.update({
				like,
				dislike,
			})
			.where({
				comment_id,
				creator_id,
			});
	};

	public deleteComment = async (id: string): Promise<void> => {
		await Db.connection("comments").delete().where({id});
	}
}
