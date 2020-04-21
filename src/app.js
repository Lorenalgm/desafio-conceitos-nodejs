const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;
     
  const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;

    return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const likes = 0;

  const repository = { id: uuid(),title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs, likes } = request.body;

   const repositoryIndex = repositories.findIndex(repository => repository.id == id);

   if(repositoryIndex < 0) {
       return response.status(400).json({ error: 'Repository not found.' });
   }

   if(likes) {
    return response.status(400).json({ error: 'You cannot update your likes.' });
   }

   const repository = {
       id,
       title,
       url,
       techs
   };

   repositories[repositoryIndex] = repository;

   return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

   if(repositoryIndex < 0) {
       return response.status(400).json({ error: 'Repository not found.' });
   }

   repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
       return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
