import { PostModelOutputDTO } from "../dto/PostsDTO";

export class Post {
	public id: string;
	public content: string;
	public creatorId: string;
	public creatorName: string;
	public likedAsUser: string | null;
	public comments: number;
	public createdAt: string;
	public updatedAt: string | null;
	public like: number;
	public dislike: number;
	constructor(
		id: string,
		content: string,
		creatorId: string,
		creatorName: string,
		likedAsUser: string | null,
		comments:number,
		createdAt: string,
		updatedAt: string | null,
		like: number,
		dislike: number
	){
		this.id = id;
		this.content = content;
		this.creatorId = creatorId;
		this.creatorName = creatorName;
		this.likedAsUser = likedAsUser;
		this.comments = comments;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.like = like;
		this.dislike = dislike;
	}

	public getId = (): string => {
		return this.id;
	};

	public setId = (id: string): void => {
		this.id = id;
	};

	public getContent = (): string => {
		return this.content;
	};

	public setContent = (content: string): void => {
		this.content = content;
	};

	public getCreatorId = (): string => {
		return this.creatorId;
	};

	public setCreatorId = (creatorId: string): void => {
		this.creatorId = creatorId;
	};

	public getCreatorName = (): string => {
		return this.creatorName;
	};

	public setCreatorName = (creatorName: string): void => {
		this.creatorName = creatorName;
	};

	public getLikedAsUser = (): string | null => {
		return this.likedAsUser;
	};

	public setLikedAsUser = (LikedAsUser: string | null): void => {
		this.likedAsUser = LikedAsUser;
	};

	public getComments = (): number => {
		return this.comments;
	}

	public setComments = (comments: number): void => {
		this.comments = comments;
	}

	public getCreatedAt = (): string => {
		return this.createdAt;
	};

	public setCreatedAt = (createdAt: string): void => {
		this.createdAt = createdAt;
	};

	public getUpdatedAt = (): string | null => {
		return this.updatedAt;
	};

	public setUpdatedAt = (updatedAt: string): void => {
		this.updatedAt = updatedAt;
	};

	public getLikes = (): number => {
		return this.like;
	};

	public setLikes = (like: number): void => {
		this.like = like;
	};

	public getDislike = (): number => {
		return this.like;
	};

	public setDislike = (dislikes: number): void => {
		this.like = dislikes;
	};

	public getPosts = (): PostModelOutputDTO => {
		return {
			id: this.getId(),
			content: this.getContent(),
			like: this.getLikes(),
			dislike: this.getDislike(),
			creatorId: this.getCreatorId(),
			createdAt: this.getCreatedAt(),
			comments: this.getComments(),
			updatedAt: this.getUpdatedAt(),
			creatorName: this.getCreatorName(),
		};
	};
}