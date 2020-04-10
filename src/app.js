const express = require("express");
const { uuid, isUuid } = require('uuidv4');
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validarUuid(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    response.status(400).json({ error: 'Invalid respository ID.' });
  }
  return next();
}

function validarLike(request, response, next) {
  const { likes } = request.body;

  if (likes !== 0) {
    response.status(400).json({ error: 'Initial like error.' });
  }
  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validarLike, (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = { id: uuid(), title, url, techs, likes };
  repositories.push(repository);

  response.json(repositories);
});

app.put("/repositories/:id", validarUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'})
  }

  const repository = {id, title, url, techs, likes};
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", validarUuid, (req, res) => {
  const { id } = req.params;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", validarUuid, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(r => r.id === id);

  if (!repository) {
    return response.status(400).json({error: 'Repository not found.'})
  }

  repository.likes++;
  return response.json(repository);

});

module.exports = app;
