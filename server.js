const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register=require('./controllers/register');
const signin=require('./controllers/signin');
const profile=require('./controllers/profile');
const image=require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
     connectionString: process.env.DATABASE_URL
    }
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json("Api is running");
});

// Get Profile
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)} );

// Update Enteries
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

// Register
app.post('/register', (req, res) => { register.handleRegister(req,res,db,bcrypt) });

// Sign in
app.post('/signin', (req,res) => { signin.handleSignIn(req, res, db, bcrypt) });

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`);
  })
  