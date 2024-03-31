const express = require('express');
const Joi = require('joi');
const { checkParams, checkBody } = require('./validation/validator');
const { articleSchema, idScheme } = require('./validation/schemes');
const { readUsers, writeUsers} = require('./validation/users');
//const controller = require('../controllers/articles');

// Create an Express router object.
const app = express();

let uniqueID = 0;
const articles = [];

const articleSchema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(10).required()
});

const idScheme = Joi.object({
    id: Joi.number().required()
});

app.use(express.json());

app.get('/articles', (req, res) => {
    res.send({articles});
});

app.get('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        res.send({article});
    } else {
        res.status(404)
        res.send({article: null});
    }
});

app.post('/articles', checkBody(articleSchema), (req, res) => {
    
    uniqueID++;
    
    articles.push({
        id: uniqueID,
        ...req.body
    });

    res.send({id: uniqueID});
});

app.put('/articles/:id', checkParams(idScheme), checkBody(articleSchema), (req, res) => {
    
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        article.title = req.body.title;
        article.content = req.body.content;
        res.send({article});
    } else {
        res.status(404)
        res.send({article: null});
    }
});

app.delete('/articles/:id', checkParams(idScheme), (req, res) => {
    const article = articles.find((article) => article.id === Number(req.params.id));
    if (article) {
        articles.splice(articles.indexOf(article), 1);
        res.send({article});
    } else {
        res.status(404)
        res.send({article: null});
    }
});


// Get a user by id
app.get('/users/:id', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  // Create a new user
  app.post('/users', (req, res) => {
    const users = readUsers();
    const newUser = req.body;
    const existingUser = users.find(u => u.id === newUser.id);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      users.push(newUser);
      writeUsers(users);
      res.status(201).json(newUser);
    }
  });
  
  // Update a user
  app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const updatedUser = req.body;
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      res.status(404).json({ message: 'User not found' });
    } else {
      users[userIndex] = updatedUser;
      writeUsers(users);
      res.json(updatedUser);
    }
  });
  
  // Delete a user
  app.delete('/users/:id', (req, res) => {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      res.status(404).json({ message: 'User not found' });
    } else {
      users.splice(userIndex, 1);
      writeUsers(users);
      res.status(204).send();
    }
  });
  

app.use((req, res) => {
    res.status(404);
    res.send({error: 'Not found'});
});

app.listen(3000);