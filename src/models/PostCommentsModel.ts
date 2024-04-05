import { GetCommentsOutPutDTO } from "../dto/PostsDTO";

export class Comments {
	public id: string;
	public creatorId: string;
	public creatorName: string;
	public comment: string;
	public postId: string;
	public postContent: string;
	public createdAt: string;
	public updatedAt: string | null;
	public like: number;
	public dislike: number;

	constructor(
		id: string,
		creatorId: string,
		creatorName: string,
		comment: string,
		postId: string,
		postContent: string,
		createdAt: string,
		updatedAt: string | null,
		like: number,
		dislike: number
	){
		this.id = id;
		this.creatorId = creatorId;
		this.creatorName = creatorName;
		this.comment = comment;
		this.postId = postId;
		this.postContent = postContent;
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

	public getCreatorId = (): string => {
		return this.creatorId;
	};

	public setCreatorId = (creatorID: string): void => {
		this.creatorId = creatorID;
	};

	public getComment = (): string => {
		return this.comment;
	};

	public setComment = (comment: string): void => {
		this.comment = comment;
	};

	public getCreatorName = (): string => {
		return this.creatorName;
	};

	public setCreatorName = (creatorName: string): void => {
		this.creatorName = creatorName;
	};

	public getPostId = (): string => {
		return this.postId;
	};

	public setPostId = (postId: string): void => {
		this.postId = postId;
	};

	public getPostContent = (): string => {
		return this.postContent;
	};

	public setPostContent = (postContent: string): void => {
		this.postContent = postContent;
	};

	public getCreatedAt = (): string => {
		return this.createdAt;
	};

	public setCreatedAt = (createdAt: string): void => {
		this.createdAt = createdAt;
	};

	public getUpdatedAt = (): string | null => {
		return this.updatedAt;
	};

	public setUpdatedAt = (updateaAt: string | null): void => {
		this.updatedAt = updateaAt;
	};

	public getLike = (): number => {
		return this.like;
	};

	public setLike = (like: number): void => {
		this.like = like;
	};

	public getDislike = (): number => {
		return this.dislike;
	};

	public setDislike = (dislike: number): void => {
		this.dislike = dislike;
	};

	public getCommentModel = (): GetCommentsOutPutDTO => {
		return {
			id: this.getId(),
			creatorId: this.getCreatorId(),
			creatorName: this.getCreatorName(),
			comment: this.getComment(),
			postId: this.getPostId(),
			postComment: this.getPostContent(),
			like: this.getLike(),
			dislike: this.getDislike(),
			createdAt: this.getCreatedAt(),
			updatedAt: this.getUpdatedAt()
		};
	};

}