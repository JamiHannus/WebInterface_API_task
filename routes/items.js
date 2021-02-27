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


// Search by item id if id = 0 then get all itesm in database
router.get('/:iditem',jsonParser, (req, res)=> {
  const iditem=req.params.iditem
  if (iditem == 0){
    db.any('SELECT * FROM items',[iditem])
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
  }
  else{
db.query('SELECT * FROM items WHERE iditem=$1',[iditem])
  .then(data => { 
      if (data.length == 0) return res.status(400).send({msg:'No items found'});
      console.log(data)
    //send the item with that id
    res.send(data);  
  })
  .catch(error => {
    console.log(error);
    console.log('Something went wrong')
      // error
  })
  }
});

//Search by location
router.get('/location/:location',jsonParser, (req, res)=> {
    const location=req.params.location;
    db.query('SELECT * FROM items WHERE location=$1 ',[location])
    .then(data => { 
        if (data.length == 0) return res.status(400).send('No items found');
        console.log(data)
      //send all items what match 
      //Oulu->so all oulu items in db
      res.send(data);  
    })
    .catch(error => {
      console.log(error);
      console.log('Something went wrong')
        // error
    })
});
//Search by category
router.get('/category/:category',jsonParser, (req, res)=> {
  const category=req.params.category;
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
//Search by location and category
router.get('/multi/:location/:category',jsonParser, (req, res)=> {
  const location=req.params.location;
  const category=req.params.category;
  db.query('SELECT * FROM items WHERE location=$1 AND category=$2 ',[location,category])
  .then(data => { 
      if (data.length == 0) return res.status(400).send('No items found');
      console.log(data)
    //send all items what match 
    //Oulu->so all oulu items in db
    res.send(data);  
  })
  .catch(error => {
    console.log(error);
    console.log('Something went wrong')
      // error
  })
});
//   dosent work
// router.get('/dateposted/:dateposted:',jsonParser, (req, res)=> {
//   console.log(req.params);
//   const dateposted=req.params.dateposted;
//   const dateparsed = Date.parse(dateposted)
//   console.log(dateposted);
//   console.log(dateparsed);
//   db.query('SELECT * FROM items WHERE dateposted=$1:date ',[dateparsed])
//   .then(data => { 
//       if (data.length == 0) return res.status(400).send('No items found');
//     //send all items what match
//     res.send(data);
//   })
//   .catch(error => {
//     console.log(error);
//     console.log('Something went wrong')
//       // error
//   })
// });

router.post('/' ,middleware.authenticateToken,jsonParser, (req, res)=> {
  parser(req,res, function (err){
    if(err){
      console.log("error with img upload",err);
      return res.status(400).json('Only up to 6 images');
    } 
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
// delete item and the picuters
router.delete('/:iditem' ,middleware.authenticateToken,jsonParser, (req, res)=> {
  
    //we get the iduser from jwt token from middleware
    //and iditem to delete from route
    const iduser = req.iduser;
    const iditem=req.params.iditem;
    db.any('SELECT * FROM items WHERE iditem=$1 AND iduser=$2 ',[iditem,iduser])
        .then((data)  =>{
          console.log(data);
          //get the items image paths from data base
          console.log(data[0].images);
          let imagepath = data[0].images;
          console.log(imagepath);
          //here we cut the url of the image to get the public id for the image deletion
          let [puplicid] =imagepath.map(x => x.substring(x.lastIndexOf('/') + 1).split('.')[0]);
          cloudinary.v2.destroy(puplicid, function(err,result) {
            if(err){
              console.log("error with img cloudinary delete",err);
              return res.status(400).json('Clodinary deletion problem');
            };
            console.log(result);
          db.query("DELETE * FROM items WHERE iditem=$1 AND iduser=$2",[iditem,iduser])
          .then((result) => res.send('yay'+result))      
          .catch((err) => {
          console.log("error ", err);
          res.sendStatus(501).json('Something went wrong');
      });
    })
  });
});


module.exports = router;