-- Active: 1711538778956@@127.0.0.1@3306
CREATE TABLE IF NOT EXISTS users(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS posts(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS comments(
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS likes_dislikes(
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);