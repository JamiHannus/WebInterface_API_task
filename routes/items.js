const express = require('express');
const db = require('../server');
const router = express.Router();
// multer + cludinary


const multer  = require('multer')
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
//cloudinary settings
const  storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: '/tori', 
    Format: ['jpg', 'png']
  },
  });
const parser = multer({ storage: storage }).array('image', 6);
//middleware
const middleware =require('../components/checkToken');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


// validation 
var Validator = require('jsonschema').Validator;
const userRegister = require('../schemas/newItem.json');
const { path } = require('dotenv/lib/env-options');

router.get('/',jsonParser, (req, res)=> {
  const iditem = req.body.iditem;
  db.query('SELECT * FROM items WHERE iditem=$1',[iditem])
  .then(data => { 
      if (data.length == 0) return res.status(400).send({msg:'No items found'});
      console.log(data)
    //send all items what match
    res.send(data);  
  })
  .catch(error => {
    console.log(error);
    console.log('Something went wrong')
      // error
  })
});
router.get('/location',jsonParser, (req, res)=> {
    const location = req.body.location ;
    db.query('SELECT * FROM items WHERE location=$1 ',[location])
    .then(data => { 
        if (data.length == 0) return res.status(400).send('No items found');
        console.log(data)
      //send all items what match
      res.send(data);  
    })
    .catch(error => {
      console.log(error);
      console.log('Something went wrong')
        // error
    })
});
router.get('/category',jsonParser, (req, res)=> {
  const category = req.body.category ;
  db.query('SELECT * FROM items WHERE category=$1 ',[category])
  .then(data => { 
      if (data.length == 0) return res.status(400).send('No items found');
    //send all items what match
    res.send(data);
  })
  .catch(error => {
    console.log(error);
    console.log('Something went wrong')
      // error
  })
});
router.post('/' ,middleware.authenticateToken,jsonParser, (req, res)=> {
  parser(req,res, function (err){
    if(err){
      console.log("error with img upload",err);
      return res.status(400).json('Only up to 6 images');
    }
    console.log(req.files);
    const { title, description, category, location,deliverytype, price} = req.body;
  //we get the iduser from jwt token from middleware
  const iduser = req.iduser;
  // here req.files is the multeres return array and only intrested in the id of the picture and that is then passed to the database.

  const images = req.files.map(a=>a.path);
  const newItem = [
        title,
        description,
        category,
        location,
        images,
        deliverytype,
        price,
        iduser,]
  db.query(
    "INSERT INTO items (title, description, category, location, images,deliverytype, price, iduser) VALUES ($1, $2, $3, $4, $5:json, $6, $7, $8) RETURNING iditem",
    newItem)
    .then((data)  =>
        db.query("SELECT * FROM items WHERE iditem=($1)", (data[0].iditem))
        .then((result) => res.send(result))      
    )
    .catch((err) => {
      console.log("error ", err);
      res.sendStatus(501).json('Something went wrong');
    });
  })

});




module.exports = router;