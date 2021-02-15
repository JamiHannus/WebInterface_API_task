const express = require('express');
const router = express.Router();

router.post('/' , (req, res)=> {
    res.send('User is created');
});



module.exports = router;