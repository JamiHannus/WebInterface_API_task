const express = require('express');
const db = require('../server');
const router = express.Router();
const middleware =require('../components/checkToken');



router.get('/' ,middleware.authenticateToken, (req, res)=> {
    console.log("hello")
    console.log(req.email)
    db.query('SELECT * FROM users WHERE email=$1 ',[req.email])
    .then(data => { 
        if (data.length == 0) return res.status(400).send('Wrong email');
      //send all the data :P hashed password too :P
      res.status(200).send(data);
        // success
    })
    .catch(error => {
      console.log(error);
      console.log('Something went wrong')
        // error
    })
});

router.patch('/', middleware.authenticateToken, (req,res)=>{
    //here we could  have user profile changes. 
    res.send("hello, your profile looks good already");
});

module.exports = router;