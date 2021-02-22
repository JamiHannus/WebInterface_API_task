const express = require('express');
const db = require('../server');
const router = express.Router();
const Ajv = require('ajv').default;

const middleware =require('../components/checkToken');



router.get('/' ,middleware.authenticateToken, (req, res)=> {
    console.log("hello")
    console.log(req.email)
    db.query('SELECT * FROM users WHERE email=$1 ',[req.email])
    .then(data => { 
        if (data.length == 0) return res.status(400).send('Wrong email');
      //send all the data :P hashed password too :P
      res.send(data);
        // success
    })
    .catch(error => {
      console.log(error);
      console.log('Something went wrong')
        // error
    })
});

router.patch('/', middleware.authenticateToken, (req,res)=>{
    //here we will have user profile changes.
    //name mostly?
    
});

module.exports = router;