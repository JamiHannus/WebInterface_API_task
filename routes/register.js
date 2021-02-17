const express = require('express');
const db = require('../server');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


// validation 
var Validator = require('jsonschema').Validator;
const userRegister = require('../schemas/userRegister.json');



router.get('/' , (req, res)=> {
    res.send('Here be register');
});

//create new user

router.post('/',jsonParser, (req, res) => {
    var v = new Validator();
    var instance = req.body;
    let result = v.validate(instance, userRegister);
    console.log(result.errors);


    if (result.errors.length == 0)
    {
        const { email, password,firstname,lastname } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = [
      email,
      hashedPassword,
      firstname,
      lastname
    ];
  
    db.result('SELECT email FROM users WHERE email= $1 ', [req.body.email])
      .then(email => {
        if (email.rowCount > 0) return res.status(409).send('Email already taken');
  
        db.query('INSERT INTO users (email, password, firstname,lastname) VALUES ($1, $2, $3, $4) ', newUser)
          .then(() => res.sendStatus(201))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
      })
      .catch(err => {
        res.sendStatus(500);
        console.log(err);
      });
    }
    else {
        console.log(result.errors[0].message);
        res.status(400);
        res.send('Wrong value for ' +result.errors[0].stack);
    
    }; 
    
  
  });

module.exports = router;