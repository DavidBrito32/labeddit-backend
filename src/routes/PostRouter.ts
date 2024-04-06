import express from "express";
import { PostController } from "../controllers/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDB } from "../database/PostDB";
import { IdGenerator } from "../services/uuid";
import { TokenManager } from "../services/token";

export const Post = express.Router();
const Control = new PostController(
	new PostBusiness(new PostDB(), 
		new IdGenerator(), 
		new TokenManager())
);

Post.get("/", Control.getAllPosts);

Post.post("/", Control.createPost);

Post.post("/:id/like", Control.likePosts);

Post.post("/comments/:id", Control.createComment);

Post.put("/comments/:id", Control.updateCommet);

Post.delete("/comments/:id", Control.removeComment);

Post.post("/comments/:id/like", Control.insertLikeInComment);

Post.get("/:id/comments", Control.GetAllComments);

Post.put("/:id", Control.editPost);

Post.delete("/:id", Control.deletePost);