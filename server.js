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

console.log(db.select('*').from('users'));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json("Api is running");
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;

    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0])
    })
    .catch(err => {
        res.status(400).json(err)
    });
});

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
  })
  