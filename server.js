const express = require('express')
const app = express()
require('dotenv/config');

var pgp = require('pg-promise')(/* options */);
var db = pgp(process.env.DB_CONNECTION);
module.exports = db;

const port = 3000;

const usersRoute = require('./routes/users');
const itemsRoute = require('./routes/items');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');


app.use('/users',usersRoute);
app.use('/items',itemsRoute);
app.use('/login',loginRoute);
app.use('/register',registerRoute);

app.get('/', (req, res) => {
    res.send('Hello World!')
    res.status(200);
  })

    app.get('/hello/:parameter1/:parameter2', (req, res) => {
        res.send('Your route parameters are\n' + JSON.stringify(req.params));
    });
    
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

module.exports = {
  start: function() {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
      console.log('Available API endpoints');

      console.log('  /items/{itemid} [GET],[PATCH],[DELETE]');
      console.log('  /items{param1},{param2},{param3}[GET],[PUT]');
      console.log('  /login [POST]');
      console.log('  /Users/{userId} [GET],[PATCH]');
      console.log('  /register [POST]');

      console.log('  /hello/{param1}/{param2} [GET]');
    });
  },
  close: function() {
    serverInstance.close();
  },
}