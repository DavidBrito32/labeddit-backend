# Labeddit

Labeddit é uma plataforma de rede social onde os usuários podem compartilhar postagens, interagir um com o outro e participar de discussões sobre uma variedade de tópicos. Este projeto é uma aplicação backend desenvolvida em Node.js utilizando TypeScript, Express.js e SQLite.

## Tecnologias Utilizadas

- TypeScript: Linguagem de programação utilizada para escrever o código backend, oferecendo tipagem estática e outras funcionalidades que aumentam a segurança e a legibilidade do código.
- JavaScript: Linguagem de programação amplamente utilizada, em que o TypeScript é baseado.
- Node.js: Ambiente de execução JavaScript server-side, que permite executar o código JavaScript no servidor.
- Express.js: Framework web para Node.js que simplifica o processo de criação de APIs RESTful.
- uuid: Biblioteca para geração de identificadores únicos (UUIDs), utilizada para criar identificadores únicos para os usuários e postagens.
- Knex: Query builder SQL para Node.js, utilizado para interagir com o banco de dados SQLite de forma mais fácil e segura.
- SQLite: Banco de dados relacional utilizado para armazenar os dados da aplicação.
- POO (Programação Orientada a Objetos): Paradigma de programação utilizado para organizar o código em classes e objetos, facilitando a manutenção e reutilização do código.
- DTO (Data Transfer Object): Padrão de design utilizado para transferir dados entre diferentes componentes da aplicação, aumentando a coesão e reduzindo o acoplamento.
- Bcrypt: Biblioteca utilizada para criptografar senhas, aumentando a segurança das informações sensíveis armazenadas na aplicação.
- Json Web Token (JWT): Padrão aberto utilizado para criar tokens de acesso, que são utilizados para autenticar usuários e proteger rotas da API.

## Documentação da API no Postman:
Para acessar a documentação desta aplicação no postman clique [aqui](link-da-documentacao-aqui)


## Como Executar

1. Certifique-se de ter o Node.js e o npm instalados em sua máquina.
- Caso não possua instale clicando [aqui](https://nodejs.org/en);
2. Clone este repositório:

   ```
   git clone https://github.com/DavidBrito32/labeddit-backend
   ```

3. Após baixar o projeto instale as dependências do projeto com os seguintes passos:

   ```
   cd labeddit
   npm install
   ```

4. Execute o servidor:

   ```
   npm start
   ```

5. O servidor estará em execução em `http://localhost:3380`.


- Para mais detalhes sobre as rotas desta aplicação, acesse a documentação no Postman.
