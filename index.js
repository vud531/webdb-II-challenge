const express = require('express');
const helmet = require('helmet');

const DB = require('./data/db')

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here


const sendUserError = (status, message, res) => {
  // This is just a helper method that we'll use for sending errors when things go wrong.
  res.status(status).json({ errorMessage: message });
  return;
};

// server.get('/', (req, res) => {
//     res.send(`
//     <h2>Blogposts</h2>
//     `)
// })

server.get('/api/zoos', (req, res) => {
  DB.find()
  .then(result => {
      res.status(200).json(result)
  })
  .catch (error => {
      console.log(error)
      res.status(500).json({
          message: 'Error retrieving the users'
      })
  })
})

server.get('/api/zoos/:id', (req, res) => {
  DB.findById(req.params.id)
  .then(user => {
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  })
  .catch (error => {
      // log error to database
      console.log(error);
      res.status(500).json({
      message: 'Error retrieving the User',
      });
  })
});

server.post('/api/zoos', (req, res) => {
  // console.log(req)
  if (req.body.name && req.body.bio) {
      try {
          const user = DB.insert(req.body);
          res.status(201).json(user);
      } catch (error) {
          // log error to database
          console.log(error);
          res.status(500).json({
          message: 'Error saving the user',
          });
      }
  }
  else {
      if (!req.body.name) sendUserError(400, 'Must provide a name', res);
      if (!req.body.bio) sendUserError(400, 'Must provide a bio', res);
  }


});

server.delete('/api/zoos/:id', async (req, res) => {
  DB.remove(req.params.id)
  .then(count => {
      if (count > 0) {
          res.status(200).json({ message: 'The user has been removed' });
      } else {
          res.status(404).json({ message: 'The user could not be found' });
      }
  })
  .catch (error => {
      {
          // log error to database
          console.log(error);
          res.status(500).json({
          message: 'Error removing the user',
          });
      }
  }) 
});

server.put('/api/zoos/:id', async (req, res) => {
  if (!req.body.name || !req.body.bio) {
      sendUserError(400, 'Must provide a name and a bio', res);
      return;
  }

  DB.update(req.params.id, req.body)
  .then(user => {
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'The user could not be found' });
      }
  })
  .catch (error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error updating the user',
      });
  }) 
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
