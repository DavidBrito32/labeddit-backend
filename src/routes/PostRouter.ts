import express from "express";
import { PostController } from "../controllers/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDB } from "../database/PostDB";
import { IdGenerator } from "../services/uuid";
import { TokenManager } from "../services/token";

export const Post = express.Router();
const Control = new PostController(new PostBusiness(new PostDB(), new IdGenerator(), new TokenManager()));


Post.get("/", Control.getAllPosts);

Post.post("/", Control.createPost);

Post.put("/:id", Control.editPost);