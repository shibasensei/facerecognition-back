const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const nodemailer = require('nodemailer');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const verification = require('./controllers/emailVerify');
const resetPassword = require('./controllers/resetPassword');

const db = knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'cacao',
    password : '',
    database : 'faceRecDB'
  }
});

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'theshibasensei@gmail.com',
        pass: ''
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) =>{res.send('done');});
app.post('/signin',signin.handleSignin(db,bcrypt));
app.post('/register',register.handleRegister(db,bcrypt));

app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.post('/send',verification.sendConfirmationEmail(db,nodemailer,transporter));
app.get('/verify',verification.confirmEmail(db));

app.post('/reset',resetPassword.sendReset(db,nodemailer,transporter,bcrypt));
app.get('/resetDone',resetPassword.confirmReset(db));

app.listen(process.env.PORT || 3001,()=>{});
