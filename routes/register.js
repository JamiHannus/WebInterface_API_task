const express = require('express');
const db = require('../server');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.get('/' , (req, res)=> {
    res.send('Here be register');
});

router.post('/',jsonParser, (req, res) => {
    const { email, password,firstname,lastname } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = [
      email,
      hashedPassword,
      firstname,
      lastname
    ];
  
    db.query('SELECT email FROM users WHERE email= $1 ', [req.body.email])
      .then(email => {
        if (email.length > 0) return res.status(400).send('Email already exists');
  
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
  });

module.exports = router;