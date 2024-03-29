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
    creator_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP Table posts;


CREATE TABLE IF NOT EXISTS comments(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS likes_dislikes(
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER,
    dislike INTEGER,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- INSERINDO VALORES DE REFERENCIA PARA CONSULTA E MONTAGEM DE QUERYS

INSERT INTO users(id, name, email, password, created_at)
VALUES
('u001', 'teste', 'teste@email.com', 'test1234', CURRENT_TIMESTAMP);

INSERT INTO posts(id, content, creator_id, created_at)
VALUES
('p001', 'Meu Primeiro Post', 'u001', CURRENT_TIMESTAMP);


INSERT INTO comments (id, creator_id, post_id, comment)
VALUES
('c001', 'u001', 'p001', "Primeiro comentario com id");


SELECT * FROM comments;

INSERT INTO likes_dislikes (creator_id, post_id, like, dislike)
VALUES
('u001', 'p001', 0, 1);

-- --------------------------------------------------------------------------------



SELECT * FROM likes_dislikes;




-- SELECT FUNCIONAL DE POSTS
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


-- --------------------------------------------------------------------------------