const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const jsonParser = bodyParser.json();
app.use(morgan('common'));


const {BlogPosts} = require('./models.js');


BlogPosts.create('title', 'content', 'author', 'publishDate');
BlogPosts.create('Action', 'Post', '', '');
BlogPosts.create('Grapes', 'Thriller', 'John', 'July');

app.get('/blog-posts', (req,res) => {
    res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }

    }
  
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
  });

  app.put('/blog-posts/:id', jsonParser, (req, res) => {
    const requiredFields = ['id','title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating items \`${req.params.id}\``);
    BlogPosts.update({
      id:  req.body.id,
      title: req.body.name,
      content: req.body.content,
      author:  req.body.author,
      publishDate: req.body.publishdate
    });
    res.status(204).end();
  });

  app.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted ID item \`${req.params.id}\``);
    res.status(204).end();
  });


 app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});