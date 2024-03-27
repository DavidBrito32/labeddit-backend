import { UserModelOutPutDTO } from "../dto/UserDTO";


export class User {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public createdAt: string;
    constructor(
        id: string,
        name: string,
        email: string,
        password: string,
        createdAt: string
        ){
            this.id = id;
            this.name = name;
            this.email = email;
            this.password = password;
            this.createdAt = createdAt;
        };

        public getId = (): string => {
            return this.id;
        };

        public setId = (id: string): void => {
            this.id = id;
        };

        public getName = (): string => {
            return this.name;
        };

        public setName = (name: string): void => {
            this.name = name;
        };

        public getEmail = (): string => {
            return this.email;
        };

        public setEmail = (email: string): void => {
            this.email = email;
        };

        public getPassword = (): string => {
            return this.password;
        };

        public setPassword = (password: string): void => {
            this.password = password;
        };

        public getCreatedAt = (): string => {
            return this.createdAt;
        };

        public getModel = (): UserModelOutPutDTO => {
            return {
                id: this.id,
                name: this.name,
                email: this.email,
                password: this.password,
                createdAt: this.createdAt
            };
        };
}