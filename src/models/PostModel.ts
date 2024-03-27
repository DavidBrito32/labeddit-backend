import { PostModelOutputDTO } from "../dto/PostsDTO";

export class Post {
    public id: string;
    public content: string;
    public creatorId: string;
    public createdAt: string;
    constructor(
        id: string,
        content: string,
        creatorId: string,
        createdAt: string
        ){
            this.id = id;
            this.content = content;
            this.creatorId = creatorId;
            this.createdAt = createdAt;
        };

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
            this.content = creatorId;
        };

        public getCreatedAt = (): string => {
            return this.createdAt;
        };

        public getPosts = (): PostModelOutputDTO => {
            return {
                id: this.getId(),
                content: this.getContent(),
                creatorId: this.getCreatorId(),
                createdAt: this.getCreatedAt()
            }
        }
}