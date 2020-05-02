const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepository(id) {
  return repositories.findIndex(repository => repository.id === id);
}

app.get("/repositories", (req, res) => {
  res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { url , title, techs } = req.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = findRepository(id);

  if (repositoryIndex < 0) {
    return res.status(400).json({
      error: 'not found',
    });
  }
  
  repository = {
    id,
    url,
    title,
    techs,
    likes: 0,
  }

  repositories[repositoryIndex] = repository;

  res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = findRepository(id);

  if (repositoryIndex < 0) {
    return res.status(400).json({
      error: 'not found',
    });
  }

  repositories.splice(repositoryIndex, 1);

  res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = findRepository(id);

  if (repositoryIndex < 0) {
    return res.status(400).json({
      error: 'not found',
    });
  }

  const repository = repositories[repositoryIndex];

  repository.likes += 1;

  res.json(repository);
});

module.exports = app;
