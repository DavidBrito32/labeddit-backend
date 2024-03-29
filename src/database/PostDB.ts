import { Db } from "./db";


export interface GetPosts {
    id: string;
    content: string;
    creator_id: string;
    creator_name: string;
    likes: number;
    dislikes: number;
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

export class PostDB extends Db {

	public getAllPosts = async (): Promise<Array<GetPosts>> => {
		const query: string = `
        SELECT
        posts.id as id,
        posts.content as content,
        posts.creator_id as creator_id,
        users.name as creator_name,
        COUNT(CASE WHEN likes_dislikes.like = 1 THEN 1 END) AS likes,
        COUNT(CASE WHEN likes_dislikes.dislike = 1 THEN 1 END) AS dislikes,
        posts.created_at as created_at,
        posts.updated_at as updated_at
        FROM posts
        INNER JOIN users ON posts.creator_id = users.id
        LEFT JOIN likes_dislikes ON posts.id = likes_dislikes.post_id
        GROUP BY posts.id;
        `;

		const posts: Array<GetPosts> = await Db.connection.raw(query);        
		return posts;
	};

    public findPostsById = async (id: string): Promise<GetPosts | undefined> => {
        const [post]: Array<GetPosts> | undefined = await Db.connection("posts").where({id});
        return post;
    }
    
	public insertPost = async (input: InsertPosts): Promise<void> => {
        const { id, content, creator_id, created_at } = input;
        await Db.connection("posts").insert({id, content, creator_id, created_at});
	};

    public updatePost = async (input: UpdatePosts): Promise<void> => {
        const { idPost, content, creator_id, updated_at } = input;
        await Db.connection("posts").update({content, updated_at}).where({id: idPost, creator_id});
    }

    public deletePost = async (id: string): Promise<void> => {
        await Db.connection("posts").delete().where({id});
    }
}