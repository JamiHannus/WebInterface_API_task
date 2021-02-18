const express = require('express');
const db = require('../server');
const router = express.Router();
const multer  = require('multer')
const multerUpload = multer({ dest: 'uploads/' })


const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


// validation 
var Validator = require('jsonschema').Validator;
const userRegister = require('../schemas/newItem.json');
const { path } = require('dotenv/lib/env-options');

router.get('/' , (req, res)=> {
    res.send('Here is items');

    //some query params
});

router.post('/' ,jsonParser,multerUpload.array('testFiles', 6), (req, res)=> {
  const { title, description, category, location,deliverytype, price} = req.body;
  const images = req.files.map(a=>a.path);

  const newItem = [
       title,
        description,
        category,
        location,
        images,
        deliverytype,
        price,
        iduser = 1]
  

  db.query(
    "INSERT INTO items (title, description, category, location, images,deliverytype, price, iduser) VALUES ($1, $2, $3, $4, $5:json, $6, $7, $8) RETURNING iditem",
    newItem)
    .then((data)  =>
        db.query("SELECT * FROM items WHERE iditem=($1)", (data[0].iditem))
        .then((result) => res.send(result))      
    )

    .catch((err) => {
      console.log("error ", err);
      res.sendStatus(500);
    });
});




module.exports = router;