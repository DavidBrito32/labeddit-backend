-- Active: 1711538778956@@127.0.0.1@3306
CREATE TABLE IF NOT EXISTS users(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

SELECT * FROM users;



CREATE TABLE IF NOT EXISTS posts(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    content TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS comments(
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NULL,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP table comments;



CREATE TABLE IF NOT EXISTS likes_dislikes_comment(
    creator_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER,
    dislike INTEGER,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE
);


SELECT * FROM likes_dislikes_comment;

SELECT 
    comments.id AS id,
    comments.comment AS comments,
    comments.creator_id AS creator_id,
    comments.created_at AS created_at,
    comments.updated_at AS updated_at,
    COUNT(CASE WHEN likes_dislikes_comment.like = 1 THEN 1 END) AS likes,
    COUNT(CASE WHEN likes_dislikes_comment.dislike = 1 THEN 1 END) AS dislikes
FROM 
    comments
LEFT JOIN 
    likes_dislikes_comment ON comments.id = likes_dislikes_comment.comment_id
WHERE 
    comments.id = 'dcb96114-349d-448a-92ba-a504ebbfa6fa'
GROUP BY
    comments.id, comments.comment, comments.creator_id;




-- ------------------------------------------------

-- query do commentario ok
SELECT
    comments.id as id,
    comments.creator_id as creator_id,
    comments.comment as comment,
    posts.id as post_id,
    posts.content as post_content,
    posts.created_at as created_at,
    posts.updated_at as updated_at,
    users.name as creator_name,
    COUNT(CASE WHEN likes_dislikes_comment.like = 1 THEN 1 END) AS likes,
    COUNT(CASE WHEN likes_dislikes_comment.dislike = 1 THEN 1 END) AS dislikes
FROM comments
INNER JOIN users ON comments.creator_id = users.id
RIGHT JOIN likes_dislikes_comment ON comments.id = likes_dislikes_comment.comment_id
RIGHT JOIN posts ON  comments.post_id = posts.id
WHERE posts.id = '99cd8b84-a72c-4cd5-b007-086777be0b55'
GROUP BY comments.id;



-- ----------------


SELECT
    comments.id as id,
    comments.creator_id as creator_id,
    comments.comment as comment,
    posts.id as post_id,
    posts.content as post_content,
    posts.created_at as created_at,
    posts.updated_at as updated_at,
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
WHERE posts.id = 'bba27195-aa94-495f-8a51-762e88232059';


-- ------------------------------------------------

INSERT INTO comments (id, creator_id, post_id, comment, created_at, updated_at)
VALUES
('c001', 'u001', '7c5f2bfe-f387-4c11-8f2b-2fd05487b709', 'segundo comentario - fiz outro', CURRENT_TIMESTAMP, NULL);

SELECT * FROM comments;

SELECT 
    posts.id AS post_id, 
    posts.content AS post_content, 
    users.id AS user_id, 
    users.name AS user_name, 
    comments.comment AS comment_content, 
    comments.id AS comment_id 
FROM 
    comments
INNER JOIN 
    users ON comments.creator_id = users.id
INNER JOIN 
    posts ON comments.post_id = posts.id;




CREATE TABLE IF NOT EXISTS likes_dislikes(
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER,
    dislike INTEGER,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT * FROM likes_dislikes_comment;


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



SELECT * FROM posts;






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