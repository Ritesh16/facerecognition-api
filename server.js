const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json("Api is running");
});

// Get Profile
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;

  db.select('*').from('users')
    .where({id})
    .then(users => {
        if(users.length){
            res.json(users[0]);
        }
        else{
            res.status(400).json('Not found');
        }
    })
    .catch(error => res.json('Some error has occurred while fetching user.'));
});

// Update Enteries
app.put('/image', (req,res) => {
   const {id} = req.body; 
   db('users').where('id', '=', id)
     .increment('entries', 1)
     .returning('entries')
     .then(entries => {
         res.json(entries[0])
     })
     .catch(error => res.status(400).json('Unable to get entries'))
});

// Register
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(userEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: userEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                        res.json(user[0])
                  })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        res.status(400).json('Some error has occured while registering')
    })
});

// Sign in
app.post('/signin', (req, res) => {

    db.select('email', 'hash')
      .from('login')
      .where('email','=', req.body.email)
      .then(data => {
          if(data.length){
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid){
              return db.select('*').from('users')
                  .where('email','=', req.body.email)
                  .then(data => {
                      res.json(data[0])
                  })
                  .catch(error=> res.status(400).json('User not found!'))
            }
            else{
                res.status(400).json('Invalid credentials');
            }  
          }
          else{
              res.status(400).json('Invalid credentials');
          }
      });
});

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
  })
  