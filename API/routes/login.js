const express = require('express');
const router = express.Router();
const db = require('../server');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportHttp = require('passport-http');
const jwt  = require('jsonwebtoken');
require('dotenv').config;

router.get('/' , (req, res)=> {
    res.send('Here be token giving');
});

//function to find users password with email then compare 
//request one with the hashed one from database and see if they match
passport.use(new passportHttp.BasicStrategy((email, password, done) => {

    db.query('SELECT * FROM users WHERE email=$1', [email])
      .then(user => {

        if (user.length == 0) return done(null, false);
        const validPassword = bcrypt.compareSync(password,user[0].password );
        //will console log true or false
        console.log(validPassword);
        if (!validPassword) return done(null, false);
        done(null, user[0]);
      })
  })
  );
  
  // login a user
  router.post('/', (req, res, next) => {
    passport.authenticate('basic', (err, data) => {
      if (err) return next(err);
      if (!data) return res.status(400).send('Invalid email or password.');
  
     // get the iduser and email for the token
      const {iduser,email}= data;
      const tokenpayload = { iduser,email};
      //jwt token hereeeeee!
      const jwttoken= jwt.sign(tokenpayload,process.env.SUPER_SECRET_KEY)
      res.json({token:jwttoken})
    })(req, res, next);
  });
  


module.exports = router;