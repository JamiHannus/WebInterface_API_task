const express = require('express')
const app = express()
const bodyParser= require('body-parser');
require('dotenv/config');

var pgp = require('pg-promise')(/* options */);
const cn= {
  connectionString:process.env.DATABASE_URL,
  ssl:{rejectUnauthorized: false}
};
var db = pgp(cn);
module.exports = db;
const port = process.env.PORT || 3000;
app.use(express.json());
// routes

const usersRoute = require('./routes/users');
const itemsRoute = require('./routes/items');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');


app.use('/users',usersRoute);
app.use('/items',itemsRoute);
app.use('/login',loginRoute);
app.use('/register',registerRoute);

app.get('/', (req, res) => {
    res.status(200).send('<p><p style="text-align: center;"><span style="text-decoration: underline;"><strong>Available API endpoints</strong></span></p><p style="text-align: center;">/items/:itemid or all items items/0 [GET]</p><p style="text-align: center;">/items/location/:location [GET]</p><p style="text-align: center;">/items/category/:category [GET]</p><p style="text-align: center;">/items/multi/:location/:category [GET]</p><p style="text-align: center;">/register [POST]</p><p style="text-align: center;"><span style="text-decoration: underline;">HTTP basic login</span></p><p style="text-align: center;">/login [POST]</p><p style="text-align: center;"><span style="text-decoration: underline;">JWT token gained by login required</span></p><p style="text-align: center;">/users/{email} [GET]</p><p style="text-align: center;">/items [POST],[DELETE]</p></p>')
  })

    /* This will be activated as the last if no other route matches. */
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404; // Set status code to 404
        next(err);  /* If you pass anything to the next() function (except the string 'route'),
                     Express regards the current request as being an error and will skip any
                     remaining non-error handling routing and middleware functions. */
    });
    
    /* This is an error handling middleware, the function has four parameters.
       See https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling */
    app.use((err, req, res, next) => {
        if(err.hasOwnProperty('status') == true) {
          const date = new Date();
          console.error(date.toUTCString() + ' - ' + err.toString());
          console.error('Path attempted - ' + req.path)
    
          res.status(err.status);
          res.json({
            reason: err.toString()
          });
        }
        else {
          next();
        }
    });
    


let serverInstance = null;

module.exports =  {
  start: function() {
    serverInstance = app.listen(port, () => {
      console.log(`listening at port ${port}`);
      console.log('Available API endpoints');
      console.log('/items/:itemid or  all items items/0 [GET]');
      console.log('/items/location/:location [GET]');
      console.log('/items/category/:category [GET]');
      console.log('/items/multi/:location/:category [GET]');
      console.log('/items [POST],[DELETE]');
      console.log('/login [POST]');
      console.log('/users/{email} [GET]');
      console.log('/register [POST]');
    });
  },
  close: function() {
    serverInstance.close();
  },
}